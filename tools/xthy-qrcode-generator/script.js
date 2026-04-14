const CODE_TYPES = {
  url: {
    label: '網址',
    fields: [
      { key: 'url', label: '網址', type: 'url', placeholder: 'https://example.com', required: true }
    ]
  },
  wifi: {
    label: 'Wi-Fi',
    fields: [
      { key: 'ssid', label: 'SSID', type: 'text', required: true },
      { key: 'password', label: '密碼', type: 'text' },
      { key: 'encryption', label: '加密方式', type: 'select', options: ['WPA', 'WEP', 'nopass'], required: true },
      { key: 'hidden', label: '隱藏網路', type: 'checkbox' }
    ]
  },
  text: {
    label: '純文字',
    fields: [
      { key: 'text', label: '文字內容', type: 'textarea', required: true, placeholder: '輸入任意文字' }
    ]
  },
  phone: {
    label: '電話 / 手機',
    fields: [
      { key: 'number', label: '電話號碼', type: 'tel', required: true, placeholder: '+886912345678' }
    ]
  },
  sms: {
    label: '簡訊',
    fields: [
      { key: 'number', label: '收件號碼', type: 'tel', required: true },
      { key: 'message', label: '簡訊內容', type: 'textarea', placeholder: '輸入預設訊息內容' }
    ]
  },
  twqr: {
    label: '銀行轉帳 (TWQR)',
    fields: [
      { key: 'bankCode', label: '銀行代碼/代號', type: 'text', required: true, placeholder: '例如：812' },
      { key: 'bankAccount', label: '銀行帳號', type: 'text', required: true, placeholder: '請輸入收款帳號' },
      { key: 'amount', label: '轉帳金額', type: 'number', step: '0.01', placeholder: '可留空' },
      { key: 'note', label: '留言備註', type: 'textarea', placeholder: '可留空' }
    ]
  }
};

const state = {
  type: 'url',
  values: {},
  qr: {
    size: 280,
    color: '#111827',
    backgroundColor: '#ffffff',
    backgroundAlpha: 100,
    minVersion: 0,
    errorCorrection: 'M',
    borderSize: 16,
    dotStyle: 'square'
  },
  logo: {
    mode: 'none',
    text: '',
    textColor: '#111827',
    textBgColor: '#ffffff',
    textStyle: 'box',
    fontFamily: 'Inter, Arial, sans-serif',
    textSize: 32,
    textPadding: 12,
    textCornerStyle: 'rounded',
    imageDataUrl: '',
    imageName: '',
    imageNaturalWidth: 1,
    imageNaturalHeight: 1,
    imageSize: 23,
    imageBorder: 8,
    imageBorderColor: '#ffffff',
    imageCornerStyle: 'rounded'
  },
  export: {
    fileName: '',
    format: 'png'
  },
  preview: {
    bgMode: 'light'
  },
  decodedRawText: '',
};

const elements = {
  codeType: document.querySelector('#codeType'),
  dynamicFields: document.querySelector('#dynamicFields'),
  qrcodePreview: document.querySelector('#qrcodePreview'),
  fixBox: document.querySelector('#fixBox'),
  riskBox: document.querySelector('#riskBox'),
  scanImageInput: document.querySelector('#scanImageInput'),
  scanStatus: document.querySelector('#scanStatus'),
  startCameraBtn: document.querySelector('#startCameraBtn'),
  cameraReader: document.querySelector('#cameraReader'),
  logoTextFields: document.querySelector('#logoTextFields'),
  logoImageFields: document.querySelector('#logoImageFields'),
  logoImageInput: document.querySelector('#logoImageInput'),
  logoImageName: document.querySelector('#logoImageName'),
  fileName: document.querySelector('#fileName'),
  downloadBtn: document.querySelector('#downloadBtn'),
  copyBtn: document.querySelector('#copyBtn'),
  qrSizeValue: document.querySelector('#qrSizeValue'),
  backgroundAlphaValue: document.querySelector('#backgroundAlphaValue'),
  minVersionValue: document.querySelector('#minVersionValue'),
  borderSizeValue: document.querySelector('#borderSizeValue'),
  logoTextSizeValue: document.querySelector('#logoTextSizeValue'),
  logoTextPaddingValue: document.querySelector('#logoTextPaddingValue'),
  logoImageSizeValue: document.querySelector('#logoImageSizeValue'),
  logoImageBorderValue: document.querySelector('#logoImageBorderValue'),
  copyStatus: document.querySelector('#copyStatus'),
  logoPreviewOverlay: document.querySelector('#logoPreviewOverlay'),
  previewPanel: document.querySelector('.preview-panel'),
  previewCard: document.querySelector('.preview-card'),
  previewStage: document.querySelector('.preview-stage'),
  previewBgMode: document.querySelector('#previewBgMode'),
  logoTextCornerStyle: document.querySelector('#logoTextCornerStyle'),
  logoImageCornerStyle: document.querySelector('#logoImageCornerStyle'),
  errorCorrectionControl: document.querySelector('#errorCorrectionControl'),
  dotStyleControl: document.querySelector('#dotStyleControl'),
  logoModeControl: document.querySelector('#logoModeControl'),
  logoTextStyleControl: document.querySelector('#logoTextStyleControl'),
  downloadFormatControl: document.querySelector('#downloadFormatControl'),
};

const PREVIEW_RENDER_SIZE = 1200;

const qrCode = new QRCodeStyling({
  width: PREVIEW_RENDER_SIZE,
  height: PREVIEW_RENDER_SIZE,
  type: 'svg',
  data: 'https://xthybot.github.io',
  qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: state.qr.errorCorrection },
  dotsOptions: { color: state.qr.color, type: state.qr.dotStyle },
  cornersSquareOptions: { color: state.qr.color, type: state.qr.dotStyle },
  cornersDotOptions: { color: state.qr.color, type: state.qr.dotStyle === 'dots' ? 'dot' : 'square' },
  backgroundOptions: { color: '#ffffff' },
  imageOptions: { crossOrigin: 'anonymous', margin: 4 }
});
qrCode.append(elements.qrcodePreview);

let cameraScanner = null;
let currentLogoAsset = null;
let previewRenderToken = 0;
let lastMobileLayout = null;
let isIosSafariLike = false;

function init() {
  isIosSafariLike = detectIosSafariLike();
  updateCopyButtonLabel();
  renderTypeOptions();
  renderVersionOptions();
  bindStaticControls();
  bindMobileCollapsibleControls();
  syncCollapsibleState();
  window.addEventListener('resize', syncCollapsibleState);
  window.addEventListener('resize', updatePreviewStageSize);
  resetValuesForType(state.type);
  renderDynamicFields();
  updatePreviewStageSize();
  if (window.ResizeObserver && elements.previewCard) {
    const ro = new ResizeObserver(() => updatePreviewStageSize());
    ro.observe(elements.previewCard);
  }
  updatePreviewBackground();
  refreshQr();
}

function renderTypeOptions() {
  elements.codeType.innerHTML = Object.entries(CODE_TYPES)
    .map(([value, config]) => `<option value="${value}">${config.label}</option>`)
    .join('');
  elements.codeType.value = state.type;
}

function renderVersionOptions() {
  const input = document.querySelector('#minVersion');
  if (!input) return;
  input.value = String(state.qr.minVersion);
  if (elements.minVersionValue) {
    elements.minVersionValue.textContent = state.qr.minVersion === 0 ? '自動' : String(state.qr.minVersion);
  }
}

function resetValuesForType(type) {
  const config = CODE_TYPES[type];
  const next = {};
  [...config.fields, ...(config.advancedFields || [])].forEach((field) => {
    if (field.defaultValue !== undefined) next[field.key] = field.defaultValue;
    else if (field.type === 'checkbox') next[field.key] = false;
    else next[field.key] = '';
  });
  if (type === 'wifi' && !next.encryption) next.encryption = 'WPA';
  state.values = next;
}

function renderDynamicFields() {
  const config = CODE_TYPES[state.type];
  const basicHtml = config.fields.map(renderField).join('');
  const advancedHtml = config.advancedFields?.length
    ? `<details class="scan-panel"><summary>TWQR 進階欄位</summary>${config.advancedFields.map(renderField).join('')}</details>`
    : '';
  const twqrNotice = state.type === 'twqr'
    ? `<p class="hint">注意：<br>這類型的QR碼，即TWQR（台灣共通QR碼支付標準），需搭配支付App及行動銀行App掃碼轉帳。<br>僅限台灣使用。</p>`
    : '';
  elements.dynamicFields.innerHTML = basicHtml + advancedHtml + twqrNotice;

  elements.dynamicFields.querySelectorAll('[data-field]').forEach((input) => {
    input.addEventListener('input', handleDynamicInput);
    input.addEventListener('change', handleDynamicInput);
  });
}

function renderField(field) {
  const value = state.values[field.key] ?? '';
  if (field.type === 'textarea') {
    return `<div class="field-group"><label for="field-${field.key}">${field.label}${field.required ? ' *' : ''}</label><textarea id="field-${field.key}" data-field="${field.key}" placeholder="${field.placeholder || ''}">${escapeHtml(value)}</textarea></div>`;
  }
  if (field.type === 'select') {
    const options = (field.options || []).map((option) => {
      const opt = typeof option === 'string' ? { value: option, label: option } : option;
      return `<option value="${escapeAttr(opt.value)}" ${String(value) === String(opt.value) ? 'selected' : ''}>${escapeHtml(opt.label)}</option>`;
    }).join('');
    return `<div class="field-group"><label for="field-${field.key}">${field.label}${field.required ? ' *' : ''}</label><select id="field-${field.key}" data-field="${field.key}">${options}</select></div>`;
  }
  if (field.type === 'checkbox') {
    return `<div class="field-group"><label class="inline-checkbox"><input id="field-${field.key}" data-field="${field.key}" type="checkbox" ${value ? 'checked' : ''} /> <span>${field.label}</span></label></div>`;
  }
  const isDigitsOnlyNumber = (
    ((state.type === 'phone' || state.type === 'sms') && field.key === 'number')
    || (state.type === 'twqr' && (field.key === 'bankCode' || field.key === 'bankAccount'))
  );
  const step = field.step ? `step="${field.step}"` : '';
  const inputType = isDigitsOnlyNumber ? 'text' : (field.type || 'text');
  const extraAttrs = isDigitsOnlyNumber ? 'inputmode="numeric" pattern="[0-9]*" autocomplete="off"' : '';
  return `<div class="field-group"><label for="field-${field.key}">${field.label}${field.required ? ' *' : ''}</label><input id="field-${field.key}" data-field="${field.key}" type="${inputType}" value="${escapeAttr(value)}" placeholder="${field.placeholder || ''}" ${step} ${extraAttrs} /></div>`;
}

function handleDynamicInput(event) {
  const key = event.target.dataset.field;
  if (!key) return;
  if ((state.type === 'phone' || state.type === 'sms') && key === 'number' && event.target.type !== 'checkbox') {
    const digitsOnly = String(event.target.value || '').replace(/\D/g, '');
    event.target.value = digitsOnly;
    state.values[key] = digitsOnly;
  } else {
    state.values[key] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
  }
  refreshQr();
}

function bindStaticControls() {
  elements.codeType.addEventListener('change', (event) => {
    state.type = event.target.value;
    resetValuesForType(state.type);
    renderDynamicFields();
    refreshQr();
  });

  bindValue('#qrSize', 'qr.size', (v) => {
    elements.qrSizeValue.textContent = `${v}px`;
  });
  bindValue('#backgroundAlpha', 'qr.backgroundAlpha', (v) => {
    elements.backgroundAlphaValue.textContent = `${v}%`;
  });
  bindValue('#minVersion', 'qr.minVersion', (v) => {
    elements.minVersionValue.textContent = Number(v) === 0 ? '自動' : String(v);
  });
  bindValue('#borderSize', 'qr.borderSize', (v) => {
    elements.borderSizeValue.textContent = `${v}px`;
  });
  bindValue('#logoTextSize', 'logo.textSize', (v) => {
    elements.logoTextSizeValue.textContent = `${v}px`;
  });
  bindValue('#logoTextPadding', 'logo.textPadding', (v) => {
    elements.logoTextPaddingValue.textContent = `${v}px`;
  });
  bindValue('#logoImageSize', 'logo.imageSize', (v) => {
    elements.logoImageSizeValue.textContent = `${v}%`;
  });
  bindValue('#logoImageBorder', 'logo.imageBorder', (v) => {
    elements.logoImageBorderValue.textContent = `${v}px`;
  });

  ['#qrColor', '#backgroundColor'].forEach((selector) => {
    document.querySelector(selector).addEventListener('input', handleStaticInput);
    document.querySelector(selector).addEventListener('change', handleStaticInput);
  });

  ['#logoText', '#logoTextColor', '#logoTextBgColor', '#logoFontFamily', '#logoImageBorderColor'].forEach((selector) => {
    document.querySelector(selector).addEventListener('input', handleStaticInput);
    document.querySelector(selector).addEventListener('change', handleStaticInput);
  });

  elements.logoImageInput.addEventListener('change', onLogoImageSelected);
  elements.scanImageInput.addEventListener('change', onScanImageSelected);
  elements.startCameraBtn.addEventListener('click', () => {
    if (cameraScanner) stopCameraScan();
    else startCameraScan();
  });
  elements.fileName.addEventListener('input', (event) => {
    state.export.fileName = event.target.value.trim();
    updateFileNamePlaceholder();
    refreshQr();
  });
  elements.downloadBtn.addEventListener('click', downloadQrCode);
  elements.copyBtn.addEventListener('click', copyQrCodeImage);
  if (elements.previewBgMode) {
    elements.previewBgMode.addEventListener('change', (event) => {
      state.preview.bgMode = event.target.checked ? 'dark' : 'light';
      updatePreviewBackground();
    });
  }

  if (elements.logoTextCornerStyle) bindSegmentedControl(elements.logoTextCornerStyle, 'textCornerStyle');
  if (elements.logoImageCornerStyle) bindSegmentedControl(elements.logoImageCornerStyle, 'imageCornerStyle');
  if (elements.errorCorrectionControl) bindSegmentedValueControl(elements.errorCorrectionControl, 'qr', 'errorCorrection');
  if (elements.dotStyleControl) bindSegmentedValueControl(elements.dotStyleControl, 'qr', 'dotStyle');
  if (elements.logoModeControl) bindSegmentedValueControl(elements.logoModeControl, 'logo', 'mode', () => toggleLogoPanels());
  if (elements.logoTextStyleControl) bindSegmentedValueControl(elements.logoTextStyleControl, 'logo', 'textStyle');
  if (elements.downloadFormatControl) bindSegmentedValueControl(elements.downloadFormatControl, 'export', 'format', null, { refresh: false });

  if (elements.previewBgMode) elements.previewBgMode.checked = state.preview.bgMode === 'dark';
  updateFileNamePlaceholder();
}

function bindValue(selector, path, callback, options = {}) {
  const el = document.querySelector(selector);
  const [group, key] = path.split('.');
  const update = (value) => {
    state[group][key] = typeof state[group][key] === 'number' ? Number(value) : value;
    callback?.(state[group][key]);
    if (options.refresh !== false) refreshQr();
  };
  callback?.(el.value);
  el.addEventListener('input', (e) => update(e.target.value));
  el.addEventListener('change', (e) => update(e.target.value));
}

function handleStaticInput(event) {
  const map = {
    qrColor: ['qr', 'color'],
    backgroundColor: ['qr', 'backgroundColor'],
    minVersion: ['qr', 'minVersion'],
    logoText: ['logo', 'text'],
    logoTextColor: ['logo', 'textColor'],
    logoTextBgColor: ['logo', 'textBgColor'],
    logoTextStyle: ['logo', 'textStyle'],
    logoFontFamily: ['logo', 'fontFamily'],
    logoImageBorderColor: ['logo', 'imageBorderColor']
  };
  const target = map[event.target.id];
  if (!target) return;
  state[target[0]][target[1]] = event.target.value;
  toggleLogoPanels();
  refreshQr();
}

function toggleLogoPanels() {
  elements.logoTextFields.hidden = state.logo.mode !== 'text';
  elements.logoImageFields.hidden = state.logo.mode !== 'image';
}

function buildQrPayload() {
  const validators = [];
  let payload = '';
  switch (state.type) {
    case 'url': {
      const url = (state.values.url || '').trim();
      if (!url) validators.push('請輸入網址');
      else if (!/^https?:\/\//i.test(url)) validators.push('網址需包含 http:// 或 https://');
      payload = url;
      break;
    }
    case 'wifi': {
      const ssid = escapeWifiValue(state.values.ssid || '');
      const password = escapeWifiValue(state.values.password || '');
      const encryption = state.values.encryption || 'WPA';
      if (!ssid) validators.push('Wi-Fi SSID 為必填');
      if (encryption !== 'nopass' && !password) validators.push('有加密時需填寫 Wi-Fi 密碼');
      payload = `WIFI:T:${encryption};S:${ssid};P:${password};H:${state.values.hidden ? 'true' : 'false'};;`;
      break;
    }
    case 'text': {
      if (!(state.values.text || '').trim()) validators.push('請輸入文字內容');
      payload = state.values.text || '';
      break;
    }
    case 'phone': {
      const number = normalizePhone(state.values.number || '');
      if (!number) validators.push('請輸入電話或手機號碼');
      payload = `tel:${number}`;
      break;
    }
    case 'sms': {
      const number = normalizePhone(state.values.number || '');
      if (!number) validators.push('請輸入簡訊收件號碼');
      const message = encodeURIComponent(state.values.message || '');
      payload = `sms:${number}${message ? `?body=${message}` : ''}`;
      break;
    }
    case 'twqr': {
      const result = buildTwqrPayload(state.values);
      payload = result.payload;
      validators.push(...result.errors);
      break;
    }
    default:
      break;
  }
  return { payload, errors: validators };
}

function buildTwqrPayload(values) {
  const errors = [];
  const bankCode = String(values.bankCode || '').trim().replace(/\D/g, '');
  const bankAccount = String(values.bankAccount || '').trim().replace(/\D/g, '');
  const amount = String(values.amount || '').trim();
  const note = String(values.note || '').trim();

  if (!/^\d{3}$/.test(bankCode)) errors.push('銀行代碼/代號需為 3 碼數字');
  if (!/^\d{10,16}$/.test(bankAccount)) errors.push('銀行帳號需為 10 到 16 碼數字');

  let amountInCents = '';
  if (amount) {
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      errors.push('轉帳金額需大於 0');
    } else {
      amountInCents = String(Math.round(parsedAmount * 100));
    }
  }

  const params = new URLSearchParams();
  if (bankCode) params.append('D5', bankCode);
  if (bankAccount) params.append('D6', bankAccount.padStart(16, '0'));
  if (amountInCents) params.append('D1', amountInCents);
  if (note) params.append('D9', note);
  params.append('D10', '901');

  const payload = `TWQRP://個人轉帳/158/02/V1?${params.toString()}`;
  return { payload, errors };
}

const QR_BYTE_CAPACITY = {
  L: [17,32,53,78,106,134,154,192,230,271,321,367,425,458,520,586,644,718,792,858,929,1003,1091,1171,1273,1367,1465,1528,1628,1732,1840,1952,2068,2188,2303,2431,2563,2699,2809,2953],
  M: [14,26,42,62,84,106,122,152,180,213,251,287,331,362,412,450,504,560,624,666,711,779,857,911,997,1059,1125,1190,1264,1370,1452,1538,1628,1722,1809,1911,1989,2099,2213,2331],
  Q: [11,20,32,46,60,74,86,108,130,151,177,203,241,258,292,322,364,394,442,482,509,565,611,661,715,751,805,868,908,982,1030,1112,1168,1228,1283,1351,1423,1499,1579,1663],
  H: [7,14,24,34,44,58,64,84,98,119,137,155,177,194,220,250,280,310,338,382,403,439,461,511,535,593,625,658,698,742,790,842,898,958,983,1051,1093,1139,1219,1273]
};

function refreshQr() {
  updatePreviewStageSize();
  toggleLogoPanels();
  const { payload, errors } = buildQrPayload();
  const fixMessages = [...errors];
  const riskMessages = [];
  const backgroundColor = hexToRgba(state.qr.backgroundColor, state.qr.backgroundAlpha / 100);
  const margin = Math.max(0, Number(state.qr.borderSize) || 0);

  const versionValidation = validateMinimumVersion(payload);
  if (versionValidation.level === 'fix') fixMessages.push(versionValidation.message);
  else if (versionValidation.level === 'risk') riskMessages.push(versionValidation.message);

  const logoValidation = validateLogoCoverage();
  if (logoValidation.level === 'fix') fixMessages.push(logoValidation.message);
  else if (logoValidation.level === 'risk') riskMessages.push(logoValidation.message);

  if (state.logo.mode === 'text' && !(state.logo.text || '').trim()) {
    riskMessages.push('目前已選文字 LOGO，但尚未輸入文字內容。');
  }
  if (state.logo.mode !== 'none' && state.qr.errorCorrection === 'L') {
    riskMessages.push('有 LOGO 時不建議使用低容錯率 (L)。');
  }
  if (state.type === 'twqr' && !state.values.amount) {
    riskMessages.push('TWQR 若要固定金額收款，建議填入轉帳金額。');
  }
  if (state.type === 'twqr' && state.values.note && String(state.values.note).trim().length > 20) {
    riskMessages.push('留言備註過長時，部分銀行 App 可能相容性較差。');
  }
  if (!state.export.fileName.trim()) {
    riskMessages.push('未設定檔案名稱');
  }

  const previewRenderSize = Math.max(100, Number(state.qr.size) || 280);
  const hasTextLogo = state.logo.mode === 'text' && (state.logo.text || '').trim();
  const hasImageLogo = state.logo.mode === 'image' && !!state.logo.imageDataUrl;
  const logoAsset = hasTextLogo
    ? buildTextLogoAsset(previewRenderSize)
    : (hasImageLogo ? buildImageLogoAsset(previewRenderSize) : null);
  currentLogoAsset = logoAsset;
  renderPreviewComposite(payload, margin, backgroundColor, logoAsset, previewRenderSize);

  if (elements.fixBox) {
    elements.fixBox.className = 'validation-card__body';
    if (fixMessages.length) {
      elements.fixBox.innerHTML = `- ${fixMessages.join('\n- ')}`;
      elements.fixBox.classList.add('is-empty-fix');
    } else {
      elements.fixBox.textContent = '無';
      elements.fixBox.classList.add('is-empty-none');
    }
  }
  if (elements.riskBox) {
    elements.riskBox.className = 'validation-card__body';
    if (riskMessages.length) {
      elements.riskBox.innerHTML = `- ${riskMessages.join('\n- ')}`;
      elements.riskBox.classList.add('is-empty-risk');
    } else {
      elements.riskBox.textContent = '無';
      elements.riskBox.classList.add('is-empty-none');
    }
  }
}

function validateMinimumVersion(payload) {
  const version = Number(state.qr.minVersion) || 0;
  if (!payload || version <= 0) return { level: 'ok', message: '' };
  const ecl = state.qr.errorCorrection;
  const capacity = QR_BYTE_CAPACITY[ecl]?.[version - 1];
  if (!capacity) return { level: 'ok', message: '' };
  const byteLength = new TextEncoder().encode(payload).length;
  if (byteLength > capacity) {
    return { level: 'fix', message: `Minimum Version ${version} 在 ${ecl} 容錯率下最多約可容納 ${capacity} bytes，目前內容約 ${byteLength} bytes，無法塞入。` };
  }
  const usage = byteLength / capacity;
  if (usage >= 0.9) {
    return { level: 'risk', message: `Minimum Version ${version} 內容使用量約 ${(usage * 100).toFixed(1)}%，接近上限，建議提高版本或改自動。` };
  }
  return { level: 'ok', message: '' };
}

function getTextLogoMetrics(renderSize = Math.max(100, Number(state.qr.size) || 280)) {
  const text = String(state.logo.text || '');
  if (!text.trim()) return null;
  const size = Number(state.logo.textSize) || 32;
  const padding = Math.max(0, Number(state.logo.textPadding) || 0);
  const canvasSize = Math.max(1, renderSize);
  const textWidth = Math.max(24, Math.round(text.length * size * 0.62));
  const textHeight = Math.max(size, Math.round(size * 1.08));
  if (state.logo.textStyle === 'box') {
    return { width: textWidth + padding * 2, height: textHeight + padding * 2 };
  }
  if (state.logo.textStyle === 'bar') {
    return { width: canvasSize, height: textHeight + padding * 2 };
  }
  if (state.logo.textStyle === 'outline') {
    return { width: textWidth + padding * 2, height: textHeight + padding * 2 };
  }
  return { width: textWidth, height: textHeight };
}

function getImageLogoMetrics(renderSize = Math.max(100, Number(state.qr.size) || 280)) {
  if (!state.logo.imageDataUrl) return null;
  const sizePercent = Math.max(0, Number(state.logo.imageSize) || 0);
  const border = Number(state.logo.imageBorder) || 0;
  const fullSize = Math.max(1, renderSize);
  const qrCanvasSize = Math.max(100, Number(state.qr.size) || 280);
  const ratio = (state.logo.imageNaturalWidth || 1) / Math.max(1, state.logo.imageNaturalHeight || 1);
  const scale = fullSize / qrCanvasSize;
  const targetMax = Math.max(1, qrCanvasSize * (sizePercent / 100) * scale);
  const scaledBorder = Math.max(0, border * scale);
  let imageWidth = targetMax;
  let imageHeight = Math.max(1, targetMax / ratio);
  if (imageHeight > targetMax) {
    imageHeight = targetMax;
    imageWidth = Math.max(1, targetMax * ratio);
  }
  return {
    width: Math.min(fullSize, imageWidth + scaledBorder * 2),
    height: Math.min(fullSize, imageHeight + scaledBorder * 2)
  };
}

function validateLogoCoverage() {
  const qrSize = Math.max(100, Number(state.qr.size) || 280);
  const qrArea = qrSize * qrSize;
  let metrics = null;
  if (state.logo.mode === 'text') metrics = getTextLogoMetrics(qrSize);
  if (state.logo.mode === 'image') metrics = getImageLogoMetrics(qrSize);
  if (!metrics) return { level: 'ok', message: '' };

  const coveredArea = metrics.width * metrics.height;
  const coverageRatio = coveredArea / qrArea;
  const eclMap = { L: 0.07, M: 0.15, Q: 0.25, H: 0.30 };
  const recoverableRatio = eclMap[state.qr.errorCorrection] || 0.15;
  const riskThreshold = recoverableRatio * 0.55;
  const failThreshold = recoverableRatio * 0.8;

  if (coverageRatio >= failThreshold) {
    return { level: 'fix', message: `LOGO 覆蓋面積約 ${(coverageRatio * 100).toFixed(1)}%，超過 ${(failThreshold * 100).toFixed(1)}% 上限，建議縮小LOGO、背景。` };
  }
  if (coverageRatio >= riskThreshold) {
    return { level: 'risk', message: `LOGO 覆蓋面積約 ${(coverageRatio * 100).toFixed(1)}%，超過 ${(riskThreshold * 100).toFixed(1)}% 上限，建議縮小LOGO、背景。` };
  }
  return { level: 'ok', message: '' };
}

function bindSegmentedControl(container, key) {
  const buttons = Array.from(container.querySelectorAll('[data-corner-style]'));
  const apply = (value) => {
    state.logo[key] = value;
    buttons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset.cornerStyle === value));
    refreshQr();
  };
  buttons.forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.cornerStyle === state.logo[key]);
    btn.addEventListener('click', () => apply(btn.dataset.cornerStyle));
  });
}

function bindSegmentedValueControl(container, group, key, afterChange = null, options = {}) {
  const buttons = Array.from(container.querySelectorAll('[data-segment-value]'));
  const sync = () => {
    buttons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset.segmentValue === String(state[group][key])));
  };
  const apply = (value) => {
    state[group][key] = value;
    sync();
    afterChange?.(value);
    if (options.refresh !== false) refreshQr();
  };
  buttons.forEach((btn) => btn.addEventListener('click', () => apply(btn.dataset.segmentValue)));
  sync();
}

function getSuggestedFileName() {
  switch (state.type) {
    case 'wifi':
      return (state.values.ssid || '').trim() || 'qrcode';
    case 'url': {
      const raw = (state.values.url || '').trim();
      try {
        return raw ? new URL(raw).hostname.replace(/^www\./, '') : 'qrcode';
      } catch {
        return raw || 'qrcode';
      }
    }
    case 'text':
      return ((state.values.text || '').trim().slice(0, 5)) || 'qrcode';
    case 'phone':
    case 'sms':
      return (state.values.number || '').trim() || 'qrcode';
    case 'twqr':
      return (`twqr-${(state.values.bankCode || '').trim()}`.replace(/-$/, '')) || 'qrcode';
    default:
      return 'qrcode';
  }
}

function updateFileNamePlaceholder() {
  if (!elements.fileName) return;
  elements.fileName.placeholder = getSuggestedFileName();
}

async function renderPreviewComposite(payload, margin, backgroundColor, logoAsset = currentLogoAsset, renderSize = Math.max(100, Number(state.qr.size) || 280)) {
  if (!elements.qrcodePreview) return;
  const token = ++previewRenderToken;
  const renderer = buildQrRenderer(renderSize);
  renderer.update({
    width: renderSize,
    height: renderSize,
    data: payload || ' ',
    margin,
    qrOptions: {
      typeNumber: Number(state.qr.minVersion),
      mode: 'Byte',
      errorCorrectionLevel: state.qr.errorCorrection,
    },
    dotsOptions: {
      color: state.qr.color,
      type: state.qr.dotStyle,
    },
    cornersSquareOptions: {
      color: state.qr.color,
      type: state.qr.dotStyle === 'dots' ? 'extra-rounded' : state.qr.dotStyle,
    },
    cornersDotOptions: {
      color: state.qr.color,
      type: state.qr.dotStyle === 'dots' ? 'dot' : 'square',
    },
    backgroundOptions: {
      color: backgroundColor,
    }
  });
  const raw = await renderer.getRawData('svg');
  if (token !== previewRenderToken) return;
  let svgText = await raw.text();
  if (token !== previewRenderToken) return;
  if (logoAsset?.dataUrl) {
    svgText = svgText.replace('</svg>', `<image href="${logoAsset.dataUrl}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"/></svg>`);
  }
  elements.qrcodePreview.innerHTML = svgText;
  if (elements.logoPreviewOverlay) elements.logoPreviewOverlay.innerHTML = '';
}

function buildQrRenderer(renderSize) {
  return new QRCodeStyling({
    width: renderSize,
    height: renderSize,
    type: 'svg',
    data: ' ',
    qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: state.qr.errorCorrection },
    dotsOptions: { color: state.qr.color, type: state.qr.dotStyle },
    cornersSquareOptions: { color: state.qr.color, type: state.qr.dotStyle === 'dots' ? 'extra-rounded' : state.qr.dotStyle },
    cornersDotOptions: { color: state.qr.color, type: state.qr.dotStyle === 'dots' ? 'dot' : 'square' },
    backgroundOptions: { color: hexToRgba(state.qr.backgroundColor, state.qr.backgroundAlpha / 100) },
    imageOptions: { crossOrigin: 'anonymous', margin: 0 }
  });
}

function buildTextLogoAsset(renderSize = Math.max(100, Number(state.qr.size) || 280)) {
  const text = escapeHtml(state.logo.text || '');
  const size = Number(state.logo.textSize) || 32;
  const padding = Math.max(0, Number(state.logo.textPadding) || 0);
  const font = state.logo.fontFamily;
  const canvasSize = Math.max(1, renderSize);
  const textWidth = Math.max(24, Math.round(text.length * size * 0.62));
  const textHeight = Math.max(size, Math.round(size * 1.08));
  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;
  let bg = '';
  let textStroke = '';

  if (state.logo.textStyle === 'box') {
    const boxWidth = textWidth + padding * 2;
    const boxHeight = textHeight + padding * 2;
    const boxX = (canvasSize - boxWidth) / 2;
    const boxY = (canvasSize - boxHeight) / 2;
    if (padding > 0) {
      bg = `<rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" rx="${state.logo.textCornerStyle === 'square' ? 0 : Math.min(16, padding)}" fill="${state.logo.textBgColor}" />`;
    }
  } else if (state.logo.textStyle === 'bar') {
    const barHeight = textHeight + padding * 2;
    const barY = (canvasSize - barHeight) / 2;
    bg = `<rect x="0" y="${barY}" width="${canvasSize}" height="${barHeight}" rx="${state.logo.textCornerStyle === 'square' ? 0 : Math.min(14, Math.round(barHeight / 3))}" fill="${state.logo.textBgColor}" />`;
  } else if (state.logo.textStyle === 'outline' && padding > 0) {
    textStroke = `stroke="${state.logo.textBgColor}" stroke-width="${padding}" paint-order="stroke fill" stroke-linejoin="round" stroke-linecap="round"`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}"><rect x="0" y="0" width="${canvasSize}" height="${canvasSize}" fill="transparent"/>${bg}<text x="${centerX}" y="${centerY}" dominant-baseline="central" text-anchor="middle" font-family="${font}" font-size="${size}px" font-weight="700" fill="${state.logo.textColor}" ${textStroke}>${text}</text></svg>`;
  return { dataUrl: svgToDataUrl(svg), outerSize: canvasSize };
}

function buildImageLogoAsset(renderSize = Math.max(100, Number(state.qr.size) || 280)) {
  const sizePercent = Math.max(0, Number(state.logo.imageSize) || 0);
  const border = Number(state.logo.imageBorder) || 0;
  const fullSize = Math.max(1, renderSize);
  const qrCanvasSize = Math.max(100, Number(state.qr.size) || 280);
  const ratio = (state.logo.imageNaturalWidth || 1) / Math.max(1, state.logo.imageNaturalHeight || 1);

  const scale = fullSize / qrCanvasSize;
  const targetMax = Math.max(1, qrCanvasSize * (sizePercent / 100) * scale);
  const scaledBorder = Math.max(0, border * scale);
  const center = fullSize / 2;

  let imageWidth = targetMax;
  let imageHeight = Math.max(1, targetMax / ratio);
  if (imageHeight > targetMax) {
    imageHeight = targetMax;
    imageWidth = Math.max(1, targetMax * ratio);
  }

  const frameW = Math.min(fullSize, imageWidth + scaledBorder * 2);
  const frameH = Math.min(fullSize, imageHeight + scaledBorder * 2);
  const frameX = center - frameW / 2;
  const frameY = center - frameH / 2;
  const imageX = frameX + scaledBorder;
  const imageY = frameY + scaledBorder;
  imageWidth = Math.max(1, frameW - scaledBorder * 2);
  imageHeight = Math.max(1, frameH - scaledBorder * 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${fullSize}" height="${fullSize}" viewBox="0 0 ${fullSize} ${fullSize}"><rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" rx="${state.logo.imageCornerStyle === 'square' ? 0 : Math.min(24, scaledBorder + 8)}" fill="${state.logo.imageBorderColor}"/><image href="${state.logo.imageDataUrl}" x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" preserveAspectRatio="xMidYMid meet"/></svg>`;
  return { dataUrl: svgToDataUrl(svg), outerSize: fullSize };
}

async function onLogoImageSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  state.logo.imageName = file.name;
  elements.logoImageName.textContent = file.name;
  state.logo.imageDataUrl = await fileToDataUrl(file);
  try {
    const img = await loadImage(state.logo.imageDataUrl);
    state.logo.imageNaturalWidth = img.naturalWidth || img.width || 1;
    state.logo.imageNaturalHeight = img.naturalHeight || img.height || 1;
  } catch (_) {
    state.logo.imageNaturalWidth = 1;
    state.logo.imageNaturalHeight = 1;
  }
  refreshQr();
}

async function onScanImageSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    let text = '';
    try {
      text = await scanQrFileWithHtml5Qrcode(file);
    } catch (_) {
      const dataUrl = await fileToDataUrl(file);
      text = await decodeQrFromImage(dataUrl);
    }
    if (!text) throw new Error('找不到 QRCode');
    applyDecodedText(text);
    elements.scanStatus.textContent = `已成功解析：${truncate(text, 120)}`;
  } catch (error) {
    elements.scanStatus.textContent = `掃描失敗：${error.message}`;
  } finally {
    event.target.value = '';
  }
}

async function decodeQrFromImage(dataUrl) {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  ctx.drawImage(image, 0, 0);

  const tries = [
    { sx: 1, sy: 1 },
    { sx: 0.75, sy: 0.75 },
    { sx: 0.5, sy: 0.5 }
  ];

  for (const attempt of tries) {
    const w = Math.max(1, Math.round(canvas.width * attempt.sx));
    const h = Math.max(1, Math.round(canvas.height * attempt.sy));
    const probeCanvas = document.createElement('canvas');
    const probeCtx = probeCanvas.getContext('2d', { willReadFrequently: true });
    probeCanvas.width = w;
    probeCanvas.height = h;
    probeCtx.drawImage(canvas, 0, 0, w, h);
    const imageData = probeCtx.getImageData(0, 0, w, h);
    const code = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
    if (code?.data) return code.data;
  }

  if ('BarcodeDetector' in window) {
    try {
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      const results = await detector.detect(image);
      if (results?.[0]?.rawValue) return results[0].rawValue;
    } catch (_) {}
  }

  return '';
}

async function startCameraScan() {
  try {
    elements.cameraReader.hidden = false;
    const uploadButton = elements.scanImageInput?.closest('.upload-button');
    uploadButton?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    elements.startCameraBtn.disabled = false;
    elements.startCameraBtn.textContent = '關閉鏡頭';
    elements.startCameraBtn.classList.add('ghost-button');
    cameraScanner = new Html5Qrcode('cameraReader');
    await cameraScanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (decodedText) => {
        applyDecodedText(decodedText);
        elements.scanStatus.textContent = `鏡頭掃描成功：${truncate(decodedText, 120)}`;
        stopCameraScan();
      },
      () => {}
    );
  } catch (error) {
    elements.scanStatus.textContent = `鏡頭啟動失敗：${error.message}`;
    stopCameraScan();
  }
}

async function stopCameraScan() {
  if (cameraScanner) {
    try { await cameraScanner.stop(); } catch (_) {}
    try { await cameraScanner.clear(); } catch (_) {}
    cameraScanner = null;
  }
  elements.cameraReader.hidden = true;
  elements.startCameraBtn.disabled = false;
  elements.startCameraBtn.textContent = '開啟鏡頭掃描';
  elements.startCameraBtn.classList.remove('ghost-button');
}

function applyDecodedText(text) {
  state.decodedRawText = text;
  const parsed = parseDecodedText(text);
  state.type = parsed.type;
  elements.codeType.value = parsed.type;
  resetValuesForType(parsed.type);
  Object.assign(state.values, parsed.values);
  renderDynamicFields();
  refreshQr();
}

function parseDecodedText(text) {
  if (/^WIFI:/i.test(text)) return parseWifi(text);
  if (/^https?:\/\//i.test(text)) return { type: 'url', values: { url: text } };
  if (/^tel:/i.test(text)) return { type: 'phone', values: { number: text.replace(/^tel:/i, '') } };
  if (/^sms:/i.test(text)) return parseSms(text);
  if (/^TWQRP:/i.test(text) || /^TWQRP%3A/i.test(text) || /^0002\d{2}01/i.test(text) || /6304[0-9A-F]{4}$/i.test(text)) return parseTwqr(text);
  return { type: 'text', values: { text } };
}

function parseWifi(text) {
  const values = { ssid: '', password: '', encryption: 'WPA', hidden: false };
  text.replace(/^WIFI:/i, '').split(';').forEach((part) => {
    const [k, ...rest] = part.split(':');
    const v = rest.join(':');
    if (k === 'S') values.ssid = unescapeWifiValue(v);
    if (k === 'P') values.password = unescapeWifiValue(v);
    if (k === 'T') values.encryption = v || 'WPA';
    if (k === 'H') values.hidden = /true/i.test(v);
  });
  return { type: 'wifi', values };
}

function parseSms(text) {
  const raw = text.replace(/^sms:/i, '');
  const [number, query = ''] = raw.split('?');
  const params = new URLSearchParams(query);
  return { type: 'sms', values: { number, message: params.get('body') || '' } };
}

function parseTwqr(text) {
  try {
    const decoded = /^TWQRP%3A/i.test(text) ? decodeURIComponent(text) : text;
    const url = new URL(decoded);
    const amountInCents = url.searchParams.get('D1') || '';
    return {
      type: 'twqr',
      values: {
        bankCode: url.searchParams.get('D5') || '',
        bankAccount: (url.searchParams.get('D6') || '').replace(/^0+(?=\d{10,16}$)/, ''),
        amount: amountInCents ? String(Number(amountInCents) / 100) : '',
        note: url.searchParams.get('D9') || ''
      }
    };
  } catch (_) {
    return {
      type: 'twqr',
      values: {
        bankCode: '',
        bankAccount: '',
        amount: '',
        note: ''
      }
    };
  }
}

async function downloadQrCode() {
  const ext = state.export.format;
  const fileName = (state.export.fileName.trim() || getSuggestedFileName() || 'qrcode').replace(/\.+$/,'');
  if (ext === 'svg') {
    const blob = await buildComposedSvgBlob();
    triggerBlobDownload(blob, `${fileName}.svg`);
    return;
  }
  const canvas = await buildComposedCanvas(ext === 'jpg' ? '#ffffff' : null);
  const mime = ext === 'png' ? 'image/png' : (ext === 'webp' ? 'image/webp' : 'image/jpeg');
  canvas.toBlob((blob) => triggerBlobDownload(blob, `${fileName}.${ext}`), mime, 0.96);
}

async function copyQrCodeImage() {
  try {
    const canvas = await buildComposedCanvas();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1));
    if (!blob) throw new Error('無法建立圖片');

    if (!isIosSafariLike && navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showCopyStatus('已複製圖片到剪貼簿');
      return;
    }

    if (typeof File !== 'undefined') {
      const file = new File([blob], `${getSuggestedFileName() || 'qrcode'}.png`, { type: 'image/png' });
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ files: [file], title: 'QRCode 圖片' });
        showCopyStatus('已開啟分享 / 儲存圖片');
        return;
      }
    }

    triggerBlobDownload(blob, `${getSuggestedFileName() || 'qrcode'}.png`);
    showCopyStatus('已改為下載圖片');
  } catch (error) {
    showCopyStatus(isIosSafariLike ? '此瀏覽器不支援直接複製圖片，請改用分享或下載。' : `複製失敗：${error.message}`, true);
  }
}

async function buildComposedCanvas(flattenBackground = null) {
  const renderSize = Math.max(100, Number(state.qr.size) || 280);
  const renderer = buildQrRenderer(renderSize);
  const { payload } = buildQrPayload();
  renderer.update({
    width: renderSize,
    height: renderSize,
    data: payload || ' ',
    margin: Math.max(0, Number(state.qr.borderSize) || 0),
    qrOptions: {
      typeNumber: Number(state.qr.minVersion),
      mode: 'Byte',
      errorCorrectionLevel: state.qr.errorCorrection,
    },
    dotsOptions: {
      color: state.qr.color,
      type: state.qr.dotStyle,
    },
    cornersSquareOptions: {
      color: state.qr.color,
      type: state.qr.dotStyle === 'dots' ? 'extra-rounded' : state.qr.dotStyle,
    },
    cornersDotOptions: {
      color: state.qr.color,
      type: state.qr.dotStyle === 'dots' ? 'dot' : 'square',
    },
    backgroundOptions: {
      color: hexToRgba(state.qr.backgroundColor, state.qr.backgroundAlpha / 100),
    }
  });
  const qrBlob = await renderer.getRawData('png');
  const qrImg = await loadImage(URL.createObjectURL(qrBlob));
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = qrImg.width;
  canvas.height = qrImg.height;
  if (flattenBackground) {
    ctx.fillStyle = flattenBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(qrImg, 0, 0);
  const exportLogoAsset = state.logo.mode === 'text' && (state.logo.text || '').trim()
    ? buildTextLogoAsset(renderSize)
    : (state.logo.mode === 'image' && state.logo.imageDataUrl ? buildImageLogoAsset(renderSize) : null);
  if (exportLogoAsset?.dataUrl) {
    const overlayImg = await loadImage(exportLogoAsset.dataUrl);
    ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
  }
  return canvas;
}

async function buildComposedSvgBlob() {
  const renderSize = Math.max(100, Number(state.qr.size) || 280);
  const renderer = buildQrRenderer(renderSize);
  const { payload } = buildQrPayload();
  renderer.update({
    width: renderSize,
    height: renderSize,
    data: payload || ' ',
    margin: Math.max(0, Number(state.qr.borderSize) || 0),
    qrOptions: {
      typeNumber: Number(state.qr.minVersion),
      mode: 'Byte',
      errorCorrectionLevel: state.qr.errorCorrection,
    },
    dotsOptions: {
      color: state.qr.color,
      type: state.qr.dotStyle,
    },
    cornersSquareOptions: {
      color: state.qr.color,
      type: state.qr.dotStyle === 'dots' ? 'extra-rounded' : state.qr.dotStyle,
    },
    cornersDotOptions: {
      color: state.qr.color,
      type: state.qr.dotStyle === 'dots' ? 'dot' : 'square',
    },
    backgroundOptions: {
      color: hexToRgba(state.qr.backgroundColor, state.qr.backgroundAlpha / 100),
    }
  });
  const raw = await renderer.getRawData('svg');
  let svgText = await raw.text();
  const exportLogoAsset = state.logo.mode === 'text' && (state.logo.text || '').trim()
    ? buildTextLogoAsset(renderSize)
    : (state.logo.mode === 'image' && state.logo.imageDataUrl ? buildImageLogoAsset(renderSize) : null);
  if (exportLogoAsset?.dataUrl) {
    svgText = svgText.replace('</svg>', `<image href="${exportLogoAsset.dataUrl}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"/></svg>`);
  }
  return new Blob([svgText], { type: 'image/svg+xml' });
}

function updatePreviewBackground() {
  if (!elements.previewCard) return;
  elements.previewCard.classList.toggle('preview-bg-dark', state.preview.bgMode === 'dark');
}

function updatePreviewStageSize() {
  if (!elements.previewCard || !elements.previewStage) return;
  const rect = elements.previewCard.getBoundingClientRect();
  const size = Math.max(120, Math.floor(Math.min(rect.width, rect.height)));
  elements.previewStage.style.setProperty('--preview-stage-size', `${size}px`);
}

function showCopyStatus(message, isError = false) {
  if (!elements.copyStatus) return;
  elements.copyStatus.textContent = message;
  elements.copyStatus.style.color = isError ? 'var(--danger)' : 'var(--ok)';
  clearTimeout(showCopyStatus._timer);
  showCopyStatus._timer = setTimeout(() => {
    if (elements.copyStatus.textContent === message) {
      elements.copyStatus.textContent = '';
    }
  }, 2400);
}

function syncCollapsibleState() {
  const isMobile = window.matchMedia('(max-width: 800px)').matches;
  if (lastMobileLayout === isMobile) return;
  lastMobileLayout = isMobile;
  document.querySelectorAll('.mobile-collapsible').forEach((detail) => {
    if (isMobile) {
      if (!detail.dataset.mobileOpen) detail.removeAttribute('open');
      else detail.setAttribute('open', 'open');
    } else {
      detail.setAttribute('open', 'open');
    }
  });
}

function bindMobileCollapsibleControls() {
  document.querySelectorAll('.mobile-collapsible > .panel-summary').forEach((summary) => {
    summary.addEventListener('click', (event) => {
      if (!window.matchMedia('(max-width: 800px)').matches) return;
      event.preventDefault();
      const detail = summary.parentElement;
      if (!detail) return;
      const nextOpen = !detail.hasAttribute('open');
      if (nextOpen) {
        detail.setAttribute('open', 'open');
        detail.dataset.mobileOpen = '1';
      } else {
        detail.removeAttribute('open');
        delete detail.dataset.mobileOpen;
      }
    });
  });
}

function detectIosSafariLike() {
  const ua = navigator.userAgent || '';
  const isIOS = /iP(ad|hone|od)/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isWebKit = /WebKit/i.test(ua);
  const isOtherBrowserShell = /CriOS|FxiOS|EdgiOS|OPiOS|YaBrowser/i.test(ua);
  return isIOS && isWebKit && !isOtherBrowserShell;
}

function updateCopyButtonLabel() {
  if (!elements.copyBtn) return;
  elements.copyBtn.textContent = isIosSafariLike ? '分享 / 儲存圖片' : '複製圖片到剪貼簿';
}

function triggerBlobDownload(blob, fileName) {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function scanQrFileWithHtml5Qrcode(file) {
  const mount = document.createElement('div');
  mount.id = `scan-file-${Date.now()}`;
  mount.style.position = 'fixed';
  mount.style.left = '-99999px';
  mount.style.top = '0';
  mount.style.width = '1px';
  mount.style.height = '1px';
  mount.style.opacity = '0';
  document.body.appendChild(mount);

  const scanner = new Html5Qrcode(mount.id);
  try {
    return await scanner.scanFile(file, true);
  } finally {
    try { await scanner.clear(); } catch (_) {}
    mount.remove();
  }
}

function tlv(id, value) {
  const stringValue = String(value ?? '');
  const length = String(stringValue.length).padStart(2, '0');
  return `${id}${length}${stringValue}`;
}

function parseTlvStream(text) {
  const map = {};
  let cursor = 0;
  while (cursor + 4 <= text.length) {
    const id = text.slice(cursor, cursor + 2);
    const len = Number(text.slice(cursor + 2, cursor + 4));
    const start = cursor + 4;
    const end = start + len;
    if (!Number.isFinite(len) || end > text.length) break;
    map[id] = text.slice(start, end);
    cursor = end;
  }
  return map;
}

function crc16(s) {
  let crc = 0xFFFF;
  for (let i = 0; i < s.length; i += 1) {
    crc ^= s.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j += 1) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatAmount(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2).replace(/\.00$/, '') : String(value);
}

function normalizePhone(input) {
  return String(input || '').trim().replace(/[\s()-]/g, '');
}

function escapeWifiValue(value) {
  return String(value).replace(/([\\;,:\"])/g, '\\$1');
}

function unescapeWifiValue(value) {
  return String(value).replace(/\\([\\;,:\"])/g, '$1');
}

function hexToRgba(hex, alpha = 1) {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3 ? normalized.split('').map((x) => x + x).join('') : normalized;
  const bigint = Number.parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function svgToDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function truncate(value, max) {
  const str = String(value || '');
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value = '') {
  return escapeHtml(value);
}

init();
