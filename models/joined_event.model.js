import sequelize from "../config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";
import { User } from "./user.model.js";
import { Event } from "./event.model.js";

export class JoinedEvent extends Model {}

JoinedEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "joined_event",
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  }
);
