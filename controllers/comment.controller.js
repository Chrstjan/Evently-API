import express from "express";
import { Comment as model } from "../models/comment.model.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";

export const commentController = express.Router();
const url = "comments";

commentController.post(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = await getUserFromToken(req, res);

    data.event_id = id;
    data.user_id = userId;

    const result = await model.create(data, {
      where: { event_id: data.event_id, user_id: data.user_id },
    });

    if (!result) {
      errorResponse(
        res,
        `Error creating comment to event with the id: ${data.id}`
      );
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error in creating comment: ${err.message}`, err);
  }
});

commentController.patch(
  `/${url}/:eventId/:commentId`,
  Authorize,
  async (req, res) => {
    try {
      const { eventId, commentId } = req.params;
      const data = req.body;
      const userId = await getUserFromToken(req, res);

      data.event_id = eventId;
      data.user_id = userId;

      const [updated] = await model.update(data, {
        where: {
          id: commentId,
          event_id: data.event_id,
          user_id: data.user_id,
        },
      });

      if (!updated) {
        errorResponse(
          res,
          `Comment with the id: ${commentId} belonging to event with the id: ${data.event_id} not found`
        );
      }

      successResponse(
        res,
        { ...data },
        `Comment with the id: ${commentId} updated`
      );
    } catch (err) {
      errorResponse(res, `Error updating commment: ${err.message}`, err);
    }
  }
);

commentController.delete(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await getUserFromToken(req, res);

    const result = await model.destroy({
      where: { id: id, user_id: userId },
    });

    if (!result) {
      errorResponse(res, `Comment with the id: ${id} not found`);
    }

    successResponse(res, `Comment with the id: ${id} successfully deleted`);
  } catch (err) {
    errorResponse(res, `Error in deleting comment: ${err.message}`, err);
  }
});
