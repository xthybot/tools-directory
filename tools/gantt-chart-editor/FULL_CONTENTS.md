# FULL CONTENTS
本檔彙整專案主要檔案完整內容。

## `index.html`

```html
<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>靜態網頁甘特圖生成器</title>
  <link rel="icon" href="assets/icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <img src="assets/icon.svg" alt="" class="brand-icon">
        <input id="projectTitleInput" class="project-title" value="我的甘特圖" aria-label="專案標題">
      </div>
      <div class="toolbar" aria-label="工具列">
        <button id="importBtn" class="icon-tool" data-tooltip="匯入資料" aria-label="匯入資料"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button id="exportBtn" class="icon-tool" data-tooltip="匯出" aria-label="匯出"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12h8m0 0-4-4m4 4-4 4M5 5h14v14H5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button id="sampleBtn" class="icon-tool" data-tooltip="匯入範例資料" aria-label="匯入範例資料">▣</button>
        <button id="clearBtn" class="icon-tool danger" data-tooltip="清空資料" aria-label="清空資料"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M9 7l1-3h4l1 3m-9 0 1 14h10l1-14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
    </header>

    <main id="splitLayout" class="split-layout">
      <section class="panel task-panel" aria-label="任務面板">
        <div class="panel-head task-head">
          <button id="addTaskBtn" class="btn primary">＋ 新增任務</button>
          <label class="compact-control">任務排序
            <select id="taskSortModeSelect">
              <option value="manual">手動排序</option>
              <option value="startDate">依開始日期排序</option>
            </select>
          </label>
        </div>
        <div id="taskTableWrap" class="table-wrap">
          <table class="task-table" aria-label="任務表格">
            <colgroup>
              <col data-col="drag">
              <col data-col="index">
              <col data-col="mode">
              <col data-col="color">
              <col data-col="name">
              <col data-col="startDate">
              <col data-col="endDate">
              <col data-col="owner">
              <col data-col="copy">
              <col data-col="delete">
            </colgroup>
            <thead>
              <tr>
                <th data-col-key="drag">排序<span class="col-resizer" data-col="drag"></span></th>
                <th data-col-key="index">#<span class="col-resizer" data-col="index"></span></th>
                <th data-col-key="mode">模式<span class="col-resizer" data-col="mode"></span></th>
                <th data-col-key="color">顏色<span class="col-resizer" data-col="color"></span></th>
                <th data-col-key="name">任務名稱<span class="col-resizer" data-col="name"></span></th>
                <th data-col-key="startDate">開始日期<span class="col-resizer" data-col="startDate"></span></th>
                <th data-col-key="endDate">結束日期<span class="col-resizer" data-col="endDate"></span></th>
                <th data-col-key="owner">負責人<span class="col-resizer" data-col="owner"></span></th>
                <th data-col-key="copy">複製<span class="col-resizer" data-col="copy"></span></th>
                <th data-col-key="delete">刪除<span class="col-resizer" data-col="delete"></span></th>
              </tr>
            </thead>
            <tbody id="taskTableBody"></tbody>
          </table>
        </div>
      </section>

      <div id="splitter" class="splitter" role="separator" aria-orientation="vertical" aria-label="調整左右面板寬度"></div>

      <section class="panel chart-panel" aria-label="甘特圖面板">
        <div class="chart-head">
          <div>
            <strong>甘特圖預覽</strong>
            <span id="chartErrorBadge" class="chart-error-badge" hidden>錯誤</span>
            <span id="chartMeta" class="muted small"></span>
          </div>
          <button id="settingsBtnInline" class="btn small-btn">設定</button>
        </div>
        <section id="settingsPanel" class="settings-panel" hidden>
          <div class="settings-grid">
            <label>
              <span>時間粒度</span>
              <select id="timelineScaleSelect">
                <option value="day">日</option>
                <option value="week">週</option>
                <option value="month">月</option>
              </select>
            </label>
            <label>
              <span>甘特圖列名</span>
              <select id="rowLabelModeSelect">
                <option value="combined">顯示所有同列任務名稱，以 / 串接</option>
                <option value="hidden">不顯示列名，只顯示甘特條上的文字</option>
              </select>
            </label>
            <label>
              <span>週末顯示</span>
              <select id="showWeekendsSelect">
                <option value="true">開</option>
                <option value="false">關</option>
              </select>
            </label>
            <label>
              <span>甘特圖負責人</span>
              <select id="ownerDisplaySelect">
                <option value="none">不顯示</option>
                <option value="left">僅顯示在左側</option>
                <option value="bar">僅顯示在甘特條</option>
                <option value="both">顯示在左側與甘特條</option>
              </select>
            </label>
            <label>
              <span>甘特條文字</span>
              <select id="showGanttBarLabelSelect">
                <option value="true">顯示任務標題與負責人</option>
                <option value="false">隱藏，只顯示顏色甘特條</option>
              </select>
            </label>
          </div>
          <pre class="tutorial-text">使用教學：
1. 左側表格可直接點擊欄位編輯。
2. 按 Enter 可新增下一個任務。
3. 按 Tab 可移動到同一列右側欄位。
4. 拖曳排序 icon 可調整任務順序。
5. 顯示模式 icon 可切換「新列」或「接續上一列」。
6. 接續任務會與上一個新列任務顯示在同一條甘特列。
7. 同一列任務日期不可重疊。
8. 今日線只會在網頁預覽中顯示，不會出現在匯出檔案。</pre>
        </section>
        <div id="validationBox" class="validation-box" hidden></div>
        <div id="ganttViewport" class="gantt-viewport">
          <div id="ganttEmpty" class="empty-state">尚無任務。請從左側新增任務，或匯入範例資料。</div>
          <div id="ganttHost" class="gantt-host" aria-label="甘特圖"></div>
        </div>
      </section>
    </main>
  </div>

  <datalist id="ownersList"></datalist>

  <div id="confirmBubble" class="confirm-bubble" hidden>
    <button id="confirmBubbleBtn" class="btn danger"></button>
  </div>

  <div id="colorPopover" class="color-popover" hidden>
    <div class="preset-colors" id="presetColors"></div>
    <div class="color-actions">
      <button id="eyedropperBtn" class="btn small-btn icon-action" title="滴管工具" aria-label="滴管工具"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5-9.5 9.5H5v-4.5L14 5Zm-2-2 9 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <label class="btn small-btn palette-label icon-action" title="調色盤" aria-label="調色盤"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 0 0 0 16h1.2a1.8 1.8 0 0 0 1.2-3.1 1.4 1.4 0 0 1 .9-2.5H17a3 3 0 0 0 3-3C20 7.3 16.4 4 12 4Z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="10" r=".8" fill="currentColor"/><circle cx="11" cy="7.8" r=".8" fill="currentColor"/><circle cx="14.5" cy="8.8" r=".8" fill="currentColor"/></svg><input id="paletteInput" type="color" hidden></label>
    </div>
  </div>

  <div id="importModal" class="modal" hidden>
    <div class="modal-backdrop" data-close="importModal"></div>
    <section class="modal-card import-card" role="dialog" aria-modal="true" aria-labelledby="importTitle">
      <div class="modal-head">
        <h2 id="importTitle">匯入資料</h2>
        <button class="icon-btn" data-close="importModal" aria-label="關閉">×</button>
      </div>
      <div class="import-tabs" role="tablist">
        <button class="tab-btn active" data-import-tab="paste">貼上表格資料</button>
        <button class="tab-btn" data-import-tab="csv">CSV</button>
        <button class="tab-btn" data-import-tab="json">JSON</button>
        <button class="tab-btn" data-import-tab="xlsx">Excel xlsx</button>
      </div>
      <div class="import-source">
        <div data-import-panel="paste">
          <textarea id="pasteInput" placeholder="貼上表格資料。支援 Markdown 表格、Tab 表格、空格對齊表格；第一列需包含欄位名稱。"></textarea>
        </div>
        <div data-import-panel="csv" hidden>
          <label class="file-picker">選擇 CSV 檔案
            <input id="csvFileInput" type="file" accept=".csv,text/csv" hidden>
          </label>
          <span id="csvFileName" class="muted small"></span>
        </div>
        <div data-import-panel="json" hidden>
          <label class="file-picker">選擇 JSON 檔案
            <input id="jsonFileInput" type="file" accept=".json,application/json" hidden>
          </label>
          <span id="jsonFileName" class="muted small"></span>
          <textarea id="jsonTextInput" placeholder="也可直接貼上本網站匯出的 JSON。JSON 會完整還原專案標題、設定、欄位寬度、ID 與任務順序。"></textarea>
        </div>
        <div data-import-panel="xlsx" hidden>
          <label class="file-picker">選擇 Excel xlsx 檔案
            <input id="xlsxFileInput" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" hidden>
          </label>
          <span id="xlsxFileName" class="muted small"></span>
        </div>
      </div>
      <div class="modal-actions">
        <button id="parseImportBtn" class="btn primary">解析資料</button>
      </div>
      <div id="mappingBox" class="mapping-box" hidden>
        <h3>欄位對應</h3>
        <p class="muted small">任務名稱需指定。開始或結束日期可留空；留空時會使用目前表格最早或最晚日期作為有效範圍。</p>
        <div id="mappingGrid" class="mapping-grid"></div>
        <div class="modal-actions import-final-actions">
          <button id="confirmImportBtn" class="btn primary">確認匯入有效資料</button>
          <div id="importChoice" class="choice-box inline-choice" hidden>
            <strong>目前已有資料，請選擇匯入方式。</strong>
            <div class="choice-actions">
              <button id="importReplaceBtn" class="btn danger">覆蓋目前資料</button>
              <button id="importAppendBtn" class="btn">追加到目前資料</button>
              <button id="importCancelChoiceBtn" class="btn ghost">取消</button>
            </div>
          </div>
        </div>
      </div>
      <div id="importErrors" class="error-list" hidden></div>
    </section>
  </div>

  <div id="exportModal" class="modal" hidden>
    <div class="modal-backdrop" data-close="exportModal"></div>
    <section class="modal-card export-card" role="dialog" aria-modal="true" aria-labelledby="exportTitle">
      <div class="modal-head export-head">
        <h2 id="exportTitle">匯出</h2>
        <label class="check-row"><input id="printTitleCheck" type="checkbox" checked> 是否列印標題</label>
        <button class="icon-btn" data-close="exportModal" aria-label="關閉">×</button>
      </div>
      <div class="export-section">
        <h3>圖表匯出</h3>
        <div class="button-row">
          <button class="btn" data-export="png">PNG</button>
          <button class="btn" data-export="svg">SVG</button>
          <button class="btn" data-export="pdf">PDF</button>
        </div>
        <div id="pngOptions" class="png-options" hidden>
          <label>PNG 解析度 (%)
            <input id="pngResolutionInput" type="number" min="50" max="800" step="10" value="250">
          </label>
          <span class="muted small">可輸入 50–800，建議 150–300，預設 250。</span>
          <button id="confirmPngExportBtn" class="btn primary">確認匯出 PNG</button>
        </div>
      </div>
      <div class="export-section">
        <h3>資料匯出</h3>
        <div class="button-row">
          <button class="btn" data-export="csv">CSV</button>
          <button class="btn" data-export="json">JSON</button>
          <button class="btn" data-export="xlsx">Excel xlsx</button>
        </div>
      </div>
    </section>
  </div>

  <div id="toast" class="toast" hidden></div>

  <script src="libs/xlsx.full.min.js"></script>
  <script src="libs/jspdf.umd.min.js"></script>
  <script src="libs/html-to-image.min.js"></script>
  <script src="app.js"></script>
</body>
</html>

```

## `styles.css`

```css
:root {
  --bg: #f7f7f5;
  --panel: #ffffff;
  --line: #e7e5e0;
  --line-strong: #d8d5cd;
  --text: #202124;
  --muted: #6b7280;
  --soft: #f2f1ee;
  --soft-hover: #eae8e3;
  --accent: #111827;
  --danger: #b42318;
  --danger-soft: #fff1f0;
  --shadow: 0 24px 60px rgba(15, 23, 42, 0.14);
  --radius: 12px;
  --left-width: 49%;
  --col-drag: 72px;
  --col-index: 54px;
  --col-mode: 70px;
  --col-color: 72px;
  --col-name: 210px;
  --col-startDate: 155px;
  --col-endDate: 155px;
  --col-owner: 150px;
  --col-copy: 64px;
  --col-delete: 64px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
}

* { box-sizing: border-box; }
html, body { height: 100%; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
}
button, input, select, textarea { font: inherit; }
button { cursor: pointer; }
button:disabled { cursor: not-allowed; opacity: 0.42; }

.app-shell {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  min-width: 1024px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  z-index: 20;
}

.brand { display: flex; align-items: center; gap: 10px; min-width: 320px; }
.brand-icon { width: 28px; height: 28px; border-radius: 8px; }
.project-title {
  width: min(520px, 42vw);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text);
  font-size: 20px;
  font-weight: 650;
  padding: 7px 9px;
  border-radius: 8px;
  outline: none;
}
.project-title:hover, .project-title:focus { border-color: var(--line); background: #fff; }
.toolbar { display: flex; gap: 8px; justify-content: flex-end; align-items: center; }

.btn, .icon-tool, .file-picker {
  border: 1px solid var(--line-strong);
  background: #fff;
  color: var(--text);
  border-radius: 9px;
  padding: 8px 12px;
  line-height: 1.15;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.12s ease;
  user-select: none;
}
.btn:hover, .icon-tool:hover, .file-picker:hover { background: var(--soft); border-color: #cfcac0; }
.btn:active, .icon-tool:active { transform: translateY(1px); }
.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.primary:hover { background: #0b1220; }
.danger { color: var(--danger); border-color: #efc4bf; }
.ghost { background: transparent; }
.small-btn { padding: 6px 10px; font-size: 13px; }
.icon-btn {
  width: 32px; height: 32px; border: 0; background: transparent; border-radius: 8px;
  font-size: 22px; line-height: 1;
}
.icon-btn:hover { background: var(--soft); }
.icon-tool {
  width: 38px;
  height: 38px;
  padding: 0;
  display: grid;
  place-items: center;
  font-size: 18px;
  position: relative;
}
.icon-tool::after {
  content: attr(data-tooltip);
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  white-space: nowrap;
  color: #fff;
  background: #111827;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 7px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-3px);
  transition: opacity .12s ease, transform .12s ease;
  z-index: 40;
}
.icon-tool:hover::after { opacity: 1; transform: translateY(0); }

.split-layout {
  display: grid;
  grid-template-columns: var(--left-width) 7px minmax(360px, 1fr);
  min-height: 0;
  height: 100%;
}
.panel {
  min-width: 0;
  min-height: 0;
  background: var(--panel);
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}
.task-panel { border-right: 1px solid var(--line); }
.panel-head, .chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--line);
  background: #fff;
}
.task-head { align-items: center; }
.compact-control {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}
.compact-control select,
.settings-grid select,
.png-options input {
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  padding: 6px 8px;
  background: #fff;
  color: var(--text);
  outline: none;
}
.muted { color: var(--muted); }
.small { font-size: 12px; }

.splitter {
  background: linear-gradient(90deg, transparent, var(--line), transparent);
  cursor: col-resize;
  position: relative;
}
.splitter::after {
  content: "";
  position: absolute;
  inset: 0 2px;
  border-radius: 6px;
}
.splitter:hover::after, .splitter.dragging::after { background: #cfcac0; }

.table-wrap {
  overflow: auto;
  min-height: 0;
  background: #fff;
}
.task-table {
  border-collapse: separate;
  border-spacing: 0;
  min-width: calc(var(--col-drag) + var(--col-index) + var(--col-mode) + var(--col-color) + var(--col-name) + var(--col-startDate) + var(--col-endDate) + var(--col-owner) + var(--col-copy) + var(--col-delete));
  width: max-content;
  table-layout: fixed;
  font-size: 13px;
}
.task-table col[data-col="drag"] { width: var(--col-drag); }
.task-table col[data-col="index"] { width: var(--col-index); }
.task-table col[data-col="mode"] { width: var(--col-mode); }
.task-table col[data-col="color"] { width: var(--col-color); }
.task-table col[data-col="name"] { width: var(--col-name); }
.task-table col[data-col="startDate"] { width: var(--col-startDate); }
.task-table col[data-col="endDate"] { width: var(--col-endDate); }
.task-table col[data-col="owner"] { width: var(--col-owner); }
.task-table col[data-col="copy"] { width: var(--col-copy); }
.task-table col[data-col="delete"] { width: var(--col-delete); }
.task-table th, .task-table td {
  border-bottom: 1px solid var(--line);
  border-right: 1px solid #f0eee9;
  height: 42px;
  padding: 6px 8px;
  vertical-align: middle;
  background: #fff;
}
.task-table th {
  position: sticky;
  top: 0;
  z-index: 3;
  font-size: 12px;
  color: var(--muted);
  text-align: left;
  font-weight: 650;
  background: #fbfaf8;
  white-space: nowrap;
}
.task-table th:first-child, .task-table td:first-child { border-left: 0; }
.task-table tr.drag-over td { background: #f6f4ef; }
.task-table tr.invalid-row td { background: #fff8f7; }
.task-table tr.dragging-row td { opacity: .55; }
.col-resizer {
  position: absolute;
  top: 0;
  right: -3px;
  width: 7px;
  height: 100%;
  cursor: col-resize;
  z-index: 5;
}
.col-resizer:hover { background: rgba(17, 24, 39, .12); }
.drag-handle, .mode-toggle, .row-icon-btn, .color-dot-btn {
  border: 1px solid transparent;
  background: transparent;
  border-radius: 8px;
  min-width: 28px;
  height: 28px;
  display: inline-grid;
  place-items: center;
  color: #4b5563;
}
.drag-handle:hover, .mode-toggle:hover, .row-icon-btn:hover, .color-dot-btn:hover { background: var(--soft); border-color: var(--line); }
.drag-handle { cursor: grab; }
.drag-handle:active { cursor: grabbing; }
.color-dot-btn span {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,.12);
  display: block;
}
.cell-input, .date-text {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 7px;
  padding: 6px 7px;
  background: transparent;
  outline: none;
  color: var(--text);
}
.cell-input:hover, .date-text:hover,
.cell-input:focus, .date-text:focus { border-color: var(--line-strong); background: #fff; }
.date-cell {
  display: grid;
  grid-template-columns: 1fr 30px;
  align-items: center;
  gap: 4px;
}
.date-picker {
  width: 30px;
  height: 30px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: #fff;
  padding: 2px;
  color: transparent;
}
.date-picker::-webkit-calendar-picker-indicator { cursor: pointer; opacity: .65; }
.index-empty { color: transparent; }

.chart-panel { background: #fff; }
.chart-head { grid-row: auto; }
.settings-panel {
  border-bottom: 1px solid var(--line);
  background: #fbfaf8;
  padding: 12px 14px;
}
.settings-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 10px;
}
.settings-grid label { display: grid; gap: 5px; font-size: 12px; color: var(--muted); }
.tutorial-text {
  margin: 0;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
  color: #374151;
  font-size: 12px;
  line-height: 1.65;
  white-space: pre-wrap;
}
.gantt-viewport {
  overflow: auto;
  min-height: 0;
  background: #fff;
  position: relative;
}
.gantt-host { min-width: 100%; position: relative; }
.gantt-svg {
  display: block;
  background: #fff;
  font-family: inherit;
}
.gantt-task { cursor: grab; }
.gantt-task:active { cursor: grabbing; }
.bar-resize { cursor: ew-resize; }
.gantt-label-resize { cursor: col-resize; }
.gantt-date-resize { cursor: ew-resize; }
.gantt-row-label { cursor: text; }
.gantt-edit-input {
  position: absolute;
  z-index: 8;
  border: 1px solid var(--accent);
  border-radius: 7px;
  padding: 5px 7px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, .16);
  min-width: 120px;
}
.empty-state {
  margin: 24px;
  padding: 20px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius);
  color: var(--muted);
  background: #fbfaf8;
}
.validation-box {
  padding: 10px 14px;
  border-bottom: 1px solid #f3b2aa;
  color: var(--danger);
  background: var(--danger-soft);
  font-size: 13px;
}
.validation-box ul { margin: 6px 0 0 18px; padding: 0; }

.confirm-bubble, .color-popover {
  position: fixed;
  z-index: 80;
  background: #fff;
  border: 1px solid var(--line-strong);
  box-shadow: 0 12px 34px rgba(15, 23, 42, .14);
  border-radius: 12px;
  padding: 8px;
}
.confirm-bubble[hidden], .color-popover[hidden] { display: none; }
.preset-colors {
  display: grid;
  grid-template-columns: repeat(5, 28px);
  gap: 7px;
  margin-bottom: 8px;
}
.preset-color {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,.12);
}
.color-actions { display: flex; gap: 6px; }
.palette-label { display: inline-block; }

.modal[hidden] { display: none; }
.modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
}
.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(17, 24, 39, 0.32);
}
.modal-card {
  position: relative;
  width: min(920px, calc(100vw - 42px));
  max-height: calc(100vh - 52px);
  overflow: auto;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow);
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2;
}
.modal-head h2 { margin: 0; font-size: 18px; }
.export-head { display: grid; grid-template-columns: 1fr auto auto; }
.import-tabs, .button-row, .choice-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.import-tabs { padding: 14px 18px 0; }
.tab-btn {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 7px 11px;
  color: var(--muted);
}
.tab-btn.active { color: #fff; background: var(--accent); border-color: var(--accent); }
.import-source, .modal-actions, .mapping-box, .error-list, .choice-box, .export-section {
  margin: 14px 18px;
}
.import-source textarea {
  width: 100%;
  min-height: 170px;
  border: 1px solid var(--line-strong);
  border-radius: 12px;
  padding: 12px;
  outline: none;
  resize: vertical;
  background: #fff;
}
.import-source textarea:focus { border-color: #b8b2a8; }
.file-picker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.choice-box, .error-list {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #fbfaf8;
}
.error-list { color: var(--danger); background: var(--danger-soft); border-color: #f3b2aa; }
.error-list ul { margin: 8px 0 0 18px; padding: 0; }
.mapping-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(230px, 1fr));
  gap: 10px;
}
.mapping-grid label { display: grid; gap: 5px; font-size: 12px; color: var(--muted); }
.mapping-grid select {
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  padding: 7px 8px;
  background: #fff;
}
.export-section {
  padding: 13px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fbfaf8;
}
.export-section h3 { margin: 0 0 10px; font-size: 15px; }
.check-row { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #374151; white-space: nowrap; }
.png-options {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.png-options label { display: inline-flex; align-items: center; gap: 8px; color: var(--muted); font-size: 13px; }
.png-options input { width: 90px; }

.toast {
  position: fixed;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  z-index: 100;
  max-width: min(720px, calc(100vw - 32px));
  padding: 10px 14px;
  border-radius: 999px;
  color: #fff;
  background: #111827;
  box-shadow: 0 16px 34px rgba(15, 23, 42, .25);
  font-size: 13px;
}
.toast[hidden] { display: none; }

@media (max-width: 1100px) {
  .settings-grid { grid-template-columns: 1fr; }
  .mapping-grid { grid-template-columns: 1fr; }
}

/* v3 interaction refinements */
:root {
  --col-drag: 44px;
  --col-index: 44px;
  --col-mode: 44px;
  --col-color: 44px;
  --col-copy: 44px;
  --col-delete: 44px;
}
.task-table th[data-col-key="drag"] .col-resizer,
.task-table th[data-col-key="index"] .col-resizer,
.task-table th[data-col-key="mode"] .col-resizer,
.task-table th[data-col-key="color"] .col-resizer,
.task-table th[data-col-key="copy"] .col-resizer,
.task-table th[data-col-key="delete"] .col-resizer { display: none; }
.task-table th[data-col-key="drag"], .task-table th[data-col-key="index"], .task-table th[data-col-key="mode"], .task-table th[data-col-key="color"], .task-table th[data-col-key="copy"], .task-table th[data-col-key="delete"],
.task-table td:nth-child(1), .task-table td:nth-child(2), .task-table td:nth-child(3), .task-table td:nth-child(4), .task-table td:nth-child(9), .task-table td:nth-child(10) {
  padding-left: 4px;
  padding-right: 4px;
  text-align: center;
}
.chart-head > div:first-child { display: flex; align-items: center; gap: 8px; min-width: 0; }
.chart-error-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--danger-soft);
  color: var(--danger);
  border: 1px solid #f3b2aa;
  font-size: 12px;
  font-weight: 650;
}
.chart-error-badge::after {
  content: attr(data-errors);
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: max-content;
  max-width: 420px;
  white-space: pre-line;
  text-align: left;
  color: #fff;
  background: #111827;
  border-radius: 9px;
  padding: 10px 12px;
  box-shadow: 0 14px 38px rgba(15, 23, 42, .22);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-3px);
  transition: opacity .12s ease, transform .12s ease;
  z-index: 30;
}
.chart-error-badge:hover::after { opacity: 1; transform: translateY(0); }
.validation-box { display: none !important; }
.gantt-task.drag-preview { opacity: .72; filter: drop-shadow(0 10px 18px rgba(15, 23, 42, .18)); }
.gantt-drop-marker { pointer-events: none; }

/* v4 refinements */
.icon-tool svg,
.icon-action svg { width: 18px; height: 18px; display: block; }
.chart-error-badge[hidden],
.png-options[hidden],
.settings-panel[hidden] { display: none !important; }
.chart-panel { grid-template-rows: auto auto minmax(0, 1fr); }
.settings-panel {
  height: calc((100vh - 68px) / 2);
  max-height: calc((100vh - 68px) / 2);
  overflow: auto;
}
.color-actions {
  justify-content: space-between;
  align-items: center;
  min-width: 170px;
}
.icon-action {
  width: 36px;
  height: 34px;
  padding: 0;
  display: inline-grid;
  place-items: center;
}
.palette-label { display: inline-grid; place-items: center; }
.table-drag-ghost {
  position: fixed;
  z-index: 120;
  pointer-events: none;
  padding: 8px 12px;
  border: 1px solid var(--line-strong);
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 16px 42px rgba(15, 23, 42, .18);
  color: var(--text);
  font-size: 13px;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
body.dragging-table-row { user-select: none; cursor: grabbing; }
.gantt-owner-resize { cursor: col-resize; }
.gantt-owner-label { cursor: text; }

/* Import mapping refinement */
.mapping-grid.mapping-grid-import {
  grid-template-columns: 1fr;
  gap: 8px;
}
.mapping-head-row,
.mapping-row {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(220px, 1fr);
  gap: 12px;
  align-items: center;
}
.mapping-head-row {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  padding: 0 2px 4px;
}
.mapping-row {
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
}
.mapping-source-name {
  font-size: 13px;
  font-weight: 650;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mapping-source-sample {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.import-final-actions {
  justify-content: flex-end;
}
.import-final-actions .inline-choice {
  width: 100%;
  margin: 0;
}
@media (max-width: 760px) {
  .mapping-head-row, .mapping-row { grid-template-columns: 1fr; }
}

```

## `app.js`

```javascript
(() => {
  'use strict';

  const STORAGE_KEY = 'static-gantt-generator-state';
  const APP_ID = 'static-gantt-generator';
  const JSON_SCHEMA_VERSION = 2;
  const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#64748B', '#84CC16', '#14B8A6', '#A855F7', '#F43F5E', '#0EA5E9', '#71717A'];
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  const MS_DAY = 24 * 60 * 60 * 1000;
  const FIXED_TABLE_COLS = new Set(['drag', 'index', 'mode', 'color', 'copy', 'delete']);
  const TABLE_COL_DEFAULTS = {
    drag: 44, index: 44, mode: 44, color: 44, name: 210,
    startDate: 155, endDate: 155, owner: 150, copy: 44, delete: 44
  };
  const DEFAULT_STATE = {
    projectTitle: '我的甘特圖',
    settings: {
      timelineScale: 'month',
      sortMode: 'manual',
      rowLabelMode: 'combined',
      showWeekends: true,
      ganttLabelWidth: 190,
      ganttOwnerWidth: 110,
      ganttDayWidth: 24,
      leftPanelWidth: null,
      ownerDisplay: 'both',
      showGanttBarLabel: true,
      tableColumnWidths: TABLE_COL_DEFAULTS
    },
    tasks: []
  };
  const SAMPLE_TASKS = [
    { id: 'task-sample-001', order: 1, rowMode: 'new', name: '需求盤點', startDate: '2026-06-20', endDate: '2026-06-25', color: '#EF4444', owner: 'Alex' },
    { id: 'task-sample-002', order: 2, rowMode: 'continue', name: '資訊架構', startDate: '2026-06-26', endDate: '2026-06-30', color: '#F97316', owner: 'Alex' },
    { id: 'task-sample-003', order: 3, rowMode: 'new', name: 'UI 設計', startDate: '2026-07-01', endDate: '2026-07-10', color: '#3B82F6', owner: 'Mia' },
    { id: 'task-sample-004', order: 4, rowMode: 'continue', name: '設計審核', startDate: '2026-07-11', endDate: '2026-07-14', color: '#8B5CF6', owner: 'Mia' },
    { id: 'task-sample-005', order: 5, rowMode: 'new', name: '前端開發', startDate: '2026-07-15', endDate: '2026-08-05', color: '#10B981', owner: 'Kai' },
    { id: 'task-sample-006', order: 6, rowMode: 'new', name: '驗收與交付', startDate: '2026-08-06', endDate: '2026-08-12', color: '#64748B', owner: 'Nora' }
  ];
  const FIELD_LABELS = {
    projectTitle: '甘特圖大標題',
    name: '任務名稱', startDate: '開始日期', endDate: '結束日期', owner: '負責人', color: '顏色(HEX 碼)', rowMode: '顯示模式', order: '排序'
  };
  const IMPORT_TARGETS = [
    ['', '無對應'],
    ['projectTitle', '甘特圖大標題'],
    ['name', '任務名稱'],
    ['startDate', '開始日期'],
    ['endDate', '結束日期'],
    ['color', '顏色(HEX 碼)'],
    ['rowMode', '顯示模式'],
    ['owner', '負責人']
  ];

  let state = loadState();
  let undoStack = [];
  let redoStack = [];
  let pendingImport = null;
  let importMode = 'replace';
  let importChoicePending = false;
  let activeImportTab = 'paste';
  let toastTimer = null;
  let confirmAction = null;
  let dragTaskId = null;
  let tablePointer = null;
  let colorTargetTaskId = null;
  let lastRender = { errors: [], taskIds: new Set(), groups: [], range: null, meta: null };
  let ganttPointer = null;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const els = {
    projectTitleInput: $('#projectTitleInput'),
    importBtn: $('#importBtn'), exportBtn: $('#exportBtn'), sampleBtn: $('#sampleBtn'), clearBtn: $('#clearBtn'),
    addTaskBtn: $('#addTaskBtn'), taskSortModeSelect: $('#taskSortModeSelect'),
    taskTableBody: $('#taskTableBody'), ownersList: $('#ownersList'),
    chartMeta: $('#chartMeta'), chartErrorBadge: $('#chartErrorBadge'), validationBox: $('#validationBox'), ganttHost: $('#ganttHost'), ganttEmpty: $('#ganttEmpty'),
    ganttViewport: $('#ganttViewport'), splitter: $('#splitter'), splitLayout: $('#splitLayout'), toast: $('#toast'),
    settingsBtnInline: $('#settingsBtnInline'), settingsPanel: $('#settingsPanel'), timelineScaleSelect: $('#timelineScaleSelect'),
    rowLabelModeSelect: $('#rowLabelModeSelect'), showWeekendsSelect: $('#showWeekendsSelect'),
    ownerDisplaySelect: $('#ownerDisplaySelect'), showGanttBarLabelSelect: $('#showGanttBarLabelSelect'),
    confirmBubble: $('#confirmBubble'), confirmBubbleBtn: $('#confirmBubbleBtn'),
    colorPopover: $('#colorPopover'), presetColors: $('#presetColors'), eyedropperBtn: $('#eyedropperBtn'), paletteInput: $('#paletteInput'),
    importModal: $('#importModal'), exportModal: $('#exportModal'),
    pasteInput: $('#pasteInput'), csvFileInput: $('#csvFileInput'), jsonFileInput: $('#jsonFileInput'), xlsxFileInput: $('#xlsxFileInput'), jsonTextInput: $('#jsonTextInput'),
    csvFileName: $('#csvFileName'), jsonFileName: $('#jsonFileName'), xlsxFileName: $('#xlsxFileName'),
    parseImportBtn: $('#parseImportBtn'), mappingBox: $('#mappingBox'), mappingGrid: $('#mappingGrid'), confirmImportBtn: $('#confirmImportBtn'), importErrors: $('#importErrors'),
    importChoice: $('#importChoice'), importReplaceBtn: $('#importReplaceBtn'), importAppendBtn: $('#importAppendBtn'), importCancelChoiceBtn: $('#importCancelChoiceBtn'),
    printTitleCheck: $('#printTitleCheck'), pngOptions: $('#pngOptions'), pngResolutionInput: $('#pngResolutionInput'), confirmPngExportBtn: $('#confirmPngExportBtn')
  };

  init();

  function init() {
    normalizeAllOrders();
    applyTableColumnWidths();
    bindEvents();
    renderPresetColors();
    renderAll();
  }

  function bindEvents() {
    els.projectTitleInput.addEventListener('focus', e => { e.target.dataset.oldValue = e.target.value; });
    els.projectTitleInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
    });
    els.projectTitleInput.addEventListener('change', e => {
      const val = e.target.value.trim() || '未命名甘特圖';
      const old = e.target.dataset.oldValue || state.projectTitle;
      e.target.value = val;
      if (val !== old) commit(() => { state.projectTitle = val; }, '修改專案標題');
    });

    els.addTaskBtn.addEventListener('click', () => addTaskAndFocus());
    els.clearBtn.addEventListener('click', () => showConfirmBubble(els.clearBtn, '確認清空資料', () => clearData()));
    els.sampleBtn.addEventListener('click', () => showConfirmBubble(els.sampleBtn, state.tasks.length ? '確認覆蓋為範例資料' : '匯入範例資料', () => importSampleData()));
    els.importBtn.addEventListener('click', openImport);
    els.exportBtn.addEventListener('click', openExport);
    els.settingsBtnInline.addEventListener('click', () => { els.settingsPanel.hidden = !els.settingsPanel.hidden; });
    els.confirmBubbleBtn.addEventListener('click', () => {
      const fn = confirmAction;
      hideConfirmBubble();
      if (fn) fn();
    });

    els.taskSortModeSelect.addEventListener('change', () => {
      commit(() => { state.settings.sortMode = els.taskSortModeSelect.value; }, '修改任務排序設定');
    });
    [els.timelineScaleSelect, els.rowLabelModeSelect, els.showWeekendsSelect, els.ownerDisplaySelect, els.showGanttBarLabelSelect].filter(Boolean).forEach(el => {
      el.addEventListener('change', updateSettingsFromPanel);
    });

    document.addEventListener('click', e => {
      const closeId = e.target?.dataset?.close;
      if (closeId) closeModal(closeId);
      if (!e.target.closest('#confirmBubble') && !e.target.closest('.icon-tool')) hideConfirmBubble();
      if (!e.target.closest('#colorPopover') && !e.target.closest('.color-dot-btn')) hideColorPopover();
    });

    document.addEventListener('keydown', e => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
      if (e.key === 'Escape') {
        hideConfirmBubble();
        hideColorPopover();
        closeInlineGanttEditor();
      }
    }, true);

    els.taskTableBody.addEventListener('change', handleTableChange);
    els.taskTableBody.addEventListener('keydown', handleTableKeydown);
    els.taskTableBody.addEventListener('click', handleTableClick);
    els.taskTableBody.addEventListener('pointerdown', handleTablePointerDown);
    els.taskTableBody.addEventListener('dragstart', handleTableDragStart);
    els.taskTableBody.addEventListener('dragover', handleTableDragOver);
    els.taskTableBody.addEventListener('dragleave', handleTableDragLeave);
    els.taskTableBody.addEventListener('drop', handleTableDrop);
    els.taskTableBody.addEventListener('dragend', handleTableDragEnd);

    $$('.col-resizer').forEach(handle => handle.addEventListener('pointerdown', startTableColumnResize));

    els.ganttHost.addEventListener('pointerdown', handleGanttPointerDown);
    els.ganttHost.addEventListener('dblclick', handleGanttDblClick);

    $$('.tab-btn').forEach(btn => btn.addEventListener('click', () => setImportTab(btn.dataset.importTab)));
    els.parseImportBtn.addEventListener('click', parseImportSource);
    els.confirmImportBtn.addEventListener('click', confirmMappedImport);
    els.importReplaceBtn.addEventListener('click', () => { importMode = 'replace'; els.importChoice.hidden = true; els.confirmImportBtn.hidden = false; if (importChoicePending) performMappedImport(); else continueParseImportSource(); });
    els.importAppendBtn.addEventListener('click', () => { importMode = 'append'; els.importChoice.hidden = true; els.confirmImportBtn.hidden = false; if (importChoicePending) performMappedImport(); else continueParseImportSource(); });
    els.importCancelChoiceBtn.addEventListener('click', () => { importChoicePending = false; els.importChoice.hidden = true; els.confirmImportBtn.hidden = false; });
    [els.csvFileInput, els.jsonFileInput, els.xlsxFileInput].forEach(input => {
      input.addEventListener('change', () => {
        const label = input === els.csvFileInput ? els.csvFileName : input === els.jsonFileInput ? els.jsonFileName : els.xlsxFileName;
        label.textContent = input.files?.[0]?.name || '';
      });
    });

    $$('#exportModal [data-export]').forEach(btn => btn.addEventListener('click', () => exportByType(btn.dataset.export)));
    els.confirmPngExportBtn.addEventListener('click', () => exportPngWithResolution());

    els.presetColors.addEventListener('click', e => {
      const btn = e.target.closest('[data-color]');
      if (btn && colorTargetTaskId) setTaskColor(colorTargetTaskId, btn.dataset.color);
    });
    els.eyedropperBtn.addEventListener('click', useEyeDropper);
    els.paletteInput.addEventListener('input', e => { if (colorTargetTaskId) setTaskColor(colorTargetTaskId, e.target.value); });

    initSplitter();
  }

  function snapshot() { return JSON.stringify(state); }
  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
  function commit(mutator, label) {
    const before = snapshot();
    undoStack.push(before);
    if (undoStack.length > 120) undoStack.shift();
    redoStack = [];
    mutator();
    normalizeAllOrders();
    saveState();
    renderAll();
  }
  function undo() {
    if (!undoStack.length) return showToast('沒有可復原的狀態。');
    redoStack.push(snapshot());
    state = sanitizeState(JSON.parse(undoStack.pop()));
    normalizeAllOrders();
    saveState();
    applyTableColumnWidths();
    renderAll();
    showToast('已復原上一個狀態。');
  }
  function redo() {
    if (!redoStack.length) return showToast('沒有可重做的狀態。');
    undoStack.push(snapshot());
    state = sanitizeState(JSON.parse(redoStack.pop()));
    normalizeAllOrders();
    saveState();
    applyTableColumnWidths();
    renderAll();
    showToast('已重做下一個狀態。');
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULT_STATE);
      return sanitizeState(JSON.parse(raw));
    } catch (err) {
      console.warn(err);
      return clone(DEFAULT_STATE);
    }
  }
  function sanitizeState(input) {
    const s = clone(DEFAULT_STATE);
    if (input && typeof input === 'object') {
      s.projectTitle = String(input.projectTitle || s.projectTitle);
      s.settings = Object.assign({}, s.settings, input.settings || {});
      s.settings.timelineScale = ['day', 'week', 'month'].includes(s.settings.timelineScale) ? s.settings.timelineScale : 'month';
      s.settings.sortMode = ['manual', 'startDate'].includes(s.settings.sortMode) ? s.settings.sortMode : 'manual';
      s.settings.rowLabelMode = ['combined', 'hidden'].includes(s.settings.rowLabelMode) ? s.settings.rowLabelMode : 'combined';
      s.settings.showWeekends = s.settings.showWeekends !== false;
      s.settings.ownerDisplay = ['none', 'left', 'bar', 'both'].includes(s.settings.ownerDisplay) ? s.settings.ownerDisplay : (s.settings.showGanttOwner === false ? 'bar' : 'both');
      s.settings.showGanttBarLabel = s.settings.showGanttBarLabel !== false && s.settings.showBarLabel !== false;
      s.settings.ganttLabelWidth = clamp(Number(s.settings.ganttLabelWidth) || 190, 42, 520);
      s.settings.ganttOwnerWidth = clamp(Number(s.settings.ganttOwnerWidth) || 110, 44, 360);
      s.settings.ganttDayWidth = clamp(Number(s.settings.ganttDayWidth) || defaultDayWidth(s.settings.timelineScale), 1, 90);
      {
        const leftPanelWidth = Number(s.settings.leftPanelWidth);
        s.settings.leftPanelWidth = Number.isFinite(leftPanelWidth) && leftPanelWidth > 0 ? clamp(leftPanelWidth, 300, 1600) : null;
      }
      s.settings.tableColumnWidths = Object.assign({}, TABLE_COL_DEFAULTS, s.settings.tableColumnWidths || {});
      Object.keys(TABLE_COL_DEFAULTS).forEach(k => { s.settings.tableColumnWidths[k] = FIXED_TABLE_COLS.has(k) ? 44 : clamp(Number(s.settings.tableColumnWidths[k]) || TABLE_COL_DEFAULTS[k], 64, 520); });
      s.tasks = Array.isArray(input.tasks) ? input.tasks.map((t, i) => sanitizeTask(t, i + 1)).filter(Boolean) : [];
    }
    if (s.tasks[0] && s.tasks[0].rowMode === 'continue') s.tasks[0].rowMode = 'new';
    return s;
  }
  function sanitizeTask(t, order) {
    if (!t || typeof t !== 'object') return null;
    const rawStart = String(t.startDate ?? '').trim();
    const rawEnd = String(t.endDate ?? '').trim();
    const start = rawStart ? (normalizeDateInput(rawStart) || '') : '';
    const end = rawEnd ? (normalizeDateInput(rawEnd) || '') : '';
    return {
      id: t.id || makeId(),
      order: Number.isFinite(+t.order) ? +t.order : order,
      rowMode: t.rowMode === 'continue' ? 'continue' : 'new',
      name: String(t.name || '新任務').trim() || '新任務',
      startDate: start,
      endDate: end,
      color: /^#[0-9a-f]{6}$/i.test(String(t.color || '')) ? String(t.color).toUpperCase() : colorForIndex(order - 1),
      owner: String(t.owner || '').trim()
    };
  }
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projectTitle: state.projectTitle, settings: state.settings, tasks: state.tasks }));
  }

  function renderAll() {
    applyLayoutSettings();
    els.projectTitleInput.value = state.projectTitle;
    renderSettingsValues();
    renderOwnersList();
    renderTaskTable();
    renderGanttPreview();
  }

  function renderSettingsValues() {
    els.taskSortModeSelect.value = state.settings.sortMode;
    els.timelineScaleSelect.value = state.settings.timelineScale;
    els.rowLabelModeSelect.value = state.settings.rowLabelMode;
    els.showWeekendsSelect.value = String(state.settings.showWeekends);
    if (els.ownerDisplaySelect) els.ownerDisplaySelect.value = state.settings.ownerDisplay || 'both';
    if (els.showGanttBarLabelSelect) els.showGanttBarLabelSelect.value = String(state.settings.showGanttBarLabel !== false);
  }

  function renderOwnersList() {
    els.ownersList.innerHTML = uniqueOwners().map(o => `<option value="${escapeAttr(o)}"></option>`).join('');
  }
  function renderTaskTable() {
    const tasks = orderedTasks();
    const validation = validateTasks(tasks);
    els.taskTableBody.innerHTML = tasks.map((task, i) => {
      const first = i === 0;
      const rowInvalid = validation.taskIds.has(task.id) ? ' invalid-row' : '';
      const index = task.rowMode === 'continue' ? '<span class="index-empty">—</span>' : String(countNewRowsBefore(tasks, i));
      return `<tr data-task-id="${escapeAttr(task.id)}" class="${rowInvalid}">
        <td><button class="drag-handle" data-action="drag" title="拖曳排序">⋮⋮</button></td>
        <td>${index}</td>
        <td><button class="mode-toggle" data-action="toggle-mode" title="${task.rowMode === 'new' ? '新列' : '接續上一列'}" ${first ? 'disabled' : ''}>${task.rowMode === 'new' ? '↵' : '↳'}</button></td>
        <td><button class="color-dot-btn" data-action="color" title="設定顏色"><span style="background:${escapeAttr(task.color)}"></span></button></td>
        <td><input class="cell-input editable" data-field="name" value="${escapeAttr(task.name)}" aria-label="任務名稱"></td>
        <td>${dateCell(task, 'startDate')}</td>
        <td>${dateCell(task, 'endDate')}</td>
        <td><input class="cell-input editable" data-field="owner" list="ownersList" value="${escapeAttr(task.owner)}" aria-label="負責人"></td>
        <td><button class="row-icon-btn" data-action="copy" title="複製任務">⧉</button></td>
        <td><button class="row-icon-btn" data-action="delete" title="刪除任務">⌫</button></td>
      </tr>`;
    }).join('');
  }

  function dateCell(task, field) {
    return `<div class="date-cell"><input class="date-text editable" data-field="${field}" value="${escapeAttr(displayDate(task[field] || ''))}" placeholder="空白=自動範圍" aria-label="${field === 'startDate' ? '開始日期' : '結束日期'}"><input class="date-picker" type="date" data-date-picker="${field}" value="${escapeAttr(task[field] || '')}" aria-label="開啟月曆"></div>`;
  }

  function countNewRowsBefore(tasks, idx) {
    let n = 0;
    for (let i = 0; i <= idx; i++) if (i === 0 || tasks[i].rowMode === 'new') n++;
    return n;
  }

  function renderGanttPreview(options = {}) {
    const tasks = orderedTasks();
    let validation = lastRender;
    if (!options.skipValidation) {
      validation = validateTasks(tasks);
      lastRender = validation;
    }
    if (!tasks.length) {
      els.ganttHost.innerHTML = '';
      els.ganttEmpty.hidden = false;
      els.chartMeta.textContent = '';
      updateChartErrorBadge([]);
      els.validationBox.hidden = true;
      return;
    }
    els.ganttEmpty.hidden = true;
    updateChartErrorBadge(validation.errors || []);
    els.validationBox.hidden = true;
    els.validationBox.innerHTML = '';
    const model = buildGanttModel(tasks, { includeTitle: false });
    els.ganttHost.innerHTML = buildGanttSvg(model, { includeToday: true });
    els.ganttHost.dataset.dayWidth = String(model.dayWidth);
    els.ganttHost.dataset.labelWidth = String(model.labelW);
    els.ganttHost.dataset.ownerWidth = String(model.ownerW || 0);
    els.ganttHost.dataset.leftWidth = String(model.leftW || model.labelW);
    els.ganttHost.dataset.rowHeight = String(model.rowH);
    els.ganttHost.dataset.headerHeight = String(model.headerH);
    const range = model.range;
    els.chartMeta.textContent = range ? `｜${range.start} 至 ${range.end}｜${scaleLabel(state.settings.timelineScale)}` : '';
  }

  function updateChartErrorBadge(errors) {
    const list = Array.isArray(errors) ? errors : [];
    if (!els.chartErrorBadge) return;
    els.chartErrorBadge.hidden = !list.length;
    els.chartErrorBadge.dataset.errors = list.length ? list.join('\n') : '';
    els.chartErrorBadge.textContent = list.length ? `錯誤 ${list.length}` : '';
  }

  function manualOrderedTasks() {
    return state.tasks.slice().sort((a, b) => a.order - b.order);
  }
  function orderedTasks() {
    const manual = manualOrderedTasks();
    if (state.settings.sortMode !== 'startDate') return manual;
    return groupTasks(manual)
      .map((group, idx) => ({ group, idx, anchor: group[0] }))
      .sort((a, b) => compareEffectiveDate(a.anchor, b.anchor, 'start') || compareEffectiveDate(a.anchor, b.anchor, 'end') || a.idx - b.idx)
      .flatMap(item => item.group);
  }
  function normalizeAllOrders() {
    state.tasks.sort((a, b) => a.order - b.order).forEach((t, i) => { t.order = i + 1; if (i === 0) t.rowMode = 'new'; });
  }
  function makeId() { return 'task-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7); }
  function colorForIndex(i) { return COLORS[((i % COLORS.length) + COLORS.length) % COLORS.length]; }
  function defaultDayWidth(scale) { return scale === 'day' ? 34 : scale === 'week' ? 18 : 12; }

  function addTaskAndFocus() {
    let newId;
    commit(() => {
      const task = createNextTask();
      newId = task.id;
      state.tasks.push(task);
    }, '新增任務');
    focusField(newId, 'name');
  }
  function createNextTask() {
    const ordered = manualOrderedTasks();
    const last = ordered[ordered.length - 1];
    let start = formatDate(new Date());
    if (last) {
      const eff = effectiveDates(last, ordered);
      start = addDaysStr(eff.end, 1);
    }
    const end = addDurationByScale(start, state.settings.timelineScale);
    return { id: makeId(), order: state.tasks.length + 1, rowMode: 'new', name: '新任務', startDate: start, endDate: end, color: colorForIndex(state.tasks.length), owner: '' };
  }
  function duplicateTask(id) {
    commit(() => {
      const list = orderedTasks();
      const visualIdx = list.findIndex(t => t.id === id);
      const src = list[visualIdx];
      if (!src) return;
      const copy = Object.assign({}, src, { id: makeId(), order: src.order + 0.5, name: src.name + ' 複製' });
      state.tasks.push(copy);
    }, '複製任務');
  }
  function deleteTask(id) { commit(() => { state.tasks = state.tasks.filter(t => t.id !== id); }, '刪除任務'); }
  function toggleMode(id) {
    const tasks = orderedTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx <= 0) return showToast('第一筆任務不可設定為接續上一列。');
    commit(() => {
      const task = state.tasks.find(t => t.id === id);
      task.rowMode = task.rowMode === 'new' ? 'continue' : 'new';
    }, '切換顯示模式');
  }
  function clearData() { commit(() => { state.tasks = []; }, '清空資料'); }
  function importSampleData() {
    commit(() => {
      state.projectTitle = '網站改版甘特圖範例';
      state.tasks = clone(SAMPLE_TASKS).map((t, i) => Object.assign(t, { id: makeId(), order: i + 1 }));
    }, '匯入範例資料');
  }

  function handleTableClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const tr = e.target.closest('tr');
    const id = tr?.dataset.taskId;
    const action = btn.dataset.action;
    if (action === 'copy' && id) duplicateTask(id);
    if (action === 'delete' && id) deleteTask(id);
    if (action === 'toggle-mode' && id) toggleMode(id);
    if (action === 'color' && id) showColorPopover(btn, id);
  }
  function handleTableChange(e) {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const id = tr.dataset.taskId;
    if (e.target.matches('[data-date-picker]')) {
      const field = e.target.dataset.datePicker;
      const text = tr.querySelector(`[data-field="${field}"]`);
      text.value = e.target.value;
      updateTaskField(id, field, e.target.value);
      return;
    }
    const field = e.target.dataset.field;
    if (!field) return;
    updateTaskField(id, field, e.target.value);
  }
  function updateTaskField(id, field, rawValue) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return false;
    let value = rawValue;
    if (field === 'name') value = String(rawValue || '').trim();
    if (field === 'owner') value = String(rawValue || '').trim();
    if (field === 'color') value = /^#[0-9a-f]{6}$/i.test(rawValue) ? rawValue.toUpperCase() : task.color;
    if (field === 'startDate' || field === 'endDate') {
      const raw = String(rawValue ?? '').trim();
      value = raw ? normalizeDateInput(raw, task[field] || undefined) : '';
      if (raw && !value) { showToast('日期格式錯誤，請輸入 YYYY-MM-DD、YYYY/MM/DD、M/D 或 MMDD。'); renderTaskTable(); return false; }
      const next = Object.assign({}, task, { [field]: value });
      const eff = effectiveDates(next, state.tasks.map(t => t.id === id ? next : t));
      if (compareDate(eff.end, eff.start) < 0) { showToast('結束日期不可早於開始日期。'); renderTaskTable(); return false; }
    }
    if (field === 'name' && !value) { showToast('任務名稱不可空白。'); renderTaskTable(); return false; }
    if (task[field] === value) return true;
    commit(() => {
      const target = state.tasks.find(t => t.id === id);
      if (target) target[field] = value;
    }, '編輯任務');
    return true;
  }
  function handleTableKeydown(e) {
    const input = e.target.closest('.editable');
    if (!input) return;
    const tr = input.closest('tr');
    const id = tr?.dataset.taskId;
    const field = input.dataset.field;
    if (!id || !field) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (updateTaskField(id, field, input.value)) addTaskAndFocus();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      updateTaskField(id, field, input.value);
      focusAdjacentField(tr, field, e.shiftKey ? -1 : 1);
    }
  }
  function focusAdjacentField(tr, field, dir) {
    const fields = ['name', 'startDate', 'endDate', 'owner'];
    const idx = fields.indexOf(field);
    const next = fields[idx + dir];
    if (!next) return;
    focusField(tr.dataset.taskId, next);
  }
  function focusField(id, field) {
    requestAnimationFrame(() => {
      const el = $(`tr[data-task-id="${cssEscape(id)}"] [data-field="${field}"]`);
      if (el) { el.focus(); el.select?.(); }
    });
  }


  function handleTableDragStart(e) {
    e.preventDefault();
  }


  function handleTableDragOver(e) {
    e.preventDefault();
  }


  function handleTableDragLeave(e) {
    const tr = e.target.closest('tr');
    if (tr) tr.classList.remove('drag-over');
  }


  function handleTableDrop(e) {
    e.preventDefault();
  }


  function handleTableDragEnd() {
    dragTaskId = null;
    $$('.dragging-row, .drag-over', els.taskTableBody).forEach(row => row.classList.remove('dragging-row', 'drag-over'));
  }


  function handleTablePointerDown(e) {
    const handle = e.target.closest('.drag-handle');
    const tr = e.target.closest('tr[data-task-id]');
    if (!handle || !tr || e.button !== 0) return;
    e.preventDefault();
    const id = tr.dataset.taskId;
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    const ghost = document.createElement('div');
    ghost.className = 'table-drag-ghost';
    ghost.textContent = task.name || id;
    document.body.appendChild(ghost);
    tablePointer = { id, source: tr, ghost, targetId: null, after: false, startX: e.clientX, startY: e.clientY, moved: false };
    tr.classList.add('dragging-row');
    document.body.classList.add('dragging-table-row');
    moveTableGhost(e.clientX, e.clientY);
    window.addEventListener('pointermove', handleTablePointerMove);
    window.addEventListener('pointerup', handleTablePointerUp, { once: true });
  }
  function moveTableGhost(x, y) {
    if (!tablePointer?.ghost) return;
    tablePointer.ghost.style.left = `${x + 12}px`;
    tablePointer.ghost.style.top = `${y + 12}px`;
  }
  function handleTablePointerMove(e) {
    if (!tablePointer) return;
    moveTableGhost(e.clientX, e.clientY);
    if (Math.abs(e.clientX - tablePointer.startX) > 2 || Math.abs(e.clientY - tablePointer.startY) > 2) tablePointer.moved = true;
    $$('.drag-over', els.taskTableBody).forEach(row => row.classList.remove('drag-over'));
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const target = el?.closest?.('tr[data-task-id]');
    if (!target || target.dataset.taskId === tablePointer.id) { tablePointer.targetId = null; return; }
    const rect = target.getBoundingClientRect();
    tablePointer.targetId = target.dataset.taskId;
    tablePointer.after = e.clientY > rect.top + rect.height / 2;
    target.classList.add('drag-over');
  }
  function handleTablePointerUp() {
    if (!tablePointer) return;
    const ptr = tablePointer;
    tablePointer = null;
    window.removeEventListener('pointermove', handleTablePointerMove);
    ptr.ghost?.remove();
    document.body.classList.remove('dragging-table-row');
    $$('.dragging-row, .drag-over', els.taskTableBody).forEach(row => row.classList.remove('dragging-row', 'drag-over'));
    if (ptr.moved && ptr.targetId && ptr.targetId !== ptr.id) reorderByTaskIds(ptr.id, ptr.targetId, ptr.after);
  }

  function reorderByTaskIds(sourceId, targetId, after) {
    commit(() => {
      const list = orderedTasks().map(t => t.id);
      const from = list.indexOf(sourceId);
      let to = list.indexOf(targetId);
      if (from < 0 || to < 0) return;
      const [moved] = list.splice(from, 1);
      if (from < to) to--;
      list.splice(to + (after ? 1 : 0), 0, moved);
      state.settings.sortMode = 'manual';
      list.forEach((id, i) => {
        const t = state.tasks.find(x => x.id === id);
        if (t) t.order = i + 1;
      });
      const first = state.tasks.find(t => t.id === list[0]);
      if (first) first.rowMode = 'new';
    }, '拖曳排序');
  }

  function startTableColumnResize(e) {
    e.preventDefault();
    e.stopPropagation();
    const col = e.currentTarget.dataset.col;
    if (FIXED_TABLE_COLS.has(col)) return;
    const beforeSnapshot = snapshot();
    const startX = e.clientX;
    const startWidth = Number(state.settings.tableColumnWidths[col]) || TABLE_COL_DEFAULTS[col];
    const onMove = ev => {
      const next = clamp(startWidth + ev.clientX - startX, 64, 560);
      state.settings.tableColumnWidths[col] = next;
      document.documentElement.style.setProperty(`--col-${col}`, `${next}px`);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      undoStack.push(beforeSnapshot);
      if (undoStack.length > 120) undoStack.shift();
      redoStack = [];
      saveState();
      renderAll();
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
  }
  function applyTableColumnWidths() {
    Object.entries(Object.assign({}, TABLE_COL_DEFAULTS, state.settings.tableColumnWidths || {})).forEach(([k, v]) => {
      const width = FIXED_TABLE_COLS.has(k) ? 44 : (Number(v) || TABLE_COL_DEFAULTS[k]);
      document.documentElement.style.setProperty(`--col-${k}`, `${width}px`);
    });
  }

  function showConfirmBubble(anchor, text, fn) {
    confirmAction = fn;
    els.confirmBubbleBtn.textContent = text;
    const rect = anchor.getBoundingClientRect();
    els.confirmBubble.hidden = false;
    requestAnimationFrame(() => {
      const b = els.confirmBubble.getBoundingClientRect();
      const left = clamp(rect.right - b.width, 8, window.innerWidth - b.width - 8);
      const top = clamp(rect.bottom + 8, 8, window.innerHeight - b.height - 8);
      els.confirmBubble.style.left = `${left}px`;
      els.confirmBubble.style.top = `${top}px`;
    });
  }
  function hideConfirmBubble() {
    confirmAction = null;
    els.confirmBubble.hidden = true;
  }

  function renderPresetColors() {
    els.presetColors.innerHTML = COLORS.map(c => `<button class="preset-color" data-color="${c}" title="${c}" style="background:${c}"></button>`).join('');
  }
  function showColorPopover(anchor, id) {
    colorTargetTaskId = id;
    const task = state.tasks.find(t => t.id === id);
    if (task) els.paletteInput.value = task.color;
    const rect = anchor.getBoundingClientRect();
    els.colorPopover.hidden = false;
    requestAnimationFrame(() => {
      const b = els.colorPopover.getBoundingClientRect();
      const left = clamp(rect.left, 8, window.innerWidth - b.width - 8);
      const top = clamp(rect.bottom + 8, 8, window.innerHeight - b.height - 8);
      els.colorPopover.style.left = `${left}px`;
      els.colorPopover.style.top = `${top}px`;
    });
  }
  function hideColorPopover() { colorTargetTaskId = null; els.colorPopover.hidden = true; }
  async function useEyeDropper() {
    if (!colorTargetTaskId) return;
    if ('EyeDropper' in window) {
      try {
        const result = await new window.EyeDropper().open();
        setTaskColor(colorTargetTaskId, result.sRGBHex);
      } catch (_) {}
    } else {
      showToast('此瀏覽器不支援滴管工具，已開啟調色盤。');
      els.paletteInput.click();
    }
  }
  function setTaskColor(id, color) {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
    commit(() => {
      const t = state.tasks.find(x => x.id === id);
      if (t) t.color = color.toUpperCase();
    }, '修改任務顏色');
    hideColorPopover();
  }


  function updateSettingsFromPanel() {
    commit(() => {
      const oldScale = state.settings.timelineScale;
      state.settings.timelineScale = els.timelineScaleSelect.value;
      if (state.settings.timelineScale !== oldScale) state.settings.ganttDayWidth = defaultDayWidth(state.settings.timelineScale);
      state.settings.rowLabelMode = els.rowLabelModeSelect.value;
      state.settings.showWeekends = els.showWeekendsSelect.value === 'true';
      if (els.ownerDisplaySelect) state.settings.ownerDisplay = els.ownerDisplaySelect.value;
      if (els.showGanttBarLabelSelect) state.settings.showGanttBarLabel = els.showGanttBarLabelSelect.value === 'true';
    }, '修改甘特圖設定');
  }

  function openImport() {
    els.importModal.hidden = false;
    importChoicePending = false;
    els.importChoice.hidden = true;
    els.confirmImportBtn.hidden = false;
    els.mappingBox.hidden = true;
    els.importErrors.hidden = true;
  }
  function openExport() {
    if (!state.tasks.length) return showToast('沒有可匯出的任務。');
    els.pngOptions.hidden = true;
    els.exportModal.hidden = false;
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  function setImportTab(tab) {
    activeImportTab = tab;
    $$('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.importTab === tab));
    $$('[data-import-panel]').forEach(panel => { panel.hidden = panel.dataset.importPanel !== tab; });
    els.mappingBox.hidden = true;
    els.importErrors.hidden = true;
    els.importChoice.hidden = true;
    els.confirmImportBtn.hidden = false;
    els.parseImportBtn.textContent = tab === 'json' ? '還原 JSON' : '解析資料';
  }
  async function parseImportSource() {
    importMode = state.tasks.length ? 'append' : 'replace';
    importChoicePending = false;
    els.importChoice.hidden = true;
    els.confirmImportBtn.hidden = false;
    await continueParseImportSource();
  }
  async function continueParseImportSource() {
    try {
      let parsed;
      if (activeImportTab === 'paste') parsed = parseTableText(els.pasteInput.value);
      if (activeImportTab === 'csv') parsed = parseCsv(await readFileText(els.csvFileInput.files?.[0]));
      if (activeImportTab === 'json') {
        parsed = parseJsonImport(els.jsonTextInput.value || await readFileText(els.jsonFileInput.files?.[0]));
        restoreJsonState(parsed.state);
        return;
      }
      if (activeImportTab === 'xlsx') parsed = await parseXlsxImport(els.xlsxFileInput.files?.[0]);
      if (!parsed || !parsed.rows.length) throw new Error('沒有可解析的資料列。');
      pendingImport = parsed;
      renderMapping(parsed);
      showImportErrors([]);
    } catch (err) {
      pendingImport = null;
      els.mappingBox.hidden = true;
      showImportErrors([err.message || String(err)]);
    }
  }
  function readFileText(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('請先選擇檔案。'));
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('讀取檔案失敗。'));
      reader.readAsText(file, 'utf-8');
    });
  }
  function parseTableText(text) {
    const rawLines = String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!rawLines.length) throw new Error('請貼上包含第一列欄位名稱的表格資料。');
    let rows;
    if (rawLines.some(l => l.includes('|'))) {
      rows = rawLines
        .filter(l => !/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(l))
        .map(l => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()));
    } else if (rawLines.some(l => l.includes('\t'))) {
      rows = rawLines.map(l => l.split('\t').map(c => c.trim()));
    } else {
      rows = rawLines.map(l => l.split(/\s{2,}/).map(c => c.trim()));
      if ((rows[0] || []).length < 2) rows = parseCsv(String(text || ''), true).aoa;
    }
    rows = rows.filter(r => r.some(c => c !== ''));
    if (rows.length < 2) throw new Error('表格至少需要欄位列與一筆資料列。');
    return aoaToImportRows(rows);
  }
  function parseCsv(text, returnAoa = false) {
    const input = String(text || '').replace(/^\uFEFF/, '').trim();
    if (!input) throw new Error('CSV 內容為空。');
    const rows = [];
    let row = [], cell = '', quote = false;
    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if (quote) {
        if (ch === '"' && input[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') quote = false;
        else cell += ch;
      } else {
        if (ch === '"') quote = true;
        else if (ch === ',') { row.push(cell.trim()); cell = ''; }
        else if (ch === '\n') { row.push(cell.trim()); rows.push(row); row = []; cell = ''; }
        else if (ch !== '\r') cell += ch;
      }
    }
    row.push(cell.trim()); rows.push(row);
    const aoa = rows.filter(r => r.some(c => String(c || '').trim() !== ''));
    if (returnAoa) return { aoa };
    return aoaToImportRows(aoa);
  }
  function aoaToImportRows(aoa, opts = {}) {
    const cleaned = (aoa || [])
      .map(r => (r || []).map(c => String(c == null ? '' : c).replace(/^\uFEFF/, '').trim()))
      .filter(r => r.some(c => c !== ''));
    if (cleaned.length < 2) throw new Error('表格至少需要欄位列與一筆資料列。');
    let headerIndex = 0;
    let projectTitle = '';
    const nonEmpty = row => row.filter(c => String(c || '').trim() !== '');
    const first = cleaned[0] || [];
    const second = cleaned[1] || [];
    const firstNonEmpty = nonEmpty(first);
    const secondNonEmpty = nonEmpty(second);
    if (secondNonEmpty.length >= 2) {
      const firstScore = scoreHeaderRow(first);
      const secondScore = scoreHeaderRow(second);
      if (firstNonEmpty.length === 1 || secondScore > firstScore) {
        headerIndex = 1;
        projectTitle = firstNonEmpty[0] || opts.sheetName || '';
      }
    }
    const headers = (cleaned[headerIndex] || []).map((h, i) => String(h || `欄位${i + 1}`).trim());
    const rows = cleaned.slice(headerIndex + 1).map(cells => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = cells[i] == null ? '' : String(cells[i]).trim(); });
      return obj;
    });
    return { headers, rows, projectTitle, headerRowIndex: headerIndex };
  }
  function scoreHeaderRow(row) {
    const aliases = ['任務名稱','名稱','任務','task','name','開始日期','開始','startdate','start','起始日期','結束日期','結束','enddate','end','截止日期','負責人','owner','assignee','人員','顏色','color','colour','rowmode','模式','顯示模式'];
    return (row || []).reduce((sum, cell) => {
      const normalized = String(cell || '').trim().toLowerCase().replace(/[\s_\-]/g, '');
      return sum + (aliases.some(a => normalized === String(a).toLowerCase().replace(/[\s_\-]/g, '')) ? 1 : 0);
    }, 0);
  }
  function parseJsonImport(text) {
    const raw = String(text || '').replace(/^\uFEFF/, '').trim();
    if (!raw) throw new Error('JSON 內容為空。');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new Error('JSON 格式錯誤，無法還原。');
    }
    const exportedState = extractWebsiteJsonState(parsed);
    if (!exportedState) {
      throw new Error('JSON 匯入只支援本網站匯出的 JSON 檔，請使用「匯出 JSON」產生的檔案。');
    }
    const restored = sanitizeState(exportedState);
    if (!Array.isArray(restored.tasks)) {
      throw new Error('JSON 狀態資料不完整，無法還原。');
    }
    return { kind: 'full-state', state: restored };
  }
  function extractWebsiteJsonState(parsed) {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    if (parsed.app === APP_ID && parsed.format === 'full-state' && parsed.state && typeof parsed.state === 'object') {
      return parsed.state;
    }
    if (parsed.app === APP_ID && parsed.state && typeof parsed.state === 'object') {
      return parsed.state;
    }
    // 相容於本專案舊版匯出的 JSON：頂層包含 projectTitle / settings / tasks。
    if (typeof parsed.projectTitle === 'string' && parsed.settings && typeof parsed.settings === 'object' && Array.isArray(parsed.tasks)) {
      return { projectTitle: parsed.projectTitle, settings: parsed.settings, tasks: parsed.tasks };
    }
    return null;
  }
  function restoreJsonState(restoredState) {
    const before = snapshot();
    undoStack.push(before);
    if (undoStack.length > 120) undoStack.shift();
    redoStack = [];
    state = sanitizeState(restoredState);
    normalizeAllOrders();
    saveState();
    applyTableColumnWidths();
    renderAll();
    closeModal('importModal');
    showToast('已還原 JSON 完整狀態。');
  }
  async function parseXlsxImport(file) {
    if (!file) throw new Error('請先選擇 xlsx 檔案。');
    if (!window.XLSX?.readAsync) throw new Error('XLSX 離線函式庫未載入。');
    const wb = await window.XLSX.readAsync(await file.arrayBuffer());
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const aoa = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    return aoaToImportRows(aoa, { sheetName });
  }
  function renderMapping(parsed) {
    const headers = parsed.headers || [];
    const previewRows = parsed.rows || [];
    els.mappingGrid.classList.add('mapping-grid-import');
    els.mappingGrid.innerHTML = `
      <div class="mapping-head-row"><span>上傳欄位資料</span><span>對應到網頁欄位</span></div>
      ${headers.map(h => {
        const guessed = guessTargetField(h);
        const samples = previewRows.map(r => r[h]).filter(v => String(v || '').trim()).slice(0, 3).join('、');
        return `<div class="mapping-row">
          <div class="mapping-source">
            <div class="mapping-source-name" title="${escapeAttr(h)}">${escapeHtml(h)}</div>
            <span class="mapping-source-sample">${samples ? `範例：${escapeHtml(samples)}` : '無範例資料'}</span>
          </div>
          <select data-source-field="${escapeAttr(h)}">
            ${IMPORT_TARGETS.map(([value, label]) => `<option value="${escapeAttr(value)}" ${value === guessed ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('')}
          </select>
        </div>`;
      }).join('')}`;
    els.mappingBox.hidden = false;
    els.importChoice.hidden = true;
    els.confirmImportBtn.hidden = false;
  }
  function guessTargetField(header) {
    const aliases = {
      projectTitle: ['甘特圖大標題', '專案標題', '標題', 'projectTitle', 'title'],
      name: ['任務名稱', '名稱', '任務', 'task', 'name'],
      startDate: ['開始日期', '開始', 'startDate', 'start', '起始日期'],
      endDate: ['結束日期', '結束', 'endDate', 'end', '截止日期'],
      owner: ['負責人', 'owner', 'assignee', '人員'],
      color: ['顏色', '顏色(HEX 碼)', 'hex', 'color', 'colour'],
      rowMode: ['rowMode', '模式', '顯示模式']
    };
    const normalized = String(header || '').trim().toLowerCase().replace(/[\s_\-]/g, '');
    for (const [field, list] of Object.entries(aliases)) {
      if (list.some(alias => normalized === String(alias).toLowerCase().replace(/[\s_\-]/g, ''))) return field;
    }
    return '';
  }
  function confirmMappedImport() {
    if (!pendingImport) return showImportErrors(['請先解析資料。']);
    if (state.tasks.length && !importChoicePending) {
      importChoicePending = true;
      els.confirmImportBtn.hidden = true;
      els.importChoice.hidden = false;
      return;
    }
    performMappedImport();
  }
  function collectImportMapping() {
    const mapping = {};
    $$('[data-source-field]', els.mappingGrid).forEach(sel => {
      const target = sel.value;
      const source = sel.dataset.sourceField;
      if (target && source) mapping[target] = source;
    });
    return mapping;
  }
  function extractMappedProjectTitle(rows, mapping) {
    if (mapping.projectTitle) {
      const row = rows.find(r => String(r[mapping.projectTitle] || '').trim());
      if (row) return String(row[mapping.projectTitle] || '').trim();
    }
    return String(pendingImport?.projectTitle || '').trim();
  }
  function performMappedImport() {
    importChoicePending = false;
    els.importChoice.hidden = true;
    els.confirmImportBtn.hidden = false;
    const mapping = collectImportMapping();
    const { tasks, errors } = buildImportedTasks(pendingImport.rows, mapping);
    const importedTitle = extractMappedProjectTitle(pendingImport.rows, mapping);
    showImportErrors(errors);
    if (!tasks.length) return;
    commit(() => {
      if (importMode === 'replace') state.tasks = [];
      if (importedTitle && (importMode === 'replace' || mapping.projectTitle)) state.projectTitle = importedTitle;
      const base = state.tasks.length;
      tasks.forEach((t, i) => { t.id = makeId(); t.order = base + i + 1; state.tasks.push(t); });
    }, '匯入資料');
    closeModal('importModal');
    showToast(`已匯入 ${tasks.length} 筆有效資料。`);
  }
  function buildImportedTasks(rows, mapping) {
    const tasks = [], errors = [];
    rows.forEach((row, idx) => {
      const name = String(row[mapping.name] || '').trim();
      if (!name) { errors.push(`第 ${idx + 2} 列：任務名稱空白，未匯入。`); return; }
      const rawStart = mapping.startDate ? String(row[mapping.startDate] || '').trim() : '';
      const rawEnd = mapping.endDate ? String(row[mapping.endDate] || '').trim() : '';
      const startDate = rawStart ? normalizeDateInput(rawStart) : '';
      const endDate = rawEnd ? normalizeDateInput(rawEnd) : '';
      if (rawStart && !startDate) { errors.push(`第 ${idx + 2} 列：開始日期錯誤，未匯入。`); return; }
      if (rawEnd && !endDate) { errors.push(`第 ${idx + 2} 列：結束日期錯誤，未匯入。`); return; }
      if (startDate && endDate && compareDate(endDate, startDate) < 0) { errors.push(`第 ${idx + 2} 列：結束日期早於開始日期，未匯入。`); return; }
      let color = mapping.color ? String(row[mapping.color] || '').trim() : '';
      color = /^#[0-9a-f]{6}$/i.test(color) ? color.toUpperCase() : colorForIndex(state.tasks.length + tasks.length);
      const rowModeRaw = mapping.rowMode ? String(row[mapping.rowMode] || '').trim().toLowerCase() : 'new';
      const rowMode = ['continue', '接續', '接續上一列'].includes(rowModeRaw) ? 'continue' : 'new';
      tasks.push({ id: makeId(), order: 0, rowMode, name, startDate, endDate, color, owner: mapping.owner ? String(row[mapping.owner] || '').trim() : '' });
    });
    if (tasks[0] && tasks[0].rowMode === 'continue') tasks[0].rowMode = 'new';
    const combined = importMode === 'append' ? orderedTasks().concat(tasks) : tasks;
    const validation = validateTasks(combined);
    if (validation.errors.length) errors.push(...validation.errors.map(e => `匯入檢查：${e}`));
    return { tasks, errors };
  }
  function showImportErrors(errors) {
    if (!errors.length) { els.importErrors.hidden = true; els.importErrors.innerHTML = ''; return; }
    els.importErrors.hidden = false;
    els.importErrors.innerHTML = `<strong>匯入訊息</strong><ul>${errors.map(e => `<li>${escapeHtml(e)}</li>`).join('')}</ul>`;
  }

  function exportByType(type) {
    const validation = validateTasks(orderedTasks());
    if (validation.errors.length) {
      showToast('資料仍有錯誤，請先修正後再匯出。');
      renderGanttPreview();
      return;
    }
    const includeTitle = els.printTitleCheck.checked;
    const name = safeFileName(state.projectTitle);
    if (type === 'png') { els.pngOptions.hidden = false; return; }
    if (type === 'svg') exportSvg(`${name}.svg`, includeTitle);
    if (type === 'pdf') exportVectorPdf(`${name}.pdf`, includeTitle);
    if (type === 'csv') exportCsv(`${name}.csv`, includeTitle);
    if (type === 'json') exportJson(`${name}.json`, includeTitle);
    if (type === 'xlsx') exportXlsx(`${name}.xlsx`, includeTitle);
  }
  function exportPngWithResolution() {
    const resolution = clamp(Number(els.pngResolutionInput.value) || 250, 50, 800);
    exportPng(`${safeFileName(state.projectTitle)}.png`, els.printTitleCheck.checked, resolution / 100);
  }
  function exportRows(includeTitle) {
    const rows = orderedTasks().map(t => ({
      id: t.id, order: t.order, rowMode: t.rowMode, name: t.name,
      startDate: t.startDate, endDate: t.endDate, color: t.color, owner: t.owner
    }));
    if (!includeTitle) return rows;
    return [{ id: state.projectTitle, order: '', rowMode: '', name: '', startDate: '', endDate: '', color: '', owner: '' }].concat(rows);
  }
  function exportCsv(filename, includeTitle) {
    const headers = ['id','order','rowMode','name','startDate','endDate','color','owner'];
    const lines = [];
    if (includeTitle) lines.push([state.projectTitle].map(csvEscape).join(','));
    lines.push(headers.join(','));
    orderedTasks().forEach(t => lines.push(headers.map(h => csvEscape(t[h])).join(',')));
    downloadBlob(filename, new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  }
  function exportJson(filename, includeTitle) {
    const fullState = buildFullExportState();
    const payload = {
      app: APP_ID,
      schemaVersion: JSON_SCHEMA_VERSION,
      format: 'full-state',
      exportedAt: new Date().toISOString(),
      includeTitleRow: !!includeTitle,
      state: fullState,
      // 便利閱讀與舊版相容欄位。JSON 匯入會優先使用 state。
      projectTitle: fullState.projectTitle,
      settings: fullState.settings,
      tasks: fullState.tasks
    };
    if (includeTitle) payload.titleRow = state.projectTitle;
    downloadBlob(filename, new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }));
  }
  function buildFullExportState() {
    const exported = sanitizeState({
      projectTitle: state.projectTitle,
      settings: clone(state.settings || {}),
      tasks: clone(state.tasks || [])
    });
    exported.settings = Object.assign({}, clone(DEFAULT_STATE.settings), exported.settings || {});
    exported.settings.tableColumnWidths = Object.assign({}, TABLE_COL_DEFAULTS, exported.settings.tableColumnWidths || {});
    Object.keys(TABLE_COL_DEFAULTS).forEach(k => {
      exported.settings.tableColumnWidths[k] = FIXED_TABLE_COLS.has(k) ? 44 : exported.settings.tableColumnWidths[k];
    });
    return exported;
  }
  function exportXlsx(filename, includeTitle) {
    if (!window.XLSX) return showToast('XLSX 函式庫未載入。');
    const headers = ['id','order','rowMode','name','startDate','endDate','color','owner'];
    const aoa = [];
    if (includeTitle) aoa.push([state.projectTitle]);
    aoa.push(headers);
    orderedTasks().forEach(t => aoa.push(headers.map(h => t[h] ?? '')));
    const wb = window.XLSX.utils.book_new();
    const ws = window.XLSX.utils.aoa_to_sheet(aoa);
    window.XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    window.XLSX.writeFile(wb, filename);
  }
  function exportSvg(filename, includeTitle) {
    const model = buildGanttModel(orderedTasks(), { includeTitle });
    const svg = buildGanttSvg(model, { includeToday: false });
    downloadBlob(filename, new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  }
  function exportPng(filename, includeTitle, scale) {
    const model = buildGanttModel(orderedTasks(), { includeTitle });
    const svg = buildGanttSvg(model, { includeToday: false });
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(model.width * scale);
      canvas.height = Math.ceil(model.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob2 => downloadBlob(filename, blob2), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); showToast('PNG 匯出失敗。'); };
    img.src = url;
  }


  function buildGanttModel(tasks, opts = {}) {
    const range = computeDateRange(tasks);
    const scale = state.settings.timelineScale;
    const dayWidth = clamp(Number(state.settings.ganttDayWidth) || defaultDayWidth(scale), 1, 90);
    const labelW = state.settings.rowLabelMode === 'hidden' ? 42 : clamp(Number(state.settings.ganttLabelWidth) || 190, 42, 520);
    const ownerDisplay = state.settings.ownerDisplay || 'both';
    const showOwnerLeft = ownerDisplay === 'left' || ownerDisplay === 'both';
    const showOwnerBar = ownerDisplay === 'bar' || ownerDisplay === 'both';
    const ownerW = showOwnerLeft ? clamp(Number(state.settings.ganttOwnerWidth) || 110, 44, 360) : 0;
    const leftW = labelW + ownerW;
    const headerH = 62;
    const rowH = 44;
    const topPad = opts.includeTitle ? 46 : 0;
    const groups = groupTasks(tasks);
    const totalDays = Math.max(1, diffDays(range.start, range.end) + 1);
    const width = Math.max(leftW + totalDays * dayWidth + 32, 720);
    const height = topPad + headerH + groups.length * rowH + 26;
    const meta = { range, scale, dayWidth, labelW, ownerW, leftW, showOwnerLeft, showOwnerBar, headerH, rowH, topPad, groups, totalDays, width, height };
    return meta;
  }


  function buildGanttSvg(model, opts = {}) {
    const { range, scale, dayWidth, labelW, ownerW, leftW, showOwnerLeft, showOwnerBar, headerH, rowH, topPad, groups, width, height } = model;
    const clipId = 'clip-label-' + Math.random().toString(36).slice(2, 8);
    const ownerClipId = 'clip-owner-' + Math.random().toString(36).slice(2, 8);
    let out = `<svg class="gantt-svg" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-range-start="${range.start}">`;
    out += `<defs><clipPath id="${clipId}"><rect x="8" y="0" width="${Math.max(labelW - 18, 1)}" height="${height}"/></clipPath><clipPath id="${ownerClipId}"><rect x="${labelW + 8}" y="0" width="${Math.max(ownerW - 16, 1)}" height="${height}"/></clipPath></defs>`;
    out += `<rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"/>`;
    if (topPad) {
      out += `<text x="12" y="28" font-size="20" font-weight="700" fill="#202124">${escapeXml(state.projectTitle)}</text>`;
      out += `<line x1="0" y1="${topPad - 8}" x2="${width}" y2="${topPad - 8}" stroke="#e7e5e0"/>`;
    }
    const y0 = topPad;
    out += `<rect x="0" y="${y0}" width="${width}" height="${headerH}" fill="#fbfaf8"/>`;
    if (state.settings.showWeekends) out += renderWeekendShading(range, leftW, dayWidth, y0, height - y0);
    out += renderHeaders(range, scale, labelW, ownerW, leftW, dayWidth, y0, height);
    if (showOwnerLeft) out += `<line x1="${labelW}" y1="${y0}" x2="${labelW}" y2="${height}" stroke="#efede8"/>`;
    out += `<line x1="${leftW}" y1="${y0}" x2="${leftW}" y2="${height}" stroke="#d9d6ce" stroke-width="1.2"/>`;
    out += `<rect class="gantt-label-resize" data-resize="label" x="${labelW - 4}" y="${y0}" width="8" height="${height - y0}" fill="transparent"/>`;
    if (showOwnerLeft) out += `<rect class="gantt-owner-resize" data-resize="owner" x="${leftW - 4}" y="${y0}" width="8" height="${height - y0}" fill="transparent"/>`;
    groups.forEach((group, row) => {
      const y = y0 + headerH + row * rowH;
      out += `<line x1="0" y1="${y + rowH}" x2="${width}" y2="${y + rowH}" stroke="#efede8"/>`;
      const firstId = group[0]?.id || '';
      if (state.settings.rowLabelMode === 'combined') {
        out += `<text class="gantt-row-label" data-edit-task-id="${escapeAttr(firstId)}" x="12" y="${y + 27}" font-size="12" fill="#374151" clip-path="url(#${clipId})">${escapeXml(group.map(t => t.name).join(' / '))}</text>`;
      }
      if (showOwnerLeft) {
        const owners = uniqueGroupOwners(group).join(' / ');
        out += `<text class="gantt-owner-label" x="${labelW + 8}" y="${y + 27}" font-size="12" fill="#6b7280" clip-path="url(#${ownerClipId})">${escapeXml(owners)}</text>`;
      }
      group.forEach(task => {
        const eff = effectiveDates(task, orderedTasks());
        const x = leftW + diffDays(range.start, eff.start) * dayWidth;
        const w = Math.max(dayWidth * (diffDays(eff.start, eff.end) + 1), 10);
        const by = y + 10;
        const ownerText = showOwnerBar && task.owner ? task.owner : '';
        const ownerNeed = ownerText ? Math.max(28, ownerText.length * 7 + 12) : 0;
        const showOwner = ownerText && w >= Math.max(70, task.name.length * 7 + ownerNeed + 24);
        const textClip = 'clip-text-' + task.id.replace(/[^a-z0-9_-]/gi, '');
        const textClipWidth = Math.max(w - 14 - (showOwner ? ownerNeed + 8 : 0), 1);
        out += `<defs><clipPath id="${textClip}"><rect x="${x + 7}" y="${by}" width="${textClipWidth}" height="22"/></clipPath></defs>`;
        out += `<g class="gantt-task" data-task-id="${escapeAttr(task.id)}" data-row="${row}">`;
        out += `<rect class="bar-rect" x="${x}" y="${by}" width="${w}" height="22" rx="6" fill="${escapeXml(task.color)}"/>`;
        out += `<rect class="bar-resize" data-resize="start" x="${x - 3}" y="${by}" width="8" height="22" fill="transparent"/>`;
        out += `<rect class="bar-resize" data-resize="end" x="${x + w - 5}" y="${by}" width="8" height="22" fill="transparent"/>`;
        if (state.settings.showGanttBarLabel !== false) {
          out += `<text class="bar-text" data-edit-task-id="${escapeAttr(task.id)}" x="${x + 8}" y="${by + 15}" font-size="12" fill="#ffffff" font-weight="600" clip-path="url(#${textClip})">${escapeXml(task.name)}</text>`;
          if (showOwner) out += `<text class="bar-owner-text" x="${x + w - 8}" y="${by + 15}" font-size="11" fill="#ffffff" text-anchor="end" opacity=".92">${escapeXml(ownerText)}</text>`;
        }
        out += `</g>`;
      });
    });
    if (opts.includeToday) {
      const today = formatDate(new Date());
      if (compareDate(today, range.start) >= 0 && compareDate(today, range.end) <= 0) {
        const x = leftW + diffDays(range.start, today) * dayWidth + dayWidth / 2;
        out += `<line class="today-line" x1="${x}" y1="${y0}" x2="${x}" y2="${height}" stroke="#111827" stroke-width="1.5" stroke-dasharray="4 4"/>`;
        out += `<text x="${x + 6}" y="${y0 + 16}" font-size="11" fill="#111827">今天</text>`;
      }
    }
    out += `</svg>`;
    return out;
  }


  function renderHeaders(range, scale, labelW, ownerW, leftW, dayWidth, y0, height) {
    let out = '';
    const totalDays = diffDays(range.start, range.end) + 1;
    const d0 = parseDate(range.start), d1 = parseDate(range.end);
    const labelGate = (slotPx, minPx) => slotPx >= minPx;
    out += `<text x="12" y="${y0 + 38}" font-size="12" font-weight="700" fill="#374151">${state.settings.rowLabelMode === 'combined' ? '甘特列' : ''}</text>`;
    if (ownerW > 0) out += `<text x="${labelW + 8}" y="${y0 + 38}" font-size="12" font-weight="700" fill="#6b7280">負責人</text>`;

    if (scale === 'day') {
      const dayLabelStep = Math.max(1, Math.ceil(18 / Math.max(dayWidth, 1)));
      const monthMarkers = [];
      let monthStart = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate());
      let currentMonth = formatDate(monthStart).slice(0, 7);
      let idx = 0;
      for (let d = new Date(d0); d <= d1; d.setDate(d.getDate() + 1), idx++) {
        const ds = formatDate(d), x = leftW + diffDays(range.start, ds) * dayWidth;
        const ym = ds.slice(0, 7);
        if (ym !== currentMonth) {
          monthMarkers.push({ label: currentMonth.replace('-', '/'), start: formatDate(monthStart), end: addDaysStr(ds, -1) });
          monthStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          currentMonth = ym;
        }
        const showDay = idx % dayLabelStep === 0;
        if (showDay) {
          out += `<line x1="${x}" y1="${y0 + 32}" x2="${x}" y2="${height}" stroke="#f0eee9"/>`;
          out += `<text x="${x + Math.max(2, Math.min(8, dayWidth / 4))}" y="${y0 + 52}" font-size="11" fill="#6b7280">${d.getDate()}</text>`;
        }
      }
      monthMarkers.push({ label: currentMonth.replace('-', '/'), start: formatDate(monthStart), end: range.end });
      monthMarkers.forEach(m => {
        const x = leftW + diffDays(range.start, m.start) * dayWidth;
        const span = (diffDays(m.start, m.end) + 1) * dayWidth;
        if (labelGate(span, 52)) {
          out += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + 32}" stroke="#ece9e3"/>`;
          out += `<text x="${x + 6}" y="${y0 + 18}" font-size="12" font-weight="700" fill="#374151">${m.label}</text>`;
        }
      });
    } else if (scale === 'week') {
      const weeks = [];
      for (let d = new Date(d0), idx = 0; d <= d1; d.setDate(d.getDate() + 7), idx++) {
        const ds = formatDate(d);
        weeks.push({ idx, ds, x: leftW + diffDays(range.start, ds) * dayWidth, label: `週 ${formatMonthDay(d)}` });
      }
      const step = Math.max(1, Math.ceil(62 / Math.max(dayWidth * 7, 1)));
      weeks.forEach(w => {
        if (w.idx % step !== 0) return;
        out += `<line x1="${w.x}" y1="${y0}" x2="${w.x}" y2="${height}" stroke="#ece9e3"/>`;
        out += `<text x="${w.x + 6}" y="${y0 + 28}" font-size="12" font-weight="600" fill="#374151">${w.label}</text>`;
      });
    } else {
      const months = [];
      let cursor = new Date(d0.getFullYear(), d0.getMonth(), 1);
      while (cursor <= d1) {
        const ds = formatDate(cursor);
        const monthEnd = formatDate(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0));
        const visibleStart = compareDate(ds, range.start) < 0 ? range.start : ds;
        const visibleEnd = compareDate(monthEnd, range.end) > 0 ? range.end : monthEnd;
        months.push({ ds, visibleStart, visibleEnd, x: leftW + diffDays(range.start, ds) * dayWidth, label: `${cursor.getFullYear()}/${pad2(cursor.getMonth() + 1)}` });
        cursor.setMonth(cursor.getMonth() + 1);
      }
      months.forEach(m => {
        const span = Math.max(1, diffDays(m.visibleStart, m.visibleEnd) + 1) * dayWidth;
        if (!labelGate(span, 56)) return;
        out += `<line x1="${m.x}" y1="${y0}" x2="${m.x}" y2="${height}" stroke="#ece9e3"/>`;
        out += `<text x="${m.x + 6}" y="${y0 + 32}" font-size="12" font-weight="700" fill="#374151">${m.label}</text>`;
      });
    }

    for (let i = 1; i <= totalDays; i++) {
      const x = leftW + i * dayWidth;
      out += `<rect class="gantt-date-resize" data-resize="date" x="${x - 4}" y="${y0}" width="8" height="${Math.min(62, height - y0)}" fill="transparent"/>`;
    }
    return out;
  }


  function renderWeekendShading(range, leftW, dayWidth, y, h) {
    let out = '';
    const d0 = parseDate(range.start), d1 = parseDate(range.end);
    for (let d = new Date(d0); d <= d1; d.setDate(d.getDate() + 1)) {
      const dow = d.getDay();
      if (dow === 0 || dow === 6) {
        const x = leftW + diffDays(range.start, formatDate(d)) * dayWidth;
        out += `<rect x="${x}" y="${y}" width="${dayWidth}" height="${h}" fill="#f8fafc"/>`;
      }
    }
    return out;
  }

  function handleGanttPointerDown(e) {
    const svg = e.target.closest('svg');
    if (!svg) return;
    const labelResize = e.target.closest('[data-resize="label"]');
    const ownerResize = e.target.closest('[data-resize="owner"]');
    const dateResize = e.target.closest('[data-resize="date"]');
    const barResize = e.target.closest('.bar-resize');
    const taskG = e.target.closest('.gantt-task');
    if (labelResize) {
      ganttPointer = { type: 'label', beforeSnapshot: snapshot(), startX: e.clientX, startWidth: state.settings.ganttLabelWidth };
    } else if (ownerResize) {
      ganttPointer = { type: 'owner', beforeSnapshot: snapshot(), startX: e.clientX, startWidth: state.settings.ganttOwnerWidth };
    } else if (dateResize) {
      ganttPointer = { type: 'date', beforeSnapshot: snapshot(), startX: e.clientX, startWidth: state.settings.ganttDayWidth };
    } else if (barResize && taskG) {
      const task = state.tasks.find(t => t.id === taskG.dataset.taskId);
      if (!task) return;
      const eff = effectiveDates(task, orderedTasks());
      const rect = $('.bar-rect', taskG);
      const text = $('.bar-text', taskG);
      const startHandle = $('[data-resize="start"]', taskG);
      const endHandle = $('[data-resize="end"]', taskG);
      ganttPointer = {
        type: barResize.dataset.resize, taskId: task.id, startX: e.clientX, startY: e.clientY,
        startStart: eff.start, startEnd: eff.end, didMove: false, taskEl: taskG,
        rect, text, startHandle, endHandle,
        barX: Number(rect?.getAttribute('x')) || 0,
        barW: Number(rect?.getAttribute('width')) || 0
      };
    } else if (taskG) {
      const task = state.tasks.find(t => t.id === taskG.dataset.taskId);
      if (!task) return;
      const eff = effectiveDates(task, orderedTasks());
      ganttPointer = { type: 'move', taskId: task.id, startX: e.clientX, startY: e.clientY, startStart: eff.start, startEnd: eff.end, didMove: false, taskEl: taskG };
      taskG.classList.add('drag-preview');
    } else return;
    e.preventDefault();
    svg.setPointerCapture?.(e.pointerId);
    window.addEventListener('pointermove', handleGanttPointerMove);
    window.addEventListener('pointerup', handleGanttPointerUp, { once: true });
  }
  function handleGanttPointerMove(e) {
    if (!ganttPointer) return;
    const dx = e.clientX - ganttPointer.startX;
    const dy = e.clientY - (ganttPointer.startY || e.clientY);
    if (ganttPointer.type === 'label') {
      state.settings.ganttLabelWidth = clamp(ganttPointer.startWidth + dx, 42, 520);
      renderGanttPreview({ skipValidation: true });
      return;
    }
    if (ganttPointer.type === 'owner') {
      state.settings.ganttOwnerWidth = clamp(ganttPointer.startWidth + dx, 44, 360);
      renderGanttPreview({ skipValidation: true });
      return;
    }
    if (ganttPointer.type === 'date') {
      state.settings.ganttDayWidth = clamp(ganttPointer.startWidth + dx, 1, 90);
      renderGanttPreview({ skipValidation: true });
      return;
    }
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) ganttPointer.didMove = true;
    if (ganttPointer.type === 'move') {
      if (ganttPointer.taskEl) ganttPointer.taskEl.setAttribute('transform', `translate(${dx},${dy})`);
      drawGanttDropMarker(e.clientY, e.clientX, Math.abs(dy) >= 10);
      return;
    }
    const dayWidth = Number(els.ganttHost.dataset.dayWidth) || state.settings.ganttDayWidth || 24;
    const deltaPx = Math.round(dx / dayWidth) * dayWidth;
    const minW = Math.max(dayWidth, 6);
    if (ganttPointer.type === 'start' && ganttPointer.rect) {
      const nextX = Math.min(ganttPointer.barX + ganttPointer.barW - minW, ganttPointer.barX + deltaPx);
      const nextW = Math.max(minW, ganttPointer.barW + ganttPointer.barX - nextX);
      ganttPointer.rect.setAttribute('x', nextX);
      ganttPointer.rect.setAttribute('width', nextW);
      ganttPointer.startHandle?.setAttribute('x', nextX - 3);
      ganttPointer.endHandle?.setAttribute('x', nextX + nextW - 5);
      ganttPointer.text?.setAttribute('x', nextX + 8);
    }
    if (ganttPointer.type === 'end' && ganttPointer.rect) {
      const nextW = Math.max(minW, ganttPointer.barW + deltaPx);
      ganttPointer.rect.setAttribute('width', nextW);
      ganttPointer.endHandle?.setAttribute('x', ganttPointer.barX + nextW - 5);
    }
  }
  function handleGanttPointerUp(e) {
    if (!ganttPointer) return;
    const ptr = ganttPointer;
    ganttPointer = null;
    window.removeEventListener('pointermove', handleGanttPointerMove);
    clearGanttDropMarker();
    ptr.taskEl?.classList.remove('drag-preview');
    ptr.taskEl?.removeAttribute('transform');
    if (ptr.type === 'label' || ptr.type === 'owner' || ptr.type === 'date') {
      undoStack.push(ptr.beforeSnapshot);
      if (undoStack.length > 120) undoStack.shift();
      redoStack = [];
      saveState();
      renderAll();
      return;
    }
    const dayWidth = Number(els.ganttHost.dataset.dayWidth) || state.settings.ganttDayWidth || 24;
    const dx = e.clientX - ptr.startX;
    const dy = e.clientY - (ptr.startY || e.clientY);
    const delta = Math.round(dx / dayWidth);
    if (ptr.type === 'move') {
      if (!delta && Math.abs(dy) < 10) { renderGanttPreview(); return; }
      const before = snapshot();
      commit(() => {
        const task = state.tasks.find(t => t.id === ptr.taskId);
        if (task && delta) {
          task.startDate = addDaysStr(ptr.startStart, delta);
          task.endDate = addDaysStr(ptr.startEnd, delta);
        }
        if (Math.abs(dy) >= 10) applyChartDrop(ptr.taskId, e.clientY, e.clientX);
      }, '調整甘特圖任務');
      rollbackIfInvalid(before);
    }
    if (ptr.type === 'start' || ptr.type === 'end') {
      if (!delta) { renderGanttPreview(); return; }
      const before = snapshot();
      commit(() => {
        const task = state.tasks.find(t => t.id === ptr.taskId);
        if (!task) return;
        if (ptr.type === 'start') {
          const next = addDaysStr(ptr.startStart, delta);
          task.startDate = compareDate(next, ptr.startEnd) <= 0 ? next : ptr.startEnd;
          task.endDate = ptr.startEnd;
        } else {
          const next = addDaysStr(ptr.startEnd, delta);
          task.startDate = ptr.startStart;
          task.endDate = compareDate(next, ptr.startStart) >= 0 ? next : ptr.startStart;
        }
      }, ptr.type === 'start' ? '調整開始日期' : '調整結束日期');
      rollbackIfInvalid(before);
    }
  }
  function drawGanttDropMarker(clientY, clientX, active) {
    const svg = $('svg', els.ganttHost);
    if (!svg) return;
    clearGanttDropMarker();
    if (!active) return;
    const rect = svg.getBoundingClientRect();
    const rowH = Number(els.ganttHost.dataset.rowHeight) || 44;
    const headerH = Number(els.ganttHost.dataset.headerHeight) || 62;
    const labelW = Number(els.ganttHost.dataset.labelWidth) || state.settings.ganttLabelWidth || 190;
    const leftW = Number(els.ganttHost.dataset.leftWidth) || labelW;
    const localY = clientY - rect.top;
    const rowCount = Math.max(1, groupTasks(orderedTasks()).length);
    const row = clamp(Math.floor((localY - headerH) / rowH), 0, rowCount - 1);
    const yInRow = localY - headerH - row * rowH;
    const lineZone = 8;
    const width = Number(svg.getAttribute('width')) || rect.width;
    let node;
    if (yInRow <= lineZone || yInRow >= rowH - lineZone) {
      const y = headerH + row * rowH + (yInRow >= rowH - lineZone ? rowH : 0);
      node = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      node.setAttribute('x1', '0'); node.setAttribute('x2', String(width));
      node.setAttribute('y1', String(y)); node.setAttribute('y2', String(y));
      node.setAttribute('stroke', '#111827'); node.setAttribute('stroke-width', '2'); node.setAttribute('stroke-dasharray', '4 3');
    } else {
      node = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      node.setAttribute('x', String(leftW)); node.setAttribute('y', String(headerH + row * rowH + 5));
      node.setAttribute('width', String(Math.max(1, width - leftW))); node.setAttribute('height', String(rowH - 10));
      node.setAttribute('fill', 'rgba(17, 24, 39, .06)'); node.setAttribute('stroke', '#111827'); node.setAttribute('stroke-dasharray', '4 3'); node.setAttribute('rx', '8');
    }
    node.setAttribute('id', 'ganttDropMarker');
    node.setAttribute('class', 'gantt-drop-marker');
    svg.appendChild(node);
  }
  function clearGanttDropMarker() {
    const marker = $('#ganttDropMarker', els.ganttHost);
    if (marker) marker.remove();
  }
  function applyChartDrop(taskId, clientY, clientX) {
    const svg = $('svg', els.ganttHost);
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const rowH = Number(els.ganttHost.dataset.rowHeight) || 44;
    const headerH = Number(els.ganttHost.dataset.headerHeight) || 62;
    const labelW = Number(els.ganttHost.dataset.labelWidth) || state.settings.ganttLabelWidth || 190;
    const leftW = Number(els.ganttHost.dataset.leftWidth) || labelW;
    const dayWidth = Number(els.ganttHost.dataset.dayWidth) || state.settings.ganttDayWidth || 24;
    const rangeStart = svg.dataset.rangeStart || computeDateRange(orderedTasks()).start;
    const visual = orderedTasks();
    const visualGroups = groupTasks(visual);
    if (!visualGroups.length) return;
    const localY = clientY - rect.top;
    const localX = clientX - rect.left;
    const targetRow = clamp(Math.floor((localY - headerH) / rowH), 0, visualGroups.length - 1);
    const yInRow = localY - headerH - targetRow * rowH;
    const lineZone = 8;
    const targetGroupIds = visualGroups[targetRow].map(t => t.id).filter(id => id !== taskId);
    const sourceGroup = visualGroups.find(g => g.some(t => t.id === taskId));
    const list = visual.map(t => t.id).filter(id => id !== taskId);
    const movedTask = state.tasks.find(t => t.id === taskId);
    if (!movedTask) return;
    if (sourceGroup?.[0]?.id === taskId && sourceGroup[1]) {
      const nextAnchor = state.tasks.find(t => t.id === sourceGroup[1].id);
      if (nextAnchor) nextAnchor.rowMode = 'new';
    }
    const indexOfFirst = ids => ids.length ? list.indexOf(ids[0]) : -1;
    const indexAfterLast = ids => ids.length ? list.indexOf(ids[ids.length - 1]) + 1 : list.length;
    let insertIndex = list.length;
    if (!targetGroupIds.length || yInRow <= lineZone) {
      const idx = indexOfFirst(targetGroupIds);
      insertIndex = idx >= 0 ? idx : 0;
      movedTask.rowMode = 'new';
    } else if (yInRow >= rowH - lineZone) {
      insertIndex = indexAfterLast(targetGroupIds);
      movedTask.rowMode = 'new';
    } else {
      const cursorDate = addDaysStr(rangeStart, Math.max(0, Math.round((localX - leftW) / dayWidth)));
      insertIndex = indexAfterLast(targetGroupIds);
      for (const id of targetGroupIds) {
        const t = state.tasks.find(x => x.id === id);
        if (!t) continue;
        const eff = effectiveDates(t, visual);
        const centerOffset = diffDays(rangeStart, eff.start) + (diffDays(eff.start, eff.end) + 1) / 2;
        const centerDate = addDaysStr(rangeStart, Math.round(centerOffset));
        if (compareDate(cursorDate, centerDate) <= 0) { insertIndex = list.indexOf(id); break; }
      }
      const firstIdx = indexOfFirst(targetGroupIds);
      if (insertIndex <= firstIdx) {
        movedTask.rowMode = 'new';
        const oldFirst = state.tasks.find(t => t.id === targetGroupIds[0]);
        if (oldFirst) oldFirst.rowMode = 'continue';
      } else {
        movedTask.rowMode = 'continue';
      }
    }
    list.splice(clamp(insertIndex, 0, list.length), 0, taskId);
    state.settings.sortMode = 'manual';
    list.forEach((id, i) => {
      const t = state.tasks.find(x => x.id === id);
      if (t) t.order = i + 1;
    });
    const first = state.tasks.find(t => t.id === list[0]);
    if (first) first.rowMode = 'new';
  }

  function rollbackIfInvalid(before) {
    const validation = validateTasks(orderedTasks());
    if (!validation.errors.length) return;
    state = sanitizeState(JSON.parse(before));
    undoStack.pop();
    saveState();
    renderAll();
    showToast('調整後造成資料錯誤或同列日期重疊，已取消。');
  }
  function handleGanttDblClick(e) {
    const target = e.target.closest('[data-edit-task-id]');
    if (!target) return;
    const id = target.dataset.editTaskId;
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    openInlineGanttEditor(target, task);
  }
  function openInlineGanttEditor(svgText, task) {
    closeInlineGanttEditor();
    const viewportRect = els.ganttViewport.getBoundingClientRect();
    const bbox = svgText.getBoundingClientRect();
    const input = document.createElement('input');
    input.className = 'gantt-edit-input';
    input.value = task.name;
    input.dataset.taskId = task.id;
    input.style.left = `${bbox.left - viewportRect.left + els.ganttViewport.scrollLeft}px`;
    input.style.top = `${bbox.top - viewportRect.top + els.ganttViewport.scrollTop - 5}px`;
    input.style.width = `${Math.max(150, bbox.width + 30)}px`;
    els.ganttViewport.appendChild(input);
    input.focus();
    input.select();
    const save = () => {
      const val = input.value.trim();
      input.remove();
      if (val && val !== task.name) updateTaskField(task.id, 'name', val);
    };
    input.addEventListener('blur', save, { once: true });
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); }
      if (ev.key === 'Escape') { ev.preventDefault(); input.remove(); }
    });
  }
  function closeInlineGanttEditor() { $$('.gantt-edit-input', els.ganttViewport).forEach(el => el.remove()); }

  function computeDateRange(tasks) {
    const bounds = rawDateBounds(tasks);
    let min = bounds.min || formatDate(new Date());
    let max = bounds.max || min;
    tasks.forEach(t => {
      const eff = effectiveDates(t, tasks);
      if (compareDate(eff.start, min) < 0) min = eff.start;
      if (compareDate(eff.end, max) > 0) max = eff.end;
    });
    if (state.settings.timelineScale === 'week') {
      min = formatDate(startOfWeek(parseDate(min)));
      max = formatDate(endOfWeek(parseDate(max)));
    }
    if (state.settings.timelineScale === 'month') {
      const a = parseDate(min), b = parseDate(max);
      min = formatDate(new Date(a.getFullYear(), a.getMonth(), 1));
      max = formatDate(new Date(b.getFullYear(), b.getMonth() + 1, 0));
    }
    return { start: min, end: max };
  }
  function rawDateBounds(tasks) {
    const vals = [];
    tasks.forEach(t => { if (DATE_RE.test(t.startDate)) vals.push(t.startDate); if (DATE_RE.test(t.endDate)) vals.push(t.endDate); });
    if (!vals.length) return { min: formatDate(new Date()), max: formatDate(new Date()) };
    return { min: vals.reduce((a, b) => compareDate(a, b) <= 0 ? a : b), max: vals.reduce((a, b) => compareDate(a, b) >= 0 ? a : b) };
  }
  function effectiveDates(task, allTasks) {
    const b = rawDateBounds(allTasks || state.tasks);
    let start = DATE_RE.test(task.startDate) ? task.startDate : b.min;
    let end = DATE_RE.test(task.endDate) ? task.endDate : b.max;
    if (!start) start = formatDate(new Date());
    if (!end) end = start;
    return { start, end };
  }
  function compareEffectiveDate(a, b, field) {
    const ea = effectiveDates(a, state.tasks), eb = effectiveDates(b, state.tasks);
    return compareDate(field === 'start' ? ea.start : ea.end, field === 'start' ? eb.start : eb.end);
  }
  function groupTasks(tasks) {
    const groups = [];
    let current = null;
    tasks.forEach((task, idx) => {
      if (idx === 0 || task.rowMode === 'new' || !current) { current = []; groups.push(current); }
      current.push(task);
    });
    return groups;
  }
  function validateTasks(tasks) {
    const errors = [], taskIds = new Set();
    tasks.forEach((t, i) => {
      const label = t.name?.trim() ? `任務「${t.name.trim()}」` : '未命名任務';
      if (!t.name.trim()) { errors.push('任務名稱不可空白。'); taskIds.add(t.id); }
      if (t.startDate && !DATE_RE.test(t.startDate)) { errors.push(`${label}開始日期格式錯誤。`); taskIds.add(t.id); }
      if (t.endDate && !DATE_RE.test(t.endDate)) { errors.push(`${label}結束日期格式錯誤。`); taskIds.add(t.id); }
      const eff = effectiveDates(t, tasks);
      if (compareDate(eff.end, eff.start) < 0) { errors.push(`${label}結束日期早於開始日期。`); taskIds.add(t.id); }
      if (i === 0 && t.rowMode === 'continue') { errors.push('第一筆任務不可為接續上一列。'); taskIds.add(t.id); }
    });
    const groups = groupTasks(tasks);
    groups.forEach(group => {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          if (isOverlap(group[i], group[j], tasks)) {
            errors.push(`甘特列日期重疊：${group[i].name} / ${group[j].name}`);
            taskIds.add(group[i].id); taskIds.add(group[j].id);
          }
        }
      }
    });
    return { errors, taskIds, groups, range: computeDateRange(tasks) };
  }
  function isOverlap(a, b, allTasks) {
    const ea = effectiveDates(a, allTasks), eb = effectiveDates(b, allTasks);
    return compareDate(ea.start, eb.end) <= 0 && compareDate(eb.start, ea.end) <= 0;
  }

  function exportVectorPdf(filename, includeTitle) {
    const model = buildGanttModel(orderedTasks(), { includeTitle });
    const pdf = createVectorPdf(model);
    downloadBlob(filename, new Blob([pdf], { type: 'application/pdf' }));
  }

  function createVectorPdf(model) {
    const { range, dayWidth, labelW, ownerW, leftW, showOwnerLeft, showOwnerBar, headerH, rowH, topPad, groups, width, height } = model;
    const cmds = [];
    const pageH = height;
    const yPdf = y => pageH - y;
    const line = (x1,y1,x2,y2,color='#e7e5e0',sw=1) => cmds.push(`${rgbStroke(color)} ${sw} w ${num(x1)} ${num(yPdf(y1))} m ${num(x2)} ${num(yPdf(y2))} l S`);
    const rect = (x,y,w,h,fill,stroke) => {
      if (fill) cmds.push(`${rgbFill(fill)} ${num(x)} ${num(yPdf(y + h))} ${num(w)} ${num(h)} re f`);
      if (stroke) cmds.push(`${rgbStroke(stroke)} ${num(x)} ${num(yPdf(y + h))} ${num(w)} ${num(h)} re S`);
    };
    const text = (s,x,y,size=10,color='#202124') => cmds.push(`${rgbFill(color)} BT /F1 ${num(size)} Tf 1 0 0 1 ${num(x)} ${num(yPdf(y))} Tm <${utf16beHex(s)}> Tj ET`);
    rect(0, 0, width, height, '#ffffff');
    if (model.topPad) { text(state.projectTitle, 12, 26, 18, '#202124'); line(0, topPad - 8, width, topPad - 8); }
    const y0 = topPad;
    rect(0, y0, width, headerH, '#fbfaf8');
    if (state.settings.showWeekends) {
      const d0 = parseDate(range.start), d1 = parseDate(range.end);
      for (let d = new Date(d0); d <= d1; d.setDate(d.getDate() + 1)) {
        const dow = d.getDay();
        if (dow === 0 || dow === 6) rect(leftW + diffDays(range.start, formatDate(d)) * dayWidth, y0, dayWidth, height - y0, '#f8fafc');
      }
    }
    if (showOwnerLeft) line(labelW, y0, labelW, height, '#efede8');
    line(leftW, y0, leftW, height, '#d9d6ce', 1.2);
    text(state.settings.rowLabelMode === 'combined' ? '甘特列' : '', 12, y0 + 38, 11, '#374151');
    if (showOwnerLeft) text('負責人', labelW + 8, y0 + 38, 11, '#6b7280');
    const d0 = parseDate(range.start), d1 = parseDate(range.end);
    const labelGate = (slotPx, minPx) => slotPx >= minPx;
    if (state.settings.timelineScale === 'day') {
      const step = Math.max(1, Math.ceil(18 / Math.max(dayWidth, 1)));
      let idx = 0;
      for (let d = new Date(d0); d <= d1; d.setDate(d.getDate() + 1), idx++) {
        if (idx % step !== 0) continue;
        const ds = formatDate(d), x = leftW + diffDays(range.start, ds) * dayWidth;
        line(x, y0 + 32, x, height, '#f0eee9');
        text(String(d.getDate()), x + 4, y0 + 52, 9, '#6b7280');
      }
    } else if (state.settings.timelineScale === 'week') {
      const step = Math.max(1, Math.ceil(62 / Math.max(dayWidth * 7, 1)));
      let idx = 0;
      for (let d = new Date(d0); d <= d1; d.setDate(d.getDate() + 7), idx++) {
        if (idx % step !== 0) continue;
        const ds = formatDate(d), x = leftW + diffDays(range.start, ds) * dayWidth;
        line(x, y0, x, height, '#ece9e3');
        text(`週 ${formatMonthDay(d)}`, x + 8, y0 + 28, 10, '#374151');
      }
    } else {
      let cursor = new Date(d0.getFullYear(), d0.getMonth(), 1);
      while (cursor <= d1) {
        const ds = formatDate(cursor), x = leftW + diffDays(range.start, ds) * dayWidth;
        const monthEnd = formatDate(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0));
        const visibleStart = compareDate(ds, range.start) < 0 ? range.start : ds;
        const visibleEnd = compareDate(monthEnd, range.end) > 0 ? range.end : monthEnd;
        const span = Math.max(1, diffDays(visibleStart, visibleEnd) + 1) * dayWidth;
        if (labelGate(span, 56)) { line(x, y0, x, height, '#ece9e3'); text(`${cursor.getFullYear()}/${pad2(cursor.getMonth() + 1)}`, x + 8, y0 + 32, 10, '#374151'); }
        cursor.setMonth(cursor.getMonth() + 1);
      }
    }
    groups.forEach((group, row) => {
      const y = y0 + headerH + row * rowH;
      line(0, y + rowH, width, y + rowH, '#efede8');
      if (state.settings.rowLabelMode === 'combined') text(truncateText(group.map(t => t.name).join(' / '), Math.max(6, Math.floor((labelW - 18) / 7))), 12, y + 27, 10, '#374151');
      if (showOwnerLeft) text(truncateText(uniqueGroupOwners(group).join(' / '), Math.max(4, Math.floor((ownerW - 18) / 7))), labelW + 8, y + 27, 10, '#6b7280');
      group.forEach(task => {
        const eff = effectiveDates(task, orderedTasks());
        const x = leftW + diffDays(range.start, eff.start) * dayWidth;
        const w = Math.max(dayWidth * (diffDays(eff.start, eff.end) + 1), 10);
        rect(x, y + 10, w, 22, task.color);
        if (state.settings.showGanttBarLabel !== false) {
          const ownerText = showOwnerBar && task.owner && w >= Math.max(70, task.name.length * 7 + task.owner.length * 7 + 26) ? `  ${task.owner}` : '';
          text(truncateText(task.name + ownerText, Math.max(2, Math.floor((w - 12) / 7))), x + 8, y + 25, 10, '#ffffff');
        }
      });
    });
    return buildPdf(width, height, cmds.join('\n'));
  }

  function buildPdf(width, height, stream) {
    const objects = [];
    const add = s => { objects.push(s); return objects.length; };
    const cidFont = add('<< /Type /Font /Subtype /CIDFontType0 /BaseFont /STSong-Light /CIDSystemInfo << /Registry (Adobe) /Ordering (GB1) /Supplement 2 >> /DW 1000 >>');
    const font = add(`<< /Type /Font /Subtype /Type0 /BaseFont /STSong-Light /Encoding /UniGB-UCS2-H /DescendantFonts [${cidFont} 0 R] >>`);
    const content = add(`<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`);
    const page = add(`<< /Type /Page /Parent 5 0 R /MediaBox [0 0 ${num(width)} ${num(height)}] /Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${content} 0 R >>`);
    const pages = add(`<< /Type /Pages /Kids [${page} 0 R] /Count 1 >>`);
    const catalog = add(`<< /Type /Catalog /Pages ${pages} 0 R >>`);
    let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const offsets = [0];
    objects.forEach((body, i) => { offsets[i + 1] = out.length; out += `${i + 1} 0 obj\n${body}\nendobj\n`; });
    const xref = out.length;
    out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) out += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    out += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Uint8Array(Array.from(out).map(ch => ch.charCodeAt(0) & 255));
  }
  function rgbFill(hex) { const [r,g,b] = hexToRgb(hex); return `${num(r/255)} ${num(g/255)} ${num(b/255)} rg`; }
  function rgbStroke(hex) { const [r,g,b] = hexToRgb(hex); return `${num(r/255)} ${num(g/255)} ${num(b/255)} RG`; }
  function hexToRgb(hex) { const v = String(hex).replace('#',''); return [parseInt(v.slice(0,2),16)||0, parseInt(v.slice(2,4),16)||0, parseInt(v.slice(4,6),16)||0]; }
  function utf16beHex(s) { return Array.from(String(s)).map(ch => ch.charCodeAt(0).toString(16).padStart(4, '0')).join(''); }
  function byteLength(s) { return new TextEncoder().encode(s).length; }
  function num(n) { return (Math.round(Number(n) * 100) / 100).toFixed(2).replace(/\.00$/, ''); }

  function normalizeDateInput(value, fallbackDate) {
    const raw = String(value ?? '').trim();
    if (!raw) return '';
    const base = fallbackDate && DATE_RE.test(fallbackDate) ? parseDate(fallbackDate) : new Date();
    let y, m, d, m1;
    if ((m1 = raw.match(/^(\d{4})[-\/\.](\d{1,2})[-\/\.](\d{1,2})$/))) { y = +m1[1]; m = +m1[2]; d = +m1[3]; }
    else if ((m1 = raw.match(/^(\d{1,2})[-\/\.](\d{1,2})$/))) { y = base.getFullYear(); m = +m1[1]; d = +m1[2]; }
    else if ((m1 = raw.match(/^(\d{8})$/))) { y = +raw.slice(0,4); m = +raw.slice(4,6); d = +raw.slice(6,8); }
    else if ((m1 = raw.match(/^(\d{3,4})$/))) { y = base.getFullYear(); const s = raw.padStart(4, '0'); m = +s.slice(0,2); d = +s.slice(2,4); }
    else return '';
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return '';
    return formatDate(dt);
  }
  function parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
  function formatDate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function compareDate(a, b) { return parseDate(a) - parseDate(b); }
  function diffDays(a, b) { return Math.round((parseDate(b) - parseDate(a)) / MS_DAY); }
  function addDaysStr(s, n) { const d = parseDate(s); d.setDate(d.getDate() + n); return formatDate(d); }
  function addDurationByScale(s, scale) {
    if (scale === 'week') return addDaysStr(s, 7);
    if (scale === 'month') { const d = parseDate(s); d.setMonth(d.getMonth() + 1); return formatDate(d); }
    return addDaysStr(s, 1);
  }
  function startOfWeek(d) { const n = new Date(d); const day = n.getDay() || 7; n.setDate(n.getDate() - day + 1); return n; }
  function endOfWeek(d) { const n = startOfWeek(d); n.setDate(n.getDate() + 6); return n; }
  function formatMonthDay(d) { return `${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`; }
  function displayDate(s) { return DATE_RE.test(String(s || '')) ? String(s).replaceAll('-', '/') : String(s || ''); }
  function applyLayoutSettings() {
    if (state.settings?.leftPanelWidth) document.documentElement.style.setProperty('--left-width', `${state.settings.leftPanelWidth}px`);
  }
  function uniqueGroupOwners(group) { return Array.from(new Set(group.map(t => String(t.owner || '').trim()).filter(Boolean))); }
  function uniqueOwners() { return Array.from(new Set(state.tasks.map(t => t.owner.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-Hant')); }
  function scaleLabel(scale) { return { day: '日', week: '週', month: '月' }[scale] || scale; }
  function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }
  function truncateText(s, n) { s = String(s); return s.length > n ? s.slice(0, Math.max(0, n - 1)) + '…' : s; }

  function initSplitter() {
    let active = false;
    let before = '';
    let changed = false;
    els.splitter.addEventListener('pointerdown', e => {
      active = true;
      changed = false;
      before = snapshot();
      els.splitter.classList.add('dragging');
      els.splitter.setPointerCapture(e.pointerId);
    });
    els.splitter.addEventListener('pointermove', e => {
      if (!active) return;
      const rect = els.splitLayout.getBoundingClientRect();
      const px = Math.round(Math.min(Math.max(e.clientX - rect.left, 300), rect.width - 360));
      state.settings.leftPanelWidth = px;
      changed = true;
      document.documentElement.style.setProperty('--left-width', `${px}px`);
    });
    els.splitter.addEventListener('pointerup', e => {
      active = false;
      els.splitter.classList.remove('dragging');
      try { els.splitter.releasePointerCapture(e.pointerId); } catch (_) {}
      if (changed) {
        undoStack.push(before);
        if (undoStack.length > 120) undoStack.shift();
        redoStack = [];
        saveState();
      }
    });
  }

  function downloadBlob(filename, blob) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }
  function csvEscape(v) {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function showToast(message) {
    els.toast.textContent = message;
    els.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { els.toast.hidden = true; }, 2600);
  }
  function safeFileName(s) { return String(s).trim().replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '_') || 'gantt'; }
  function escapeHtml(s) { return String(s ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch])); }
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, '&#39;'); }
  function escapeXml(s) { return escapeHtml(s); }
  function cssEscape(s) { return String(s).replace(/(["\\#.;:[\],>+~*^$|= ])/g, '\\$1'); }
})();

```

## `README.md`

```markdown
# 靜態網頁甘特圖生成器

這是一個可直接部署的單頁靜態網頁甘特圖生成器。所有資料只在瀏覽器端處理，並以 `localStorage` 自動儲存與還原；不需要後端 API、資料庫、登入系統或伺服器端運算。

## 啟動方式

請使用 HTTP/HTTPS 靜態伺服器提供檔案，不建議用 `file://` 直接開啟。

```bash
cd static-gantt-generator
python3 -m http.server 8080
```

瀏覽器開啟：

```text
http://localhost:8080
```

也可以部署到 GitHub Pages、Netlify、Vercel Static Hosting、Nginx、Apache 或任意靜態檔案伺服器。

## 檔案結構

```text
static-gantt-generator/
├── index.html
├── styles.css
├── app.js
├── README.md
├── FULL_CONTENTS.md
├── assets/
│   └── icon.svg
├── data/
│   └── sample-tasks.json
└── libs/
    ├── xlsx.full.min.js
    ├── jspdf.umd.min.js
    └── html-to-image.min.js
```

## 第三方函式庫版本與來源說明

目前專案採本地檔案引用，以支援離線部署。因產生專案的執行環境無法連線下載官方 minified 檔，`libs/` 內為本專案需求專用的離線相容層，檔名沿用常見函式庫名稱，功能覆蓋本專案使用情境。

| 檔案 | 對應函式庫 | 版本說明 | 來源參考 |
|---|---|---:|---|
| `libs/xlsx.full.min.js` | SheetJS CE | Offline compatibility layer v1.0 | `https://github.com/SheetJS/sheetjs` |
| `libs/jspdf.umd.min.js` | jsPDF | Offline compatibility layer v1.0，本版 PDF 實際由 `app.js` 的向量 PDF 產生器輸出 | `https://github.com/parallax/jsPDF` |
| `libs/html-to-image.min.js` | html-to-image | Offline compatibility layer v1.0 | `https://github.com/bubkoo/html-to-image` |

## 程式架構

### `index.html`

負責頁面 DOM 結構：

- 頂部工具列：專案標題、匯入、匯出、範例資料、清空資料 icon。
- 左側任務面板：新增任務、任務排序設定、任務名稱/日期/負責人可調欄寬表格；排序、#、模式、顏色、複製、刪除固定 44px。
- 右側甘特圖面板：甘特圖預覽、inline 設定面板、標題列錯誤 badge。
- 匯入彈窗、匯出彈窗、顏色選擇浮層、確認操作浮層。

### `styles.css`

負責 Notion 風格 UI、左右分割、表格欄寬、甘特圖 SVG 互動游標、彈窗與浮層樣式。

重點：

- `--left-width` 控制左右面板比例。
- `--col-*` 控制左側任務表格每一欄寬度。
- 任務清單與甘特圖可各自水平與垂直捲動。
- 清空確認使用小浮層；匯入按鈕會直接開啟匯入視窗，確認匯入時才選擇覆蓋或追加；不使用 `alert` 或 `confirm`。

### `app.js`

主要邏輯集中在單一原生 JavaScript 檔案：

- 狀態管理與 `localStorage` 儲存。
- Undo / Redo 歷史紀錄。
- 任務新增、編輯、複製、刪除、拖曳排序。
- 表格欄寬拖曳調整。
- 甘特圖 SVG 產生與互動。
- 甘特圖列名欄寬與日期欄寬拖曳調整。
- 甘特圖任務甘特條橫向拖曳移動、左右縮放日期、垂直拖曳排序。
- 任務名稱與甘特列標題雙擊 inline 編輯。
- 日期解析與空白日期有效範圍推定。
- 匯入：Markdown 表格、Tab 表格、空格對齊表格、CSV、xlsx；JSON 僅支援本網站匯出的完整狀態檔。
- 匯出：PNG、SVG、PDF、CSV、JSON 完整狀態檔、xlsx。
- PDF 採向量/物件方式產生，不將圖片直接塞入 PDF。

## 使用說明

### 建立任務

1. 點擊左側「新增任務」。
2. 直接點擊欄位編輯。
3. 任務名稱不可空白。
4. 開始日期或結束日期可留空；留空時會以目前表格最早或最晚日期作為有效顯示範圍。
5. 日期支援 `YYYY-MM-DD`、`YYYY/MM/DD`、`M/D`、`MMDD`、`YYYYMMDD`。

### 快捷鍵

| 快捷鍵 | 功能 |
|---|---|
| Enter | 儲存目前欄位並新增下一個任務 |
| Tab | 儲存目前欄位並移到右側欄位 |
| Shift + Tab | 儲存目前欄位並移到左側欄位 |
| Ctrl + Z | Undo |
| Ctrl + Shift + Z | Redo |

### 調整欄位寬度

- 左側任務清單：拖曳表頭右側細線即可調整單一欄位寬度。
- 右側甘特圖列名：拖曳甘特列與日期區中間的垂直線。
- 右側日期欄：拖曳日期列中的欄位分隔區，會一次調整所有日期寬度。

### 任務排序

任務排序設定位於左側任務列表右上角：

- 手動排序：拖曳排序 icon 或甘特圖甘特條可調整順序。
- 依開始日期排序：表格與甘特圖依開始日期排序，左側拖曳排序停用。

### 接續任務

- 模式 icon 為 `↵` 時表示新列。
- 模式 icon 為 `↳` 時表示接續上一個新列任務。
- 第一筆任務不可為接續模式。
- 同一甘特列內任務日期不可重疊；若重疊，系統會顯示錯誤並阻止匯出。
- 接續任務不顯示序號。

### 甘特圖直接編輯

甘特圖預覽支援：

- 拖曳任務甘特條左右移動：調整開始與結束日期。
- 拖曳甘特條 左側：調整開始日期。
- 拖曳甘特條 右側：調整結束日期。
- 垂直拖曳甘特條：在手動排序模式下調整任務順序。
- 雙擊甘特條 文字：直接修改任務名稱。
- 雙擊甘特列標題：直接修改該列第一個任務名稱。

### 顏色設定

點擊左側任務顏色小球會先開啟顏色浮層：

- 可選預設色。
- 可使用支援瀏覽器提供的 EyeDropper 滴管工具。
- 可開啟調色盤選擇自訂色。

### 甘特圖設定

甘特圖右上角「設定」會在甘特圖上方展開 inline 設定面板，不再跳出視窗。面板包含：

- 時間粒度：日、週、月。
- 甘特圖列名顯示方式。
- 週末顯示開關。
- 使用教學。

### 匯入資料

點擊頂部匯入 icon 後，會直接開啟匯入面板。

支援格式：

- 貼上 Markdown 表格。
- 貼上 Tab 表格。
- 貼上空格對齊表格。
- CSV 檔。
- JSON 檔或 JSON 文字：僅支援本網站「匯出 JSON」產生的完整狀態檔，會直接還原專案標題、設定、欄位寬度、ID、任務順序與任務資料，不進入欄位對應流程。
- Excel xlsx 檔。
- 內建範例資料。

貼上表格、CSV、空格表格都應包含欄位名稱。解析後會顯示欄位對應介面。JSON 不進入欄位對應，會完整還原匯出時的狀態。

若目前已有資料，一般表格、CSV、Excel 匯入會在確認匯入時要求選擇：

- 覆蓋目前資料。
- 追加到目前資料。
- 取消。

JSON 完整狀態還原會直接覆蓋目前狀態，但仍可用 Ctrl + Z 復原。

### 清空資料

點擊頂部清空 icon 後，按鈕下方會出現「確認清空資料」浮層。點擊確認才清空。此操作可用 Ctrl + Z 復原。

### 匯出資料

點擊匯出 icon 後才會顯示格式選項。

圖表匯出：

- PNG：會要求填寫解析度，預設 250%。
- SVG：匯出向量 SVG。
- PDF：以向量/物件方式輸出 PDF，不以圖片直接轉存。

資料匯出：

- CSV。
- JSON：匯出完整狀態檔，包含 `app`、`schemaVersion`、`format`、`exportedAt` 與 `state`；`state` 內含專案標題、設定、欄位寬度、ID、順序與完整任務資料。
- Excel xlsx。

「是否列印標題」位於匯出視窗標題列右側。若勾選，CSV 與 Excel 第一列會放置專案標題，JSON 會包含 `titleRow`；JSON 的主要還原資料一律位於 `state`。

## JSON 匯出 / 匯入格式

JSON 是完整狀態備份格式，只支援本網站匯出的 JSON 再匯入。匯入後會直接還原，不進入欄位對應流程。

```json
{
  "app": "static-gantt-generator",
  "schemaVersion": 2,
  "format": "full-state",
  "exportedAt": "2026-06-21T00:00:00.000Z",
  "includeTitleRow": true,
  "state": {
    "projectTitle": "我的甘特圖",
    "settings": {
      "timelineScale": "month",
      "sortMode": "manual",
      "rowLabelMode": "combined",
      "showWeekends": true,
      "ganttLabelWidth": 190,
      "ganttOwnerWidth": 110,
      "ganttDayWidth": 24,
      "leftPanelWidth": null,
      "ownerDisplay": "both",
      "showGanttBarLabel": true,
      "tableColumnWidths": {}
    },
    "tasks": []
  }
}
```

## localStorage 格式

Key：

```text
static-gantt-generator-state
```

格式：

```json
{
  "projectTitle": "我的甘特圖",
  "settings": {
    "timelineScale": "month",
    "sortMode": "manual",
    "rowLabelMode": "combined",
    "showWeekends": true,
    "ganttLabelWidth": 190,
    "ganttOwnerWidth": 110,
    "ganttDayWidth": 24,
    "leftPanelWidth": null,
    "ownerDisplay": "both",
    "showGanttBarLabel": true,
    "tableColumnWidths": {
      "drag": 44,
      "index": 44,
      "mode": 44,
      "color": 44,
      "name": 210,
      "startDate": 155,
      "endDate": 155,
      "owner": 150,
      "copy": 44,
      "delete": 44
    }
  },
  "tasks": [
    {
      "id": "task-001",
      "order": 1,
      "rowMode": "new",
      "name": "設計",
      "startDate": "2026-06-20",
      "endDate": "2026-06-25",
      "color": "#EF4444",
      "owner": "Alex"
    }
  ]
}
```

## 驗收清單

| 項目 | 狀態 |
|---|---|
| 不需要後端即可使用 | 已完成 |
| 重新整理頁面後資料不遺失 | 已完成 |
| 左右面板寬度可拖曳調整 | 已完成 |
| 左右面板可各自水平與垂直捲動 | 已完成 |
| 任務名稱、日期、負責人欄位寬度可拖曳調整；功能欄固定 44px | 已完成 |
| 甘特列標題欄寬可拖曳調整 | 已完成 |
| 日期欄寬可一次整體調整 | 已完成 |
| 新增任務按鈕位於左側任務面板 | 已完成 |
| 任務排序設定位於任務列表右上角 | 已完成 |
| 清空資料前使用小浮層確認，不使用 alert/confirm | 已完成 |
| 匯入資料按鈕直接開啟視窗；確認匯入時才選擇覆蓋或追加 | 已完成 |
| 可匯入內建範例資料 | 已完成 |
| 任務欄位不包含備註 | 已完成 |
| 點擊欄位可直接編輯 | 已完成 |
| Enter 可新增下一個任務 | 已完成 |
| Tab / Shift + Tab 可移動欄位 | 已完成 |
| Ctrl + Z / Ctrl + Shift + Z | 已完成 |
| 負責人欄位支援 datalist combo box | 已完成 |
| 可拖曳排序任務 | 已完成 |
| 可切換手動排序與依開始日期排序 | 已完成 |
| 可切換任務為新列或接續上一列 | 已完成 |
| 接續任務不顯示序號 | 已完成 |
| 同列任務日期不可重疊 | 已完成 |
| 可切換日 / 週 / 月檢視，預設月 | 已完成 |
| 週末顯示涵蓋日期列與任務列 | 已完成 |
| 今日線只在網頁預覽顯示，不出現在匯出檔案 | 已完成 |
| 甘特圖設定面板 inline 顯示於甘特圖上方 | 已完成 |
| 頂部工具列按鈕為 icon，hover 顯示說明 | 已完成 |
| 點擊匯出後才顯示匯出格式 | 已完成 |
| 圖表匯出核取方塊位於匯出標題列右側 | 已完成 |
| 可匯出 PNG、SVG、PDF、CSV、JSON、Excel | 已完成 |
| PNG 匯出可填解析度，預設 250 | 已完成 |
| PDF 匯出使用向量/物件方式 | 已完成 |
| 介面為極簡 Notion 風 | 已完成 |

## 已知限制

- 甘特列標題不是獨立資料欄位；雙擊甘特列標題時會修改該列第一個任務名稱。
- PDF 採內建向量 PDF 產生器輸出，已避免圖片直接轉存；不同 PDF 閱讀器對 CJK CID 字型支援可能略有差異。
- xlsx 讀取依賴瀏覽器對 `DecompressionStream` 的支援；匯出 xlsx 不需後端。

## 2026-06-21 追加修正紀錄

本版針對使用回饋追加以下調整：

1. 甘特圖資料錯誤不再顯示於預覽區上方，改為顯示在「甘特圖預覽」標題後方的錯誤 badge，滑鼠移入才顯示錯誤清單。
2. 甘特圖拖曳與縮放期間只顯示預覽，不即時檢查錯誤；滑鼠放開後才驗證，若造成日期重疊或資料錯誤會回滾。
3. 甘特圖任務甘特條支援拖曳到其他甘特列；拖到列中會改成接續該列，拖到列線附近會插入為新列。
4. 依開始日期自動排序時，接續任務不單獨參與排序，而是固定跟隨所屬新列任務群組。
5. 使用者只要拖曳調整任務順序，系統會自動切回手動排序模式。
6. 日/週/月標題在欄寬過窄時會自動隱藏部分文字與對應直線，避免重疊。
7. 甘特圖日期欄寬最小值下修為 2px，日、週、月皆可縮得更小。
8. 左側固定功能欄位維持 44px，不提供手動欄寬調整。
9. 匯入資料按鈕直接開啟匯入視窗；解析完成後按下確認匯入時，若已有資料才選擇覆蓋或追加。


## 2026-06-21 本輪追加修正紀錄

1. 左側任務拖曳排序改為 pointer-based 實作，避免原生 HTML5 drag 在表格列與按鈕內失效。
2. PNG 解析度設定改為點擊 PNG 後才顯示，並標示可輸入 50–800、建議 150–300、預設 250。
3. 左側任務表格的日期顯示改為斜線格式，例如 `2026/06/20`；內部儲存仍維持 `YYYY-MM-DD`。
4. 預設色票增加為 15 色；滴管與調色盤改為 icon，滴管靠左、調色盤靠右。
5. 甘特圖左側負責人欄支援拖曳調整欄寬。
6. 甘特圖負責人顯示模式改為下拉選單：不顯示、僅顯示在左側、僅顯示在甘特條、顯示在左側與甘特條。
7. 介面文字統一使用「甘特條」。
8. 錯誤提示不再額外加入清單編號；一個錯誤一行顯示。
9. 甘特圖設定面板開啟後固定為右側區域約一半高度；設定區與下方甘特圖區各自使用捲軸。

## 2026-06-21 匯入與匯出修正紀錄

1. CSV 匯出加入 UTF-8 BOM，並使用 `\r\n` 換行，降低 Excel 開啟中文 CSV 時出現亂碼的機率。
2. Excel xlsx 匯出維持 UTF-8 XML；若勾選列印標題，第一列為甘特圖大標題，第二列為欄位名稱。
3. CSV、貼上表格與 Excel 匯入會自動偵測「第一列為甘特圖大標題、第二列為欄位名稱」的格式。
4. 匯入欄位對應 UI 改為左側顯示上傳檔案欄位與範例值，右側選擇要對應的網頁欄位。
5. 欄位對應選項包含：無對應、甘特圖大標題、任務名稱、開始日期、結束日期、顏色(HEX 碼)、顯示模式、負責人。
6. 若系統無法辨識欄位名稱，預設為「無對應」，由使用者手動選擇。
7. 若目前已有資料，使用者按下「確認匯入有效資料」後，最下方按鈕會替換為「目前已有資料，請選擇匯入方式。」與覆蓋/追加/取消按鈕。

```

## `assets/icon.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Gantt icon">
  <rect width="64" height="64" rx="16" fill="#111827"/>
  <rect x="14" y="18" width="30" height="8" rx="4" fill="#F9FAFB"/>
  <rect x="20" y="30" width="26" height="8" rx="4" fill="#93C5FD"/>
  <rect x="14" y="42" width="38" height="8" rx="4" fill="#FCA5A5"/>
</svg>

```

## `data/sample-tasks.json`

```json
{
  "projectTitle": "網站改版甘特圖範例",
  "settings": {
    "timelineScale": "month",
    "sortMode": "manual",
    "rowLabelMode": "combined",
    "showWeekends": true
  },
  "tasks": [
    {
      "id": "task-001",
      "order": 1,
      "rowMode": "new",
      "name": "需求盤點",
      "startDate": "2026-06-20",
      "endDate": "2026-06-25",
      "color": "#EF4444",
      "owner": "Alex"
    },
    {
      "id": "task-002",
      "order": 2,
      "rowMode": "continue",
      "name": "資訊架構",
      "startDate": "2026-06-26",
      "endDate": "2026-06-30",
      "color": "#F97316",
      "owner": "Alex"
    },
    {
      "id": "task-003",
      "order": 3,
      "rowMode": "new",
      "name": "UI 設計",
      "startDate": "2026-07-01",
      "endDate": "2026-07-10",
      "color": "#3B82F6",
      "owner": "Mia"
    },
    {
      "id": "task-004",
      "order": 4,
      "rowMode": "continue",
      "name": "設計審核",
      "startDate": "2026-07-11",
      "endDate": "2026-07-14",
      "color": "#8B5CF6",
      "owner": "Mia"
    },
    {
      "id": "task-005",
      "order": 5,
      "rowMode": "new",
      "name": "前端開發",
      "startDate": "2026-07-15",
      "endDate": "2026-08-05",
      "color": "#10B981",
      "owner": "Kai"
    },
    {
      "id": "task-006",
      "order": 6,
      "rowMode": "new",
      "name": "驗收與交付",
      "startDate": "2026-08-06",
      "endDate": "2026-08-12",
      "color": "#64748B",
      "owner": "Nora"
    }
  ]
}

```

## `libs/xlsx.full.min.js`

```javascript
/* Offline XLSX compatibility layer for Static Gantt Generator.
   Implements a small SheetJS-like subset used by this project: readAsync,
   utils.sheet_to_json, utils.json_to_sheet, utils.aoa_to_sheet, book_new,
   book_append_sheet, and writeFile. It creates standards-compliant .xlsx files
   with stored ZIP entries and reads common .xlsx first worksheets, including
   deflated ZIP entries when the browser supports DecompressionStream. */
(function (global) {
  'use strict';
  var enc = new TextEncoder();
  var dec = new TextDecoder();
  var crcTable = null;

  function makeCrcTable() {
    var c, table = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      table[n] = c >>> 0;
    }
    return table;
  }
  function crc32(bytes) {
    if (!crcTable) crcTable = makeCrcTable();
    var crc = 0 ^ (-1);
    for (var i = 0; i < bytes.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    return (crc ^ (-1)) >>> 0;
  }
  function u16(v) { return [v & 255, (v >>> 8) & 255]; }
  function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
  function strBytes(s) { return enc.encode(s); }
  function concat(parts) {
    var len = parts.reduce(function (a, p) { return a + p.length; }, 0);
    var out = new Uint8Array(len), off = 0;
    parts.forEach(function (p) { out.set(p, off); off += p.length; });
    return out;
  }
  function zipStore(files) {
    var locals = [], centrals = [], offset = 0;
    Object.keys(files).forEach(function (name) {
      var data = typeof files[name] === 'string' ? strBytes(files[name]) : files[name];
      var nameB = strBytes(name), crc = crc32(data);
      var local = concat([
        new Uint8Array([0x50,0x4b,0x03,0x04]), new Uint8Array(u16(20)), new Uint8Array(u16(0)), new Uint8Array(u16(0)),
        new Uint8Array(u16(0)), new Uint8Array(u16(0)), new Uint8Array(u32(crc)), new Uint8Array(u32(data.length)),
        new Uint8Array(u32(data.length)), new Uint8Array(u16(nameB.length)), new Uint8Array(u16(0)), nameB, data
      ]);
      var central = concat([
        new Uint8Array([0x50,0x4b,0x01,0x02]), new Uint8Array(u16(20)), new Uint8Array(u16(20)), new Uint8Array(u16(0)),
        new Uint8Array(u16(0)), new Uint8Array(u16(0)), new Uint8Array(u16(0)), new Uint8Array(u32(crc)),
        new Uint8Array(u32(data.length)), new Uint8Array(u32(data.length)), new Uint8Array(u16(nameB.length)),
        new Uint8Array(u16(0)), new Uint8Array(u16(0)), new Uint8Array(u16(0)), new Uint8Array(u16(0)),
        new Uint8Array(u32(0)), new Uint8Array(u32(offset)), nameB
      ]);
      locals.push(local); centrals.push(central); offset += local.length;
    });
    var centralStart = offset;
    var centralData = concat(centrals);
    var eocd = concat([
      new Uint8Array([0x50,0x4b,0x05,0x06]), new Uint8Array(u16(0)), new Uint8Array(u16(0)),
      new Uint8Array(u16(centrals.length)), new Uint8Array(u16(centrals.length)), new Uint8Array(u32(centralData.length)),
      new Uint8Array(u32(centralStart)), new Uint8Array(u16(0))
    ]);
    return concat(locals.concat([centralData, eocd]));
  }
  function xmlEscape(v) {
    return String(v == null ? '' : v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function colName(n) {
    var s = '';
    while (n >= 0) { s = String.fromCharCode((n % 26) + 65) + s; n = Math.floor(n / 26) - 1; }
    return s;
  }
  function cellRef(r, c) { return colName(c) + (r + 1); }
  function aoa_to_sheet(aoa) { return { '!data': aoa.map(function (r) { return r.slice(); }) }; }
  function json_to_sheet(rows) {
    rows = rows || [];
    var headers = [];
    rows.forEach(function (row) { Object.keys(row).forEach(function (k) { if (headers.indexOf(k) < 0) headers.push(k); }); });
    var aoa = [headers];
    rows.forEach(function (row) { aoa.push(headers.map(function (h) { return row[h] == null ? '' : row[h]; })); });
    return aoa_to_sheet(aoa);
  }
  function sheet_to_json(sheet, opts) {
    opts = opts || {};
    var data = (sheet && sheet['!data']) || [];
    if (opts.header === 1) return data.map(function (r) { return r.slice(); });
    var headers = (data[0] || []).map(function (h, i) { return h || ('Column' + (i + 1)); });
    return data.slice(1).map(function (row) {
      var o = {};
      headers.forEach(function (h, i) { o[h] = row[i] == null ? (opts.defval !== undefined ? opts.defval : undefined) : row[i]; });
      return o;
    });
  }
  function book_new() { return { SheetNames: [], Sheets: {} }; }
  function book_append_sheet(wb, ws, name) { wb.SheetNames.push(name); wb.Sheets[name] = ws; }
  function sheetXml(ws) {
    var data = (ws && ws['!data']) || [];
    var rows = data.map(function (row, r) {
      var cells = row.map(function (v, c) {
        var ref = cellRef(r, c);
        if (typeof v === 'number' && isFinite(v)) return '<c r="' + ref + '"><v>' + v + '</v></c>';
        return '<c r="' + ref + '" t="inlineStr"><is><t>' + xmlEscape(v) + '</t></is></c>';
      }).join('');
      return '<row r="' + (r + 1) + '">' + cells + '</row>';
    }).join('');
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' + rows + '</sheetData></worksheet>';
  }
  function workbookFiles(wb) {
    var sheetName = wb.SheetNames[0] || 'Sheet1';
    var ws = wb.Sheets[sheetName] || aoa_to_sheet([[]]);
    return {
      '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
      '_rels/.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
      'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="' + xmlEscape(sheetName) + '" sheetId="1" r:id="rId1"/></sheets></workbook>',
      'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
      'xl/styles.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs></styleSheet>',
      'xl/worksheets/sheet1.xml': sheetXml(ws)
    };
  }
  function writeFile(wb, filename) {
    var bytes = zipStore(workbookFiles(wb));
    var blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename || 'workbook.xlsx';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }
  function readU16(view, off) { return view.getUint16(off, true); }
  function readU32(view, off) { return view.getUint32(off, true); }
  async function inflateEntry(method, comp) {
    if (method === 0) return comp;
    if (method === 8 && global.DecompressionStream) {
      var ds = new DecompressionStream('deflate-raw');
      return await new Response(new Blob([comp]).stream().pipeThrough(ds)).arrayBuffer();
    }
    throw new Error('此瀏覽器不支援解壓縮此 xlsx 檔案。');
  }
  async function unzip(buffer) {
    var view = new DataView(buffer), files = {};
    var eocd = -1;
    for (var p = view.byteLength - 22; p >= 0 && p > view.byteLength - 66000; p--) {
      if (readU32(view, p) === 0x06054b50) { eocd = p; break; }
    }
    if (eocd >= 0) {
      var count = readU16(view, eocd + 10), centralOffset = readU32(view, eocd + 16), pos = centralOffset;
      for (var i = 0; i < count && pos + 46 <= view.byteLength; i++) {
        if (readU32(view, pos) !== 0x02014b50) break;
        var method = readU16(view, pos + 10), compSize = readU32(view, pos + 20);
        var nameLen = readU16(view, pos + 28), extraLen = readU16(view, pos + 30), commentLen = readU16(view, pos + 32);
        var localOffset = readU32(view, pos + 42);
        var name = dec.decode(new Uint8Array(buffer, pos + 46, nameLen));
        var lhNameLen = readU16(view, localOffset + 26), lhExtraLen = readU16(view, localOffset + 28);
        var dataStart = localOffset + 30 + lhNameLen + lhExtraLen;
        files[name] = await inflateEntry(method, buffer.slice(dataStart, dataStart + compSize));
        pos += 46 + nameLen + extraLen + commentLen;
      }
      return files;
    }
    var seq = 0;
    while (seq + 30 <= view.byteLength && readU32(view, seq) === 0x04034b50) {
      var m = readU16(view, seq + 8), cs = readU32(view, seq + 18);
      var nl = readU16(view, seq + 26), el = readU16(view, seq + 28);
      var nm = dec.decode(new Uint8Array(buffer, seq + 30, nl));
      var ds0 = seq + 30 + nl + el;
      files[nm] = await inflateEntry(m, buffer.slice(ds0, ds0 + cs));
      seq = ds0 + cs;
    }
    return files;
  }
  function textFromXml(xml, tagName) {
    var nodes = Array.prototype.slice.call(xml.getElementsByTagName(tagName));
    return nodes.map(function (n) { return n.textContent || ''; }).join('');
  }
  function parseSheet(xmlText, shared) {
    var xml = new DOMParser().parseFromString(xmlText, 'application/xml');
    var rowNodes = Array.prototype.slice.call(xml.getElementsByTagName('row'));
    var data = [];
    rowNodes.forEach(function (rowNode) {
      var rowIndex = parseInt(rowNode.getAttribute('r') || (data.length + 1), 10) - 1;
      var row = data[rowIndex] || [];
      var cells = Array.prototype.slice.call(rowNode.getElementsByTagName('c'));
      cells.forEach(function (cNode) {
        var ref = cNode.getAttribute('r') || 'A1';
        var col = 0;
        (ref.match(/[A-Z]+/i) || ['A'])[0].toUpperCase().split('').forEach(function (ch) { col = col * 26 + ch.charCodeAt(0) - 64; });
        col -= 1;
        var type = cNode.getAttribute('t');
        var value = '';
        if (type === 's') {
          var idx = parseInt(textFromXml(cNode, 'v') || '0', 10); value = shared[idx] || '';
        } else if (type === 'inlineStr') value = textFromXml(cNode, 't');
        else value = textFromXml(cNode, 'v');
        row[col] = value;
      });
      data[rowIndex] = row;
    });
    return aoa_to_sheet(data.filter(function (r) { return r && r.some(function (v) { return v !== ''; }); }));
  }
  async function readAsync(buffer) {
    var files = await unzip(buffer);
    var shared = [];
    if (files['xl/sharedStrings.xml']) {
      var sharedXml = new DOMParser().parseFromString(dec.decode(files['xl/sharedStrings.xml']), 'application/xml');
      Array.prototype.slice.call(sharedXml.getElementsByTagName('si')).forEach(function (si) { shared.push(textFromXml(si, 't')); });
    }
    var sheetPath = Object.keys(files).filter(function (p) { return /^xl\/worksheets\/sheet\d+\.xml$/.test(p); })[0];
    if (!sheetPath) throw new Error('找不到工作表。');
    var sheet = parseSheet(dec.decode(files[sheetPath]), shared);
    return { SheetNames: ['Sheet1'], Sheets: { Sheet1: sheet } };
  }
  global.XLSX = { utils: { aoa_to_sheet: aoa_to_sheet, json_to_sheet: json_to_sheet, sheet_to_json: sheet_to_json, book_new: book_new, book_append_sheet: book_append_sheet }, writeFile: writeFile, readAsync: readAsync };
})(window);

```

## `libs/jspdf.umd.min.js`

```javascript
/* Offline jsPDF-compatible micro layer for this project.
   Supports new jspdf.jsPDF({orientation, unit:'pt', format:[w,h]}), addImage(dataUrl,'JPEG',x,y,w,h), and save(filename). */
(function (global) {
  'use strict';
  function b64ToBinary(b64) { return atob(b64); }
  function escapePdf(s) { return String(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); }
  function parseJpegSize(bin) {
    var i = 2;
    while (i < bin.length) {
      if (bin.charCodeAt(i) !== 0xFF) break;
      var marker = bin.charCodeAt(i + 1);
      var len = (bin.charCodeAt(i + 2) << 8) + bin.charCodeAt(i + 3);
      if (marker >= 0xC0 && marker <= 0xC3) {
        return { height: (bin.charCodeAt(i + 5) << 8) + bin.charCodeAt(i + 6), width: (bin.charCodeAt(i + 7) << 8) + bin.charCodeAt(i + 8) };
      }
      i += 2 + len;
    }
    return { width: 1000, height: 700 };
  }
  function makePdf(pageW, pageH, image) {
    var objects = [];
    function obj(s) { objects.push(s); return objects.length; }
    var imgObj = obj('<< /Type /XObject /Subtype /Image /Width ' + image.pixelW + ' /Height ' + image.pixelH + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + image.bin.length + ' >>\nstream\n' + image.bin + '\nendstream');
    var content = 'q\n' + image.w.toFixed(2) + ' 0 0 ' + image.h.toFixed(2) + ' ' + image.x.toFixed(2) + ' ' + (pageH - image.y - image.h).toFixed(2) + ' cm\n/Im1 Do\nQ';
    var contentObj = obj('<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream');
    var pageObj = obj('<< /Type /Page /Parent 4 0 R /MediaBox [0 0 ' + pageW.toFixed(2) + ' ' + pageH.toFixed(2) + '] /Resources << /XObject << /Im1 ' + imgObj + ' 0 R >> >> /Contents ' + contentObj + ' 0 R >>');
    var pagesObj = obj('<< /Type /Pages /Kids [' + pageObj + ' 0 R] /Count 1 >>');
    var catalogObj = obj('<< /Type /Catalog /Pages ' + pagesObj + ' 0 R >>');
    var out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', offsets = [0];
    objects.forEach(function (body, idx) { offsets[idx + 1] = out.length; out += (idx + 1) + ' 0 obj\n' + body + '\nendobj\n'; });
    var xref = out.length;
    out += 'xref\n0 ' + (objects.length + 1) + '\n0000000000 65535 f \n';
    for (var i = 1; i <= objects.length; i++) out += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    out += 'trailer\n<< /Size ' + (objects.length + 1) + ' /Root ' + catalogObj + ' 0 R >>\nstartxref\n' + xref + '\n%%EOF';
    return out;
  }
  function jsPDF(opts) {
    opts = opts || {};
    var f = opts.format || (opts.orientation === 'landscape' ? [841.89, 595.28] : [595.28, 841.89]);
    this.pageW = Number(f[0]) || 841.89;
    this.pageH = Number(f[1]) || 595.28;
    this.image = null;
  }
  jsPDF.prototype.addImage = function (dataUrl, format, x, y, w, h) {
    var b64 = String(dataUrl).split(',')[1] || '';
    var bin = b64ToBinary(b64);
    var size = parseJpegSize(bin);
    this.image = { bin: bin, pixelW: size.width, pixelH: size.height, x: x || 0, y: y || 0, w: w || this.pageW, h: h || this.pageH };
  };
  jsPDF.prototype.save = function (filename) {
    if (!this.image) throw new Error('PDF 尚未加入圖片。');
    var pdf = makePdf(this.pageW, this.pageH, this.image);
    var bytes = new Uint8Array(pdf.length);
    for (var i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 255;
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    a.download = filename || 'export.pdf'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  };
  global.jspdf = { jsPDF: jsPDF, _note: 'offline micro compatibility layer' };
})(window);

```

## `libs/html-to-image.min.js`

```javascript
/* Offline html-to-image-compatible micro layer.
   The app exports SVG directly; this helper is provided for local deployment completeness. */
(function (global) {
  'use strict';
  function toPng(node, options) {
    options = options || {};
    return new Promise(function (resolve, reject) {
      try {
        var svg = node instanceof SVGElement ? node : node.querySelector('svg');
        if (!svg) throw new Error('找不到可轉換的 SVG。');
        var text = new XMLSerializer().serializeToString(svg);
        var blob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = options.canvasWidth || svg.viewBox.baseVal.width || svg.width.baseVal.value;
          canvas.height = options.canvasHeight || svg.viewBox.baseVal.height || svg.height.baseVal.value;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = options.backgroundColor || '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
      } catch (err) { reject(err); }
    });
  }
  global.htmlToImage = { toPng: toPng, _note: 'offline micro compatibility layer' };
})(window);

```
