const state = {
  tools: [],
  activeTag: '全部',
  query: '',
};

const elements = {
  searchInput: document.querySelector('#searchInput'),
  tagList: document.querySelector('#tagList'),
  toolsGrid: document.querySelector('#toolsGrid'),
  resultsCount: document.querySelector('#resultsCount'),
  emptyState: document.querySelector('#emptyState'),
  clearFiltersBtn: document.querySelector('#clearFiltersBtn'),
};

async function loadTools() {
  try {
    const response = await fetch('assets/data/tools.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.tools = Array.isArray(data) ? data : [];
    renderAll();
  } catch (error) {
    console.error('Failed to load tools:', error);
    elements.resultsCount.textContent = '資料載入失敗';
    elements.toolsGrid.innerHTML = '<div class="tool-card"><p>無法載入工具資料。</p></div>';
  }
}

function getAllTags() {
  const tags = new Set(['全部']);
  state.tools.forEach((tool) => {
    (tool.tags || []).forEach((tag) => tags.add(tag));
  });
  return [...tags];
}

function filterTools() {
  const query = state.query.trim().toLowerCase();

  return state.tools.filter((tool) => {
    const matchesTag = state.activeTag === '全部' || (tool.tags || []).includes(state.activeTag);
    const searchableText = [
      tool.title,
      tool.description,
      ...(tool.tags || []),
      tool.link,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesQuery = !query || searchableText.includes(query);
    return matchesTag && matchesQuery;
  });
}

function renderTags() {
  const tags = getAllTags();
  elements.tagList.innerHTML = tags
    .map(
      (tag) => `
        <button
          type="button"
          class="tag-chip ${tag === state.activeTag ? 'is-active' : ''}"
          data-tag="${escapeHtml(tag)}"
        >
          ${escapeHtml(tag)}
        </button>
      `
    )
    .join('');

  elements.tagList.querySelectorAll('.tag-chip').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeTag = button.dataset.tag;
      renderAll();
    });
  });
}

function renderTools() {
  const filteredTools = filterTools();
  elements.resultsCount.textContent = `共 ${filteredTools.length} 個工具`;

  if (!filteredTools.length) {
    elements.toolsGrid.innerHTML = '';
    elements.emptyState.hidden = false;
    return;
  }

  elements.emptyState.hidden = true;
  elements.toolsGrid.innerHTML = filteredTools
    .map((tool) => {
      const tagsHtml = (tool.tags || [])
        .map((tag) => `<span class="tool-tag">${escapeHtml(tag)}</span>`)
        .join('');
      return `
        <article class="tool-card">
          <a
            class="tool-card__link"
            href="${escapeAttribute(tool.link)}"
            target="_blank"
            rel="noreferrer noopener"
          >
            <div class="tool-card__top">
              <div class="tool-card__icon-wrap">
                <img class="tool-card__icon" src="${escapeAttribute(tool.icon)}" alt="${escapeAttribute(tool.title)} icon" />
              </div>
              <div class="tool-card__title-wrap">
                <div class="tool-card__heading-row">
                  <h3 class="tool-card__title">${escapeHtml(tool.title)}</h3>
                </div>
                <p class="tool-card__desc">${escapeHtml(tool.description)}</p>
              </div>
            </div>
            <div class="tool-card__bottom">
              <div class="tool-card__tags">${tagsHtml}</div>
              <span class="tool-card__cta">開啟工具 ↗</span>
            </div>
          </a>
        </article>
      `;
    })
    .join('');
}

function renderAll() {
  renderTags();
  renderTools();
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value = '') {
  return escapeHtml(value);
}

elements.searchInput?.addEventListener('input', (event) => {
  state.query = event.target.value || '';
  renderTools();
});

elements.clearFiltersBtn?.addEventListener('click', () => {
  state.activeTag = '全部';
  state.query = '';
  if (elements.searchInput) elements.searchInput.value = '';
  renderAll();
});

loadTools();
