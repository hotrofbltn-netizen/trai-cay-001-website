const loginPanel = document.querySelector("#loginPanel");
const editorPanel = document.querySelector("#editorPanel");
const loginForm = document.querySelector("#loginForm");
const passwordInput = document.querySelector("#password");
const loginStatus = document.querySelector("#loginStatus");
const contentForm = document.querySelector("#contentForm");
const editor = document.querySelector("#contentEditor");
const editorStatus = document.querySelector("#editorStatus");
const autosaveState = document.querySelector("#autosaveState");
const reloadButton = document.querySelector("#reloadContent");
const applyJsonButton = document.querySelector("#applyJson");
const logoutButton = document.querySelector("#logout");

const tokenKey = "trai-cay-001-admin-token";
let currentContent = {};
let saveTimer;
let isSaving = false;

const repeaters = {
  stats: {
    fields: [
      ["value", "Số", "number"],
      ["suffix", "Đơn vị"],
      ["label", "Nội dung"]
    ],
    empty: { value: 0, suffix: "", label: "Nội dung mới" }
  },
  "values.items": {
    fields: [
      ["icon", "Số thứ tự"],
      ["title", "Tiêu đề"],
      ["text", "Nội dung", "textarea"]
    ],
    empty: { icon: "01", title: "Tiêu đề mới", text: "Nội dung mới" }
  },
  "products.items": {
    fields: [
      ["image", "Đường dẫn ảnh"],
      ["alt", "Mô tả ảnh"],
      ["category", "Nhóm"],
      ["title", "Tên sản phẩm"],
      ["text", "Mô tả", "textarea"]
    ],
    empty: { image: "assets/profile-page-01.jpg", alt: "Sản phẩm", category: "Sản phẩm", title: "Sản phẩm mới", text: "Mô tả sản phẩm." }
  },
  "factory.items": {
    fields: [
      ["title", "Dòng lớn"],
      ["text", "Dòng nhỏ"]
    ],
    empty: { title: "Thông tin mới", text: "Mô tả mới" }
  },
  "process.items": {
    fields: [
      ["step", "Số bước"],
      ["title", "Tiêu đề"],
      ["text", "Nội dung", "textarea"]
    ],
    empty: { step: "01", title: "Bước mới", text: "Nội dung bước mới." }
  },
  "market.items": {
    fields: [
      ["title", "Tiêu đề"],
      ["text", "Nội dung", "textarea"]
    ],
    empty: { title: "Thị trường mới", text: "Nội dung mới." }
  },
  "news.items": {
    fields: [
      ["image", "Đường dẫn ảnh"],
      ["alt", "Mô tả ảnh"],
      ["category", "Chuyên mục"],
      ["title", "Tiêu đề"],
      ["text", "Nội dung", "textarea"]
    ],
    empty: { image: "assets/profile-page-20.jpg", alt: "Tin tức", category: "Tin tức", title: "Tin mới", text: "Nội dung tin." }
  }
};

const setStatus = (element, message, type = "") => {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("is-error", type === "error");
  element.classList.toggle("is-ok", type === "ok");
};

const setAutosave = (message, type = "") => {
  if (!autosaveState) return;
  autosaveState.textContent = message;
  autosaveState.classList.toggle("is-saving", type === "saving");
  autosaveState.classList.toggle("is-error", type === "error");
  autosaveState.classList.toggle("is-ok", type === "ok");
};

const getValue = (object, path) =>
  path.split(".").reduce((value, key) => (value === undefined || value === null ? undefined : value[key]), object);

const setValue = (object, path, value) => {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((item, key) => {
    item[key] = item[key] || {};
    return item[key];
  }, object);
  target[last] = value;
};

const linesToText = (value) => (Array.isArray(value) ? value.join("\n") : value || "");
const textToLines = (value) => String(value || "").split("\n").map((line) => line.trim()).filter(Boolean);

const bindSimpleFields = () => {
  contentForm.querySelectorAll("[data-path]").forEach((input) => {
    const value = getValue(currentContent, input.dataset.path);
    input.value = input.dataset.type === "lines" ? linesToText(value) : value ?? "";
  });
};

const createField = (path, label, type = "text", value = "") => {
  const field = document.createElement("label");
  const caption = document.createElement("span");
  const input = type === "textarea" ? document.createElement("textarea") : document.createElement("input");

  caption.textContent = label;
  input.dataset.path = path;
  input.dataset.type = type;

  if (type !== "textarea") input.type = type === "number" ? "number" : "text";
  input.value = value ?? "";

  field.append(caption, input);
  return field;
};

const renderRepeaters = () => {
  Object.entries(repeaters).forEach(([path, config]) => {
    const area = document.querySelector(`[data-list="${path}"]`);
    if (!area) return;

    const items = getValue(currentContent, path) || [];
    area.innerHTML = "";

    items.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "repeat-item";

      const title = document.createElement("div");
      title.className = "repeat-title";
      title.innerHTML = `<strong>Mục ${index + 1}</strong>`;

      const remove = document.createElement("button");
      remove.className = "danger-btn";
      remove.type = "button";
      remove.textContent = "Xóa";
      remove.dataset.remove = path;
      remove.dataset.index = String(index);
      title.append(remove);

      const grid = document.createElement("div");
      grid.className = "form-grid";

      config.fields.forEach(([key, label, type]) => {
        grid.append(createField(`${path}.${index}.${key}`, label, type, item[key]));
      });

      card.append(title, grid);
      area.append(card);
    });
  });
};

const renderForm = () => {
  bindSimpleFields();
  renderRepeaters();
  editor.value = JSON.stringify(currentContent, null, 2);
};

const syncFormToContent = () => {
  contentForm.querySelectorAll("[data-path]").forEach((input) => {
    let value = input.value;
    if (input.dataset.type === "number") value = Number(value || 0);
    if (input.dataset.type === "lines") value = textToLines(value);
    setValue(currentContent, input.dataset.path, value);
  });

  editor.value = JSON.stringify(currentContent, null, 2);
};

const saveContent = async () => {
  if (isSaving) return;

  isSaving = true;
  setAutosave("Đang lưu...", "saving");
  setStatus(editorStatus, "Đang lưu...");

  try {
    syncFormToContent();
    const token = localStorage.getItem(tokenKey);
    const response = await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(currentContent)
    });
    const payload = await response.json();

    if (!response.ok) throw new Error(payload.error || "Không lưu được nội dung.");

    setAutosave("Đã tự lưu", "ok");
    setStatus(editorStatus, "Đã tự lưu. Tải lại website để xem nội dung mới.", "ok");
  } catch (error) {
    setAutosave("Lưu lỗi", "error");
    setStatus(editorStatus, `Lỗi: ${error.message}`, "error");
  } finally {
    isSaving = false;
  }
};

const scheduleSave = () => {
  clearTimeout(saveTimer);
  setAutosave("Đang chờ lưu...", "saving");
  setStatus(editorStatus, "Đang chờ tự lưu...");
  saveTimer = setTimeout(saveContent, 900);
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
  currentContent = await response.json();
  renderForm();
};

const login = async (password) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });
  const payload = await response.json();

  if (!response.ok) throw new Error(payload.error || "Đăng nhập thất bại.");
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
    setAutosave("Tự lưu đang bật", "ok");
  } catch (error) {
    setStatus(loginStatus, error.message, "error");
  }
});

contentForm.addEventListener("input", (event) => {
  if (event.target.matches("[data-path]")) scheduleSave();
});

contentForm.addEventListener("click", (event) => {
  const addPath = event.target.dataset.add;
  const removePath = event.target.dataset.remove;

  if (addPath) {
    syncFormToContent();
    const list = getValue(currentContent, addPath) || [];
    list.push({ ...repeaters[addPath].empty });
    setValue(currentContent, addPath, list);
    renderForm();
    saveContent();
  }

  if (removePath) {
    syncFormToContent();
    const list = getValue(currentContent, removePath) || [];
    list.splice(Number(event.target.dataset.index), 1);
    setValue(currentContent, removePath, list);
    renderForm();
    saveContent();
  }
});

reloadButton.addEventListener("click", async () => {
  try {
    clearTimeout(saveTimer);
    await loadContent();
    setStatus(editorStatus, "Đã tải lại nội dung mới nhất.", "ok");
    setAutosave("Tự lưu đang bật", "ok");
  } catch (error) {
    setStatus(editorStatus, error.message, "error");
  }
});

applyJsonButton.addEventListener("click", () => {
  try {
    currentContent = JSON.parse(editor.value);
    renderForm();
    setStatus(editorStatus, "Đã áp dụng JSON vào form.", "ok");
    saveContent();
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
    setAutosave("Tự lưu đang bật", "ok");
  } catch (error) {
    localStorage.removeItem(tokenKey);
    showLogin();
  }
};

boot();
