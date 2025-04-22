import express from "express";
import { Reply as model } from "../models/reply.model.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";

export const replyController = express.Router();
const url = "reply";

replyController.post(`/${url}`, Authorize, async (req, res) => {
  try {
    const data = req.body;
    const userId = await getUserFromToken(req, res);

    data.user_id = userId;

    const result = await model.create(data, {
      where: { comment_id: data.comment_id },
    });

    if (!result) {
      errorResponse(
        res,
        `Error to replying to comment with the id: ${data.comment_id}`
      );
    }

    successResponse(res, result, "Reply created");
  } catch (err) {
    errorResponse(res, `Error creating comment reply: ${err.message}`, err);
  }
});

replyController.delete(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await getUserFromToken(req, res);

    const result = await model.destroy({
      where: { id: id, user_id: userId },
    });

    if (!result) {
      errorResponse(res, `Error reply with the id: ${id} not found`);
    }

    successResponse(res, `Reply with the id: ${id} deleted successfully`);
  } catch (err) {
    errorResponse(res, `Error deleting reply: ${err.message}`, err);
  }
});
