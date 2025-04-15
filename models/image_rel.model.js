import sequelize from "../config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";
import { Event } from "./event.model.js";
import { Image } from "./image.model.js";

export class ImageRel extends Model {}

ImageRel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Image,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "image_rel",
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  }
);
