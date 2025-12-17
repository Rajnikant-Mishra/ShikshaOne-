
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Role from "../Role/role.model.js";
import Menu from "../Menu/menu.model.js";

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
    indexes: [{ unique: true, fields: ["role_id", "menu_id"] }],
  }
);

// Many-to-Many
Role.belongsToMany(Menu, { through: RoleMenu, foreignKey: "role_id" });
Menu.belongsToMany(Role, { through: RoleMenu, foreignKey: "menu_id" });

// REQUIRED for RoleMenu include
RoleMenu.belongsTo(Role, { foreignKey: "role_id" });
RoleMenu.belongsTo(Menu, { foreignKey: "menu_id" });

export default RoleMenu;
