// import Menu from '../../models/Menu/menuModel.js';

// // Create a new menu
// export const createMenu = (req, res) => {
//   const menu = req.body;
//   Menu.createMenu(menu, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//     } else {
//       res.status(201).json({ id: results.insertId, ...menu });
//     }
//   });
// };


// // Get all menus
// export const getAllMenus = (req, res) => {
//   Menu.getAllMenus((err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//     } else {
//       res.status(200).json(results);
//     }
//   });
// };

// // Get a single menu by ID
// export const getMenuById = (req, res) => {
//   const { id } = req.params;
//   Menu.getMenuById(id, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//     } else if (results.length === 0) {
//       res.status(404).json({ message: 'Menu not found' });
//     } else {
//       res.status(200).json(results[0]);
//     }
//   });
// };

// // Update a menu by ID
// export const updateMenu = (req, res) => {
//   const { id } = req.params;
//   const menu = req.body;
//   Menu.updateMenu(id, menu, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//     } else if (results.affectedRows === 0) {
//       res.status(404).json({ message: 'Menu not found' });
//     } else {
//       res.status(200).json({ message: 'Menu updated successfully', id, ...menu });
//     }
//   });
// };

// // Delete a menu by ID
// export const deleteMenu = (req, res) => {
//   const { id } = req.params;
//   Menu.deleteMenu(id, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//     } else if (results.affectedRows === 0) {
//       res.status(404).json({ message: 'Menu not found' });
//     } else {
//       res.status(200).json({ message: 'Menu deleted successfully' });
//     }
//   });
// };



import Menu from '../../models/Menu/Menu.js';

// Create a new menu
export const createMenu = async (req, res) => {
  try {
    const menu = await Menu.create(req.body);
    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all menus
export const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll();
    res.status(200).json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get menu by ID
export const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update menu
export const updateMenu = async (req, res) => {
  try {
    const [updated] = await Menu.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ message: 'Menu not found or no changes' });
    }

    const updatedMenu = await Menu.findByPk(req.params.id);
    res.status(200).json({ message: 'Menu updated successfully', menu: updatedMenu });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete menu
export const deleteMenu = async (req, res) => {
  try {
    const deleted = await Menu.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.status(200).json({ message: 'Menu deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
