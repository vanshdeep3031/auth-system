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

  // 2FA case
  if (data.userId) {
    const otp = prompt("Enter OTP");

    const verify = await fetch(`${API}/auth/2fa/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ userId: data.userId, token: otp })
    });

    const finalData = await verify.json();

    localStorage.setItem("token", finalData.accessToken);
    window.location.href = "dashboard.html";
    return;
  }

  // Normal login
  localStorage.setItem("token", data.accessToken);
  window.location.href = "dashboard.html";
}

// DASHBOARD
async function loadDashboard() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/protected/dashboard`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();
  document.getElementById("data").innerText = JSON.stringify(data, null, 2);
}

// LOGOUT
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}