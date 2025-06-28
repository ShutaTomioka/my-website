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
      const currentTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      
      themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
          const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', nextTheme);
          localStorage.setItem('theme', nextTheme);
          btn.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
          btn.setAttribute('aria-label', nextTheme === 'dark' ? 'Toggle light theme' : 'Toggle dark theme');
        });
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
  
  // セクションがビューポートに入ったらアニメーションを適用 (スキルバーアニメーションも含む)
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
  
  // スキルバーのアニメーションを制御
  function animateSkillBars() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillLevels = skillsSection.querySelectorAll('.skill-level');
          skillLevels.forEach(level => {
            const percentage = level.getAttribute('data-level');
            level.style.setProperty('--level', percentage + '%');
            level.style.width = percentage + '%';
          });
          observer.unobserve(skillsSection);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(skillsSection);
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
  
  // Particle.js の初期化
  function setupParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        "particles": {
          "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
          "color": { "value": "#ffffff" },
          "shape": { "type": "circle" },
          "opacity": { "value": 0.5, "random": false },
          "size": { "value": 3, "random": true },
          "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
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
  
  // 訪問者カウンターの制御
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
  
  // アコーディオンFAQの制御
  function setupAccordion() {
      const accordionHeaders = document.querySelectorAll('.accordion-header');
      accordionHeaders.forEach(header => {
          header.addEventListener('click', () => {
              const content = header.nextElementSibling;
              
              // 既に開いているアコーディオンを閉じる
              document.querySelectorAll('.accordion-content.open').forEach(item => {
                  if (item !== content) {
                      item.classList.remove('open');
                      item.previousElementSibling.classList.remove('active');
                  }
              });
              
              // クリックしたアコーディオンを開閉
              content.classList.toggle('open');
              header.classList.toggle('active');
          });
      });
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
    setupScrollAnimation();
    animateSkillBars();
    setupHeaderScroll();
    setupParticles();
    setupVisitorCounter();
    setupGallerySwiper();
    setupAccordion();
    setupProgressBar();
    setupImageModal();
  });