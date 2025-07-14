const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

// Logout button
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

window.addEventListener("load", () => {
  loadUsers();
  loadTasks();
});

// ——— USERS ———

async function loadUsers() {
  const res = await fetch("http://localhost:3000/api/users", { headers });
  const users = await res.json();

  let html = `
    <table id="users-table">
      <thead>
        <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
      </thead>
      <tbody>
  `;
  users.forEach((u) => {
    html += `
      <tr data-id="${u.id}">
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>
          <button class="edit-user btn" data-id="${u.id}">Edit</button>
          <button class="delete-user btn" data-id="${u.id}">Delete</button>
        </td>
      </tr>
    `;
  });
  html += `</tbody></table>`;
  document.getElementById("users-list").innerHTML = html;

  // Attach event delegation
  document.getElementById("users-table").addEventListener("click", handleUserTableClick);
}

async function handleUserTableClick(e) {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("delete-user")) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await fetch(`http://localhost:3000/api/users/${id}`, {
      method: "DELETE",
      headers,
    });
    loadUsers();
  }
  else if (e.target.classList.contains("edit-user")) {
    // Prompt for new values (you could also show a form)
    const newName = prompt("New name?");
    const newEmail = prompt("New email?");
    const newRole = prompt("New role (admin/user)?");
    if (!newName || !newEmail || !newRole) return;
    await fetch(`http://localhost:3000/api/users/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ name: newName, email: newEmail, role: newRole }),
    });
    loadUsers();
  }
}

// Create user
document.getElementById("user-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("new-user-name").value;
  const email = document.getElementById("new-user-email").value;
  const password = document.getElementById("new-user-password").value;
  await fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers,
    body: JSON.stringify({ name, email, password, role: "user" }),
  });
  loadUsers();
});

// ——— TASKS ———

document.getElementById("task-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("task-title").value;
  const userEmail = document.getElementById("task-user").value;
  const deadline = document.getElementById("task-deadline").value;
  await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers,
    body: JSON.stringify({ name, userEmail, deadline }),
  });
  loadTasks();
});

async function loadTasks() {
  const res = await fetch("http://localhost:3000/api/tasks", { headers });
  const tasks = await res.json();
  let html = `
    <table>
      <thead><tr><th>Task</th><th>Assigned To</th><th>Status</th><th>Deadline</th></tr></thead>
      <tbody>
  `;
  tasks.forEach((t) => {
    html += `
      <tr>
        <td>${t.name}</td>
        <td>${t.assigned_to_name}</td>
        <td>${t.status}</td>
        <td>${t.deadline || "-"}</td>
      </tr>
    `;
  });
  html += `</tbody></table>`;
  document.getElementById("tasks-list").innerHTML = html;
}
