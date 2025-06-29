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
    // Particle.jsライブラリが読み込まれているか確認
    if (typeof particlesJS !== 'undefined') {
      // テーマに応じて粒子の色と線の色を動的に設定
      const particlesColor = theme === 'dark' ? '#ffffff' : '#aaa'; 
      
      // 既存のParticle.jsインスタンスを削除して再初期化（再設定のため）
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
      
      // ページロード時に現在のテーマで粒子を初期化
      setupParticles(currentTheme); 
      
      themeToggles.forEach(btn => {
        // ボタンのアイコンとaria-labelを初期テーマに合わせて設定
        const icon = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
        btn.textContent = icon;
        btn.setAttribute('aria-label', icon === '☀️' ? 'Toggle light theme' : 'Toggle dark theme');
  
        btn.addEventListener('click', () => {
          const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', nextTheme);
          localStorage.setItem('theme', nextTheme);
          
          // ボタンのアイコンを切り替える
          btn.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
          btn.setAttribute('aria-label', nextTheme === 'dark' ? 'Toggle light theme' : 'Toggle dark theme');
          
          // テーマ変更後に粒子を再初期化して色を切り替える
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
  
  // 日記投稿モーダルの制御
  function setupDiaryPostModal() {
    const openModalBtn = document.getElementById('open-diary-modal-btn');
    const diaryModal = document.getElementById('diary-modal');
    const closeModalSpan = document.querySelector('.diary-close-modal');
    const postBtn = document.getElementById('modal-post-diary-btn');
    const dateInput = document.getElementById('modal-diary-date');
    const textarea = document.getElementById('modal-new-diary-entry');
    const passwordInput = document.getElementById('modal-diary-password');
    const diaryMessage = document.getElementById('modal-diary-message');
    const diaryContainer = document.getElementById('diary-entries');
  
    const ADMIN_PASSWORD = 'shuta0426'; // 管理者パスワードを定義
  
    // モーダルを開くボタン
    if (openModalBtn) {
      openModalBtn.addEventListener('click', () => {
        diaryModal.style.display = 'flex';
        // モーダルを開く際に現在の日付をデフォルトで設定
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
        
        // テキストエリアとパスワードをクリア
        textarea.value = '';
        passwordInput.value = '';
        diaryMessage.textContent = '';
        diaryMessage.style.display = 'none';
      });
    }
  
    // モーダルを閉じるボタン (x印)
    if (closeModalSpan) {
      closeModalSpan.addEventListener('click', () => {
        diaryModal.style.display = 'none';
      });
    }
  
    // モーダルの外側をクリックして閉じる
    if (diaryModal) {
      diaryModal.addEventListener('click', (e) => {
        if (e.target === diaryModal) {
          diaryModal.style.display = 'none';
        }
      });
    }
  
    // 日記投稿ボタン
    if (postBtn && dateInput && textarea && passwordInput && diaryMessage && diaryContainer) {
      postBtn.addEventListener('click', () => {
        const selectedDate = dateInput.value;
        const entryText = textarea.value.trim();
        const enteredPassword = passwordInput.value;
  
        diaryMessage.textContent = ''; // エラーメッセージをリセット
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
          </article>
        `;
        
        // 新しいエントリをリストの先頭に追加
        diaryContainer.insertAdjacentHTML('afterbegin', newEntryHTML);
        
        // テキストエリア、パスワード、メッセージをクリア/更新
        textarea.value = '';
        passwordInput.value = '';
        diaryMessage.textContent = '日記を投稿しました！';
        diaryMessage.style.color = 'var(--primary)'; // 成功メッセージはプライマリカラーで
        diaryMessage.style.display = 'block';
  
        // 成功メッセージは短時間で消し、モーダルを閉じる
        setTimeout(() => {
          diaryMessage.style.display = 'none';
          diaryModal.style.display = 'none'; // 投稿成功後モーダルを閉じる
        }, 2000); // 2秒後にメッセージを消す
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
  
  // 訪問者カウンターは削除されたため、この関数は削除
  /*
  async function setupVisitorCounter() {
    const countElement = document.getElementById('visitor-count');
    if (!countElement) return;
  
    try {
      const response = await fetch('https://api.countapi.xyz/hit/your-site-id/visits');
      const data = await response.json();
      
      let currentCount = 0;
      const finalCount = data.value;
      const duration = 2000;
      const step = Math.ceil(finalCount / (duration / 10));
  
      const interval = setInterval(() => {
        currentCount += step;
        if (currentCount >= finalCount) {
          currentCount = finalCount;
          clearInterval(interval);
        }
        countElement.textContent = currentCount.toLocaleString();
      }, 10);
      
    } catch (error) {
      console.error('Failed to fetch visitor count:', error);
      countElement.textContent = '...'; 
    }
  }
  */
  
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
  
  // 全てのセットアップ関数を実行
  document.addEventListener('DOMContentLoaded', () => {
    setupNav('nav-toggle', 'nav-menu');
    setupThemeToggle('theme-toggle');
    setupToTop('to-top');
    setupDiaryToggle();
    setupDiaryPostModal(); // 日記投稿モーダル機能の呼び出し
    setupScrollAnimation();
    setupHeaderScroll();
    // setupVisitorCounter(); // 訪問者カウンターを削除
    setupGallerySwiper();
    setupProgressBar();
    setupImageModal();
  });
  