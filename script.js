
// 汎用ナビゲーション切り替え
function setupNav(toggleId, menuId) {
  const btn = document.getElementById(toggleId);
  const menu = document.getElementById(menuId);
  btn.addEventListener('click', () => menu.classList.toggle('open'));
}
setupNav('nav-toggle', 'nav-menu');
setupNav('nav-toggle-diary', 'nav-menu-diary');

// テーマ切替
document.querySelectorAll('.theme-toggle').forEach(btn => {
  const current = localStorage.getItem('theme') || 'light';
  if (current === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
});

// Back-to-top
function setupToTop(id) {
  const btn = document.getElementById(id);
  window.addEventListener('scroll', () => btn.style.display = window.scrollY > 300 ? 'block' : 'none');
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
setupToTop('to-top');
setupToTop('to-top-diary');