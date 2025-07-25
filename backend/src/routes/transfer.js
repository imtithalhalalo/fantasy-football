import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import prisma from "../utils/prismaClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { team, player, maxPrice } = req.query;

    let players = await prisma.player.findMany({
      where: { isForSale: true },
      include: { team: true },
    });

    if (player) {
      players = players.filter((p) =>
        p.name.toLowerCase().includes(player.toLowerCase())
      );
    }

    if (team) {
      players = players.filter((p) =>
        p.team?.name.toLowerCase().includes(team.toLowerCase())
      );
    }

    if (maxPrice) {
      const max = parseInt(maxPrice);
      players = players.filter((p) => p.price <= max);
    }

    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:playerId", authMiddleware, async (req, res) => {
  try {
    const playerId = parseInt(req.params.playerId);
    const { askingPrice } = req.body;

    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: { team: true },
    });

    if (!player) return res.status(404).json({ message: "Player not found" });
    if (player.team.userId !== req.userId)
      return res.status(403).json({ message: "Not your player" });

    const updated = await prisma.player.update({
      where: { id: playerId },
      data: {
        isForSale: true,
        askingPrice: askingPrice,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list player for transfer" });
  }
});

router.delete("/:playerId", authMiddleware, async (req, res) => {
  try {
    const playerId = parseInt(req.params.playerId);

    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: { team: true },
    });

    if (!player) return res.status(404).json({ message: "Player not found" });
    if (player.team.userId !== req.userId)
      return res.status(403).json({ message: "Not your player" });

    const updated = await prisma.player.update({
      where: { id: playerId },
      data: {
        isForSale: false,
        askingPrice: null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove player from transfer" });
  }
});


router.post("/buy/:playerId", authMiddleware, async (req, res) => {
  try {
    const buyerUserId = req.userId;
    const playerId = parseInt(req.params.playerId);

    const buyerTeam = await prisma.team.findUnique({
      where: { userId: buyerUserId },
      include: { players: true },
    });

    if (!buyerTeam)
      return res.status(404).json({ message: "Your team not found" });

    const sellerPlayer = await prisma.player.findUnique({
      where: { id: playerId },
      include: { team: true },
    });

    if (!sellerPlayer || !sellerPlayer.isForSale)
      return res.status(404).json({ message: "Player not for sale" });

    const sellerTeam = await prisma.team.findUnique({
      where: { id: sellerPlayer.teamId },
      include: { players: true },
    });

    if (sellerTeam.userId === buyerUserId)
      return res.status(400).json({ message: "You already own this player" });

    const transferPrice = Math.floor(
      (sellerPlayer.askingPrice || sellerPlayer.price) * 0.95
    );

    if (buyerTeam.players.length >= 25)
      return res.status(400).json({ message: "Cannot exceed 25 players" });

    if (sellerTeam.players.length <= 15)
      return res
        .status(400)
        .json({ message: "Seller cannot go below 15 players" });

    if (buyerTeam.budget < transferPrice)
      return res.status(400).json({ message: "Not enough budget" });

    const buyerNotificationMsg = `You bought ${sellerPlayer.name} from ${sellerTeam.name} for $${transferPrice}`;
    const sellerNotificationMsg = `${buyerTeam.name} bought your player ${sellerPlayer.name} for $${transferPrice}`;

    await prisma.$transaction([
      prisma.team.update({
        where: { id: buyerTeam.id },
        data: { budget: { decrement: transferPrice } },
      }),
      prisma.team.update({
        where: { id: sellerTeam.id },
        data: { budget: { increment: transferPrice } },
      }),
      prisma.player.update({
        where: { id: playerId },
        data: {
          teamId: buyerTeam.id,
          isForSale: false,
          askingPrice: null,
          boughtFromId: sellerTeam.id,
          boughtAt: new Date(),
        },
      }),
      prisma.notification.create({
        data: { userId: buyerTeam.userId, message: buyerNotificationMsg },
      }),
      prisma.notification.create({
        data: { userId: sellerTeam.userId, message: sellerNotificationMsg },
      }),
    ]);

    res.json({
      message: "Player bought successfully!",
      transferPrice,
      buyerNotificationMsg,
      sellerNotificationMsg,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to buy player" });
  }
});

export default router;
