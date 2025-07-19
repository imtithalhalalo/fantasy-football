import express from "express";
import { prisma } from "../prismaClient.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { team, player, maxPrice } = req.query;

    const where = {
      isForSale: true,
      ...(player && { name: { contains: player, mode: "insensitive" } }),
      ...(maxPrice && { price: { lte: parseInt(maxPrice) } }),
      ...(team && {
        team: {
          name: { contains: team, mode: "insensitive" },
        },
      }),
    };

    const players = await prisma.player.findMany({
      where,
      include: { team: true },
    });

    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transfer list" });
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

    if (!buyerTeam) return res.status(404).json({ message: "Your team not found" });

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

    if (buyerTeam.players.length >= 25)
      return res.status(400).json({ message: "Cannot exceed 25 players" });

    if (sellerTeam.players.length <= 15)
      return res.status(400).json({ message: "Seller cannot go below 15 players" });


    res.json({ message: "Player bought successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to buy player" });
  }
});

export default router;
