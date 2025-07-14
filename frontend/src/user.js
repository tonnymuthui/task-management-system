const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

window.onload = () => {
  loadMyTasks();
};

// funct 4 Loading current user Tasks
async function loadMyTasks() {
  const res = await fetch("http://localhost:3000/api/tasks/my-tasks", { headers });
  const tasks = await res.json();

  let html = `<table><tr><th>Task</th><th>Status</th><th>Deadline</th><th>Update</th></tr>`;
  tasks.forEach((t) => {
    html += `
      <tr>
        <td>${t.name}</td>
        <td>${t.status}</td>
        <td>${t.deadline || "-"}</td>
        <td>
          <select data-id="${t.id}" class="status-dropdown">
            <option value="Pending" ${t.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="In Progress" ${t.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Completed" ${t.status === "Completed" ? "selected" : ""}>Completed</option>
          </select>
        </td>
      </tr>
    `;
  });
  html += `</table>`;
  document.getElementById("user-tasks").innerHTML = html;

  document.querySelectorAll(".status-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("change", async (e) => {
      const id = e.target.dataset.id;
      const status = e.target.value;

      await fetch(`http://localhost:3000/api/tasks/${id}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status }),
      });

      loadMyTasks();
    });
  });
}
