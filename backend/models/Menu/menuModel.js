// import { db } from '../../config/db.js';

// const Menu = {
//   // Create a new menu
//   createMenu: (menu, callback) => {
//     const query = `
//       INSERT INTO menu (title, link, enable, visible, image, sequence, updated_by, parent_id) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     db.query(
//       query,
//       [
//         menu.title,
//         menu.link,  
//         menu.enable,
//         menu.visible,
//         menu.image,
//         menu.sequence,
//         menu.updated_by,
//         menu.parent_id || null, // Handle null parent_id if not provided
//       ],
//       callback
//     );
//   },


//   // Get all menus
//   getAllMenus: (callback) => {
//     const query = 'SELECT * FROM menu';
//     db.query(query, callback);
//   },

//   // Get a menu by ID
//   getMenuById: (id, callback) => {
//     const query = 'SELECT * FROM menu WHERE id = ?';
//     db.query(query, [id], callback);
//   },

//   // Update a menu by ID
//   updateMenu: (id, menu, callback) => {
//     const query = `
//       UPDATE menu 
//       SET title = ?, link = ?, enable = ?, visible = ?, image = ?, sequence = ?, updated_by = ?, parent_id = ? 
//       WHERE id = ?
//     `;
//     db.query(
//       query,
//       [
//         menu.title,
//         menu.link,
//         menu.enable,
//         menu.visible,
//         menu.image,
//         menu.sequence,
//         menu.updated_by,
//         menu.parent_id || null, // Handle null parent_id if not provided
//         id
//       ],
//       callback
//     );
//   },

//   // Delete a menu by ID
//   deleteMenu: (id, callback) => {
//     const query = 'DELETE FROM menu WHERE id = ?';
//     db.query(query, [id], callback);
//   },
// };

// export default Menu;



import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Menu = sequelize.define('Menu', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  enable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sequence: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  updated_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'menu',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Menu;
