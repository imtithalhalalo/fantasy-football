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
})

router.post("/read-all", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    await prisma.notification.updateMany({
      where: { userId },  
      data: { isRead: true }
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.userId;

    const deleted = await prisma.notification.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Notification not found or not yours" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification" });
  }
});



export default router;
