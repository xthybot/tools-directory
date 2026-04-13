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
      { key: 'payloadFormatIndicator', label: 'Payload Format Indicator', type: 'text', defaultValue: '01', required: true },
      { key: 'pointOfInitiationMethod', label: 'Point of Initiation Method', type: 'select', options: [{ value: '11', label: '11 - 靜態' }, { value: '12', label: '12 - 動態' }], defaultValue: '11', required: true },
      { key: 'merchantAccountGui', label: 'Merchant Account GUI', type: 'text', defaultValue: 'TWQR', required: true },
      { key: 'merchantAccountInfo', label: 'Merchant Account Info / Bank Routing / Merchant ID', type: 'text', required: true, placeholder: '依收款方規格填入主識別內容' },
      { key: 'merchantCategoryCode', label: 'Merchant Category Code', type: 'text', defaultValue: '0000', required: true },
      { key: 'transactionCurrency', label: 'Transaction Currency', type: 'text', defaultValue: '901', required: true },
      { key: 'transactionAmount', label: '交易金額', type: 'number', step: '0.01', placeholder: '可留空' },
      { key: 'countryCode', label: 'Country Code', type: 'text', defaultValue: 'TW', required: true },
      { key: 'merchantName', label: '收款人名稱', type: 'text', required: true },
      { key: 'merchantCity', label: '城市', type: 'text', defaultValue: 'TAIPEI', required: true }
    ],
    advancedFields: [
      { key: 'postalCode', label: 'Postal Code', type: 'text' },
      { key: 'billNumber', label: 'Bill Number', type: 'text' },
      { key: 'mobileNumber', label: 'Mobile Number', type: 'text' },
      { key: 'storeLabel', label: 'Store Label', type: 'text' },
      { key: 'loyaltyNumber', label: 'Loyalty Number', type: 'text' },
      { key: 'referenceLabel', label: 'Reference Label', type: 'text' },
      { key: 'customerLabel', label: 'Customer Label', type: 'text' },
      { key: 'terminalLabel', label: 'Terminal Label', type: 'text' },
      { key: 'purposeOfTransaction', label: 'Purpose of Transaction', type: 'text' },
      { key: 'merchantInformationLanguageTemplate', label: 'Merchant Information Language Template', type: 'text', placeholder: '例如: ZH' },
      { key: 'merchantAlternateName', label: 'Merchant Alternate Name', type: 'text' },
      { key: 'merchantAlternateCity', label: 'Merchant Alternate City', type: 'text' },
      { key: 'tipOrConvenienceIndicator', label: 'Tip / Convenience Indicator', type: 'select', options: [{ value: '', label: '不使用' }, { value: '01', label: '01 - Prompted to enter tip' }, { value: '02', label: '02 - Fixed convenience fee' }, { value: '03', label: '03 - Percentage convenience fee' }] },
      { key: 'valueOfConvenienceFeeFixed', label: 'Fixed Convenience Fee', type: 'number', step: '0.01' },
      { key: 'valueOfConvenienceFeePercentage', label: 'Convenience Fee Percentage', type: 'number', step: '0.01' },
      { key: 'merchantChannel', label: 'Merchant Channel / 自訂附加欄位', type: 'text' }
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
    imageSize: 64,
    imageBorder: 8,
    imageCornerStyle: 'rounded'
  },
  export: {
    fileName: 'xthy-qrcode',
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
  stopCameraBtn: document.querySelector('#stopCameraBtn'),
  cameraReader: document.querySelector('#cameraReader'),
  logoMode: document.querySelector('#logoMode'),
  logoTextFields: document.querySelector('#logoTextFields'),
  logoImageFields: document.querySelector('#logoImageFields'),
  logoImageInput: document.querySelector('#logoImageInput'),
  logoImageName: document.querySelector('#logoImageName'),
  fileName: document.querySelector('#fileName'),
  downloadFormat: document.querySelector('#downloadFormat'),
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

function init() {
  renderTypeOptions();
  renderVersionOptions();
  bindStaticControls();
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
  elements.dynamicFields.innerHTML = basicHtml + advancedHtml;

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
  const step = field.step ? `step="${field.step}"` : '';
  return `<div class="field-group"><label for="field-${field.key}">${field.label}${field.required ? ' *' : ''}</label><input id="field-${field.key}" data-field="${field.key}" type="${field.type || 'text'}" value="${escapeAttr(value)}" placeholder="${field.placeholder || ''}" ${step} /></div>`;
}

function handleDynamicInput(event) {
  const key = event.target.dataset.field;
  if (!key) return;
  state.values[key] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
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
  }, { refresh: false });
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
    elements.logoImageSizeValue.textContent = `${v}px`;
  });
  bindValue('#logoImageBorder', 'logo.imageBorder', (v) => {
    elements.logoImageBorderValue.textContent = `${v}px`;
  });

  ['#qrColor', '#backgroundColor', '#errorCorrection', '#dotStyle'].forEach((selector) => {
    document.querySelector(selector).addEventListener('input', handleStaticInput);
    document.querySelector(selector).addEventListener('change', handleStaticInput);
  });

  ['#logoMode', '#logoText', '#logoTextColor', '#logoTextBgColor', '#logoTextStyle', '#logoFontFamily'].forEach((selector) => {
    document.querySelector(selector).addEventListener('input', handleStaticInput);
    document.querySelector(selector).addEventListener('change', handleStaticInput);
  });

  elements.logoImageInput.addEventListener('change', onLogoImageSelected);
  elements.scanImageInput.addEventListener('change', onScanImageSelected);
  elements.startCameraBtn.addEventListener('click', startCameraScan);
  elements.stopCameraBtn.addEventListener('click', stopCameraScan);
  elements.fileName.addEventListener('input', (event) => {
    state.export.fileName = event.target.value.trim();
    updateFileNamePlaceholder();
    refreshQr();
  });
  elements.downloadFormat.addEventListener('change', (event) => { state.export.format = event.target.value; });
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

  document.querySelector('#logoMode').value = state.logo.mode;
  document.querySelector('#downloadFormat').value = state.export.format;
  if (elements.previewBgMode) elements.previewBgMode.checked = state.preview.bgMode === 'dark';
  updateFileNamePlaceholder();

  document.querySelectorAll('select').forEach((select) => {
    ['pointerdown', 'mousedown', 'click'].forEach((eventName) => {
      select.addEventListener(eventName, (event) => event.stopPropagation());
    });
  });
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
    errorCorrection: ['qr', 'errorCorrection'],
    dotStyle: ['qr', 'dotStyle'],
    minVersion: ['qr', 'minVersion'],
    logoMode: ['logo', 'mode'],
    logoText: ['logo', 'text'],
    logoTextColor: ['logo', 'textColor'],
    logoTextBgColor: ['logo', 'textBgColor'],
    logoTextStyle: ['logo', 'textStyle'],
    logoFontFamily: ['logo', 'fontFamily']
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
  const requiredKeys = ['payloadFormatIndicator', 'pointOfInitiationMethod', 'merchantAccountGui', 'merchantAccountInfo', 'merchantCategoryCode', 'transactionCurrency', 'countryCode', 'merchantName', 'merchantCity'];
  requiredKeys.forEach((key) => {
    if (!(values[key] || '').toString().trim()) errors.push(`TWQR 缺少必要欄位：${key}`);
  });
  if (values.transactionCurrency && values.transactionCurrency !== '901') errors.push('台灣 TWD 幣別通常應為 901');
  if (values.countryCode && String(values.countryCode).toUpperCase() !== 'TW') errors.push('TWQR Country Code 建議為 TW');
  if (values.payloadFormatIndicator && values.payloadFormatIndicator !== '01') errors.push('Payload Format Indicator 通常為 01');
  if (values.transactionAmount && Number(values.transactionAmount) < 0) errors.push('交易金額不可小於 0');

  const merchantAccountTemplate = [];
  merchantAccountTemplate.push(tlv('00', values.merchantAccountGui || 'TWQR'));
  merchantAccountTemplate.push(tlv('01', values.merchantAccountInfo || ''));
  if (values.merchantChannel) merchantAccountTemplate.push(tlv('02', values.merchantChannel));

  const additionalData = [];
  if (values.billNumber) additionalData.push(tlv('01', values.billNumber));
  if (values.mobileNumber) additionalData.push(tlv('02', values.mobileNumber));
  if (values.storeLabel) additionalData.push(tlv('03', values.storeLabel));
  if (values.loyaltyNumber) additionalData.push(tlv('04', values.loyaltyNumber));
  if (values.referenceLabel) additionalData.push(tlv('05', values.referenceLabel));
  if (values.customerLabel) additionalData.push(tlv('06', values.customerLabel));
  if (values.terminalLabel) additionalData.push(tlv('07', values.terminalLabel));
  if (values.purposeOfTransaction) additionalData.push(tlv('08', values.purposeOfTransaction));
  if (values.additionalConsumerDataRequest) additionalData.push(tlv('09', values.additionalConsumerDataRequest));

  const merchantLanguage = [];
  if (values.merchantInformationLanguageTemplate) merchantLanguage.push(tlv('00', values.merchantInformationLanguageTemplate));
  if (values.merchantAlternateName) merchantLanguage.push(tlv('01', values.merchantAlternateName));
  if (values.merchantAlternateCity) merchantLanguage.push(tlv('02', values.merchantAlternateCity));

  const records = [
    tlv('00', values.payloadFormatIndicator || '01'),
    tlv('01', values.pointOfInitiationMethod || '11'),
    tlv('26', merchantAccountTemplate.join('')),
    tlv('52', values.merchantCategoryCode || '0000'),
    tlv('53', values.transactionCurrency || '901')
  ];

  if (values.transactionAmount) records.push(tlv('54', formatAmount(values.transactionAmount)));
  if (values.tipOrConvenienceIndicator) records.push(tlv('55', values.tipOrConvenienceIndicator));
  if (values.valueOfConvenienceFeeFixed) records.push(tlv('56', formatAmount(values.valueOfConvenienceFeeFixed)));
  if (values.valueOfConvenienceFeePercentage) records.push(tlv('57', formatAmount(values.valueOfConvenienceFeePercentage)));

  records.push(tlv('58', (values.countryCode || 'TW').toUpperCase()));
  records.push(tlv('59', values.merchantName || ''));
  records.push(tlv('60', values.merchantCity || ''));
  if (values.postalCode) records.push(tlv('61', values.postalCode));
  if (additionalData.length) records.push(tlv('62', additionalData.join('')));
  if (merchantLanguage.length) records.push(tlv('64', merchantLanguage.join('')));

  let payloadWithoutCrc = records.join('') + '6304';
  const crc = crc16(payloadWithoutCrc);
  return { payload: payloadWithoutCrc + crc, errors };
}

function refreshQr() {
  updatePreviewStageSize();
  toggleLogoPanels();
  const { payload, errors } = buildQrPayload();
  const riskMessages = [];
  const backgroundColor = hexToRgba(state.qr.backgroundColor, state.qr.backgroundAlpha / 100);
  const margin = Math.max(0, Number(state.qr.borderSize) || 0);

  if (state.logo.mode === 'image' && state.logo.imageSize > state.qr.size * 0.5) {
    riskMessages.push('LOGO 圖片偏大，可能導致掃描失敗。');
  }
  if (state.logo.mode === 'text' && !(state.logo.text || '').trim()) {
    riskMessages.push('目前已選文字 LOGO，但尚未輸入文字內容。');
  }
  if (state.logo.mode === 'text' && (state.logo.text || '').length > 8 && state.logo.textSize > 42) {
    riskMessages.push('LOGO 文字較長且字體偏大，建議提高 ECL 或縮小字級。');
  }
  if (state.logo.mode !== 'none' && state.qr.errorCorrection === 'L') {
    riskMessages.push('有 LOGO 時不建議使用低容錯率 (L)。');
  }
  if (state.type === 'twqr' && !state.values.transactionAmount) {
    riskMessages.push('TWQR 若用於固定收款，建議填入交易金額。');
  }
  if (!state.export.fileName.trim()) {
    riskMessages.push(`未自訂檔案名稱，將使用預設：${getSuggestedFileName()}`);
  }

  const hasTextLogo = state.logo.mode === 'text' && (state.logo.text || '').trim();
  const hasImageLogo = state.logo.mode === 'image' && !!state.logo.imageDataUrl;
  const logoAsset = hasTextLogo
    ? buildTextLogoAsset(PREVIEW_RENDER_SIZE)
    : (hasImageLogo ? buildImageLogoAsset(PREVIEW_RENDER_SIZE) : null);
  currentLogoAsset = logoAsset;
  renderLogoPreviewOverlay(logoAsset);

  const image = undefined;
  const imageSize = 0.34;
  const imageMargin = 0;

  qrCode.update({
    width: PREVIEW_RENDER_SIZE,
    height: PREVIEW_RENDER_SIZE,
    data: payload || ' ',
    margin,
    qrOptions: {
      typeNumber: Number(state.qr.minVersion),
      mode: 'Byte',
      errorCorrectionLevel: state.qr.errorCorrection,
    },
    image,
    imageOptions: {
      hideBackgroundDots: false,
      imageSize,
      margin: imageMargin,
      crossOrigin: 'anonymous'
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

  if (elements.fixBox) {
    elements.fixBox.className = 'validation-card__body';
    if (errors.length) {
      elements.fixBox.innerHTML = `- ${errors.join('\n- ')}`;
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

function getSuggestedFileName() {
  switch (state.type) {
    case 'wifi':
      return (state.values.ssid || '').trim() || 'wifi-qrcode';
    case 'url': {
      const raw = (state.values.url || '').trim();
      try {
        return raw ? new URL(raw).hostname.replace(/^www\./, '') : 'url-qrcode';
      } catch {
        return raw || 'url-qrcode';
      }
    }
    case 'text':
      return ((state.values.text || '').trim().slice(0, 5)) || 'text-qrcode';
    case 'phone':
    case 'sms':
      return (state.values.number || '').trim() || 'phone-qrcode';
    case 'twqr':
      return (state.values.merchantName || '').trim() || 'twqr-qrcode';
    default:
      return 'xthy-qrcode';
  }
}

function updateFileNamePlaceholder() {
  if (!elements.fileName) return;
  elements.fileName.placeholder = getSuggestedFileName();
}

function renderLogoPreviewOverlay(logoAsset = currentLogoAsset) {
  if (!elements.logoPreviewOverlay) return;
  if (!logoAsset?.dataUrl) {
    elements.logoPreviewOverlay.innerHTML = '';
    return;
  }
  elements.logoPreviewOverlay.innerHTML = `<img src="${logoAsset.dataUrl}" alt="logo preview" style="width:100%;height:100%;object-fit:contain;display:block;" />`;
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

function buildTextLogoAsset(renderSize = PREVIEW_RENDER_SIZE) {
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

function buildImageLogoAsset(renderSize = PREVIEW_RENDER_SIZE) {
  const size = Number(state.logo.imageSize) || 64;
  const border = Number(state.logo.imageBorder) || 0;
  const fullSize = Math.max(1, renderSize);
  const ratio = (state.logo.imageNaturalWidth || 1) / Math.max(1, state.logo.imageNaturalHeight || 1);
  const targetMax = Math.max(24, Math.round((size / Math.max(100, state.qr.size)) * fullSize));
  const scaledBorder = Math.max(0, Math.round((border / Math.max(100, state.qr.size)) * fullSize));

  let imageWidth = targetMax;
  let imageHeight = Math.max(1, Math.round(targetMax / ratio));
  if (imageHeight > targetMax) {
    imageHeight = targetMax;
    imageWidth = Math.max(1, Math.round(targetMax * ratio));
  }

  const frameW = Math.min(fullSize, imageWidth + scaledBorder * 2);
  const frameH = Math.min(fullSize, imageHeight + scaledBorder * 2);
  const frameX = (fullSize - frameW) / 2;
  const frameY = (fullSize - frameH) / 2;
  const imageX = frameX + scaledBorder;
  const imageY = frameY + scaledBorder;
  imageWidth = Math.max(1, frameW - scaledBorder * 2);
  imageHeight = Math.max(1, frameH - scaledBorder * 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${fullSize}" height="${fullSize}" viewBox="0 0 ${fullSize} ${fullSize}"><rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" rx="${state.logo.imageCornerStyle === 'square' ? 0 : Math.min(24, scaledBorder + 8)}" fill="#ffffff"/><image href="${state.logo.imageDataUrl}" x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" preserveAspectRatio="xMidYMid meet"/></svg>`;
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
    const dataUrl = await fileToDataUrl(file);
    const text = await decodeQrFromImage(dataUrl);
    if (!text) throw new Error('找不到 QRCode');
    applyDecodedText(text);
    elements.scanStatus.textContent = `已成功解析：${truncate(text, 120)}`;
  } catch (error) {
    elements.scanStatus.textContent = `掃描失敗：${error.message}`;
  }
}

async function decodeQrFromImage(dataUrl) {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);
  return code?.data || '';
}

async function startCameraScan() {
  try {
    elements.cameraReader.hidden = false;
    elements.startCameraBtn.disabled = true;
    elements.stopCameraBtn.disabled = false;
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
  elements.stopCameraBtn.disabled = true;
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
  if (/^0002\d{2}01/i.test(text) || /6304[0-9A-F]{4}$/i.test(text)) return parseTwqr(text);
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
  const tlvs = parseTlvStream(text);
  const account = parseTlvStream(tlvs['26'] || '');
  const additional = parseTlvStream(tlvs['62'] || '');
  const lang = parseTlvStream(tlvs['64'] || '');
  return {
    type: 'twqr',
    values: {
      payloadFormatIndicator: tlvs['00'] || '01',
      pointOfInitiationMethod: tlvs['01'] || '11',
      merchantAccountGui: account['00'] || 'TWQR',
      merchantAccountInfo: account['01'] || '',
      merchantChannel: account['02'] || '',
      merchantCategoryCode: tlvs['52'] || '0000',
      transactionCurrency: tlvs['53'] || '901',
      transactionAmount: tlvs['54'] || '',
      tipOrConvenienceIndicator: tlvs['55'] || '',
      valueOfConvenienceFeeFixed: tlvs['56'] || '',
      valueOfConvenienceFeePercentage: tlvs['57'] || '',
      countryCode: tlvs['58'] || 'TW',
      merchantName: tlvs['59'] || '',
      merchantCity: tlvs['60'] || '',
      postalCode: tlvs['61'] || '',
      billNumber: additional['01'] || '',
      mobileNumber: additional['02'] || '',
      storeLabel: additional['03'] || '',
      loyaltyNumber: additional['04'] || '',
      referenceLabel: additional['05'] || '',
      customerLabel: additional['06'] || '',
      terminalLabel: additional['07'] || '',
      purposeOfTransaction: additional['08'] || '',
      merchantInformationLanguageTemplate: lang['00'] || '',
      merchantAlternateName: lang['01'] || '',
      merchantAlternateCity: lang['02'] || ''
    }
  };
}

async function downloadQrCode() {
  const ext = state.export.format;
  const fileName = (state.export.fileName || getSuggestedFileName() || 'xthy-qrcode').replace(/\.+$/,'');
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
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    showCopyStatus('已複製圖片');
  } catch (error) {
    showCopyStatus(`複製失敗：${error.message}`, true);
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
  document.querySelectorAll('.mobile-collapsible').forEach((detail) => {
    if (isMobile) {
      detail.removeAttribute('open');
    } else {
      detail.setAttribute('open', 'open');
    }
  });
}

function triggerBlobDownload(blob, fileName) {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
