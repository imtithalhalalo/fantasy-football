import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/teams.js";
import transferRoutes from "./routes/transfer.js";

dotenv.config();
const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => res.send("🚀 Backend is running!"));


app.use("/auth", authRoutes);
app.use("/team", teamRoutes);
app.use("/transfer", transferRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
