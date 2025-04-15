import express from "express";
import dotenv from "dotenv";
import { dbController } from "./controllers/db.controller.js";
import { authController } from "./controllers/auth.controller.js";
import { setRelations } from "./models/relations.js";
import { eventController } from "./controllers/event.controller.js";
import { categoryController } from "./controllers/category.controller.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();

const port = process.env.PORT;

setRelations();

app.get("/", (req, res) => {
  res.send({ message: "Welcome to the evently API" });
});

app.use(dbController, authController, eventController, categoryController);

app.listen(port, () => {
  console.log(`Server live on http://localhost:${port}`);
});
