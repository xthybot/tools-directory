# Xthy Work 工具集

這個 repo 是一個純靜態網站工具目錄，用來集中收納可直接打開使用的網頁工具。
首頁會讀取 `assets/data/tools.json`，自動產生工具卡片、搜尋與標籤篩選；真正的工具頁則放在 `tools/` 底下，各自獨立維護。

此 repo 由 `xthy_server` 和阿蝦共同管理。
**協作規則很簡單：每次開始動檔案前先 pull，做完後就 push。**

## 專案特性

- 純前端靜態網站，**沒有建置流程**、**沒有套件管理**、**沒有後端依賴**
- 首頁工具列表由 `tools.json` 控制
- 支援：
  - 關鍵字搜尋
  - 標籤篩選
  - 工具卡片自動渲染
- 每個工具都可以是獨立小專案，只要能用瀏覽器直接開啟即可

## 專案結構

```text
.
├─ index.html                 # 工具首頁
├─ README.md
├─ assets/
│  ├─ css/
│  │  └─ style.css            # 首頁樣式
│  ├─ js/
│  │  └─ app.js               # 首頁搜尋 / 標籤 / 卡片渲染邏輯
│  ├─ data/
│  │  └─ tools.json           # 工具清單資料來源
│  └─ icons/                  # 首頁卡片 icon
└─ tools/
   ├─ a4-merge-print-tool/    # 獨立工具
   ├─ mermaid-preview/        # 獨立工具
   └─ NanoBanana_remove_watermark/
```

## 這個專案怎麼運作

首頁 `index.html` 會載入：

- `assets/css/style.css`
- `assets/js/app.js`

而 `app.js` 會再去抓：

- `assets/data/tools.json`

`tools.json` 裡每一筆資料都代表首頁上一張工具卡片。卡片內容包含：

- 工具名稱
- icon
- 工具介紹
- tags
- 連結位置

也就是說，**新增工具至少要做兩件事**：

1. 在 `tools/` 建立實際工具頁
2. 在 `assets/data/tools.json` 新增對應資料

少任何一步，首頁都不算完整接上。

## tools.json 格式

每個工具資料格式如下：

```json
{
  "title": "工具名稱",
  "icon": "assets/icons/example-local.svg",
  "description": "工具用途簡介",
  "tags": ["標籤1", "標籤2"],
  "link": "tools/your-tool/"
}
```

### 欄位說明

- `title`：首頁顯示名稱
- `icon`：首頁卡片圖示路徑
- `description`：簡短說明
- `tags`：用於首頁篩選與搜尋；**越少越好，當作類別在使用，不要塞太多細碎標籤**
- `link`：點開工具時要前往的頁面

## 新增一個工具的標準流程

### 1. 先 pull 最新版本

```bash
git pull --rebase origin main
```

### 2. 在 `tools/` 下建立新工具資料夾

建議命名：

- 全小寫
- 用 `-` 分隔單字
- 名稱清楚表達用途

例如：

```text
tools/image-resizer/
```

### 3. 放入工具檔案

最基本通常是：

```text
tools/image-resizer/
├─ index.html
├─ style.css
└─ script.js
```

如果工具更複雜，也可以有自己的：

- `assets/`
- `README.md`
- `images/`
- 其他必要靜態資源

**重要：單一工具的需求規格、UX 討論、欄位定義、待辦與備註，請寫在該工具自己的資料夾內 README.md，不要直接改寫 repo 根目錄這份 README。**

原則只有一個：
**最後要能直接從 `tools/xxx/` 在瀏覽器中打開使用。**

### 4. 準備首頁 icon

如果這個工具要有自己的圖示，可以放到：

```text
assets/icons/
```

然後在 `tools.json` 中填對應路徑。

### 5. 在 `assets/data/tools.json` 新增一筆工具資料

範例：

```json
{
  "title": "Image Resizer",
  "icon": "assets/icons/image-resizer.svg",
  "description": "快速調整圖片尺寸並匯出。",
  "tags": ["圖片"],
  "link": "tools/image-resizer/"
}
```

### 6. 本地確認首頁是否正常顯示

至少檢查這幾件事：

- 首頁有出現新卡片
- 搜尋能搜到工具名稱 / 描述 / 標籤
- 點卡片能正確打開工具
- 工具在手機版與桌面版都沒有明顯壞版

## 本地預覽方式

這是靜態網站，直接用本機 HTTP server 開就好。

### 方法一：Python

```bash
python3 -m http.server 8000
```

然後打開：

```text
http://localhost:8000/
```

### 方法二：Node / 其他靜態伺服器

任何能提供靜態檔案的 server 都可以。

重點是：
**不要只雙擊 `index.html` 測試首頁。**
因為首頁會 fetch `assets/data/tools.json`，用 `file://` 開啟時可能被瀏覽器擋掉。

## 維護首頁時的注意事項

### 搜尋與篩選來源

首頁搜尋會比對：

- `title`
- `description`
- `tags`
- `link`

所以：

- 工具名稱要清楚
- 描述要寫人看得懂的話
- 標籤要有實際分類價值

### 標籤建議

標籤不用亂堆，但要能真的幫助篩選，例如：

- `圖片`
- `PDF`
- `列印`
- `流程圖`
- `開發`
- `AI圖片`
- `修圖`

### 路徑規則

- 首頁資源共用放 `assets/`
- 獨立工具頁放 `tools/`
- 不要把新工具直接丟在 repo 根目錄
- 不要把所有 css/js 都混進首頁共用檔，除非真的是全站共用資源

## Git 協作規則

這個 repo 是多人 / 多端共同維護，所以照這個流程做：

### 開始前

```bash
git pull --rebase origin main
```

### 確認狀態

```bash
git status --short --branch
```

### 提交變更

```bash
git add README.md index.html assets tools
git commit -m "feat: add new tool"
git push origin main
```

如果只是改文件，commit message 可以像：

```bash
git commit -m "docs: update project README"
```

## 適合放進來的工具類型

適合：

- 可直接在瀏覽器執行的小工具
- 單頁靜態工具
- 不需要後端的轉換 / 整理 / 預覽工具
- 有明確輸入輸出流程的實用頁面

不適合：

- 需要私密金鑰才能運作，但又把金鑰寫死在前端的工具
- 依賴重後端服務、但 repo 內沒有後端部署方案的工具
- 跟首頁完全無關、也無法獨立使用的半成品檔案

## 現在已存在的工具

- `tools/a4-merge-print-tool/`：A4 合併列印工具
- `tools/mermaid-preview/`：Mermaid 即時預覽
- `tools/NanoBanana_remove_watermark/`：移除 Gemini NanoBanana 浮水印

## 最小維護準則

每次修改後，至少確認：

1. `git pull --rebase origin main` 已做
2. 工具頁面可以正常打開
3. `tools.json` 路徑正確
4. 首頁能正確顯示新工具
5. 修改完成後有 push 回 repo

---

如果只是要快速新增工具，記住一句話就夠：

**先在 `tools/` 做出可打開的頁面，再把它登記進 `assets/data/tools.json`，最後 pull / 檢查 / push。**