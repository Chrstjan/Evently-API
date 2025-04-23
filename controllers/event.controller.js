import express from "express";
import { Event as model } from "../models/event.model.js";
import { errorResponse, successResponse } from "../utils/response.utils.js";
import { Authorize, getUserFromToken } from "../utils/auth.utils.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Image } from "../models/image.model.js";
import { Reply } from "../models/reply.model.js";
import { NestedReply } from "../models/nested_reply.model.js";

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
          model: Image,
          attributes: ["filename", "description"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstname", "lastname", "avatar"],
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

eventController.get(`/${url}/:slug`, async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await model.findOne({
      where: { slug: slug },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name", "id", "slug"],
        },
        {
          model: Image,
          attributes: ["filename", "description"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["firstname", "lastname", "id"],
        },
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "event_id", "content", "createdAt", "num_likes"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstname", "lastname", "avatar"],
            },
            {
              model: Reply,
              as: "replies",
              attributes: [
                "id",
                "comment_id",
                "content",
                "createdAt",
                "num_likes",
              ],
              include: [
                {
                  model: User,
                  attributes: ["id", "firstname", "lastname"],
                },
                {
                  model: NestedReply,
                  as: "nested_comments",
                  include: {
                    model: User,
                    attributes: ["id", "firstname", "lastname"],
                  },
                  attributes: [
                    "id",
                    "comment_id",
                    "parent_reply_id",
                    "content",
                    "createdAt",
                    "num_likes",
                  ],
                },
              ],
            },
          ],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "user_id", "category_id"],
      },
    });

    if (!result) {
      errorResponse(res, `Error fetching event by slug: ${slug}:`);
    }
    successResponse(res, result);
  } catch (err) {
    errorResponse(res, `Error fetching event: ${err.message}`);
  }
});

eventController.get(`/${url}/category/:slug`, async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({
      where: { slug: slug },
    });

    const result = await model.findAll({
      where: { category_id: category.id },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name", "id", "slug"],
        },
        {
          model: Image,
          attributes: ["filename", "description"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstname", "lastname", "avatar"],
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
      errorResponse(
        res,
        `Error fetching events from category: ${category.name}: ${err.message}`
      );
    }
    successResponse(res, result);
  } catch (err) {
    errorResponse(
      res,
      `Error fetching events from category: ${err.message}`,
      err
    );
  }
});

eventController.post(`/${url}`, Authorize, async (req, res) => {
  try {
    const data = req.body;

    const userId = await getUserFromToken(req, res);

    //Adds the user as the event creator
    data.user_id = userId;

    //Checks if there's already an event with that title
    const doesTitleExist = await model.findAll({
      where: { title: data.title },
    });

    //If a event with that title exists add an extra number to the end of the slug
    if (doesTitleExist) {
      data.slug = data.title.replaceAll(
        " ",
        "-".toLowerCase() + "-" + doesTitleExist.length
      );
    } else {
      //Else make the event slug be the event name lowercased
      data.slug = data.title.replaceAll(" ", "-").toLowerCase();
    }

    const result = await model.create(data);

    successResponse(res, result, "Event created", 201);
  } catch (err) {
    errorResponse(res, `Error creating event: ${err.message}`);
  }
});

eventController.patch(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const userId = await getUserFromToken(req, res);

    const data = req.body;

    const { id } = req.params;

    data.user_id = userId;

    //Updates the slug to the new event name
    data.slug = data.title.replace(" ", "-").toLowerCase();

    const [updated] = await model.update(data, {
      where: { id: id, user_id: userId },
      individualHooks: true, //Allows for hooks in the model
    });

    if (!updated)
      return errorResponse(
        res,
        `Event with id: ${id} belonging to user with id: ${userId} not found.`,
        404
      );
    successResponse(res, { userId, ...data }, "Event updated successfully");
  } catch (err) {
    errorResponse(res, `Error updating event: ${err.message}`, err);
  }
});

eventController.delete(`/${url}/:id`, Authorize, async (req, res) => {
  try {
    const data = req.body;

    const { id } = req.params;

    const userId = await getUserFromToken(req, res);

    const result = await model.destroy({
      where: { id: id, user_id: userId },
    });

    if (!result) {
      errorResponse(res, `Error deleting event with the id: ${id}`);
    }

    successResponse(
      res,
      { ...data },
      `Event with the id: ${id} deleted succesfully`
    );
  } catch (err) {
    errorResponse(res, `Error in deleting event`, err);
  }
});
