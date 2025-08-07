

// import RoleMenu from "../../models/configuration/role_menuModel.js";

// // Assign a menu to multiple roles
// export const assignMenu = (req, res) => {
//   const { menu_id, role_ids } = req.body;

//   if (!menu_id || !Array.isArray(role_ids) || role_ids.length === 0) {
//       return res.status(400).json({ error: 'Invalid input. menu_id and role_ids are required.' });
//   }

//   RoleMenu.assignMenuToRole({ menu_id, role_ids }, (err, result) => {
//       if (err) {
//           return res.status(500).json({ error: 'Failed to assign menu to roles', details: err.message });
//       }
//       res.status(201).json({ message: 'Menu assigned to roles successfully', result });
//   });
// };


// // Get menus for a specific role
// export const getMenusByRole = (req, res) => {
//   const { role_id } = req.params;

//   RoleMenu.getMenusByRole(role_id, (err, results) => {
//       if (err) {
//           return res.status(500).json({ error: 'Failed to fetch menus for the role' });
//       }
//       res.json(results);
//   });
// };


// //getall rolesmenus
// // export const getAllRoleMenu = (req, res) => {
// //     RoleMenu.getAllRoleMenuWithNames((err, results) => {
// //         if (err) {
// //             return res.status(500).json({ error: 'Failed to fetch role-menu data with names', details: err.message });
// //         }
// //         res.status(200).json({ message: 'Data fetched successfully', data: results });
// //     });
// // };
// export const getAllRoleMenu = (req, res) => {
//     RoleMenu.getAllRoleMenuWithNames((err, results) => {
//       if (err) {
//         return res.status(500).json({ error: 'Failed to fetch role-menu data with names', details: err.message });
//       }
//       res.status(200).json({ message: 'Data fetched successfully', data: results });
//     });
//   };
  


// export const deleteRoleMenu = (req, res) => {
//     const { id } = req.params;
//     RoleMenu.delete(id, (err) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.status(200).json({ message: 'RoleMenu deleted successfully' });
//     });

// };



import RoleMenu from '../../models/configuration/RoleMenu.js';
import Menu from '../../models/Menu/Menu.js';
import Role from '../../models/Role/Role.js';

// Assign a menu to multiple roles (each as separate rows)
export const assignMenu = async (req, res) => {
  try {
    const { menu_id, role_ids } = req.body;

    if (!menu_id || !Array.isArray(role_ids) || role_ids.length === 0) {
      return res.status(400).json({ error: 'Invalid input. menu_id and role_ids are required.' });
    }

    const records = role_ids.map(role_id => ({
      role_id,
      menu_id,
    }));

    await RoleMenu.bulkCreate(records, { ignoreDuplicates: true });

    res.status(201).json({ message: 'Menu assigned to roles successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign menu to roles', details: err.message });
  }
};

// Get all menus assigned to a specific role
export const getMenusByRole = async (req, res) => {
  try {
    const role_id = req.params.role_id;
    const menus = await Menu.findAll({
      include: {
        model: Role,
        where: { id: role_id },
        through: { attributes: [] }, // exclude join table fields
      },
    });
    res.status(200).json(menus);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menus for the role', details: err.message });
  }
};

// Get all role-menu mappings with names
export const getAllRoleMenu = async (req, res) => {
  try {
    const results = await RoleMenu.findAll({
      include: [
        { model: Menu, attributes: ['title'] },
        { model: Role, attributes: ['role_name'] }
      ]
    });

    const formatted = results.map(rm => ({
      id: rm.id,
      menu_title: rm.Menu.title,
      role_name: rm.Role.role_name,
      created_at: rm.created_at,
    }));

    res.status(200).json({ message: 'Data fetched successfully', data: formatted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch role-menu data with names', details: err.message });
  }
};

// Delete a role-menu mapping
export const deleteRoleMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RoleMenu.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'RoleMenu mapping not found' });
    }

    res.status(200).json({ message: 'RoleMenu deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
