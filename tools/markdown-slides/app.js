const input = document.getElementById('markdownInput');
const markdownPreview = document.getElementById('markdownPreview');
const slidesContainer = document.getElementById('slidesContainer');
const slideCount = document.getElementById('slideCount');
const sourceTab = document.getElementById('sourceTab');
const previewTab = document.getElementById('previewTab');
const playBtn = document.getElementById('playBtn');
const exportBtn = document.getElementById('exportBtn');
const presentation = document.getElementById('presentation');
const presentationSlide = document.getElementById('presentationSlide');
const presentationCounter = document.getElementById('presentationCounter');
const closePresentation = document.getElementById('closePresentation');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');

let slides = [];
let currentSlideIndex = 0;

const sampleMarkdown = `# Project Overview

## Main Goals

- Build a static Markdown slide tool
- Split pages with three dashes
- Export slides as PDF

---

# Feature List

## Editor

1. Source mode
   a. Edit Markdown
      i. Support nested ordered list
2. Preview mode

## Supported Syntax

- # heading
- ## heading
- ### heading

---

# Table Example

| Item | Status | Notes |
|---|---|---|
| Markdown input | Done | Static only |
| Slide preview | Done | Split by --- |
| PDF export | Done | Browser print |
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
  const level = Math.min(Math.floor(spaces / 2), 2);

  let tag = 'ul';
  let type = '';
  if (/^\d+\.$/.test(marker)) {
    tag = 'ol';
    type = '1';
  } else if (/^[a-zA-Z]\.$/.test(marker)) {
    tag = 'ol';
    type = 'a';
  } else if (/^[ivxlcdmIVXLCDM]+\.$/.test(marker)) {
    tag = 'ol';
    type = 'i';
  }

  return { level, tag, type, content };
}

function closeLists(stack, targetLevel = -1) {
  let html = '';
  while (stack.length > 0 && stack[stack.length - 1].level > targetLevel) {
    html += `</${stack.pop().tag}>`;
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
      const current = listStack[listStack.length - 1];

      if (!current || listInfo.level > current.level) {
        const typeAttr = listInfo.type ? ` type="${listInfo.type}"` : '';
        html += `<${listInfo.tag}${typeAttr}>`;
        listStack.push({ level: listInfo.level, tag: listInfo.tag, type: listInfo.type });
      } else {
        html += closeLists(listStack, listInfo.level - 1);
        const top = listStack[listStack.length - 1];
        if (!top || top.tag !== listInfo.tag || top.type !== listInfo.type) {
          if (top && top.level === listInfo.level) html += closeLists(listStack, listInfo.level - 1);
          const typeAttr = listInfo.type ? ` type="${listInfo.type}"` : '';
          html += `<${listInfo.tag}${typeAttr}>`;
          listStack.push({ level: listInfo.level, tag: listInfo.tag, type: listInfo.type });
        }
      }

      html += `<li>${parseInline(listInfo.content)}</li>`;
      continue;
    }

    html += closeLists(listStack);
    paragraph.push(trimmed);
  }

  flushParagraph();
  html += closeLists(listStack);
  return `<div class="markdown-body">${html}</div>`;
}

function renderAll() {
  slides = splitSlides(input.value);
  slideCount.textContent = `${slides.length} slide${slides.length === 1 ? '' : 's'}`;
  markdownPreview.innerHTML = renderMarkdown(input.value);

  slidesContainer.innerHTML = slides
    .map((slide, index) => `
      <article class="slide-page">
        <div class="slide-number">Slide ${index + 1}</div>
        ${renderMarkdown(slide)}
      </article>
    `)
    .join('');
}

function setEditorMode(mode) {
  const preview = mode === 'preview';
  sourceTab.classList.toggle('active', !preview);
  previewTab.classList.toggle('active', preview);
  input.classList.toggle('hidden', preview);
  markdownPreview.classList.toggle('hidden', !preview);
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
    ol2: { prefix: '  a. ', suffix: '' },
    ol3: { prefix: '    i. ', suffix: '' },
    table: {
      prefix: '\n| Column 1 | Column 2 | Column 3 |\n|---|---|---|\n| Value | Value | Value |\n',
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
}

function closePresentationMode() {
  presentation.classList.add('hidden');
  presentation.setAttribute('aria-hidden', 'true');
}

function updatePresentationSlide() {
  presentationSlide.innerHTML = renderMarkdown(slides[currentSlideIndex]);
  presentationCounter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
}

function goToSlide(offset) {
  currentSlideIndex = Math.max(0, Math.min(slides.length - 1, currentSlideIndex + offset));
  updatePresentationSlide();
}

input.addEventListener('input', renderAll);
sourceTab.addEventListener('click', () => setEditorMode('source'));
previewTab.addEventListener('click', () => setEditorMode('preview'));
playBtn.addEventListener('click', openPresentation);
exportBtn.addEventListener('click', () => window.print());
closePresentation.addEventListener('click', closePresentationMode);
prevSlideBtn.addEventListener('click', () => goToSlide(-1));
nextSlideBtn.addEventListener('click', () => goToSlide(1));

document.querySelectorAll('.toolbar button').forEach(button => {
  button.addEventListener('click', () => applyStyle(button.dataset.style));
});

document.addEventListener('keydown', event => {
  const isOpen = !presentation.classList.contains('hidden');
  if (!isOpen) return;

  if (event.key === 'Escape') closePresentationMode();
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') goToSlide(1);
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') goToSlide(-1);
});

presentation.addEventListener('wheel', event => {
  if (Math.abs(event.deltaY) < 20) return;
  goToSlide(event.deltaY > 0 ? 1 : -1);
}, { passive: true });

renderAll();
