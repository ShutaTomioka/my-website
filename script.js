// --- ダークモード切り替え ---
const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('change', () => {
  if (toggle.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
});

// --- モーダルの開閉制御 ---
const btn = document.getElementById('btn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('modal-close');

// ボタン押下でモーダルを表示
btn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

// ×ボタンでモーダルを非表示
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// モーダル外クリックでも閉じる
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
