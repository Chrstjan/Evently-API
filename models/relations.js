import { Category } from "./category.model.js";
import { Comment } from "./comment.model.js";
import { Event } from "./event.model.js";
import { Following } from "./following.model.js";
import { Image } from "./image.model.js";
import { ImageRel } from "./image_rel.model.js";
import { JoinedEvent } from "./joined_event.model.js";
import { NestedReply } from "./nested_reply.model.js";
import { Reply } from "./reply.model.js";
import { User } from "./user.model.js";

export const setRelations = () => {
  // Event / Category relation
  Event.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
  });
  Category.hasMany(Event, {
    foreignKey: "category_id",
    as: "events",
  });

  // Event / Image relation
  Event.belongsToMany(Image, { through: ImageRel });
  Image.belongsToMany(Event, { through: ImageRel });

  //User / Event relation
  Event.belongsTo(User, {
    foreignKey: "user_id",
    as: "creator",
    onDelete: "CASCADE",
  });
  User.hasMany(Event, {
    foreignKey: "user_id",
    as: "events",
    onDelete: "CASCADE",
  });

  // User / Joined event relation
  JoinedEvent.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "CASCADE",
  });
  User.hasMany(JoinedEvent, {
    foreignKey: "user_id",
    as: "joined_events",
    onDelete: "CASCADE",
  });

  // Event / Joined event relation
  JoinedEvent.belongsTo(Event);
  Event.hasMany(JoinedEvent);

  // User / Comment relation
  Comment.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "CASCADE",
  });

  User.hasMany(Comment, {
    foreignKey: "user_id",
    as: "comment",
    onDelete: "CASCADE",
  });

  // Event / Comment relation
  Comment.belongsTo(Event, {
    foreignKey: "event_id",
    as: "comments",
    onDelete: "CASCADE",
  });

  Event.hasMany(Comment, {
    foreignKey: "event_id",
    as: "comments",
    onDelete: "CASCADE",
  });

  // Comment / Reply relation
  Reply.belongsTo(Comment, {
    foreignKey: "comment_id",
    as: "comment",
    onDelete: "CASCADE",
  });

  Comment.hasMany(Reply, {
    foreignKey: "comment_id",
    as: "replies",
    onDelete: "CASCADE",
  });

  // Reply / Nested Reply relation
  NestedReply.belongsTo(Reply, {
    foreignKey: "parent_reply_id",
    as: "parent_comment",
    onDelete: "CASCADE",
  });

  Reply.hasMany(NestedReply, {
    foreignKey: "parent_reply_id",
    as: "nested_comments",
    onDelete: "CASCADE",
  });

  // User / Reply relation
  Reply.belongsTo(User);

  // User / Nested Reply relation
  NestedReply.belongsTo(User);

  // User / Followers relation
  Following.belongsTo(User, {
    foreignKey: "followed_user_id",
    as: "user",
    onDelete: "CASCADE",
  });
  User.hasMany(Following, {
    foreignKey: "followed_user_id",
    as: "followers_rel",
    onDelete: "CASCADE",
  });

  // User / Following relation
  Following.belongsTo(User, {
    foreignKey: "user_id",
    as: "follower",
    onDelete: "CASCADE",
  });
  User.hasMany(Following, {
    foreignKey: "user_id",
    as: "following_rel",
    onDelete: "CASCADE",
  });
};
