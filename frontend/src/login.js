const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

document.getElementById('login-toggle').addEventListener('click', function() {
  document.getElementById('login-card').classList.add('active');
  document.getElementById('register-card').classList.remove('active');
  this.classList.add('active');
  document.getElementById('register-toggle').classList.remove('active');
});

document.getElementById('register-toggle').addEventListener('click', function() {
  document.getElementById('register-card').classList.add('active');
  document.getElementById('login-card').classList.remove('active');
  this.classList.add('active');
  document.getElementById('login-toggle').classList.remove('active');
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("https://task-management-system-yefx.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    if (data.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "user.html";
    }
  } else {
    alert(data.message || "Login failed.");
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  const res = await fetch("https://task-management-system-yefx.onrender.com/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Registration successful. You can now log in.");
  } else {
    alert(data.message || "Registration failed.");
  }
});
