const input = document.getElementById('markdownInput');
const markdownPreview = document.getElementById('markdownPreview');
const modeSwitch = document.getElementById('modeSwitch');
const playBtn = document.getElementById('playBtn');
const exportBtn = document.getElementById('exportBtn');
const presentation = document.getElementById('presentation');
const presentationSlide = document.getElementById('presentationSlide');
const presentationCounter = document.getElementById('presentationCounter');
const closePresentation = document.getElementById('closePresentation');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const presentationControls = document.getElementById('presentationControls');

let slides = [];
let currentSlideIndex = 0;
let previewMode = false;
let suppressPreviewSync = false;
let controlsTimer = null;

const sampleMarkdown = `# 專案總覽

## 主要目標

1. 建立靜態 Markdown 簡報工具
2. 用三條橫線分隔投影片
3. 匯出成 PDF

---

# 功能清單

## 編輯器

1. 原始碼模式
2. 預覽模式可直接修改
3. 播放模式全畫面展示

## 支援語法

1. 標題
2. 自動編號清單
3. 表格

---

# 表格範例

| 項目 | 狀態 | 備註 |
|---|---|---|
| Markdown 輸入 | 完成 | 純前端 |
| 預覽可編輯 | 完成 | 即時同步 |
| PDF 匯出 | 完成 | 使用瀏覽器列印 |
`;

input.value = sampleMarkdown;

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseInline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
}

function splitSlides(markdown) {
  return markdown
    .split(/^---\s*$/gm)
    .map(part => part.trim())
    .filter(Boolean);
}

function isTableStart(lines, index) {
  return (
    index + 1 < lines.length &&
    /^\s*\|.*\|\s*$/.test(lines[index]) &&
    /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1])
  );
}

function parseTable(lines, startIndex) {
  const rows = [];
  let index = startIndex;

  while (index < lines.length && /^\s*\|.*\|\s*$/.test(lines[index])) {
    rows.push(lines[index]);
    index += 1;
  }

  const cells = rows.map(row =>
    row
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(cell => parseInline(cell.trim()))
  );

  const header = cells[0] || [];
  const body = cells.slice(2);

  const html = [
    '<table>',
    '<thead><tr>',
    ...header.map(cell => `<th>${cell}</th>`),
    '</tr></thead>',
    '<tbody>',
    ...body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`),
    '</tbody>',
    '</table>'
  ].join('');

  return { html, nextIndex: index };
}

function getListInfo(line) {
  const match = line.match(/^(\s*)(-|\d+\.|[a-zA-Z]\.|[ivxlcdmIVXLCDM]+\.)\s+(.+)$/);
  if (!match) return null;

  const spaces = match[1].replace(/\t/g, '  ').length;
  const marker = match[2];
  const content = match[3];
  const level = Math.max(0, Math.floor(spaces / 2));
  const ordered = marker !== '-';

  return { level, ordered, content };
}

function closeLists(stack, targetLevel = -1) {
  let html = '';
  while (stack.length > 0 && stack[stack.length - 1].level > targetLevel) {
    html += `</li></${stack.pop().tag}>`;
  }
  return html;
}

function renderMarkdown(markdown) {
  const lines = markdown.split('\n');
  const listStack = [];
  let html = '';
  let paragraph = [];

  function flushParagraph() {
    if (paragraph.length) {
      html += `<p>${parseInline(paragraph.join(' '))}</p>`;
      paragraph = [];
    }
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      html += closeLists(listStack);
      continue;
    }

    if (isTableStart(lines, i)) {
      flushParagraph();
      html += closeLists(listStack);
      const result = parseTable(lines, i);
      html += result.html;
      i = result.nextIndex - 1;
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      html += closeLists(listStack);
      const level = heading[1].length;
      html += `<h${level}>${parseInline(heading[2])}</h${level}>`;
      continue;
    }

    const listInfo = getListInfo(line);
    if (listInfo) {
      flushParagraph();
      const tag = listInfo.ordered ? 'ol' : 'ul';
      const current = listStack[listStack.length - 1];

      if (!current || listInfo.level > current.level) {
        html += `<${tag}><li>`;
        listStack.push({ level: listInfo.level, tag });
      } else {
        while (listStack.length && listStack[listStack.length - 1].level > listInfo.level) {
          html += `</li></${listStack.pop().tag}>`;
        }

        const top = listStack[listStack.length - 1];
        if (!top || top.level < listInfo.level) {
          html += `<${tag}><li>`;
          listStack.push({ level: listInfo.level, tag });
        } else if (top.tag !== tag) {
          html += `</li></${listStack.pop().tag}><${tag}><li>`;
          listStack.push({ level: listInfo.level, tag });
        } else {
          html += '</li><li>';
        }
      }

      html += parseInline(listInfo.content);
      continue;
    }

    html += closeLists(listStack);
    paragraph.push(trimmed);
  }

  flushParagraph();
  html += closeLists(listStack);
  return `<div class="markdown-body">${html}</div>`;
}

function htmlToMarkdown(root) {
  function inlineText(node) {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const text = Array.from(node.childNodes).map(inlineText).join('');
    const tag = node.tagName.toLowerCase();

    if (tag === 'strong' || tag === 'b') return `**${text}**`;
    if (tag === 'em' || tag === 'i') return `*${text}*`;
    if (tag === 'code') return `\`${text}\``;
    if (tag === 'br') return '  \n';

    return text;
  }

  function listToMarkdown(listNode, depth = 0) {
    const ordered = listNode.tagName.toLowerCase() === 'ol';
    const items = Array.from(listNode.children)
      .filter(child => child.tagName && child.tagName.toLowerCase() === 'li')
      .map((li, index) => {
        const marker = ordered ? `${index + 1}. ` : '- ';
        const indent = '  '.repeat(depth);
        const parts = [];
        const nested = [];

        Array.from(li.childNodes).forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE && ['UL', 'OL'].includes(child.tagName)) {
            nested.push(child);
          } else {
            parts.push(inlineText(child));
          }
        });

        const line = `${indent}${marker}${parts.join('').trim()}`.trimEnd();
        const nestedText = nested.map(child => listToMarkdown(child, depth + 1)).filter(Boolean).join('\n');
        return nestedText ? `${line}\n${nestedText}` : line;
      });

    return items.join('\n');
  }

  function blockToMarkdown(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent.trim();
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const tag = node.tagName.toLowerCase();

    if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      const hashes = '#'.repeat(Number(tag[1]));
      return `${hashes} ${inlineText(node).trim()}`;
    }

    if (tag === 'p') {
      return inlineText(node).trim();
    }

    if (tag === 'ul' || tag === 'ol') {
      return listToMarkdown(node);
    }

    if (tag === 'table') {
      const rows = Array.from(node.querySelectorAll('tr')).map(tr =>
        Array.from(tr.children).map(cell => inlineText(cell).trim())
      );

      if (!rows.length) return '';

      const header = `| ${rows[0].join(' | ')} |`;
      const divider = `| ${rows[0].map(() => '---').join(' | ')} |`;
      const body = rows.slice(1).map(row => `| ${row.join(' | ')} |`);
      return [header, divider, ...body].join('\n');
    }

    if (tag === 'div' && node.classList.contains('markdown-body')) {
      return Array.from(node.childNodes)
        .map(blockToMarkdown)
        .filter(Boolean)
        .join('\n\n');
    }

    return inlineText(node).trim();
  }

  return Array.from(root.childNodes)
    .map(blockToMarkdown)
    .filter(Boolean)
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getSelectionBlockElement() {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return null;

  let node = selection.anchorNode;
  if (!node) return null;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;

  while (node && node !== markdownPreview) {
    if (node.nodeType === Node.ELEMENT_NODE && /^(P|LI|H1|H2|H3)$/.test(node.tagName)) {
      return node;
    }
    node = node.parentElement;
  }

  return null;
}

function placeCaretAtEnd(element) {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function syncPreviewToMarkdown() {
  const nextMarkdown = htmlToMarkdown(markdownPreview);
  input.value = nextMarkdown;
  renderAll();
}

function indentListItem(item, outdent = false) {
  if (!item || item.tagName !== 'LI') return false;

  const list = item.parentElement;
  if (!list || !['UL', 'OL'].includes(list.tagName)) return false;

  if (outdent) {
    const parentLi = list.closest('li');
    if (!parentLi) return false;

    const parentList = parentLi.parentElement;
    parentList.insertBefore(item, parentLi.nextSibling);

    if (!list.querySelector(':scope > li')) {
      list.remove();
    }

    placeCaretAtEnd(item);
    return true;
  }

  const prev = item.previousElementSibling;
  if (!prev || prev.tagName !== 'LI') return false;

  let nestedList = Array.from(prev.children).find(child => child.tagName === list.tagName);
  if (!nestedList) {
    nestedList = document.createElement(list.tagName.toLowerCase());
    prev.appendChild(nestedList);
  }

  nestedList.appendChild(item);
  placeCaretAtEnd(item);
  return true;
}

function handlePreviewEnter(event) {
  const block = getSelectionBlockElement();
  if (!block) return;

  if (block.tagName === 'LI') {
    event.preventDefault();
    const text = block.textContent.trim();

    if (!text) {
      const list = block.parentElement;
      const paragraph = document.createElement('p');
      paragraph.innerHTML = '<br>';
      list.parentElement.insertBefore(paragraph, list.nextSibling);
      block.remove();
      if (!list.querySelector(':scope > li')) list.remove();
      placeCaretAtEnd(paragraph);
    } else {
      const newItem = document.createElement('li');
      newItem.innerHTML = '<br>';
      block.parentElement.insertBefore(newItem, block.nextSibling);
      placeCaretAtEnd(newItem);
    }

    syncPreviewToMarkdown();
    return;
  }

  if (block.tagName === 'P') {
    event.preventDefault();
    const newParagraph = document.createElement('p');
    newParagraph.innerHTML = '<br>';
    block.insertAdjacentElement('afterend', newParagraph);
    placeCaretAtEnd(newParagraph);
    syncPreviewToMarkdown();
  }
}

function handlePreviewTab(event) {
  const block = getSelectionBlockElement();
  if (!block || block.tagName !== 'LI') return;

  event.preventDefault();
  const moved = indentListItem(block, event.shiftKey);
  if (moved) {
    syncPreviewToMarkdown();
  }
}

function renderAll() {
  slides = splitSlides(input.value);
  suppressPreviewSync = true;
  markdownPreview.innerHTML = renderMarkdown(input.value);
  suppressPreviewSync = false;

  if (!slides.length) {
    slides = [''];
  }

  if (!presentation.classList.contains('hidden')) {
    currentSlideIndex = Math.min(currentSlideIndex, slides.length - 1);
    updatePresentationSlide();
  }
}

function updateModeSwitch() {
  modeSwitch.setAttribute('aria-checked', String(previewMode));
  modeSwitch.textContent = previewMode ? '預覽：開啟' : '預覽：關閉';
}

function setEditorMode(enabled) {
  previewMode = enabled;
  updateModeSwitch();
  input.classList.toggle('hidden', enabled);
  markdownPreview.classList.toggle('hidden', !enabled);
}

function wrapSelection(prefix, suffix = '') {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const selected = input.value.slice(start, end);
  const next = selected ? `${prefix}${selected}${suffix}` : prefix;
  input.setRangeText(next, start, end, 'end');
  input.focus();
  renderAll();
}

function applyStyle(style) {
  const templates = {
    h1: { prefix: '# ', suffix: '' },
    h2: { prefix: '## ', suffix: '' },
    h3: { prefix: '### ', suffix: '' },
    ul: { prefix: '- ', suffix: '' },
    ol1: { prefix: '1. ', suffix: '' },
    ol2: { prefix: '  1. ', suffix: '' },
    ol3: { prefix: '    1. ', suffix: '' },
    table: {
      prefix: '\n| 欄位 1 | 欄位 2 | 欄位 3 |\n|---|---|---|\n| 內容 | 內容 | 內容 |\n',
      suffix: ''
    }
  };

  const item = templates[style];
  if (!item) return;
  wrapSelection(item.prefix, item.suffix);
}

function openPresentation() {
  if (!slides.length) return;
  currentSlideIndex = 0;
  presentation.classList.remove('hidden');
  presentation.setAttribute('aria-hidden', 'false');
  updatePresentationSlide();
  revealControls();
}

function closePresentationMode() {
  presentation.classList.add('hidden');
  presentation.setAttribute('aria-hidden', 'true');
  clearTimeout(controlsTimer);

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function updatePresentationSlide() {
  presentationSlide.innerHTML = renderMarkdown(slides[currentSlideIndex]);
  presentationCounter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
}

function goToSlide(offset) {
  currentSlideIndex = Math.max(0, Math.min(slides.length - 1, currentSlideIndex + offset));
  updatePresentationSlide();
}

function revealControls() {
  presentationControls.classList.add('visible');
  clearTimeout(controlsTimer);
  controlsTimer = setTimeout(() => {
    presentationControls.classList.remove('visible');
  }, 2200);
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await presentation.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.error('fullscreen error', error);
  }
}

input.addEventListener('input', renderAll);
modeSwitch.addEventListener('click', () => setEditorMode(!previewMode));
playBtn.addEventListener('click', openPresentation);
exportBtn.addEventListener('click', () => window.print());
closePresentation.addEventListener('click', closePresentationMode);
fullscreenBtn.addEventListener('click', toggleFullscreen);

markdownPreview.addEventListener('input', () => {
  if (suppressPreviewSync || !previewMode) return;
  syncPreviewToMarkdown();
});

markdownPreview.addEventListener('keydown', event => {
  if (!previewMode) return;

  if (event.key === 'Enter') {
    handlePreviewEnter(event);
    return;
  }

  if (event.key === 'Tab') {
    handlePreviewTab(event);
  }
});

document.querySelectorAll('.toolbar button').forEach(button => {
  button.addEventListener('click', () => applyStyle(button.dataset.style));
});

document.addEventListener('keydown', event => {
  const isOpen = !presentation.classList.contains('hidden');
  if (!isOpen) return;

  if (event.key === 'Escape') closePresentationMode();
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
    event.preventDefault();
    goToSlide(1);
    revealControls();
  }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    event.preventDefault();
    goToSlide(-1);
    revealControls();
  }
});

presentation.addEventListener('wheel', event => {
  if (Math.abs(event.deltaY) < 20) return;
  goToSlide(event.deltaY > 0 ? 1 : -1);
  revealControls();
}, { passive: true });

presentation.addEventListener('mousemove', event => {
  const nearRight = window.innerWidth - event.clientX < 180;
  const nearBottom = window.innerHeight - event.clientY < 140;
  if (nearRight && nearBottom) {
    revealControls();
  }
});

document.addEventListener('fullscreenchange', () => {
  fullscreenBtn.textContent = document.fullscreenElement ? '⤢' : '⛶';
  revealControls();
});

setEditorMode(false);
renderAll();
