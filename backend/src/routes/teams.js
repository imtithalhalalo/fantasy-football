import express from "express";
import { prisma } from "../prismaClient.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const team = await prisma.team.findUnique({
      where: { userId: req.userId },
      include: { players: true },
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
