// ナビゲーションメニューの開閉を制御
function setupNav(toggleId, menuId) {
    const btn = document.getElementById(toggleId);
    const menu = document.getElementById(menuId);
    if (btn && menu) {
      btn.addEventListener('click', () => {
        menu.classList.toggle('open');
        const isExpanded = menu.classList.contains('open');
        btn.setAttribute('aria-expanded', isExpanded);
      });
      // ナビゲーションリンクをクリックしたらメニューを閉じる
      menu.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }
  
  // テーマの切り替えを制御
  function setupThemeToggle(toggleClass) {
    const themeToggles = document.querySelectorAll(`.${toggleClass}`);
    if (themeToggles.length > 0) {
      // ページ読み込み時にローカルストレージからテーマを読み込み
      const currentTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      
      // 各ボタンにイベントリスナーを設定
      themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
          const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', nextTheme);
          localStorage.setItem('theme', nextTheme);
          btn.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
          btn.setAttribute('aria-label', nextTheme === 'dark' ? 'Toggle light theme' : 'Toggle dark theme');
        });
        // 初期状態で正しいアイコンを表示
        const icon = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
        btn.textContent = icon;
        btn.setAttribute('aria-label', icon === '☀️' ? 'Toggle light theme' : 'Toggle dark theme');
      });
    }
  }
  
  // ページトップへ戻るボタンの制御
  function setupToTop(id) {
    const btn = document.getElementById(id);
    if (btn) {
      window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
      });
      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
  
  // 日記の表示・非表示を切り替える機能
  function setupDiaryToggle() {
    const readMoreBtn = document.querySelector('.read-more-btn');
    const diaryFullSection = document.getElementById('diary-full');
    const backBtn = document.querySelector('.back-to-diary-btn');
    const latestDiarySection = document.getElementById('diary');
    
    if (readMoreBtn && diaryFullSection && backBtn && latestDiarySection) {
      readMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        diaryFullSection.style.display = 'block';
        diaryFullSection.scrollIntoView({ behavior: 'smooth' });
      });
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        diaryFullSection.style.display = 'none';
        latestDiarySection.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }
  
  // セクションがビューポートに入ったらアニメーションを適用
  function setupScrollAnimation() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // 一度アニメーションしたら監視を停止
        }
      });
    }, observerOptions);
  
    document.querySelectorAll('.fade-in').forEach(section => {
      observer.observe(section);
    });
  }
  
  // 全てのセットアップ関数を実行
  document.addEventListener('DOMContentLoaded', () => {
    setupNav('nav-toggle', 'nav-menu');
    setupThemeToggle('theme-toggle');
    setupToTop('to-top');
    setupDiaryToggle();
    setupScrollAnimation();
  });