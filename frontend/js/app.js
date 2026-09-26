const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];
const STAMP_COLORS = {
  Applied: "var(--slate)",
  Interview: "var(--ochre)",
  Offer: "var(--moss)",
  Rejected: "var(--rust)",
};

const authView = document.getElementById("auth-view");
const appView = document.getElementById("app-view");

let trackers = [];

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  if (getToken()) {
    showApp();
  } else {
    showAuth();
  }
  bindAuthTabs();
  bindAuthForms();
  bindAppEvents();
});

function showAuth() {
  authView.classList.remove("hidden");
  appView.classList.add("hidden");
}

async function showApp() {
  authView.classList.add("hidden");
  appView.classList.remove("hidden");
  await loadTrackers();
}

// ---------- AUTH ----------
function bindAuthTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".auth-form").forEach((f) => f.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`${btn.dataset.tab}-form`).classList.add("active");
    });
  });
}

function bindAuthForms() {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("login-msg");
    msg.textContent = "";
    const fd = new FormData(loginForm);
    try {
      const res = await Api.login(fd.get("email"), fd.get("password"));
      setToken(res.token);
      loginForm.reset();
      showToast("Welcome back!");
      await showApp();
    } catch (err) {
      msg.textContent = err.message;
    }
  });

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("signup-msg");
    msg.textContent = "";
    const fd = new FormData(signupForm);
    try {
      await Api.signup(fd.get("name"), fd.get("email"), fd.get("password"));
      showToast("Account created — please log in.");
      signupForm.reset();
      document.querySelector('.tab-btn[data-tab="login"]').click();
    } catch (err) {
      msg.textContent = err.message;
    }
  });
}

// ---------- APP EVENTS ----------
function bindAppEvents() {
  document.getElementById("logout-btn").addEventListener("click", () => {
    clearToken();
    trackers = [];
    showAuth();
  });

  document.getElementById("new-entry-btn").addEventListener("click", () => openEntryModal());
  document.getElementById("modal-close").addEventListener("click", closeEntryModal);
  document.getElementById("cancel-entry-btn").addEventListener("click", closeEntryModal);

  document.getElementById("entry-form").addEventListener("submit", handleEntrySubmit);
  document.getElementById("delete-entry-btn").addEventListener("click", handleEntryDelete);
}

// ---------- DATA ----------
async function loadTrackers() {
  try {
    trackers = await Api.getTrackers();
    renderBoard();
    renderStats();
  } catch (err) {
    showToast(err.message);
    if (err.message.toLowerCase().includes("token")) {
      clearToken();
      showAuth();
    }
  }
}

function renderStats() {
  const el = document.getElementById("spine-stats");
  el.innerHTML = STATUSES.map((status) => {
    const count = trackers.filter((t) => t.status === status).length;
    return `<div class="stat-row"><span class="stat-label">${status}</span><span class="stat-value">${count}</span></div>`;
  }).join("");

  document.getElementById("entry-count").textContent =
    `${trackers.length} application${trackers.length === 1 ? "" : "s"} logged`;
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = STATUSES.map((status) => {
    const items = trackers.filter((t) => t.status === status);
    return `
      <div class="column">
        <div class="column-head">
          <span class="column-title">${status}</span>
          <span class="column-count">${items.length}</span>
        </div>
        ${
          items.length
            ? items.map(cardHtml).join("")
            : `<p class="empty-column">No entries yet.</p>`
        }
      </div>
    `;
  }).join("");

  board.querySelectorAll(".entry-card").forEach((card) => {
    card.addEventListener("click", () => {
      const tracker = trackers.find((t) => t._id === card.dataset.id);
      if (tracker) openEntryModal(tracker);
    });
  });
}

function cardHtml(t) {
  const color = STAMP_COLORS[t.status] || "var(--slate)";
  const metaBits = [];
  if (t.location) metaBits.push(t.location);
  if (t.workMode) metaBits.push(t.workMode);
  if (t.appliedDate) metaBits.push(new Date(t.appliedDate).toLocaleDateString());

  return `
    <div class="entry-card" style="--stamp-color:${color}" data-id="${t._id}">
      <div class="company">${escapeHtml(t.companyName)}</div>
      <div class="role">${escapeHtml(t.role)}</div>
      ${metaBits.length ? `<div class="meta">${metaBits.map(escapeHtml).join(" · ")}</div>` : ""}
    </div>
  `;
}

// ---------- MODAL ----------
function openEntryModal(tracker) {
  const form = document.getElementById("entry-form");
  form.reset();
  document.getElementById("entry-msg").textContent = "";
  const deleteBtn = document.getElementById("delete-entry-btn");

  if (tracker) {
    document.getElementById("modal-title").textContent = "Edit entry";
    form.id.value = tracker._id;
    form.companyName.value = tracker.companyName || "";
    form.role.value = tracker.role || "";
    form.status.value = tracker.status || "Applied";
    form.workMode.value = tracker.workMode || "";
    form.location.value = tracker.location || "";
    form.appliedDate.value = tracker.appliedDate ? tracker.appliedDate.slice(0, 10) : "";
    form.salary.value = tracker.salary ?? "";
    form.jobLink.value = tracker.jobLink || "";
    form.notes.value = tracker.notes || "";
    deleteBtn.classList.remove("hidden");
  } else {
    document.getElementById("modal-title").textContent = "New entry";
    form.id.value = "";
    deleteBtn.classList.add("hidden");
  }

  document.getElementById("entry-modal").classList.remove("hidden");
}

function closeEntryModal() {
  document.getElementById("entry-modal").classList.add("hidden");
}

async function handleEntrySubmit(e) {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById("entry-msg");
  msg.textContent = "";

  const fd = new FormData(form);
  const id = fd.get("id");
  const payload = {
    companyName: fd.get("companyName"),
    role: fd.get("role"),
    status: fd.get("status"),
    workMode: fd.get("workMode"),
    location: fd.get("location"),
    appliedDate: fd.get("appliedDate") || undefined,
    salary: fd.get("salary") ? Number(fd.get("salary")) : undefined,
    jobLink: fd.get("jobLink"),
    notes: fd.get("notes"),
  };

  try {
    if (id) {
      await Api.updateTracker(id, payload);
      showToast("Entry updated.");
    } else {
      await Api.createTracker(payload);
      showToast("Entry added.");
    }
    closeEntryModal();
    await loadTrackers();
  } catch (err) {
    msg.textContent = err.message;
  }
}

async function handleEntryDelete() {
  const form = document.getElementById("entry-form");
  const id = form.id.value;
  if (!id) return;
  if (!confirm("Delete this entry? This cannot be undone.")) return;

  try {
    await Api.deleteTracker(id);
    showToast("Entry deleted.");
    closeEntryModal();
    await loadTrackers();
  } catch (err) {
    document.getElementById("entry-msg").textContent = err.message;
  }
}

// ---------- HELPERS ----------
function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.add("hidden"), 2800);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}
