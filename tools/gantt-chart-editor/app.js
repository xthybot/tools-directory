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
