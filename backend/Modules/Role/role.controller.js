
import Role from '../Role/role.model.js';

// Create Role
export const createRole = async (req, res) => {
  try {
    const { role_name} = req.body;
    if (!role_name) return res.status(400).json({ message: "Role name is required" });

    const role = await Role.create({ role_name });
    res.status(201).json({ message: "Role created", id: role.id });
  } catch (error) {
    res.status(500).json({ message: "Error creating role", error });
  }
};

// Get All Roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles", error });
  }
};

// Get Role by ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: "Error fetching role", error });
  }
};

// Update Role
export const updateRole = async (req, res) => {
  try {
    const { role_name } = req.body;
    const updated = await Role.update(
      { role_name},
      { where: { id: req.params.id } }
    );
    if (updated[0] === 0) return res.status(404).json({ message: "Role not found or no change" });
    res.status(200).json({ message: "Role updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error });
  }
};

// Delete Role
export const deleteRole = async (req, res) => {
  try {
    const deleted = await Role.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting role", error });
  }
};
