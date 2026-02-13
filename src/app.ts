import express from "express";
import cors from "cors";
import { router } from "./routes";

export const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running 🚀",
  });
});


app.use(cors());
app.use(express.json());

app.use("/api", router);

