const db = require("../config/db");

class User {
  static async create(name, email, password, role = "user") {
    const result = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, password, role]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  }

  static async findAll() {
    const result = await db.query("SELECT * FROM users");
    return result.rows;
  }

  static async update(id, name, email, role) {
    const result = await db.query(
      "UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *",
      [name, email, role, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
  }
}

module.exports = User;
