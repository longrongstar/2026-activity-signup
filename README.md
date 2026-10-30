# 2026 活動報名｜活動設計・半馬拉松跑步

簡約北歐風格的活動報名網站。表單送出後，資料寫入 Google Sheet「**2026活動報名**」（第一列為標題列）。

## 網站網址（GitHub Pages）

**https://longrongstar.github.io/2026-activity-signup/**

## 檔案結構

| 檔案 | 說明 |
| --- | --- |
| index.html | 報名頁面（活動資訊、活動介紹、圖片、報名表單，由上而下以列排） |
| styles.css | 簡約北歐風格樣式 |
| app.js | 表單驗證與送出（email 格式檢查、電話文字格式） |
| apps-script/Code.gs | Google Apps Script Web App（寫入 Google Sheet 的後端） |

## 後端部署（Google Apps Script）

1. 建立 Google Sheet，檔名：**2026活動報名**
2. 選單「擴充功能」→「Apps Script」，貼上 [apps-script/Code.gs](apps-script/Code.gs) 全部內容並儲存
3. 「部署」→「新增部署作業」→ 類型「**網路應用程式**」
   - 執行身分：我本人
   - 存取權：所有人
4. 複製「網路應用程式 URL」，填入 [app.js](app.js) 的 `APPS_SCRIPT_URL` 常數
5. 試算表第一列標題（姓名 / Email / 電話 / 報名時間）會於首次送出時自動建立

## 備註

- GitHub 不支援中文字元的 repo 名稱，故 repo 採用 `2026-activity-signup`（對應 Google Sheet 檔名「2026活動報名」）。
- `spec/` 資料夾依需求未推送至 GitHub。
