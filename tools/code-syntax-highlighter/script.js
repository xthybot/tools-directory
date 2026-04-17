const THEME_STYLESHEET = document.getElementById('hljs-theme');
const languageSelect = document.getElementById('languageSelect');
const themeSelect = document.getElementById('themeSelect');
const indentSizeSelect = document.getElementById('indentSizeSelect');
const editor = document.getElementById('editor');
const editorHost = document.getElementById('editorHost');
const sampleBtn = document.getElementById('sampleBtn');
const clearBtn = document.getElementById('clearBtn');
const copyRawBtn = document.getElementById('copyRawBtn');
const copyHtmlBtn = document.getElementById('copyHtmlBtn');
const copyTextBtn = document.getElementById('copyTextBtn');
const statusText = document.getElementById('statusText');
const metaText = document.getElementById('metaText');
const themeIndicator = document.getElementById('themeIndicator');

const PLACEHOLDER = `把你的程式碼貼在這裡，例如：
#!/bin/bash
for file in *.js; do
  echo "Processing $file"
done`;

const LANGUAGES = [
  { label: 'Auto Detect', value: 'auto' },
  { label: 'Plain Text', value: 'plaintext' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'HTML / XML', value: 'xml' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'Python', value: 'python' },
  { label: 'Bash', value: 'bash' },
  { label: 'Shell', value: 'shell' },
  { label: 'Command Line', value: 'shellsession' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'YAML', value: 'yaml' },
  { label: 'SQL', value: 'sql' },
  { label: 'Java', value: 'java' },
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' }
];

const THEMES = [
  { label: 'GitHub Light', value: 'github', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css', mode: 'light', previewBg: '#ffffff' },
  { label: 'GitHub Dark', value: 'github-dark', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css', mode: 'dark', previewBg: '#0d1117' },
  { label: 'Atom One Light', value: 'atom-one-light', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-light.min.css', mode: 'light', previewBg: '#fafafa' },
  { label: 'Atom One Dark', value: 'atom-one-dark', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css', mode: 'dark', previewBg: '#282c34' },
  { label: 'StackOverflow Light', value: 'stackoverflow-light', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/stackoverflow-light.min.css', mode: 'light', previewBg: '#ffffff' },
  { label: 'StackOverflow Dark', value: 'stackoverflow-dark', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/stackoverflow-dark.min.css', mode: 'dark', previewBg: '#1c1b1b' },
  { label: 'Nord', value: 'nord', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/nord.min.css', mode: 'dark', previewBg: '#2e3440' }
];

const SAMPLE_SNIPPETS = {
  auto: `const prices = [120, 80, 199];
const total = prices.reduce((sum, price) => sum + price, 0);
console.log({ total });`,
  plaintext: `This is plain text preview without syntax highlight.\nYou can paste logs, notes, or mixed snippets here.`,
  javascript: `function greet(name) {
  return \`Hello, ${name}!\`;
}

const user = 'Xthy';
console.log(greet(user));`,
  typescript: `type User = {
  id: number;
  name: string;
  active: boolean;
};

const user: User = { id: 1, name: 'Xthy', active: true };
console.log(user.name);`,
  xml: `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>Hello</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>`,
  css: `.card {
  border-radius: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #4f7cff, #6d5efc);
  color: white;
}`,
  json: `{
  "name": "Xthy",
  "role": "creator",
  "active": true,
  "tags": ["tools", "frontend"]
}`,
  python: `def greet(name: str) -> str:
    return f"Hello, {name}!"

user = "Xthy"
print(greet(user))`,
  bash: `#!/bin/bash
set -e

for file in *.js; do
  echo "Processing $file"
done`,
  shell: `export APP_ENV=production
pnpm install
pnpm run build`,
  shellsession: `$ git status --short
 M tools/code-syntax-highlighter/script.js
$ git add .
$ git commit -m "feat: improve tool"`,
  markdown: `# Title

- item 1
- item 2

\`inline code\``,
  yaml: `name: Xthy
role: creator
active: true
stack:
  - frontend
  - automation`,
  sql: `SELECT id, name, created_at
FROM users
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 20;`,
  java: `public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, Xthy!");
  }
}`,
  c: `#include <stdio.h>

int main(void) {
  printf("Hello, Xthy!\\n");
  return 0;
}`,
  cpp: `#include <iostream>
#include <vector>

int main() {
  std::vector<int> nums{1, 2, 3};
  std::cout << nums.size() << std::endl;
  return 0;
}`,
  csharp: `using System;

class Program {
  static void Main() {
    Console.WriteLine("Hello, Xthy!");
  }
}`,
  go: `package main

import "fmt"

func main() {
  fmt.Println("Hello, Xthy!")
}`,
  rust: `fn main() {
  let name = "Xthy";
  println!("Hello, {}!", name);
}`,
  php: `<?php
function greet(string $name): string {
    return "Hello, {$name}!";
}

echo greet('Xthy');`,
  ruby: `def greet(name)
  "Hello, #{name}!"
end

puts greet('Xthy')`,
  swift: `import Foundation

let name = "Xthy"
print("Hello, \(name)!")`,
  kotlin: `fun main() {
    val name = "Xthy"
    println("Hello, $name!")
}`
};

function setStatus(text) { statusText.textContent = text; }
function populateSelect(select, list) { select.innerHTML = list.map(item => `<option value="${item.value}">${item.label}</option>`).join(''); }
function getSelectedTheme() { return THEMES.find(theme => theme.value === themeSelect.value) || THEMES[0]; }
function getEditorText() { return editor.textContent || ''; }
function escapeHtml(text) { return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function getIndentUnit() { return ' '.repeat(Number(indentSizeSelect?.value || 2)); }

function applyThemeVisual(theme) {
  THEME_STYLESHEET.href = theme.href;
  themeIndicator.textContent = `${theme.label} · ${theme.mode === 'dark' ? 'Dark' : 'Light'}`;
  document.body.classList.toggle('theme-dark', theme.mode === 'dark');
  document.documentElement.style.setProperty('--preview-bg', theme.previewBg);
}

function getHighlightLanguage(language) {
  const aliasMap = { shellsession: 'shell' };
  return aliasMap[language] || language;
}

function getCaretOffset(root) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return 0;
  const range = sel.getRangeAt(0);
  const preRange = range.cloneRange();
  preRange.selectNodeContents(root);
  preRange.setEnd(range.endContainer, range.endOffset);
  return preRange.toString().length;
}

function setCaretOffset(root, offset) {
  const selection = window.getSelection();
  if (!selection) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let currentOffset = 0;
  let node;
  let lastTextNode = null;

  while ((node = walker.nextNode())) {
    lastTextNode = node;
    const nextOffset = currentOffset + node.nodeValue.length;
    if (offset <= nextOffset) {
      const range = document.createRange();
      range.setStart(node, Math.max(0, offset - currentOffset));
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    currentOffset = nextOffset;
  }

  if (lastTextNode) {
    const range = document.createRange();
    range.setStart(lastTextNode, lastTextNode.nodeValue.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    return;
  }

  const trailingNode = document.createTextNode('');
  root.appendChild(trailingNode);
  const range = document.createRange();
  range.setStart(trailingNode, 0);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function insertTextAtCaret(text, { moveCaret = true } = {}) {
  const current = getEditorText();
  const start = getCaretOffset(editor);
  const next = current.slice(0, start) + text + current.slice(start);
  editor.textContent = next;
  renderEditor({ preserveCaret: false });
  if (moveCaret) {
    requestAnimationFrame(() => {
      editor.focus();
      setCaretOffset(editor, start + text.length);
    });
  }
}

function getLineIndentBeforeCaret(text, caret) {
  const beforeCaret = text.slice(0, caret);
  const lineStart = beforeCaret.lastIndexOf('\n') + 1;
  const currentLine = beforeCaret.slice(lineStart);
  const indentMatch = currentLine.match(/^\s*/);
  const baseIndent = indentMatch ? indentMatch[0] : '';
  const trimmed = currentLine.trimEnd();
  const shouldIncrease = /[\{\[\(\:]$/.test(trimmed) || /\b(do|then|else|elif|case)\s*$/.test(trimmed);
  return baseIndent + (shouldIncrease ? getIndentUnit() : '');
}

function outdentCurrentLine() {
  const text = getEditorText();
  const caret = getCaretOffset(editor);
  const lineStart = text.lastIndexOf('\n', Math.max(0, caret - 1)) + 1;
  const rest = text.slice(lineStart);
  const line = rest.split('\n')[0];
  const indentUnit = getIndentUnit();

  let removeCount = 0;
  if (line.startsWith(indentUnit)) {
    removeCount = indentUnit.length;
  } else {
    const leadingSpaces = (line.match(/^ +/) || [''])[0].length;
    removeCount = Math.min(leadingSpaces, indentUnit.length);
  }

  if (!removeCount) return;

  const next = text.slice(0, lineStart) + text.slice(lineStart + removeCount);
  editor.textContent = next;
  renderEditor({ preserveCaret: false });
  requestAnimationFrame(() => {
    editor.focus();
    setCaretOffset(editor, Math.max(lineStart, caret - removeCount));
  });
}

function renderEditor({ preserveCaret = true } = {}) {
  const raw = getEditorText();
  const selectedLanguage = languageSelect.value;
  const caret = preserveCaret ? getCaretOffset(editor) : 0;
  const endsWithNewline = raw.endsWith('\n');
  metaText.textContent = `${raw.length} 字元`;

  if (!raw.trim()) {
    editor.className = 'editor-surface hljs language-plaintext';
    editor.innerHTML = '';
    editor.dataset.placeholder = PLACEHOLDER;
    setStatus('等待輸入');
    return;
  }

  delete editor.dataset.placeholder;

  try {
    let result;
    if (selectedLanguage === 'auto') {
      result = hljs.highlightAuto(raw);
      editor.className = `editor-surface hljs language-${result.language || 'plaintext'}`;
      editor.innerHTML = result.value;
      setStatus(`已自動判斷語言：${result.language || 'plaintext'}`);
    } else {
      const highlightLanguage = getHighlightLanguage(selectedLanguage);
      result = hljs.highlight(raw, { language: highlightLanguage, ignoreIllegals: true });
      editor.className = `editor-surface hljs language-${highlightLanguage}`;
      editor.innerHTML = result.value;
      const selectedLabel = LANGUAGES.find(item => item.value === selectedLanguage)?.label || selectedLanguage;
      setStatus(`已套用語言：${selectedLabel}`);
    }
  } catch (error) {
    editor.className = 'editor-surface hljs language-plaintext';
    editor.innerHTML = escapeHtml(raw);
    setStatus('語法高亮失敗，已退回純文字');
    console.error(error);
  }

  if (endsWithNewline) {
    editor.appendChild(document.createTextNode('\n'));
  }

  if (preserveCaret) setCaretOffset(editor, caret);
}

async function copyText(text, successMessage, failMessage = '複製失敗') {
  try {
    await navigator.clipboard.writeText(text);
    setStatus(successMessage);
  } catch (error) {
    console.error(error);
    setStatus(failMessage);
  }
}

async function copyRichHtml(html, plainText, successMessage, failMessage = '複製失敗') {
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plainText], { type: 'text/plain' })
      });
      await navigator.clipboard.write([item]);
    } else {
      await navigator.clipboard.writeText(plainText);
    }
    setStatus(successMessage);
  } catch (error) {
    console.error(error);
    setStatus(failMessage);
  }
}

function getSampleForLanguage(language) { return SAMPLE_SNIPPETS[language] || SAMPLE_SNIPPETS.javascript; }

function buildStyledHtmlSnippet() {
  const clone = editor.cloneNode(true);
  const allNodes = [clone, ...clone.querySelectorAll('*')];
  allNodes.forEach(node => {
    if (!(node instanceof HTMLElement)) return;
    const computed = window.getComputedStyle(node);
    node.style.color = computed.color;
    node.style.backgroundColor = 'transparent';
    node.style.fontWeight = '400';
    node.style.fontStyle = 'normal';
    node.style.textDecoration = computed.textDecoration;
  });

  const styles = window.getComputedStyle(editor);
  const wrapper = document.createElement('pre');
  wrapper.style.margin = '0';
  wrapper.style.padding = '22px';
  wrapper.style.borderRadius = '16px';
  wrapper.style.overflowX = 'auto';
  wrapper.style.whiteSpace = 'pre';
  wrapper.style.tabSize = '2';
  wrapper.style.background = getComputedStyle(document.documentElement).getPropertyValue('--preview-bg').trim() || '#ffffff';
  wrapper.style.color = styles.color;
  wrapper.style.fontFamily = styles.fontFamily;
  wrapper.style.fontSize = styles.fontSize;
  wrapper.style.lineHeight = styles.lineHeight;
  wrapper.appendChild(clone);
  return { html: wrapper.outerHTML, text: getEditorText() };
}

function initialize() {
  populateSelect(languageSelect, LANGUAGES);
  populateSelect(themeSelect, THEMES);
  indentSizeSelect.value = '2';
  languageSelect.value = 'javascript';
  themeSelect.value = 'github';
  editor.textContent = SAMPLE_SNIPPETS.javascript;
  applyThemeVisual(getSelectedTheme());
  renderEditor({ preserveCaret: false });
}

editor.addEventListener('input', () => renderEditor());
editor.addEventListener('keydown', event => {
  if (event.isComposing) return;

  if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();
    const text = getEditorText();
    const caret = getCaretOffset(editor);
    const indent = getLineIndentBeforeCaret(text, caret);
    insertTextAtCaret(`\n${indent}`);
    return;
  }

  if (event.key === 'Tab') {
    event.preventDefault();
    event.stopPropagation();
    if (event.shiftKey) {
      outdentCurrentLine();
    } else {
      insertTextAtCaret(getIndentUnit());
    }
  }
});
editor.addEventListener('paste', event => {
  event.preventDefault();
  const text = event.clipboardData?.getData('text/plain') || '';
  insertTextAtCaret(text);
});
languageSelect.addEventListener('change', () => renderEditor());
themeSelect.addEventListener('change', () => { applyThemeVisual(getSelectedTheme()); renderEditor(); });
indentSizeSelect.addEventListener('change', () => {
  editor.focus();
  setStatus(`縮排改為 ${indentSizeSelect.value} 個空格`);
});

sampleBtn.addEventListener('click', () => {
  const selectedLanguage = languageSelect.value === 'auto' ? 'javascript' : languageSelect.value;
  editor.textContent = getSampleForLanguage(selectedLanguage);
  renderEditor({ preserveCaret: false });
  setCaretOffset(editor, getEditorText().length);
  editor.focus();
  setStatus('已載入範例');
});
clearBtn.addEventListener('click', () => {
  editor.textContent = '';
  renderEditor({ preserveCaret: false });
  editor.focus();
  setStatus('已清空內容');
});
copyRawBtn.addEventListener('click', () => copyText(getEditorText(), '已複製原始碼'));
copyHtmlBtn.addEventListener('click', () => copyText(editor.outerHTML, '已複製上色後 HTML'));
copyTextBtn.addEventListener('click', () => {
  const snippet = buildStyledHtmlSnippet();
  copyRichHtml(snippet.html, snippet.text, '已複製帶樣式內容');
});

initialize();
