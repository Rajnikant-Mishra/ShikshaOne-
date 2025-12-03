import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Role from "../Role/roleModel.js";
import Menu from "../Menu/menuModel.js";

const RoleMenu = sequelize.define(
  "RoleMenu",
  {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Menu,
        key: "id",
      },
    },
  },
  {
    tableName: "role_menu",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["role_id", "menu_id"],
      },
    ],
  }
);

Role.belongsToMany(Menu, {
  through: RoleMenu,
  foreignKey: "role_id",
});
Menu.belongsToMany(Role, {
  through: RoleMenu,
  foreignKey: "menu_id",
});

export default RoleMenu;
