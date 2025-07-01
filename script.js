function setupNav(toggleId, menuId) {
    const btn = document.getElementById(toggleId);
    const menu = document.getElementById(menuId);
    if (btn && menu) {
      btn.addEventListener('click', () => {
        menu.classList.toggle('open');
        const isExpanded = menu.classList.contains('open');
        btn.setAttribute('aria-expanded', isExpanded);
      });
      // メニュー内のリンクをクリックした際にメニューを閉じる
      menu.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }
  
  // Particle.js の初期化
  function setupParticles(theme) {
    if (typeof particlesJS !== 'undefined') {
      const particlesColor = theme === 'dark' ? '#ffffff' : '#aaa'; 
      const particleCanvas = document.getElementById('particles-js');
      if (particleCanvas) {
          particleCanvas.innerHTML = '';
      }
      particlesJS('particles-js', {
        "particles": {
          "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
          "color": { "value": particlesColor }, 
          "shape": { "type": "circle" },
          "opacity": { "value": 0.5, "random": false },
          "size": { "value": 3, "random": true },
          "line_linked": { "enable": true, "distance": 150, "color": particlesColor, "opacity": 0.4, "width": 1 },
          "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
        },
        "retina_detect": true
      });
    }
  }
  
  // テーマの切り替えを制御
  function setupThemeToggle(toggleClass) {
    const themeToggles = document.querySelectorAll(`.${toggleClass}`);
    if (themeToggles.length > 0) {
      const currentTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      setupParticles(currentTheme); 
      
      themeToggles.forEach(btn => {
        const icon = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
        btn.textContent = icon;
        btn.setAttribute('aria-label', icon === '☀️' ? 'Toggle light theme' : 'Toggle dark theme');
  
        btn.addEventListener('click', () => {
          const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', nextTheme);
          localStorage.setItem('theme', nextTheme);
          btn.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
          btn.setAttribute('aria-label', nextTheme === 'dark' ? 'Toggle light theme' : 'Toggle dark theme');
          setupParticles(nextTheme); 
        });
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
  
  // 日記の表示・非表示を切り替える機能 (diary-full を表示/非表示)
  function setupDiaryToggle() {
    const readMoreBtn = document.querySelector('.read-more-btn');
    const diaryFullSection = document.getElementById('diary-full');
    const backToDiaryBtns = document.querySelectorAll('.back-to-diary-btn'); // 複数になる可能性
  
    if (readMoreBtn && diaryFullSection) {
      readMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        diaryFullSection.style.display = 'block';
        diaryFullSection.scrollIntoView({ behavior: 'smooth' });
      });
    }
    
    if (backToDiaryBtns.length > 0) {
      backToDiaryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (diaryFullSection) {
            diaryFullSection.style.display = 'none';
          }
          document.getElementById('diary').scrollIntoView({ behavior: 'smooth' });
        });
      });
    }
  }
  
  // 最新の日記エントリを diary-full から取得して表示する関数
  function displayLatestDiary() {
      const latestDiaryDisplay = document.getElementById('latest-diary-display');
      const diaryFullSection = document.getElementById('diary-full');
  
      if (!latestDiaryDisplay || !diaryFullSection) {
          console.warn('Elements for latest diary display not found.');
          return;
      }
  
      // diary-full 内の最初の子要素（最新の日記）を取得
      const latestEntryArticle = diaryFullSection.querySelector('article');
  
      if (latestEntryArticle) {
          const date = latestEntryArticle.querySelector('h1')?.textContent.split(':')[0].trim() || '日付不明';
          const content = latestEntryArticle.querySelector('p')?.innerHTML || '内容なし';
          
          latestDiaryDisplay.innerHTML = `
              <h3>${date}</h3>
              <p>${content}</p>
          `;
      } else {
          latestDiaryDisplay.innerHTML = `<p>まだ日記がありません。</p>`;
      }
  }
  
  // 特定の日付の日記エントリを diary-full から取得して表示する関数
  function fetchAndDisplaySpecificDiary(date) {
      const viewedDiaryContent = document.getElementById('viewed-diary-content');
      const diaryFullSection = document.getElementById('diary-full');
  
      if (!viewedDiaryContent || !diaryFullSection) {
          console.warn('Elements for specific diary display not found.');
          return;
      }
  
      const allDiaryArticles = diaryFullSection.querySelectorAll('article');
      let found = false;
  
      allDiaryArticles.forEach(article => {
          const articleDate = article.dataset.date; // data-date 属性から日付を取得
          if (articleDate === date) {
              const title = article.querySelector('h1')?.textContent || '';
              const content = article.querySelector('p')?.innerHTML || '';
              viewedDiaryContent.innerHTML = `
                  <h3>${title.split(':')[0].trim()}</h3>
                  <p>${content}</p>
              `;
              found = true;
          }
      });
  
      if (!found) {
          viewedDiaryContent.innerHTML = `<p>選択された日付 (${date}) の日記はありません。</p>`;
      }
  }
  
  // 日記閲覧機能のセットアップ (カレンダーとボタン)
  function setupCalendarViewer() {
      const dateInput = document.getElementById('view-diary-date');
      const viewBtn = document.getElementById('view-diary-btn');
  
      if (dateInput && viewBtn) {
          // 今日の日付をデフォルトで設定
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          dateInput.value = `${year}-${month}-${day}`;
  
          // ページロード時に今日の日記を自動表示
          fetchAndDisplaySpecificDiary(dateInput.value);
  
          // ボタンクリックで日記を閲覧
          viewBtn.addEventListener('click', () => {
              if (dateInput.value) {
                  fetchAndDisplaySpecificDiary(dateInput.value);
              } else {
                  document.getElementById('viewed-diary-content').innerHTML = `<p style="color: var(--error-color);">日付を選択してください。</p>`;
              }
          });
  
          // 日付が変更されたら自動で日記を閲覧
          dateInput.addEventListener('change', () => {
              if (dateInput.value) {
                  fetchAndDisplaySpecificDiary(dateInput.value);
              } else {
                  document.getElementById('viewed-diary-content').innerHTML = `<p style="color: var(--error-color);">日付を選択してください。</p>`;
              }
          });
      }
  }
  
  
  // 日記投稿モーダルの制御 (一時的な表示のみ)
  function setupDiaryPostModal() {
    const openModalBtn = document.getElementById('open-diary-modal-btn');
    const diaryModal = document.getElementById('diary-modal');
    const closeModalSpan = document.querySelector('.diary-close-modal');
    const postBtn = document.getElementById('modal-post-diary-btn');
    const dateInput = document.getElementById('modal-diary-date');
    const textarea = document.getElementById('modal-new-diary-entry');
    const passwordInput = document.getElementById('modal-diary-password');
    const diaryMessage = document.getElementById('modal-diary-message');
    const diaryEntriesContainer = document.getElementById('diary-entries'); // 最新の日記を表示する場所
  
    const ADMIN_PASSWORD = 'shuta0426'; // 管理者パスワードを定義
  
    if (openModalBtn) {
      openModalBtn.addEventListener('click', () => {
        diaryModal.style.display = 'flex';
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
        
        textarea.value = '';
        passwordInput.value = '';
        diaryMessage.textContent = '';
        diaryMessage.style.display = 'none';
      });
    }
  
    if (closeModalSpan) {
      closeModalSpan.addEventListener('click', () => {
        diaryModal.style.display = 'none';
      });
    }
  
    if (diaryModal) {
      diaryModal.addEventListener('click', (e) => {
        if (e.target === diaryModal) {
          diaryModal.style.display = 'none';
        }
      });
    }
  
    if (postBtn && dateInput && textarea && passwordInput && diaryMessage && diaryEntriesContainer) {
      postBtn.addEventListener('click', () => {
        const selectedDate = dateInput.value;
        const entryText = textarea.value.trim();
        const enteredPassword = passwordInput.value;
  
        diaryMessage.textContent = ''; 
        diaryMessage.style.display = 'none';
  
        if (!selectedDate) {
          diaryMessage.textContent = '日付を選択してください。';
          diaryMessage.style.color = 'var(--error-color)';
          diaryMessage.style.display = 'block';
          return;
        }
  
        if (!entryText) {
          diaryMessage.textContent = '日記の内容を入力してください。';
          diaryMessage.style.color = 'var(--error-color)';
          diaryMessage.style.display = 'block';
          return;
        }
  
        if (enteredPassword !== ADMIN_PASSWORD) {
          diaryMessage.textContent = 'パスワードが正しくありません。';
          diaryMessage.style.color = 'var(--error-color)';
          diaryMessage.style.display = 'block';
          return;
        }
        
        // 新しい日記エントリのHTMLを作成
        const newEntryHTML = `
          <article class="card">
            <h3>${selectedDate}</h3>
            <p>${entryText.replace(/\n/g, '<br>')}</p>
            <a href="#diary-full" class="btn-secondary read-more-btn">Read More</a>
          </article>
        `;
        
        // 最新の日記表示エリアをクリアし、新しいエントリを追加
        diaryEntriesContainer.innerHTML = newEntryHTML;
        
        textarea.value = '';
        passwordInput.value = '';
        diaryMessage.textContent = '日記を投稿しました！ (この投稿は保存されません)';
        diaryMessage.style.color = 'var(--primary)';
        diaryMessage.style.display = 'block';
  
        // 投稿成功後、モーダルを閉じる
        setTimeout(() => {
          diaryMessage.style.display = 'none';
          diaryModal.style.display = 'none';
        }, 2000); 
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
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    document.querySelectorAll('.fade-in').forEach(section => {
      observer.observe(section);
    });
  }
  
  // スクロール連動ヘッダーの制御
  function setupHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  // スライダーギャラリーの初期化
  function setupGallerySwiper() {
    const swiperElement = document.querySelector('.gallery-swiper');
    if (swiperElement && typeof Swiper !== 'undefined') {
      new Swiper(swiperElement, {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }
      });
    }
  }
  
  // スクロール進捗バーの制御
  function setupProgressBar() {
      const progressBar = document.querySelector('.scroll-progress-bar');
      if (!progressBar) return;
      
      window.addEventListener('scroll', () => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPosition = window.scrollY;
          const progress = (scrollPosition / totalHeight) * 100;
          progressBar.style.width = `${progress}%`;
      });
  }
  
  // 画像モーダルウィンドウの制御
  function setupImageModal() {
      const modal = document.getElementById('image-modal');
      const modalImg = document.getElementById('modal-image');
      const span = document.getElementsByClassName('close-modal')[0];
      const galleryImages = document.querySelectorAll('.gallery-swiper img');
  
      galleryImages.forEach(img => {
          img.addEventListener('click', () => {
              modal.style.display = 'flex';
              modalImg.src = img.src;
          });
      });
  
      span.addEventListener('click', () => {
          modal.style.display = 'none';
      });
      
      modal.addEventListener('click', (e) => {
          if (e.target === modal) {
              modal.style.display = 'none';
          }
      });
  }
  
  // DOMContentLoaded イベントで初期化関数を呼び出す
  document.addEventListener('DOMContentLoaded', () => {
    setupNav('nav-toggle', 'nav-menu');
    setupThemeToggle('theme-toggle');
    setupToTop('to-top');
    setupDiaryToggle(); // diary-full の表示/非表示を制御
    setupDiaryPostModal(); // 日記投稿モーダル
    setupCalendarViewer(); // カレンダーによる日記閲覧
    displayLatestDiary(); // 最新日記の表示
    setupScrollAnimation();
    setupHeaderScroll();
    setupGallerySwiper();
    setupProgressBar();
    setupImageModal();
  });