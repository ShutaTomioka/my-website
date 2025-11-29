function setupNav(toggleId, menuId) {
  const btn = document.getElementById(toggleId);
  const menu = document.getElementById(menuId);
  if (btn && menu) {
      btn.addEventListener('click', () => {
          menu.classList.toggle('open');
          const isExpanded = menu.classList.contains('open');
          btn.setAttribute('aria-expanded', isExpanded);
          // ハンバーガーメニューアイコンの切り替え（簡易的）
          btn.textContent = isExpanded ? '✕' : '☰';
      });
      // リンククリック時に閉じる
      menu.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
              menu.classList.remove('open');
              btn.textContent = '☰';
          });
      });
  }
}

function setupParticles(theme) {
  if (typeof particlesJS !== 'undefined') {
      const particlesColor = theme === 'dark' ? '#ffffff' : '#1565c0'; // テーマに合わせて青か白か
      const particleCanvas = document.getElementById('particles-js');
      if (particleCanvas) particleCanvas.innerHTML = '';

      particlesJS('particles-js', {
          "particles": {
              "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
              "color": { "value": particlesColor },
              "shape": { "type": "circle" },
              "opacity": { "value": 0.3, "random": false },
              "size": { "value": 4, "random": true },
              "line_linked": { "enable": true, "distance": 150, "color": particlesColor, "opacity": 0.2, "width": 1 },
              "move": { "enable": true, "speed": 2, "direction": "none", "out_mode": "out" }
          },
          "interactivity": {
              "detect_on": "canvas",
              "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } }
          },
          "retina_detect": true
      });
  }
}

function setupThemeToggle(toggleClass) {
  const themeToggles = document.querySelectorAll(`.${toggleClass}`);
  if (themeToggles.length > 0) {
      const currentTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      setupParticles(currentTheme);

      themeToggles.forEach(btn => {
          const icon = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
          btn.textContent = icon;

          btn.addEventListener('click', () => {
              const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
              document.documentElement.setAttribute('data-theme', nextTheme);
              localStorage.setItem('theme', nextTheme);
              btn.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
              setupParticles(nextTheme);
          });
      });
  }
}

function setupToTop(id) {
  const btn = document.getElementById(id);
  if (btn) {
      window.addEventListener('scroll', () => {
          btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
      });
      btn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
}

// 日記データの取得と表示ヘルパー
function getDiaryEntry(date) {
  const diaryFullSection = document.getElementById('diary-full');
  if (!diaryFullSection) return null;
  const article = diaryFullSection.querySelector(`article[data-date="${date}"]`);
  if (article) {
      return {
          title: article.querySelector('h1')?.textContent || '',
          content: article.querySelector('p')?.innerHTML || ''
      };
  }
  return null;
}

// 最新の日記を表示
function displayLatestDiary() {
  const display = document.getElementById('latest-diary-display');
  const diaryFull = document.getElementById('diary-full');
  
  if (display && diaryFull) {
      const latestArticle = diaryFull.querySelector('article'); // 最初の子要素が最新と仮定
      if (latestArticle) {
          const title = latestArticle.querySelector('h1')?.textContent;
          const content = latestArticle.querySelector('p')?.innerHTML;
          display.innerHTML = `<h4>${title}</h4><p>${content}</p>`;
      } else {
          display.innerHTML = '<p>No entries yet.</p>';
      }
  }
}

// カレンダービューアーのセットアップ
function setupCalendarViewer() {
  const dateInput = document.getElementById('view-diary-date');
  const viewBtn = document.getElementById('view-diary-btn');
  const contentArea = document.getElementById('viewed-diary-content');
  const diaryFull = document.getElementById('diary-full');

  if (dateInput && viewBtn && contentArea && diaryFull) {
      
      // 1. 保存されている日記の中から最新の日付を探してデフォルト値にする
      let latestDate = '';
      diaryFull.querySelectorAll('article').forEach(art => {
          const d = art.getAttribute('data-date');
          if (!latestDate || d > latestDate) latestDate = d;
      });

      if (latestDate) {
          dateInput.value = latestDate;
          const entry = getDiaryEntry(latestDate);
          if (entry) contentArea.innerHTML = `<h4>${entry.title}</h4><p>${entry.content}</p>`;
      } else {
          // 日記がない場合は今日の日付
          dateInput.value = new Date().toISOString().split('T')[0];
      }

      // 閲覧ボタンイベント
      const showEntry = () => {
          const date = dateInput.value;
          const entry = getDiaryEntry(date);
          if (entry) {
              contentArea.innerHTML = `<h4>${entry.title}</h4><p>${entry.content}</p>`;
          } else {
              contentArea.innerHTML = `<p style="color:var(--error-color)">No entry found for ${date}.</p>`;
          }
      };

      viewBtn.addEventListener('click', showEntry);
      dateInput.addEventListener('change', showEntry);
  }
}

// 日記投稿モーダル (機能はモックアップ)
function setupDiaryModal() {
  const modal = document.getElementById('diary-modal');
  const openBtn = document.getElementById('open-diary-modal-btn');
  const closeBtn = document.querySelector('.diary-close-modal');
  const postBtn = document.getElementById('modal-post-diary-btn');
  const msg = document.getElementById('modal-diary-message');

  if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
          modal.style.display = 'flex';
          document.getElementById('modal-diary-date').value = new Date().toISOString().split('T')[0];
          msg.style.display = 'none';
      });
      
      // 閉じる処理
      const closeModal = () => modal.style.display = 'none';
      closeBtn.addEventListener('click', closeModal);
      window.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

      // 投稿処理
      postBtn.addEventListener('click', () => {
          const pw = document.getElementById('modal-diary-password').value;
          if (pw === 'shuta0426') {
              msg.textContent = 'Posted successfully! (Not saved to server)';
              msg.style.color = 'var(--primary)';
              msg.style.display = 'block';
              setTimeout(closeModal, 1500);
          } else {
              msg.textContent = 'Incorrect Password';
              msg.style.color = 'var(--error-color)';
              msg.style.display = 'block';
          }
      });
  }
}

function setupScrollAnimation() {
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
          }
      });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
  });
}

function setupGallery() {
  if (typeof Swiper !== 'undefined') {
      new Swiper('.gallery-swiper', {
          loop: true,
          slidesPerView: 1,
          spaceBetween: 20,
          pagination: { el: '.swiper-pagination', clickable: true },
          navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
          breakpoints: {
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
          }
      });
  }
}

function setupImageModal() {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const close = document.querySelector('.close-modal');

  document.querySelectorAll('.swiper-slide img').forEach(img => {
      img.addEventListener('click', () => {
          modal.style.display = 'flex';
          modalImg.src = img.src;
      });
  });

  if(close) close.addEventListener('click', () => modal.style.display = 'none');
  modal.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });
}

function setupProgressBar() {
  const bar = document.querySelector('.scroll-progress-bar');
  window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollTop / scrollHeight) * 100;
      bar.style.width = scrolled + "%";
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNav('nav-toggle', 'nav-menu');
  setupThemeToggle('theme-toggle');
  setupToTop('to-top');
  displayLatestDiary();
  setupCalendarViewer();
  setupDiaryModal();
  setupScrollAnimation();
  setupHeaderScroll();
  setupGallery();
  setupImageModal();
  setupProgressBar();
});