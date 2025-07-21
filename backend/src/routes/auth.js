import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ message: "Invalid password" });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token, isNew: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const team = await prisma.team.create({
      data: {
        name: `${email.split("@")[0]}'s Team`,
        budget: 5000000,
        userId: user.id,
      },
    });

    const positions = [
      ...Array(3).fill("GK"),
      ...Array(6).fill("DEF"),
      ...Array(6).fill("MID"),
      ...Array(5).fill("ATT"),
    ];

    const playerData = positions.map((pos, index) => ({
      name: `Player ${index + 1}`,
      position: pos,
      price: Math.floor(Math.random() * 500000 + 100000),
      teamId: team.id,
    }));

    await prisma.player.createMany({ data: playerData });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, isNew: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
