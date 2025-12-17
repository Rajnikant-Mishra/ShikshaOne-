import repo from "../Class/class.repository.js";

class StudentClassService {
  //create
  async create(data) {
    const exists = await repo.findByName(data.class_name);
    if (exists) throw new Error("Class name already exists");

    return await repo.create(data);
  }



  async getAll(query) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const search = query.search || "";

  return await repo.findAllWithFilters({ page, limit, search });
}


  //getbyid
  async getOne(id) {
    const data = await repo.findById(id);
    if (!data) throw new Error("class not found");

    return data;
  }

  //update
  async update(id, body) {
    const exists = await repo.findById(id);
    if (!exists) throw new Error("class not found");

    if (body.class_name) {
      const nameExists = await repo.findByName(body.class_name);
      if (nameExists && nameExists.id !== id) {
        throw new Error("class name already exists");
      }
    }
    await repo.update(id, body);
    return await repo.findById(id);
  }

  //delete
  async delete(id) {
    const exists = await repo.findById(id);
    if (!exists) {
      throw new Error("Class not found");
    }

    const deleted = await repo.delete(id);

    if (deleted === 0) {
      throw new Error("Failed to delete class");
    }

    return { message: "Class deleted successfully" };
  }
}

export default new StudentClassService();
