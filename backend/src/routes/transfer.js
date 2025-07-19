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
})

export default router;
