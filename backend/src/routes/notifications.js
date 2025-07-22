import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import prisma from "../utils/prismaClient.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });

  res.json(notifications);
});


router.post("/read/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });
  res.json({ success: true });
});


export default router;
