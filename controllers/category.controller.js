import express from "express";
import { Category as model } from "../models/category.model.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";

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
