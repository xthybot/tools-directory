const profileWidget = document.querySelector('#profileWidget');
const profileToggle = document.querySelector('#profileToggle');
const profileCard = document.querySelector('#profileCard');

if (profileWidget && profileToggle && profileCard) {
  const compactLayout = window.matchMedia('(max-width: 1759px)');

  function setProfileOpen(open, restoreFocus = false) {
    profileCard.hidden = compactLayout.matches && !open;
    profileToggle.setAttribute('aria-expanded', String(!profileCard.hidden));
    profileToggle.setAttribute('aria-label', profileCard.hidden ? '開啟個人介紹' : '關閉個人介紹');
    if (restoreFocus) profileToggle.focus();
  }

  function syncProfileLayout() {
    const focusInsideCard = profileCard.contains(document.activeElement);
    const focusOnToggle = document.activeElement === profileToggle;
    setProfileOpen(!compactLayout.matches, compactLayout.matches && focusInsideCard);
    if (!compactLayout.matches && focusOnToggle) {
      profileCard.querySelector('a')?.focus();
    }
  }

  profileToggle.addEventListener('click', () => {
    setProfileOpen(profileCard.hidden);
  });

  document.addEventListener('click', (event) => {
    if (compactLayout.matches && !profileCard.hidden && !profileWidget.contains(event.target)) {
      setProfileOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && compactLayout.matches && !profileCard.hidden) {
      setProfileOpen(false, true);
    }
  });

  compactLayout.addEventListener('change', syncProfileLayout);
  profileWidget.classList.add('is-ready');
  syncProfileLayout();
}
