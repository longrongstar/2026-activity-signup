/**
 * 2026活動報名 — Google Apps Script Web App
 *
 * 部署方式（容器綁定指令碼）：
 *   1. 建立 Google Sheet，檔名：2026活動報名
 *   2. 選單「擴充功能」→「Apps Script」，貼上本檔案全部內容
 *   3. 「部署」→「新增部署作業」→ 類型「網路應用程式」
 *      - 執行身分：我本人
 *      - 存取權：所有人
 *   4. 部署後複製「網路應用程式 URL」，貼到網站 app.js 的 APPS_SCRIPT_URL
 *
 * 行為：
 *   - 第一列為標題列：姓名 / Email / 電話 / 報名時間（自動建立）
 *   - Email 格式檢查，電話以「文字」格式寫入（保留前導 0）
 */

var SHEET_NAME = "報名資料";
var HEADERS = ["姓名", "Email", "電話", "報名時間"];

function doGet() {
  return json_({ result: "ok", service: "2026活動報名" });
}

function doPost(e) {
  var sheet = getSheet_();
  ensureHeader_(sheet);

  var params = (e && e.parameter) || {};
  var name = String(params.name || "").trim();
  var email = String(params.email || "").trim();
  var phone = String(params.phone || "").trim();

  if (!name) {
    return json_({ result: "error", message: "姓名不可為空" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json_({ result: "error", message: "Email 格式錯誤" });
  }
  if (!/^[0-9+\-\s()]{6,20}$/.test(phone)) {
    return json_({ result: "error", message: "電話格式錯誤" });
  }

  sheet.appendRow([name, email, phone, new Date()]);
  // appendRow 可能依內容自動轉型，寫入後再次指定電話欄為「文字」格式
  sheet.getRange(sheet.getLastRow(), 3).setNumberFormat("@");

  return json_({ result: "success" });
}

/** 取得（或建立）寫入用的工作表 */
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

/** 第一列為標題列；並將「電話」整欄固定為文字格式 */
function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  sheet.getRange("C:C").setNumberFormat("@");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
