

import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Role = sequelize.define(
  "Role",
  {
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "roles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Role;
