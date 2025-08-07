// import { db } from "../../config/db.js";

// const Role = {
//    // Create a new role (permissions stored as JSON)
//    create: (role_name, permissions, callback) => {
//     const query = "INSERT INTO roles (role_name, permissions) VALUES (?, ?)";
//     const permissionsJson = JSON.stringify(permissions); // serialize permissions to JSON string
//     db.query(query, [role_name, permissionsJson], callback);
//   },

//   // Get all roles
//   getAll: (callback) => {
//     const query = "SELECT * FROM roles";
//     db.query(query, callback);
//   },

//   // Get a role by its ID (only role_name)
//   getById: (id, callback) => {
//     const query = "SELECT id, role_name, permissions FROM roles WHERE id = ?";
//     db.query(query, [id], (err, result) => {
//       if (err) return callback(err, null);
//       callback(null, result.length ? result[0] : null);
//     });
//   },

//   // Update a role by its ID (without permissions)
//   update: (id, role_name, permissions, callback) => {
//     const query =
//       "UPDATE roles SET role_name = ?, permissions = ?,  updated_at = CURRENT_TIMESTAMP WHERE id = ?";
//       const permissionsJson = JSON.stringify(permissions);
//     db.query(query, [role_name, permissionsJson,  id], callback);
//   },

//   // Delete a role by its ID
//   delete: (id, callback) => {
//     const query = "DELETE FROM roles WHERE id = ?";
//     db.query(query, [id], callback);
//   },
// };

// export default Role;

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
