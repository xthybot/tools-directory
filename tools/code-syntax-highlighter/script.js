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
  { label: 'Command Line', value: 'shell' },
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
  javascript: `function greet(name) {
  return \`Hello, ${name}!\`;
}

const user = 'Xthy';
console.log(greet(user));`,
  typescript: `type User = {
  id: number;
  name: string;
};

const user: User = { id: 1, name: 'Xthy' };
console.log(user.name);`,
  python: `def greet(name: str) -> str:
    return f"Hello, {name}!"

user = "Xthy"
print(greet(user))`,
  bash: `#!/bin/bash
set -e

for file in *.js; do
  echo "Processing $file"
done`,
  shell: `#!/bin/bash
set -e

for file in *.js; do
  echo "Processing $file"
done`,
  sql: `SELECT id, name, created_at
FROM users
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 20;`,
  xml: `<!doctype html>
<html>
  <body>
    <h1>Hello World</h1>
  </body>
</html>`,
  json: `{
  "name": "Xthy",
  "role": "creator",
  "active": true
}`,
  yaml: `name: Xthy
role: creator
active: true`,
  css: `.card {
  border-radius: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #4f7cff, #6d5efc);
}`,
  markdown: `# Title

- item 1
- item 2

\`inline code\``,
  plaintext: `Plain text preview without syntax highlight.`
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

function highlightCurrentCode() {
  const raw = codeInput.value;
  const selectedLanguage = languageSelect.value;

  metaText.textContent = `${raw.length} 字元`;

  if (!raw.trim()) {
    previewCode.textContent = '把程式碼貼上來後，這裡會立即顯示上色結果。';
    previewCode.className = 'language-plaintext';
    setStatus('等待輸入');
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
      result = hljs.highlight(raw, { language: selectedLanguage, ignoreIllegals: true });
      previewCode.className = `hljs language-${selectedLanguage}`;
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

function getSampleForLanguage(language) {
  const aliasMap = {
    c: 'plaintext',
    cpp: 'plaintext',
    csharp: 'plaintext',
    go: 'plaintext',
    rust: 'plaintext',
    java: 'plaintext',
    php: 'plaintext',
    ruby: 'plaintext',
    swift: 'plaintext',
    kotlin: 'plaintext'
  };

  const resolved = aliasMap[language] || language;
  if (SAMPLE_SNIPPETS[resolved]) return SAMPLE_SNIPPETS[resolved];
  return SAMPLE_SNIPPETS.javascript;
}

function initialize() {
  populateSelect(languageSelect, LANGUAGES);
  populateSelect(themeSelect, THEMES);

  languageSelect.value = 'javascript';
  themeSelect.value = 'github';
  codeInput.value = SAMPLE_SNIPPETS.javascript;

  applyThemeVisual(getSelectedTheme());
  highlightCurrentCode();
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
  copyText(previewCode.textContent || '', '已複製純文字');
});

initialize();
