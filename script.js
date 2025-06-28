// ナビゲーションのトグル
function setupNav(toggleId, menuId) {
    const toggle = document.getElementById(toggleId);
    const menu = document.getElementById(menuId);
    toggle.addEventListener('click', () => {
      menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    });
  }
  
  setupNav('nav-toggle', 'nav-menu');
  setupNav('nav-toggle-diary', 'nav-menu-diary');