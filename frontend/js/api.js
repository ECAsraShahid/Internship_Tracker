// Small fetch wrapper around the Internship Tracker REST API.
// All endpoints are relative, since the frontend is served by the
// same Express app as the API (see backend app.js).

const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no JSON body
  }

  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

const Api = {
  signup: (name, email, password) =>
    apiRequest("/auth/signup", { method: "POST", body: { name, email, password } }),

  login: (email, password) =>
    apiRequest("/auth/login", { method: "POST", body: { email, password } }),

  getTrackers: () => apiRequest("/users", { auth: true }),

  createTracker: (data) =>
    apiRequest("/users", { method: "POST", body: data, auth: true }),

  updateTracker: (id, data) =>
    apiRequest(`/users/${id}`, { method: "PUT", body: data, auth: true }),

  deleteTracker: (id) =>
    apiRequest(`/users/${id}`, { method: "DELETE", auth: true }),
};
