import express from "express";
import { Op } from "sequelize";
import { Event as model } from "../models/event.model.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";
import { Image } from "../models/image.model.js";

export const searchController = express.Router();
const url = "search";

searchController.get(`/${url}/:param`, async (req, res) => {
  try {
    const { param } = req.params;

    const result = await model.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${param}%` } },
          { slug: { [Op.like]: `%${param}%` } },
          { short_desc: { [Op.like]: `%${param}%` } },
          { description: { [Op.like]: `%${param}%` } },
          { location: { [Op.like]: `%${param}%` } },
        ],
      },
      attributes: [
        "id",
        "user_id",
        "category_id",
        "title",
        "slug",
        "short_desc",
        "location",
        "date",
        "time",
      ],
      include: [
        {
          model: Image,
          attributes: ["filename", "description"],
        },
      ],
    });

    if (!result || result.length === 0) {
      errorResponse(res, `No results found for "${param}"`);
    }

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error in searching: ${err.message}`, err);
  }
});
