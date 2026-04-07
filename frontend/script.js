const API = "http://localhost:8000/api/auth";

// 🔹 REGISTER
async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const msg = document.getElementById("message");
  msg.innerText = "Processing...";

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    msg.innerText = "Registered successfully! Redirecting...";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

  } catch (err) {
    msg.innerText = err.message;
  }
}

// 🔹 LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const msg = document.getElementById("message");
  msg.innerText = "Processing...";

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("token", data.token);

    msg.innerText = "Login successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);

  } catch (err) {
    msg.innerText = err.message;
  }
}