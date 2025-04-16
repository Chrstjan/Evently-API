import express from "express";
import { Following as model } from "../models/following.model.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";

export const followingController = express.Router();
const url = "following";

followingController.post(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await getUserFromToken(req, res);

    if (userId === id) {
      errorResponse(res, "You can't follow yourself");
    }

    const alreadyFollowing = await model.findAll({
      where: { followed_user_id: id, user_id: userId },
    });

    if (alreadyFollowing.length > 0) {
      errorResponse(res, `Already following user with the id: ${id}`);
    }

    const result = await model.create({
      followed_user_id: id,
      user_id: userId,
    });
    successResponse(res, result, `Following succesfull`);
  } catch (err) {
    errorResponse(res, `Error following user: ${err}`);
  }
});

followingController.delete(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await getUserFromToken(req, res);

    const followingUser = await model.findAll({
      where: { followed_user_id: id, user_id: userId },
    });

    if (followingUser.length === 0) {
      errorResponse(res, `Could not unfollow user with the id: ${id}`);
    }

    const result = await model.destroy({
      where: { followed_user_id: id, user_id: userId },
    });
    successResponse(res, result, `User with the id: ${id} unfollowed`);
  } catch (err) {
    errorResponse(res, `Error unfollowing user: ${err.message}`, err);
  }
});
