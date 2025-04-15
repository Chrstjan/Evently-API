import express from "express";
import { Event as model } from "../models/event.model.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";

export const eventController = express.Router();
const url = "events";

eventController.get(`/${url}`, async (req, res) => {
  try {
    const result = await model.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name", "id", "slug"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["firstname", "lastname", "id"],
        },
      ],
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "user_id",
          "category_id",
          "description",
        ],
      },
    });

    if (!result || result.length === 0) {
      errorResponse(res, "No events found", 404);
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error fetching events: ${err.message}`);
  }
});

// eventController.get(`/${url}/:id([0-9]+)`, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await model.findOne({
//       where: { id: id },
//     });

//     if (!result || result.length === 0) {
//       errorResponse(
//         res,
//         `Error fetching event with id: ${eventId}: ${err.message}`
//       );
//     }

//     successResponse(res, result);
//   } catch (err) {
//     errorResponse(res, `Error fetching event: ${err.message}`);
//   }
// });
