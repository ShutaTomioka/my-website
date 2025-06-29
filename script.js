// Firebase SDK のインポート
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// Firebase グローバル変数を設定 (Canvas 環境から提供される)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let db;
let auth;
let userId = 'anonymous'; // デフォルト値を設定

// Firebase 初期化と認証
async function initializeFirebase() {
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        // 認証状態の変化を監視
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                userId = user.uid;
                console.log('Firebase: User signed in with UID:', userId);
                loadDiaryEntries(); // 認証後に日記をロード
            } else {
                // 初回ロード時、カスタムトークンがあればサインイン、なければ匿名サインイン
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                    console.log('Firebase: Signed in with custom token.');
                } else {
                    await signInAnonymously(auth);
                    console.log('Firebase: Signed in anonymously.');
                }
            }
        });
    } catch (error) {
        console.error('Firebase initialization or authentication error:', error);
    }
}

// 日記エントリをFirestoreから読み込み、表示する関数
function loadDiaryEntries() {
    if (!db || !userId) {
        console.warn('Firebase DB or User ID not ready for loading diary entries.');
        return;
    }

    const diaryContainer = document.getElementById('diary-entries');
    const diaryCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/diaryEntries`);
    const q = query(diaryCollectionRef, orderBy('timestamp', 'desc')); // タイムスタンプで降順ソート

    onSnapshot(q, (snapshot) => {
        diaryContainer.innerHTML = ''; // 既存のエントリをクリア
        if (snapshot.empty) {
            console.log('No diary entries found. Adding initial entry.');
            // Firestoreにエントリがない場合、指定の日記内容を自動投稿（初回のみ）
            const initialEntryText = `ポートフォリオサイトに研究内容や自己紹介のページを追加しました！スキル不足で苦労しましたが、やり遂げた達成感があります。

仕事でWeb開発の知識を直接使うことはあまりないかもしれませんが、いつか何かの重要なタスクを解決する糸口になるんじゃないかと信じて、これからも勉強を続けます。`;
            const today = new Date();
            const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            
            addDoc(diaryCollectionRef, {
                date: dateString,
                content: initialEntryText,
                timestamp: serverTimestamp(), // Firestoreが自動でタイムスタンプを生成
                userId: userId
            }).then(() => {
                console.log("Initial diary entry added to Firestore!");
            }).catch((error) => {
                console.error("Error adding initial document: ", error);
            });
            return;
        }

        snapshot.forEach((doc) => {
            const entry = doc.data();
            const newEntryHTML = `
                <article class="card">
                    <h3>${entry.date}</h3>
                    <p>${entry.content.replace(/\n/g, '<br>')}</p>
                </article>
            `;
            diaryContainer.insertAdjacentHTML('beforeend', newEntryHTML); // 古いものを下に追加
        });
    }, (error) => {
        console.error("Error fetching diary entries:", error);
    });
}


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

// 日記投稿モーダルの制御 (Firestore 保存機能追加)
function setupDiaryPostModal() {
  const openModalBtn = document.getElementById('open-diary-modal-btn');
  const diaryModal = document.getElementById('diary-modal');
  const closeModalSpan = document.querySelector('.diary-close-modal');
  const postBtn = document.getElementById('modal-post-diary-btn');
  const dateInput = document.getElementById('modal-diary-date');
  const textarea = document.getElementById('modal-new-diary-entry');
  const passwordInput = document.getElementById('modal-diary-password');
  const diaryMessage = document.getElementById('modal-diary-message');

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

  if (postBtn && dateInput && textarea && passwordInput && diaryMessage) {
    postBtn.addEventListener('click', async () => { // async を追加
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
      
      // Firebase に保存
      try {
          if (!db || !userId) {
              console.error('Firebase DB or User ID not available. Cannot save diary.');
              diaryMessage.textContent = 'エラー: データベースに接続できません。';
              diaryMessage.style.color = 'var(--error-color)';
              diaryMessage.style.display = 'block';
              return;
          }
          await addDoc(collection(db, `artifacts/${appId}/users/${userId}/diaryEntries`), {
              date: selectedDate,
              content: entryText,
              timestamp: serverTimestamp(), // Firestore がタイムスタンプを自動生成
              userId: userId // 念のためユーザーIDも保存
          });
          
          textarea.value = '';
          passwordInput.value = '';
          diaryMessage.textContent = '日記を投稿しました！';
          diaryMessage.style.color = 'var(--primary)';
          diaryMessage.style.display = 'block';

          setTimeout(() => {
            diaryMessage.style.display = 'none';
            diaryModal.style.display = 'none';
          }, 2000); 

      } catch (error) {
          console.error('Error adding document: ', error);
          diaryMessage.textContent = '日記の投稿中にエラーが発生しました。';
          diaryMessage.style.color = 'var(--error-color)';
          diaryMessage.style.display = 'block';
      }
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
  initializeFirebase(); // Firebase の初期化を一番最初に呼び出す
  setupNav('nav-toggle', 'nav-menu');
  setupThemeToggle('theme-toggle');
  setupToTop('to-top');
  setupDiaryToggle();
  setupDiaryPostModal(); 
  setupScrollAnimation();
  setupHeaderScroll();
  setupGallerySwiper();
  setupProgressBar();
  setupImageModal();
});
