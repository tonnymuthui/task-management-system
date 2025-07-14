const db = require("../config/db");

class Task {
  static async create(name, assigned_to, deadline) {
    const result = await db.query(
      "INSERT INTO tasks (name, assigned_to, deadline, status) VALUES ($1, $2, $3, 'Pending') RETURNING *",
      [name, assigned_to, deadline]
    );
    return result.rows[0];
  }

  static async findByUser(userId) {
    const result = await db.query("SELECT * FROM tasks WHERE assigned_to = $1", [userId]);
    return result.rows;
  }

  static async findAll() {
    const result = await db.query("SELECT * FROM tasks");
    return result.rows;
  }

  static async updateStatus(id, status) {
    const result = await db.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    return result.rows[0];
  }
}

module.exports = Task;
