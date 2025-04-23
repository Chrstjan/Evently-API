import express from "express";
import { NestedReply as model } from "../models/nested_reply.model.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";

export const nestedReplyController = express.Router();
const url = "nested-reply";

nestedReplyController.post(`/${url}`, Authorize, async (req, res) => {
  try {
    const data = req.body;
    const userId = await getUserFromToken(req, res);

    data.user_id = userId;

    const parentComment = await model.findOne({
      where: {
        parent_reply_id: data.parent_reply_id,
        comment_id: data.comment_id,
      },
    });

    if (!parentComment) {
      errorResponse(
        res,
        `Error parent comment with the id: ${data.parent_reply_id} not found`
      );
    }

    const result = await model.create(data);
    successResponse(res, result, "Comment created");
  } catch (err) {
    errorResponse(res, `Error creating nested comment: ${err.message}`, err);
  }
});

nestedReplyController.delete(`/${url}/:id`, Authorize, async (req, res) => {
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
