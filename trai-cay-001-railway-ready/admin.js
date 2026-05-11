const loginPanel = document.querySelector("#loginPanel");
const editorPanel = document.querySelector("#editorPanel");
const loginForm = document.querySelector("#loginForm");
const passwordInput = document.querySelector("#password");
const loginStatus = document.querySelector("#loginStatus");
const editor = document.querySelector("#contentEditor");
const editorStatus = document.querySelector("#editorStatus");
const saveButton = document.querySelector("#saveContent");
const formatButton = document.querySelector("#formatContent");
const logoutButton = document.querySelector("#logout");

const tokenKey = "trai-cay-001-admin-token";

const setStatus = (element, message, type = "") => {
  element.textContent = message;
  element.classList.toggle("is-error", type === "error");
  element.classList.toggle("is-ok", type === "ok");
};

const showEditor = () => {
  loginPanel.hidden = true;
  editorPanel.hidden = false;
};

const showLogin = () => {
  loginPanel.hidden = false;
  editorPanel.hidden = true;
};

const loadContent = async () => {
  const response = await fetch("/api/content", { cache: "no-store" });
  if (!response.ok) throw new Error("Không tải được nội dung.");
  const content = await response.json();
  editor.value = JSON.stringify(content, null, 2);
};

const login = async (password) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Đăng nhập thất bại.");
  }

  localStorage.setItem(tokenKey, payload.token);
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus(loginStatus, "Đang đăng nhập...");

  try {
    await login(passwordInput.value);
    await loadContent();
    showEditor();
    setStatus(editorStatus, "Đã tải nội dung website.", "ok");
  } catch (error) {
    setStatus(loginStatus, error.message, "error");
  }
});

saveButton.addEventListener("click", async () => {
  setStatus(editorStatus, "Đang lưu...");

  try {
    const content = JSON.parse(editor.value);
    const token = localStorage.getItem(tokenKey);
    const response = await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(content)
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Không lưu được nội dung.");
    }

    editor.value = JSON.stringify(content, null, 2);
    setStatus(editorStatus, "Đã lưu. Mở lại website để xem nội dung mới.", "ok");
  } catch (error) {
    setStatus(editorStatus, `Lỗi: ${error.message}`, "error");
  }
});

formatButton.addEventListener("click", () => {
  try {
    editor.value = JSON.stringify(JSON.parse(editor.value), null, 2);
    setStatus(editorStatus, "Đã căn lại JSON.", "ok");
  } catch (error) {
    setStatus(editorStatus, "JSON đang sai dấu ngoặc hoặc dấu phẩy.", "error");
  }
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(tokenKey);
  passwordInput.value = "";
  showLogin();
  setStatus(loginStatus, "Đã đăng xuất.", "ok");
});

const boot = async () => {
  if (!localStorage.getItem(tokenKey)) return;

  try {
    await loadContent();
    showEditor();
  } catch (error) {
    localStorage.removeItem(tokenKey);
    showLogin();
  }
};

boot();
