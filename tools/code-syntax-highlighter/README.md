# Code Syntax Highlighter

這是一個純前端、可直接在瀏覽器中使用的線上程式碼上色工具。

目標是讓使用者貼上一段程式碼後，可以快速：
- 選擇語言
- 套用不同配色主題
- 預覽上色結果
- 支援 Bash / Command Line 類內容
- 後續可擴充複製 / 匯出 / 分享等能力

---

## 需求目標

### 核心需求

- 支援大多數主流程式語言
- 支援 Bash / Shell / Command Line 顯示
- 支援 5 種以上主題
- 同時包含淺色底與深色底主題
- 可直接在桌面與手機瀏覽器使用

### 預計支援語言

第一版可優先涵蓋：

- JavaScript
- TypeScript
- HTML
- CSS
- JSON
- Python
- Bash / Shell
- Markdown
- YAML
- SQL
- Java
- C
- C++
- C#
- Go
- Rust
- PHP
- Ruby
- Swift
- Kotlin
- Command Line / Terminal

實作上可透過成熟的前端 syntax highlighting library 來支援更多語言，避免自己維護 tokenizer。

### 主題方向

至少提供 5 種以上主題，並涵蓋：

- 深色主題
- 淺色主題
- 高對比主題
- 偏柔和閱讀主題
- 偏開發者常用風格主題

例如可規劃：

- GitHub Light
- GitHub Dark
- One Dark
- Dracula
- Nord
- Solarized Light
- Solarized Dark

---

## 工具架構規劃

這個工具維持簡單的靜態頁面結構：

```text
tools/code-syntax-highlighter/
├─ index.html   # UI 結構與操作區塊
├─ style.css    # 頁面版型、主題控制、響應式樣式
├─ script.js    # 語言切換、主題切換、上色渲染、互動功能
└─ README.md    # 工具規格與架構說明
```

如果後續功能變多，再考慮擴充為：

```text
tools/code-syntax-highlighter/
├─ index.html
├─ style.css
├─ script.js
├─ README.md
├─ assets/
│  ├─ icons/
│  └─ themes/
└─ vendor/
   └─ ...syntax-highlighting library files...
```

原則：
- 先維持單工具獨立，不污染全站共用資源
- 只在必要時增加額外資料夾
- 確保打開 `tools/code-syntax-highlighter/` 就能直接使用

---

## 頁面功能分區

### 1. 輸入區

用途：
- 貼上原始程式碼
- 可手動輸入或編輯

預計內容：
- 大型 textarea 或 editor 區塊
- 可保留換行與縮排
- 支援貼上長段程式碼

### 2. 語言選擇區

用途：
- 指定要用哪一種語言規則上色

預計內容：
- 下拉選單
- 常用語言快速選項
- 可包含 `Auto Detect`，但不依賴它作為唯一方案

### 3. 主題選擇區

用途：
- 切換不同高亮主題

預計內容：
- 下拉選單或按鈕群組
- 至少 5 種以上主題
- 明確標示 light / dark 類型

### 4. 預覽區

用途：
- 顯示語法上色後結果

預計內容：
- `pre > code` 結構或對應 library 要求結構
- 保留縮排、換行與橫向捲動
- 適合長程式碼閱讀

### 5. 操作功能區

第一版建議：
- 複製原始碼
- 複製上色後結果（若可行）
- 清空內容
- 載入範例

後續可擴充：
- 匯出 HTML
- 匯出圖片
- 分享連結
- 自動記住上次語言與主題

---

## 技術實作方向

### 語法上色核心

建議優先採用成熟現成方案，例如：

- Prism.js
- highlight.js
- Shiki（若最終仍能維持靜態前端與可接受體積）

目前傾向：
- **第一版優先考慮 `highlight.js` 或 `Prism.js`**
- 原因是整合簡單、靜態頁易落地、支援語言廣、主題多

### 主題切換方式

可採其中一種：

1. 切換不同 theme stylesheet
2. 頁面載入多個主題定義，再用 class 控制
3. 動態替換 `link` 標籤

第一版較實際作法：
- 用 `link` 或 `data-theme` 切換主題
- 同時確保 light / dark 主題背景與文字對比正確

### 語言資料管理

可在 `script.js` 內先集中管理：

- 顯示名稱
- 對應語言代碼
- 是否預設顯示

例如：

```js
const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Bash', value: 'bash' },
  { label: 'Command Line', value: 'shell' }
];
```

### 主題資料管理

同樣集中管理：

```js
const THEMES = [
  { label: 'GitHub Light', value: 'github-light', mode: 'light' },
  { label: 'GitHub Dark', value: 'github-dark', mode: 'dark' },
  { label: 'One Dark', value: 'one-dark', mode: 'dark' },
  { label: 'Dracula', value: 'dracula', mode: 'dark' },
  { label: 'Nord', value: 'nord', mode: 'dark' },
  { label: 'Solarized Light', value: 'solarized-light', mode: 'light' }
];
```

---

## UI / UX 原則

### 介面原則

- 直接、乾淨、不花俏
- 輸入與預覽區要一眼看懂
- 手機版也能正常貼碼與切換設定
- 長程式碼時要能橫向捲動，不要硬折行到難讀

### 響應式策略

桌面版：
- 左右雙欄或上下區塊皆可
- 優先考慮輸入 / 預覽並列

手機版：
- 改為上下堆疊
- 操作區先顯示，預覽區放後面
- 按鈕尺寸要適合觸控

### 可用性細節

- 主題名稱要清楚標示
- 語言排序以常用優先
- Bash / Shell / CLI 要容易找到
- 預覽區要有足夠 padding 與易讀字級

---

## 第一版實作清單

### 必做

- 建立基本頁面布局
- 建立語言選單
- 建立主題選單
- 建立程式碼輸入區
- 建立上色預覽區
- 接入 syntax highlighting library
- 支援至少 5 種主題
- 支援 Bash / Shell / Command Line
- 手機 / 桌面版基本可用

### 可加分

- 複製按鈕
- 範例程式碼快速載入
- 自動記住上次主題
- URL query 帶入語言與主題

### 後續擴充

- 匯出圖片
- 匯出 HTML snippet
- 行號顯示
- 自動判斷語言
- 自訂字體大小與 tab width

---

## 開發備註

- 此工具應保持純前端、無後端依賴
- 若引用第三方 library，需確認授權與靜態部署可行性
- 若使用 CDN，要評估是否要改成本地 vendor 檔，避免外部依賴失效
- 若要接進工具首頁，之後需另外新增 `assets/data/tools.json` 資料

---

## 目前狀態

目前已完成：
- 建立工具資料夾骨架
- 建立基礎 `index.html`
- 建立基礎 `style.css`
- 建立基礎 `script.js`
- 補上本 README 架構規劃

下一步可直接開始實作正式版本。