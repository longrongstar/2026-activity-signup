/* 2026 活動報名 — 表單驗證與送出（寫入 Google Sheet 的 Apps Script Web App） */

// Apps Script Web App 部署完成後，會由此部署流程自動更新為實際 URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw1QZGoSCD2IoucH5DJFIRR7RSdXLYvS5I64PkvJ2Ww6UlBZhgkXcomJWLQ9gheshFq/exec";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 電話以「文字」處理：允許數字、+、-、空格、括號
const PHONE_PATTERN = /^[0-9+\-\s()]{6,20}$/;

const form = document.getElementById("signup-form");
const statusEl = document.getElementById("form-status");

function setFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);
  if (errorEl) errorEl.textContent = message || "";
  if (input) input.classList.toggle("invalid", Boolean(message));
}

function setStatus(type, message) {
  statusEl.className = `form-status${type ? " " + type : ""}`;
  statusEl.textContent = message;
}

function validate(values) {
  let valid = true;

  if (!values.name) {
    setFieldError("name", "請輸入姓名");
    valid = false;
  }

  if (!values.email) {
    setFieldError("email", "請輸入 Email");
    valid = false;
  } else if (!EMAIL_PATTERN.test(values.email)) {
    setFieldError("email", "Email 格式不正確（例：name@example.com）");
    valid = false;
  }

  if (!values.phone) {
    setFieldError("phone", "請輸入電話");
    valid = false;
  } else if (!PHONE_PATTERN.test(values.phone)) {
    setFieldError("phone", "電話格式不正確（可含數字、+、-、空格）");
    valid = false;
  }

  return valid;
}

["name", "email", "phone"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => setFieldError(id, ""));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("", "");

  const values = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
  };

  if (!validate(values)) return;

  if (APPS_SCRIPT_URL === "PENDING_APPS_SCRIPT_URL") {
    setStatus("error", "報名系統後端尚未完成部署，請稍後再試。");
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  setStatus("", "送出中…");

  try {
    const body = new FormData();
    body.append("name", values.name);
    body.append("email", values.email);
    body.append("phone", values.phone);

    // Apps Script Web App 不支援 CORS 讀取回應，以 no-cors 送出；
    // 伺服器端仍會進行 email／電話格式檢查後才寫入試算表。
    await fetch(APPS_SCRIPT_URL, { method: "POST", mode: "no-cors", body });

    setStatus("success", `報名成功！感謝 ${values.name}，我們已收到您的資料。`);
    form.reset();
  } catch (err) {
    setStatus("error", "送出失敗，請檢查網路連線後再試一次。");
  } finally {
    button.disabled = false;
  }
});
