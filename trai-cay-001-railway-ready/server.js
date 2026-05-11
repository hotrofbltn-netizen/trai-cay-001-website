const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const port = process.env.PORT || 3000;
const contentPath = process.env.CONTENT_PATH || path.join(root, "content.json");
const adminPassword = process.env.ADMIN_PASSWORD || "admin001";
const adminSecret = process.env.ADMIN_SECRET || adminPassword;

const adminToken = crypto
  .createHash("sha256")
  .update(`${adminPassword}:${adminSecret}`)
  .digest("hex");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8"
};

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
};

const readBody = (request) =>
  new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Payload too large"));
        request.destroy();
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });

const readContent = () => {
  const rawContent = fs.readFileSync(contentPath, "utf8");
  return JSON.parse(rawContent);
};

const writeContent = (content) => {
  fs.writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
};

const isAuthorized = (request) => {
  const authorization = request.headers.authorization || "";
  return authorization === `Bearer ${adminToken}`;
};

const server = http.createServer((request, response) => {
  const urlPath = decodeURIComponent(request.url.split("?")[0]);

  if (request.method === "GET" && urlPath === "/api/content") {
    try {
      sendJson(response, 200, readContent());
    } catch (error) {
      sendJson(response, 500, { error: "Không đọc được nội dung website." });
    }
    return;
  }

  if (request.method === "POST" && urlPath === "/api/login") {
    readBody(request)
      .then((body) => {
        const payload = JSON.parse(body || "{}");

        if (payload.password !== adminPassword) {
          sendJson(response, 401, { error: "Sai mật khẩu quản trị." });
          return;
        }

        sendJson(response, 200, { token: adminToken });
      })
      .catch(() => sendJson(response, 400, { error: "Dữ liệu đăng nhập không hợp lệ." }));
    return;
  }

  if (request.method === "POST" && urlPath === "/api/content") {
    if (!isAuthorized(request)) {
      sendJson(response, 401, { error: "Bạn cần đăng nhập lại." });
      return;
    }

    readBody(request)
      .then((body) => {
        const payload = JSON.parse(body || "{}");
        writeContent(payload);
        sendJson(response, 200, { ok: true });
      })
      .catch(() => sendJson(response, 400, { error: "Nội dung JSON không hợp lệ." }));
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Method not allowed");
    return;
  }

  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.join(root, requestedPath);
  const normalizedPath = path.normalize(filePath);

  if (!normalizedPath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(normalizedPath, (error, content) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const ext = path.extname(normalizedPath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=3600"
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Trai Cay 001 website running on port ${port}`);
});
