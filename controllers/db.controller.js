import express from "express";
import sequelize from "../config/sequelize.config.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";
export const dbController = express.Router();

dbController.get("/api", async (req, res) => {
  try {
    await sequelize.authenticate();
    successResponse(res, "Connection to DB", 200);
  } catch (err) {
    errorResponse(res, `Error could not find DB: ${err.message}`, 500);
  }
});

dbController.get("/sync", async (req, res) => {
  try {
    const resp = await sequelize.sync();
    successResponse(res, "DB Synced", 200);
  } catch (err) {
    errorResponse(res, `Error in DB sync: ${err.message}`);
  }
});
