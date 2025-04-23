import express from "express";
import { Category as model } from "../models/category.model.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";
import { Event } from "../models/event.model.js";
import { Image } from "../models/image.model.js";
import { User } from "../models/user.model.js";

export const categoryController = express.Router();
const url = "categories";

categoryController.get(`/${url}`, async (req, res) => {
  try {
    const result = await model.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!result || result.length === 0) {
      errorResponse(res, "No categories found", 404);
    }
    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error fetching categories: ${err.message}`);
  }
});

categoryController.get(`/${url}/:slug`, async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await model.findOne({
      where: { slug: slug },
      attributes: ["id", "name", "slug"],
      include: [
        {
          model: Event,
          as: "events",
          attributes: [
            "id",
            "user_id",
            "title",
            "slug",
            "short_desc",
            "location",
            "date",
            "time",
          ],
          include: [
            {
              model: User,
              as: "creator",
              attributes: ["firstname", "lastname"],
            },
            {
              model: Image,
              attributes: ["filename", "description"],
            },
          ],
        },
      ],
    });

    if (!result) {
      errorResponse(res, `Error fetching category by slug: ${slug}:`);
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error fetching category: ${err.message}`, err);
  }
});
