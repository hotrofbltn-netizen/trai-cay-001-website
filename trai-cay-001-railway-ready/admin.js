const loginPanel = document.querySelector("#loginPanel");
const editorPanel = document.querySelector("#editorPanel");
const loginForm = document.querySelector("#loginForm");
const passwordInput = document.querySelector("#password");
const loginStatus = document.querySelector("#loginStatus");
const contentForm = document.querySelector("#contentForm");
const editor = document.querySelector("#contentEditor");
const editorStatus = document.querySelector("#editorStatus");
const saveButton = document.querySelector("#saveContent");
const reloadButton = document.querySelector("#reloadContent");
const applyJsonButton = document.querySelector("#applyJson");
const logoutButton = document.querySelector("#logout");

const tokenKey = "trai-cay-001-admin-token";
let currentContent = {};

const sections = [
  {
    title: "Thông tin chung",
    fields: [
      ["site.company", "Tên công ty"],
      ["site.brand", "Tên thương hiệu"],
      ["site.tagline", "Dòng mô tả logo"],
      ["site.email", "Email"],
      ["site.phone", "Số điện thoại hiển thị"],
      ["site.phoneRaw", "Số điện thoại để bấm gọi"],
      ["site.hotline", "Hotline"],
      ["site.address", "Địa chỉ", "textarea"],
      ["footer.description", "Mô tả chân trang", "textarea"],
      ["footer.products", "Danh sách sản phẩm chân trang, mỗi dòng 1 mục", "lines"]
    ]
  },
  {
    title: "Trang đầu",
    fields: [
      ["hero.kicker", "Dòng nhỏ màu cam"],
      ["hero.title", "Tiêu đề lớn"],
      ["hero.body", "Đoạn giới thiệu", "textarea"],
      ["hero.trust", "Các nhãn cam kết, mỗi dòng 1 nhãn", "lines"],
      ["hero.badgeValue", "Số trong thẻ nổi", "number"],
      ["hero.badgeSuffix", "Đơn vị sau số"],
      ["hero.badgeLabel", "Chữ dưới số"]
    ]
  },
  {
    title: "Câu chuyện thương hiệu",
    fields: [
      ["about.kicker", "Dòng nhỏ"],
      ["about.title", "Tiêu đề"],
      ["about.body", "Nội dung", "textarea"],
      ["about.cardTitle", "Tiêu đề thẻ nổi"],
      ["about.cardText", "Nội dung thẻ nổi"],
      ["about.checks", "Các ý nổi bật, mỗi dòng 1 ý", "lines"]
    ]
  },
  {
    title: "Nhà xưởng",
    fields: [
      ["factory.kicker", "Dòng nhỏ"],
      ["factory.title", "Tiêu đề"],
      ["factory.body", "Nội dung", "textarea"]
    ]
  },
  {
    title: "Quy trình",
    fields: [
      ["process.kicker", "Dòng nhỏ"],
      ["process.title", "Tiêu đề"]
    ]
  },
  {
    title: "Thị trường",
    fields: [
      ["market.kicker", "Dòng nhỏ"],
      ["market.title", "Tiêu đề"]
    ]
  },
  {
    title: "Tin tức",
    fields: [
      ["news.kicker", "Dòng nhỏ"],
      ["news.title", "Tiêu đề"],
      ["news.linkText", "Chữ link bên phải"]
    ]
  },
  {
    title: "Khối tư vấn",
    fields: [
      ["consult.kicker", "Dòng nhỏ"],
      ["consult.title", "Tiêu đề"],
      ["consult.body", "Nội dung", "textarea"],
      ["consult.button", "Chữ nút gọi"]
    ]
  }
];

const repeaters = [
  {
    path: "stats",
    title: "Số liệu nổi bật",
    fields: [
      ["value", "Số", "number"],
      ["suffix", "Đơn vị"],
      ["label", "Nội dung"]
    ],
    empty: { value: 0, suffix: "", label: "Nội dung mới" }
  },
  {
    path: "values.items",
    title: "Giá trị cốt lõi",
    fields: [
      ["icon", "Số thứ tự"],
      ["title", "Tiêu đề"],
      ["text", "Nội dung", "textarea"]
    ],
    empty: { icon: "01", title: "Tiêu đề mới", text: "Nội dung mới" }
  },
  {
    path: "products.items",
    title: "Sản phẩm",
    fields: [
      ["image", "Đường dẫn ảnh"],
      ["alt", "Mô tả ảnh"],
      ["category", "Nhóm"],
      ["title", "Tên sản phẩm"],
      ["text", "Mô tả", "textarea"]
    ],
    empty: { image: "assets/profile-page-01.jpg", alt: "Sản phẩm", category: "Sản phẩm", title: "Sản phẩm mới", text: "Mô tả sản phẩm." }
  },
  {
    path: "factory.items",
    title: "Thông tin trong khối nhà xưởng",
    fields: [
      ["title", "Dòng lớn"],
      ["text", "Dòng nhỏ"]
    ],
    empty: { title: "Thông tin mới", text: "Mô tả mới" }
  },
  {
    path: "process.items",
    title: "Các bước quy trình",
    fields: [
      ["step", "Số bước"],
      ["title", "Tiêu đề"],
      ["text", "Nội dung", "textarea"]
    ],
    empty: { step: "01", title: "Bước mới", text: "Nội dung bước mới." }
  },
  {
    path: "market.items",
    title: "Thị trường xuất khẩu",
    fields: [
      ["title", "Tiêu đề"],
      ["text", "Nội dung", "textarea"]
    ],
    empty: { title: "Thị trường mới", text: "Nội dung mới." }
  },
  {
    path: "news.items",
    title: "Tin tức & hoạt động",
    fields: [
      ["image", "Đường dẫn ảnh"],
      ["alt", "Mô tả ảnh"],
      ["category", "Chuyên mục"],
      ["title", "Tiêu đề"],
      ["text", "Nội dung", "textarea"]
    ],
    empty: { image: "assets/profile-page-20.jpg", alt: "Tin tức", category: "Tin tức", title: "Tin mới", text: "Nội dung tin." }
  }
];

const setStatus = (element, message, type = "") => {
  element.textContent = message;
  element.classList.toggle("is-error", type === "error");
  element.classList.toggle("is-ok", type === "ok");
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

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

const inputMarkup = (path, label, type = "text", value = "") => {
  const safeValue = type === "lines" ? linesToText(value) : value ?? "";
  const tag =
    type === "textarea" || type === "lines"
      ? `<textarea data-path="${path}" data-type="${type}">${escapeHtml(safeValue)}</textarea>`
      : `<input data-path="${path}" data-type="${type}" type="${type === "number" ? "number" : "text"}" value="${escapeHtml(safeValue)}">`;

  return `<label><span>${escapeHtml(label)}</span>${tag}</label>`;
};

const renderForm = () => {
  const simpleSections = sections
    .map(
      (section) => `
        <section class="admin-card">
          <h2>${escapeHtml(section.title)}</h2>
          <div class="form-grid">
            ${section.fields.map(([path, label, type]) => inputMarkup(path, label, type, getValue(currentContent, path))).join("")}
          </div>
        </section>
      `
    )
    .join("");

  const repeaterSections = repeaters
    .map((repeater) => {
      const items = getValue(currentContent, repeater.path) || [];

      return `
        <section class="admin-card" data-repeater="${repeater.path}">
          <div class="card-title-row">
            <h2>${escapeHtml(repeater.title)}</h2>
            <button class="small-btn" type="button" data-add="${repeater.path}">+ Thêm</button>
          </div>
          <div class="repeat-list">
            ${items
              .map(
                (item, index) => `
                  <article class="repeat-item" data-index="${index}">
                    <div class="repeat-title">
                      <strong>Mục ${index + 1}</strong>
                      <button class="danger-btn" type="button" data-remove="${repeater.path}" data-index="${index}">Xóa</button>
                    </div>
                    <div class="form-grid">
                      ${repeater.fields
                        .map(([key, label, type]) => inputMarkup(`${repeater.path}.${index}.${key}`, label, type, item[key]))
                        .join("")}
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");

  contentForm.innerHTML = `${simpleSections}${repeaterSections}`;
  editor.value = JSON.stringify(currentContent, null, 2);
};

const syncFormToContent = () => {
  contentForm.querySelectorAll("[data-path]").forEach((input) => {
    const path = input.dataset.path;
    const type = input.dataset.type;
    let value = input.value;

    if (type === "number") value = Number(value || 0);
    if (type === "lines") value = textToLines(value);

    setValue(currentContent, path, value);
  });

  editor.value = JSON.stringify(currentContent, null, 2);
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

contentForm.addEventListener("click", (event) => {
  const addPath = event.target.dataset.add;
  const removePath = event.target.dataset.remove;

  if (addPath) {
    syncFormToContent();
    const repeater = repeaters.find((item) => item.path === addPath);
    const list = getValue(currentContent, addPath) || [];
    list.push({ ...repeater.empty });
    setValue(currentContent, addPath, list);
    renderForm();
  }

  if (removePath) {
    syncFormToContent();
    const list = getValue(currentContent, removePath) || [];
    list.splice(Number(event.target.dataset.index), 1);
    setValue(currentContent, removePath, list);
    renderForm();
  }
});

saveButton.addEventListener("click", async () => {
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

    if (!response.ok) {
      throw new Error(payload.error || "Không lưu được nội dung.");
    }

    renderForm();
    setStatus(editorStatus, "Đã lưu. Tải lại website để xem nội dung mới.", "ok");
  } catch (error) {
    setStatus(editorStatus, `Lỗi: ${error.message}`, "error");
  }
});

reloadButton.addEventListener("click", async () => {
  try {
    await loadContent();
    setStatus(editorStatus, "Đã tải lại nội dung mới nhất.", "ok");
  } catch (error) {
    setStatus(editorStatus, error.message, "error");
  }
});

applyJsonButton.addEventListener("click", () => {
  try {
    currentContent = JSON.parse(editor.value);
    renderForm();
    setStatus(editorStatus, "Đã áp dụng JSON vào form.", "ok");
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
