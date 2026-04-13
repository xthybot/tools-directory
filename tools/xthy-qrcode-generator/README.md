# Xthy QRCode 產生器

`Xthy QRCode 產生器` 是一個純前端、無後端依賴的 QRCode 工具。
它的目標不是只做「能產生 QRCode」，而是要同時兼顧：

- 多類型內容輸入
- 即時預覽
- 掃描與反解析
- 樣式自訂
- LOGO 疊加
- 驗證與風險提示
- 輸出 PNG / JPG / WEBP / SVG
- 手機與桌面都能操作

這份 README 的目的，是讓**任何人或 AI 接手時，都能快速理解這個工具的實作邏輯與修改入口**，避免再靠猜。

---

## 1. 檔案結構

```text
tools/xthy-qrcode-generator/
├─ index.html   # 頁面結構 / UI 區塊 / 控制項 id
├─ style.css    # 所有版面、樣式、RWD、互動外觀
└─ script.js    # 所有狀態、邏輯、QR 生成、掃描、驗證、輸出
```

這個工具**沒有 build 流程**、**沒有模組 bundler**、**沒有 npm 依賴安裝步驟**。
它直接透過 CDN 載入第三方函式庫。

---

## 2. 外部依賴

頁面目前透過 CDN 使用以下套件：

- `qr-code-styling`
  - 用於產生 QRCode SVG / PNG
  - 支援點樣式、顏色、容錯率、version 等
- `jsQR`
  - 用於解碼上傳圖片中的 QRCode
- `html5-qrcode`
  - 用於鏡頭即時掃描

在 `index.html` 的底部可看到：

```html
<script src="https://cdn.jsdelivr.net/npm/qr-code-styling@1.9.2/lib/qr-code-styling.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
<script src="script.js"></script>
```

如果未來要升級版本，**先確認 API 是否相容**，尤其是：

- `QRCodeStyling(...).update(...)`
- `.getRawData('png' | 'svg')`
- `Html5Qrcode.start(...)`

---

## 3. UI 版面設計

整個工具在桌面版是三大欄：

1. 左：內容設定
2. 中：QRCode 設定（含 LOGO 設定）
3. 右：即時預覽與輸出

在手機版：

- `內容設定`
- `QRCode 設定`

會變成可折疊區塊。

### 主要區塊對應

#### `index.html`

- `.left-column-stack`
  - 左欄容器
- `.form-panel`
  - 內容設定
- `.options-panel`
  - QRCode 設定 + LOGO 設定
- `.preview-panel`
  - 預覽、檔名、輸出、驗證區

#### 預覽區的關鍵容器

```html
<div class="preview-card">
  <div class="preview-stage">
    <div id="qrcodePreview" class="qrcode-preview"></div>
    <div id="logoPreviewOverlay" class="logo-preview-overlay"></div>
  </div>
</div>
```

這裡的概念是：

- `qrcodePreview`：底層 QR 本體
- `logoPreviewOverlay`：上層 LOGO 預覽層
- `preview-stage`：兩者共用的正方形座標舞台

這一層是後來為了修正「預覽與輸出不一致」問題而建立的關鍵結構。

---

## 4. 核心狀態：`state`

所有主要互動都集中在 `script.js` 內的 `state` 物件。

### 結構概覽

```js
const state = {
  type,
  values,
  qr,
  logo,
  export,
  preview,
  decodedRawText,
}
```

### 4.1 `state.type`

目前選擇的 QRCode 類型，例如：

- `url`
- `wifi`
- `text`
- `phone`
- `sms`
- `twqr`

### 4.2 `state.values`

目前內容欄位的實際值。

這一段會依 `type` 切換而重建。

### 4.3 `state.qr`

管理 QR 本體設定，例如：

- `size`
- `color`
- `backgroundColor`
- `backgroundAlpha`
- `minVersion`
- `errorCorrection`
- `borderSize`
- `dotStyle`

### 4.4 `state.logo`

管理 LOGO 文字 / 圖片設定，例如：

- `mode`
- `text`
- `textColor`
- `textBgColor`
- `textStyle`
- `textSize`
- `textPadding`
- `textCornerStyle`
- `imageDataUrl`
- `imageNaturalWidth`
- `imageNaturalHeight`
- `imageSize`
- `imageBorder`
- `imageCornerStyle`

### 4.5 `state.export`

管理輸出相關設定：

- `fileName`
- `format`

### 4.6 `state.preview`

管理預覽專用狀態：

- `bgMode`

目前是：

- `light`
- `dark`

---

## 5. 類型定義：`CODE_TYPES`

各種 QRCode 類型的欄位 schema 集中在：

```js
const CODE_TYPES = { ... }
```

這是整個工具最重要的「表單描述層」。

每一個 type 都包含：

- `label`
- `fields`
- （可選）`advancedFields`

例如：

- URL
- Wi‑Fi
- 純文字
- 電話
- 簡訊
- TWQR

### 為什麼這層重要

因為目前的動態表單，是由這份設定直接渲染出來的：

- `renderDynamicFields()`
- `renderField(field)`

所以未來要新增新類型，通常步驟是：

1. 在 `CODE_TYPES` 新增 schema
2. 在 `buildQrPayload()` 加對應轉換
3. 在 `parseDecodedText()` 加反解析邏輯（若需要）

---

## 6. 資料流：從輸入到預覽

這個工具的主要即時更新流程如下：

```text
使用者輸入
→ 更新 state
→ refreshQr()
→ buildQrPayload()
→ 驗證 / 風險分析
→ 更新 QR 本體
→ 更新 LOGO overlay
→ 更新驗證區
```

### 6.1 輸入更新

- 動態欄位：`handleDynamicInput()`
- 靜態欄位：`handleStaticInput()`
- range / slider：`bindValue()`

### 6.2 統一刷新入口

```js
refreshQr()
```

這是目前整個工具最核心的 refresh 函式。

它負責：

1. 更新預覽舞台大小
2. 切換 LOGO 區塊顯示
3. 組出 QR payload
4. 產生欄位錯誤與風險提示
5. 產生 LOGO 預覽資產
6. 更新 `qrCode.update(...)`
7. 更新驗證區內容

如果之後要查「為什麼某個控制項變了，畫面沒更新」，優先看這一段。

---

## 7. QR 內容生成邏輯

### 7.1 統一入口

```js
buildQrPayload()
```

這裡會依照 `state.type` 產生實際 QR 字串。

### 目前支援的內容格式

#### URL
直接輸出 URL 字串。

#### Wi‑Fi
輸出標準：

```text
WIFI:T:WPA;S:SSID;P:password;H:false;;
```

#### 純文字
直接輸出文字。

#### 電話
輸出：

```text
tel:0912345678
```

#### 簡訊
輸出：

```text
sms:0912345678?body=內容
```

#### TWQR
透過：

```js
buildTwqrPayload(values)
```

組成 EMVCo / TLV 格式資料，並補 CRC16。

---

## 8. 反解析與掃描邏輯

### 8.1 上傳圖片解碼

- `onScanImageSelected()`
- `decodeQrFromImage(dataUrl)`

透過 `jsQR` 分析圖片像素。

### 8.2 鏡頭掃描

- `startCameraScan()`
- `stopCameraScan()`

透過 `html5-qrcode` 啟動相機掃描。

### 8.3 掃描後自動判斷類型

```js
parseDecodedText(text)
```

目前會判斷：

- Wi‑Fi
- URL
- 電話
- SMS
- TWQR
- 其他 → 純文字

### 8.4 回填流程

```js
applyDecodedText(text)
```

流程：

1. 判斷類型
2. 切換 `state.type`
3. 重建欄位預設值
4. 將解析結果寫回 `state.values`
5. 重畫畫面

---

## 9. 預覽架構

這個工具有兩個不同概念，必須分清楚：

### 9.1 預覽渲染尺寸

```js
const PREVIEW_RENDER_SIZE = 1200;
```

這只是**預覽用的高解析畫布尺寸**，不是最後輸出尺寸。

### 9.2 實際輸出尺寸

輸出時會改用：

```js
const renderSize = Math.max(100, Number(state.qr.size) || 280)
```

也就是：

- 輸出 PNG / JPG / WEBP / SVG
- 依 `QRCode 尺寸` 設定的 px 為準

### 9.3 預覽舞台大小

畫面上右邊實際顯示多大，是由：

```js
updatePreviewStageSize()
```

去讀取 `.preview-card` 的實際可用寬高，取最小值後建立正方形舞台。

這是為了避免：

- 預覽超出框線
- 寬高比跑掉
- 純 QRCode 超框

---

## 10. LOGO 架構

LOGO 系統現在分兩條線：

1. 預覽用 asset
2. 輸出用 asset

但兩者都共用同一套生成邏輯函式，避免不一致。

### 10.1 預覽用 overlay

```js
renderLogoPreviewOverlay(logoAsset)
```

它會把生成好的 SVG / image dataUrl 直接蓋到 `logoPreviewOverlay`。

### 10.2 輸出用合成

- `buildComposedCanvas()`
- `buildComposedSvgBlob()`

這兩個函式會：

1. 先畫出 QRCode 本體
2. 再疊上 LOGO asset

所以現在的方向是：

- 預覽與輸出共用同一份 LOGO asset
- 盡量避免「預覽正常、輸出跑掉」

---

## 11. LOGO 文字模式邏輯

### 11.1 生成入口

```js
buildTextLogoAsset(renderSize)
```

### 11.2 支援樣式

- `box`
- `bar`
- `outline`
- `none`

### 11.3 行為定義

#### `box`
依文字寬高，加上 `textPadding` 外擴成框。

#### `bar`
沿整個 QR 畫布寬度橫向延伸成條。

#### `outline`
用 SVG `stroke` 畫文字描邊。

#### `none`
只有文字本體。

### 11.4 角樣式

透過：

- `state.logo.textCornerStyle`

決定：

- `rounded`
- `square`

對 `box` / `bar` 的 `rect rx` 生效。

---

## 12. LOGO 圖片模式邏輯

### 12.1 生成入口

```js
buildImageLogoAsset(renderSize)
```

### 12.2 核心概念

圖片邊框不是固定正方形邏輯，而是：

1. 先讀原圖長寬比
2. 依 `imageSize` 算出目標尺寸
3. 依 `imageBorder` 從圖片邊界等距外擴
4. 再依 `imageCornerStyle` 決定圓角或直角

### 12.3 原圖尺寸來源

上傳圖片時：

```js
onLogoImageSelected(event)
```

會把以下資訊存回 state：

- `imageNaturalWidth`
- `imageNaturalHeight`

這是為了確保之後的邊框不是憑空猜長寬比。

---

## 13. 驗證與風險提示架構

目前驗證區已拆成兩塊：

- `需要修正`
- `風險提示`

### 13.1 欄位錯誤

來源：

```js
buildQrPayload()
```

例如：

- URL 沒填
- Wi‑Fi 缺 SSID
- SMS 缺收件號碼
- TWQR 缺必要欄位

### 13.2 風險提示

來源：`refreshQr()` 內的風險判斷，例如：

- 圖片 LOGO 太大
- 文字太大太長
- 有 LOGO 但 ECL 太低
- TWQR 沒填交易金額
- 沒自訂檔名，將改用建議名稱

### 13.3 顯示規則

- 左：`fixBox`
- 右：`riskBox`

沒有內容時顯示：

- `無`

目前樣式規則：

- 需要修正有內容 → 紅色
- 風險提示有內容 → 橘色
- 無 → 綠色

---

## 14. 檔名命名邏輯

### 14.1 使用者輸入優先

如果使用者有填 `檔案名稱`，輸出直接用該值。

### 14.2 否則用 placeholder 建議值

由：

```js
getSuggestedFileName()
```

推導。

目前規則：

- Wi‑Fi → `SSID`
- URL → 網域
- 純文字 → 前 5 個字
- 電話 / 簡訊 → 電話號碼
- TWQR → 收款人名稱
- 其他 → `xthy-qrcode`

### 14.3 更新 placeholder

```js
updateFileNamePlaceholder()
```

這個函式只更新 placeholder，不會把值真正塞進 input。

這是刻意的，因為主人要求：

- 看到建議名稱
- 但不要真的預填進文字框

---

## 15. 匯出架構

### 15.1 下載入口

```js
downloadQrCode()
```

### 15.2 複製入口

```js
copyQrCodeImage()
```

### 15.3 真正輸出邏輯

#### Canvas 類輸出

```js
buildComposedCanvas(flattenBackground)
```

流程：

1. 建立指定輸出尺寸的 QR renderer
2. 產出 QR 本體
3. 視需要鋪白底（JPG）
4. 疊上 LOGO asset
5. 回傳 canvas

#### SVG 輸出

```js
buildComposedSvgBlob()
```

流程：

1. 建立指定輸出尺寸的 QR renderer
2. 拿到 SVG 原始碼
3. 若有 LOGO，插入 overlay `<image>`
4. 輸出 blob

### 15.4 重要原則

**預覽尺寸** 和 **輸出尺寸** 必須分開。

這是之前踩過的坑：

- 若直接把預覽用的 1200 拿去輸出
- 會導致所有檔案都變成 1200×1200

現在已拆開。

---

## 16. 你要改哪裡，請看這裡

### 想新增 QR 類型
看：

- `CODE_TYPES`
- `buildQrPayload()`
- `parseDecodedText()`

### 想改表單欄位順序 / UI
看：

- `index.html`
- `renderDynamicFields()`
- `renderField()`

### 想改驗證提示文案
看：

- `buildQrPayload()`
- `buildTwqrPayload()`
- `refreshQr()`

### 想改 LOGO 文字邏輯
看：

- `buildTextLogoAsset(renderSize)`

### 想改 LOGO 圖片邏輯
看：

- `onLogoImageSelected()`
- `buildImageLogoAsset(renderSize)`

### 想改輸出尺寸 / 格式
看：

- `downloadQrCode()`
- `buildComposedCanvas()`
- `buildComposedSvgBlob()`

### 想改預覽區行為
看：

- `preview-stage` / `qrcode-preview` / `logoPreviewOverlay`
- `updatePreviewStageSize()`
- `updatePreviewBackground()`

---

## 17. 已知高風險區域

這些地方未來改動時要特別小心：

### 17.1 預覽與輸出一致性

只要碰到以下任何一項，就有高機率讓預覽 / 輸出再度不一致：

- `buildTextLogoAsset()`
- `buildImageLogoAsset()`
- `renderLogoPreviewOverlay()`
- `buildComposedCanvas()`
- `buildComposedSvgBlob()`

### 17.2 QR 預覽超框

只要碰到以下任何一項，就有可能讓純 QRCode 超出右側框線：

- `.preview-card`
- `.preview-stage`
- `.qrcode-preview`
- `updatePreviewStageSize()`

### 17.3 檔名 placeholder 與實際輸出名稱不同步

如果之後修改：

- `elements.fileName` 的 input 處理
- `getSuggestedFileName()`
- `downloadQrCode()`

要注意：

- placeholder 只是提示
- 真正輸出仍要 fallback 到建議值

---

## 18. 建議後續重構方向

雖然目前工具可運作，但如果未來要長期維護，建議可以分離成：

### 18.1 抽出模組

把 `script.js` 拆成至少四層：

- `state` / config
- QR payload builders
- logo renderers
- export / preview / scan controllers

### 18.2 建立統一 render pipeline

目前已經接近這個方向，但還沒完全乾淨。

理想狀況：

```text
state
→ payload
→ qr base render
→ logo asset render
→ preview compose
→ export compose
```

所有預覽與輸出都只共用這一條 pipeline。

### 18.3 建立測試案例

至少保留以下人工回歸測試：

- 無 LOGO 純 QR
- Wi‑Fi
- URL
- 長文字 LOGO
- box / bar / outline / none
- 圖片 LOGO 橫圖
- 圖片 LOGO 直圖
- borderSize = 0
- SVG / PNG / JPG 匯出

---

## 19. 修改這個工具前，建議流程

1. 先 pull 最新版
2. 只改這個工具資料夾內的檔案
3. 改完先檢查：
   - 純 QR 是否正常
   - 不放 LOGO 是否正常
   - 預覽是否超框
   - 輸出尺寸是否正確
4. 再測 LOGO
5. 最後再 push

---

## 20. 一句話總結

這個工具目前的核心不是「生成 QRCode」而已，
而是：

**用單一狀態管理多類型資料，讓 QR 內容、預覽、LOGO 疊加、驗證、掃描與輸出維持一致。**

如果之後要擴充功能，請優先維持這個原則，不要讓預覽和輸出又分裂成兩套互相打架的邏輯。
