class UI {
  static init() {
    const role = localStorage.getItem('role');
    if (role) {
      UI.renderDashboard(role);
    } else {
      UI.renderLogin();
    }
  }

  static renderLogin() {
    document.getElementById("app").innerHTML = `
      <div class="container">
        <h1>Task Management</h1>
        <form id="login-form">
          <input type="email" id="email" placeholder="Email" required />
          <input type="password" id="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    `;

    document.getElementById('login-form').addEventListener('submit', UI.handleLogin);
  }

  static handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const role = email === 'admin@example.com' ? 'admin' : 'user';
    localStorage.setItem('role', role);
    UI.renderDashboard(role);
  }

  static renderDashboard(role) {
    document.getElementById("app").innerHTML = `
      <div class="container">
        <h2>Welcome, ${role}</h2>
        <button id="logout-btn">Logout</button>
        <div id="task-controls"></div>
        <div id="task-list"></div>
      </div>
    `;

    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("role");
      UI.renderLogin();
    });

    if (role === "admin") UI.renderAdminControls();
    UI.renderTasks(role);
  }

  static renderAdminControls() {
    document.getElementById("task-controls").innerHTML = `
      <form id="new-task-form">
        <input type="text" id="task-name" placeholder="Task name" required />
        <input type="text" id="task-user" placeholder="Assign to user ID" required />
        <input type="date" id="task-deadline" required />
        <button type="submit">Create Task</button>
      </form>
    `;

    document.getElementById("new-task-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("task-name").value;
      const userId = document.getElementById("task-user").value;
      const deadline = document.getElementById("task-deadline").value;

      // Replace with actual API
      await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, userId, deadline }),
      });

      UI.renderTasks("admin");
    });
  }

  static async renderTasks(role) {
    // Replace with actual API endpoint
    const endpoint =
      role === "admin"
        ? "http://localhost:3000/api/tasks"
        : "http://localhost:3000/api/my-tasks";

    const res = await fetch(endpoint);
    const tasks = await res.json();

    let html = `
      <table>
        <thead>
          <tr><th>Task</th><th>Status</th><th>Deadline</th>${
            role === "user" ? "<th>Update</th>" : ""
          }</tr>
        </thead>
        <tbody>
    `;

    tasks.forEach((task) => {
      html += `
        <tr>
          <td>${task.name}</td>
          <td>${task.status}</td>
          <td>${task.deadline || "-"}</td>
          ${
            role === "user"
              ? `<td>
                  <select data-id="${task.id}" class="status-dropdown">
                    <option value="Pending" ${
                      task.status === "Pending" ? "selected" : ""
                    }>Pending</option>
                    <option value="In Progress" ${
                      task.status === "In Progress" ? "selected" : ""
                    }>In Progress</option>
                    <option value="Completed" ${
                      task.status === "Completed" ? "selected" : ""
                    }>Completed</option>
                  </select>
                </td>`
              : ""
          }
        </tr>
      `;
    });

    html += `</tbody></table>`;
    document.getElementById("task-list").innerHTML = html;

    if (role === "user") {
      document.querySelectorAll(".status-dropdown").forEach((dropdown) => {
        dropdown.addEventListener("change", async (e) => {
          const newStatus = e.target.value;
          const taskId = e.target.dataset.id;

          await fetch(`http://localhost:3000/api/tasks/${taskId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });

          UI.renderTasks("user");
        });
      });
    }
  }
}

UI.init();
