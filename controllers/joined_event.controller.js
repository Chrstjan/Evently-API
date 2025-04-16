import express from "express";
import { JoinedEvent as model } from "../models/joined_event.model.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";

export const joinedEventController = express.Router();
const url = "joined-event";

joinedEventController.post(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await getUserFromToken(req, res);

    const alreadyJoined = await model.findAll({
      where: { event_id: id, user_id: userId },
    });

    if (alreadyJoined.length > 0) {
      errorResponse(res, `Already joined the event with the id: ${id}`);
    }

    const result = await model.create({
      event_id: id,
      user_id: userId,
    });
    successResponse(res, result, "Event joined");
  } catch (err) {
    errorResponse(res, `Error joining event: ${err.message}`, err);
  }
});

joinedEventController.delete(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await getUserFromToken(req, res);

    const joinedEvent = await model.findAll({
      where: { event_id: id, user_id: userId },
    });

    if (joinedEvent.length === 0) {
      errorResponse(res, `Could not leave joined event with the id: ${id}`);
    }

    const result = await model.destroy({
      where: { event_id: id, user_id: userId },
    });
    successResponse(
      res,
      result,
      `Joined Event with the id: ${id} left successfully`
    );
  } catch (err) {
    errorResponse(res, `Error leaving joined event: ${err.message}`, err);
  }
});
