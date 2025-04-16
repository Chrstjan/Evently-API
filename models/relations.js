import { Category } from "./category.model.js";
import { Event } from "./event.model.js";
import { Following } from "./following.model.js";
import { JoinedEvent } from "./joined_event.model.js";
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
