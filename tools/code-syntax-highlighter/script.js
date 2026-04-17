const THEME_STYLESHEET = document.getElementById('hljs-theme');
const languageSelect = document.getElementById('languageSelect');
const themeSelect = document.getElementById('themeSelect');
const codeInput = document.getElementById('codeInput');
const previewCode = document.getElementById('previewCode');
const sampleBtn = document.getElementById('sampleBtn');
const clearBtn = document.getElementById('clearBtn');
const copyRawBtn = document.getElementById('copyRawBtn');
const copyHtmlBtn = document.getElementById('copyHtmlBtn');
const copyTextBtn = document.getElementById('copyTextBtn');
const statusText = document.getElementById('statusText');
const metaText = document.getElementById('metaText');
const themeIndicator = document.getElementById('themeIndicator');
const editorStack = document.getElementById('editorStack');

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
  {
    label: 'GitHub Light',
    value: 'github',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css',
    mode: 'light',
    previewBg: '#ffffff'
  },
  {
    label: 'GitHub Dark',
    value: 'github-dark',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css',
    mode: 'dark',
    previewBg: '#0d1117'
  },
  {
    label: 'Atom One Light',
    value: 'atom-one-light',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-light.min.css',
    mode: 'light',
    previewBg: '#fafafa'
  },
  {
    label: 'Atom One Dark',
    value: 'atom-one-dark',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css',
    mode: 'dark',
    previewBg: '#282c34'
  },
  {
    label: 'StackOverflow Light',
    value: 'stackoverflow-light',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/stackoverflow-light.min.css',
    mode: 'light',
    previewBg: '#ffffff'
  },
  {
    label: 'StackOverflow Dark',
    value: 'stackoverflow-dark',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/stackoverflow-dark.min.css',
    mode: 'dark',
    previewBg: '#1c1b1b'
  },
  {
    label: 'Nord',
    value: 'nord',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/nord.min.css',
    mode: 'dark',
    previewBg: '#2e3440'
  }
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

function setStatus(text) {
  statusText.textContent = text;
}

function populateSelect(select, list) {
  select.innerHTML = list.map(item => `<option value="${item.value}">${item.label}</option>`).join('');
}

function getSelectedTheme() {
  return THEMES.find(theme => theme.value === themeSelect.value) || THEMES[0];
}

function applyThemeVisual(theme) {
  THEME_STYLESHEET.href = theme.href;
  themeIndicator.textContent = `${theme.label} · ${theme.mode === 'dark' ? 'Dark' : 'Light'}`;
  document.body.classList.toggle('theme-dark', theme.mode === 'dark');
  document.documentElement.style.setProperty('--preview-bg', theme.previewBg);
}

function getHighlightLanguage(language) {
  const aliasMap = {
    shellsession: 'shell'
  };
  return aliasMap[language] || language;
}

function syncScroll() {
  const highlightLayer = previewCode.parentElement;
  if (!highlightLayer) return;
  highlightLayer.scrollTop = codeInput.scrollTop;
  highlightLayer.scrollLeft = codeInput.scrollLeft;
}

function highlightCurrentCode() {
  const raw = codeInput.value;
  const selectedLanguage = languageSelect.value;

  metaText.textContent = `${raw.length} 字元`;

  if (!raw.trim()) {
    previewCode.textContent = codeInput.placeholder || '把程式碼貼上來後，這裡會立即顯示上色結果。';
    previewCode.className = 'language-plaintext';
    setStatus('等待輸入');
    syncScroll();
    return;
  }

  try {
    let result;

    if (selectedLanguage === 'auto') {
      result = hljs.highlightAuto(raw);
      previewCode.className = `hljs language-${result.language || 'plaintext'}`;
      previewCode.innerHTML = result.value;
      setStatus(`已自動判斷語言：${result.language || 'plaintext'}`);
    } else {
      const highlightLanguage = getHighlightLanguage(selectedLanguage);
      result = hljs.highlight(raw, { language: highlightLanguage, ignoreIllegals: true });
      previewCode.className = `hljs language-${highlightLanguage}`;
      previewCode.innerHTML = result.value;
      const selectedLabel = LANGUAGES.find(item => item.value === selectedLanguage)?.label || selectedLanguage;
      setStatus(`已套用語言：${selectedLabel}`);
    }
  } catch (error) {
    previewCode.textContent = raw;
    previewCode.className = 'hljs language-plaintext';
    setStatus('語法高亮失敗，已退回純文字');
    console.error(error);
  }

  syncScroll();
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

function getSampleForLanguage(language) {
  if (SAMPLE_SNIPPETS[language]) return SAMPLE_SNIPPETS[language];
  return SAMPLE_SNIPPETS.javascript;
}

function buildStyledHtmlSnippet() {
  const codeClone = previewCode.cloneNode(true);
  const allNodes = [codeClone, ...codeClone.querySelectorAll('*')];

  allNodes.forEach(node => {
    if (!(node instanceof HTMLElement)) return;
    const computed = window.getComputedStyle(node);
    node.style.color = computed.color;
    node.style.backgroundColor = 'transparent';
    node.style.fontWeight = computed.fontWeight;
    node.style.fontStyle = computed.fontStyle;
    node.style.textDecoration = computed.textDecoration;
  });

  const previewStyles = window.getComputedStyle(previewCode);
  const wrapper = document.createElement('pre');
  wrapper.style.margin = '0';
  wrapper.style.padding = '22px';
  wrapper.style.borderRadius = '16px';
  wrapper.style.overflowX = 'auto';
  wrapper.style.whiteSpace = 'pre';
  wrapper.style.tabSize = '2';
  wrapper.style.background = getComputedStyle(document.documentElement).getPropertyValue('--preview-bg').trim() || '#ffffff';
  wrapper.style.minHeight = '100%';
  wrapper.style.color = previewStyles.color;
  wrapper.style.fontFamily = previewStyles.fontFamily;
  wrapper.style.fontSize = previewStyles.fontSize;
  wrapper.style.lineHeight = previewStyles.lineHeight;
  wrapper.appendChild(codeClone);

  return {
    html: wrapper.outerHTML,
    text: previewCode.textContent || ''
  };
}

function initialize() {
  populateSelect(languageSelect, LANGUAGES);
  populateSelect(themeSelect, THEMES);

  languageSelect.value = 'javascript';
  themeSelect.value = 'github';
  codeInput.value = SAMPLE_SNIPPETS.javascript;

  applyThemeVisual(getSelectedTheme());
  highlightCurrentCode();
  syncScroll();
}

languageSelect.addEventListener('change', () => {
  highlightCurrentCode();
});

themeSelect.addEventListener('change', () => {
  applyThemeVisual(getSelectedTheme());
  highlightCurrentCode();
});

codeInput.addEventListener('input', () => {
  highlightCurrentCode();
});

codeInput.addEventListener('scroll', syncScroll);
editorStack.addEventListener('click', () => codeInput.focus());

sampleBtn.addEventListener('click', () => {
  const selectedLanguage = languageSelect.value === 'auto' ? 'javascript' : languageSelect.value;
  codeInput.value = getSampleForLanguage(selectedLanguage);
  highlightCurrentCode();
  setStatus('已載入範例');
});

clearBtn.addEventListener('click', () => {
  codeInput.value = '';
  highlightCurrentCode();
  setStatus('已清空內容');
});

copyRawBtn.addEventListener('click', () => {
  copyText(codeInput.value, '已複製原始碼');
});

copyHtmlBtn.addEventListener('click', () => {
  copyText(previewCode.outerHTML, '已複製上色後 HTML');
});

copyTextBtn.addEventListener('click', () => {
  const snippet = buildStyledHtmlSnippet();
  copyRichHtml(snippet.html, snippet.text, '已複製帶樣式內容');
});

initialize();
