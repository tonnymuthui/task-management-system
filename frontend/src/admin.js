const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

// Logout th user
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

// Load everything on page load
window.onload = () => {
  loadUsers();
  loadTasks();
};

// funct for Loading Users
async function loadUsers() {
  const res = await fetch("http://localhost:3000/api/users", { headers });
  const users = await res.json();

  let html = `<table><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>`;
  users.forEach((u) => {
    html += `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>
          <button onclick="deleteUser(${u.id})">Delete</button>
        </td>
      </tr>
    `;
  });
  html += `</table>`;
  document.getElementById("users-list").innerHTML = html;
}

// Adding User
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

// Deleting a User
async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  await fetch(`http://localhost:3000/api/users/${id}`, {
    method: "DELETE",
    headers,
  });

  loadUsers();
}

// Funct for Assigning Tasks
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

// funnc below will Load All Tasks
async function loadTasks() {
  const res = await fetch("http://localhost:3000/api/tasks", { headers });
  const tasks = await res.json();

  let html = `<table><tr><th>Task</th><th>Assigned To</th><th>Status</th><th>Deadline</th></tr>`;
  tasks.forEach((t) => {
    html += `
      <tr>
        <td>${t.name}</td>
        <td>${t.assigned_to}</td>
        <td>${t.status}</td>
        <td>${t.deadline || "-"}</td>
      </tr>
    `;
  });
  html += `</table>`;
  document.getElementById("tasks-list").innerHTML = html;
}
