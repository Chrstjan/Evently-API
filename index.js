import express from "express";
import dotenv from "dotenv";
import { dbController } from "./controllers/db.controller.js";
import { authController } from "./controllers/auth.controller.js";

const app = express();

dotenv.config();

const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "Welcome to the evently API" });
});

app.use(dbController, authController);

app.listen(port, () => {
  console.log(`Server live on http://localhost:${port}`);
});
