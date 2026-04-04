const API = "https://authorisation-1fun.onrender.com/api";

// REGISTER
async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  document.getElementById("message").innerText = data.message;

  // 🔥 Redirect to login after success
  if (res.status === 201 || data.message) {
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
}

// LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.accessToken) {
    localStorage.setItem("token", data.accessToken);

    // 🔥 Redirect to dashboard
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("message").innerText = data.message;
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}