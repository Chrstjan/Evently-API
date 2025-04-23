import express from "express";
import dotenv from "dotenv";
import { dbController } from "./controllers/db.controller.js";
import { authController } from "./controllers/auth.controller.js";
import { setRelations } from "./models/relations.js";
import { eventController } from "./controllers/event.controller.js";
import { categoryController } from "./controllers/category.controller.js";
import { searchController } from "./controllers/search.controller.js";
import { userController } from "./controllers/user.controller.js";
import { commentController } from "./controllers/comment.controller.js";
import { replyController } from "./controllers/reply.controller.js";
import { nestedReplyController } from "./controllers/nested_reply.controller.js";
import { joinedEventController } from "./controllers/joined_event.controller.js";
import { followingController } from "./controllers/following.controller.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();

const port = process.env.PORT;

setRelations();

app.get("/", (req, res) => {
  res.send({ message: "Welcome to the evently API" });
});

app.use(
  dbController,
  authController,
  eventController,
  categoryController,
  searchController,
  userController,
  commentController,
  replyController,
  nestedReplyController,
  joinedEventController,
  followingController
);

app.listen(port, () => {
  console.log(`Server live on http://localhost:${port}`);
});
