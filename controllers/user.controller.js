import express from "express";
import { User as model } from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { Event } from "../models/event.model.js";

export const userController = express.Router();
const url = "users";

userController.get(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);

    const result = await model.findOne({
      attributes: [
        "firstname",
        "lastname",
        "email",
        "avatar",
        "followers",
        "following",
      ],
      where: { id: userId },
      include: [
        {
          model: Event,
          as: "events",
        },
      ],
    });

    if (!result)
      return errorResponse(res, `User with the id: ${userId} not found`, 404);

    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error fetching data from user: ${err.message}`);
  }
});

userController.post(`/${url}`, async (req, res) => {
  try {
    const data = req.body;

    let doesExist = await model.findOne({ where: { email: data.email } });
    if (doesExist) {
      errorResponse(res, `Error user already exists`);
    } else {
      const result = await model.create(data);
      successResponse(
        res,
        {
          firstname: result.firstname,
          lastname: result.lastname,
          email: result.email,
          avatar: result.avatar,
        },
        "User created successfully",
        201
      );
    }
  } catch (err) {
    errorResponse(res, `Error in creating user: ${err.message}`, err);
  }
});

userController.patch(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);

    const data = req.body;

    const [updated] = await model.update(data, {
      where: { id: userId },
    });

    if (!updated) {
      errorResponse(res, `No user with the id: ${userId} found`, 404);
    }

    successResponse(res, { userId, ...data }, "User updated successfully");
  } catch (err) {
    errorResponse(res, `Error in updating user: ${err.message}`, err);
  }
});

userController.delete(`/${url}`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);

    const result = await model.destroy({
      where: { id: userId },
    });

    if (!result) {
      errorResponse(res, `User with the id: ${userId} not found`, 404);
    }

    successResponse(res, null, "User and related events deleted successfully");
  } catch (err) {
    errorResponse(res, `Error deleting user: ${err.message}`, err);
  }
});
