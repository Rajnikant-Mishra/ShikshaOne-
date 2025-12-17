import repo from "../Subject/subject.repository.js";

class SubjectService {
  // CREATE
  async create(data) {
    if (!data.subject_name || data.subject_name.trim() === "") {
      throw new Error("Subject name is required");
    }

    // Disallow special characters: @ # ~ `
    const invalidChars = /[@#~`]/;
    if (invalidChars.test(data.subject_name)) {
      throw new Error("Special characters like @ # ~ ` are not allowed.");
    }

    const exists = await repo.findByName(data.subject_name);
    if (exists) throw new Error("Subject name already exists");

    return await repo.create(data);
  }

  // GET ALL with pagination + search
  async getAll(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || "";

    return await repo.findAllWithFilters({ page, limit, search });
  }

  // GET ONE
  async getOne(id) {
    const data = await repo.findById(id);
    if (!data) throw new Error("Subject not found");
    return data;
  }

  // UPDATE
  async update(id, body) {
    const exists = await repo.findById(id);
    if (!exists) throw new Error("Subject not found");

    if (body.subject_name) {
      const nameExists = await repo.findByName(body.subject_name);
      if (nameExists && nameExists.id !== id) {
        throw new Error("Subject name already exists");
      }
    }

    await repo.update(id, body);
    return await repo.findById(id);
  }

  // DELETE
  async delete(id) {
    const exists = await repo.findById(id);
    if (!exists) throw new Error("Subject not found");

    const deleted = await repo.delete(id);
    if (!deleted) throw new Error("Failed to delete subject");

    return { message: "Subject deleted successfully" };
  }
}

export default new SubjectService();
