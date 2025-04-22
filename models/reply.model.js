import sequelize from "../config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";
import { Comment } from "./comment.model.js";
import { User } from "./user.model.js";

export class Reply extends Model {}

Reply.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Comment,
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    num_likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "reply",
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  }
);
