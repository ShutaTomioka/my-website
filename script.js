/**
 * Shuta's Portfolio - Final Integrated Script
 */

// --- 1. Particles.js 初期化 ---
function initParticles() {
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }
            },
            "retina_detect": true
        });
    }
}

// --- 2. テーマ切り替え機能 ---
function setupTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
    };

    setTheme(currentTheme);

    toggleBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

// --- 3. スキルアニメーション (Intersection Observer) ---
function setupSkillAnimations() {
    const skillSection = document.getElementById('skills');
    const skillCards = document.querySelectorAll('.skill-card');
    const progressBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillCards.forEach((card, i) => setTimeout(() => card.classList.add('animate'), i * 150));
                progressBars.forEach(bar => bar.style.width = bar.getAttribute('data-level'));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (skillSection) observer.observe(skillSection);
}

// --- 4. 日記機能 (LocalStorage保存) ---
const DB_KEY = 'shuta_portfolio_diary';
const getSavedPosts = () => JSON.parse(localStorage.getItem(DB_KEY) || '[]');

function displayLatestDiary() {
    const display = document.getElementById('latest-diary-display');
    const saved = getSavedPosts();
    const staticArticles = document.querySelectorAll('#diary-full article');
    let latest = null;

    if (saved.length > 0) latest = saved[saved.length - 1];
    if (staticArticles.length > 0) {
        const staticLatest = {
            title: staticArticles[0].querySelector('h1')?.textContent,
            content: staticArticles[0].querySelector('p')?.innerHTML,
            date: staticArticles[0].getAttribute('data-date')
        };
        if (!latest || staticLatest.date >= latest.date) latest = staticLatest;
    }
    if (display && latest) {
        display.innerHTML = `<h4>${latest.title}</h4><p>${latest.content}</p>`;
    }
}

function setupDiaryModal() {
    const modal = document.getElementById('diary-modal');
    const openBtn = document.getElementById('open-diary-modal-btn');
    const closeBtn = document.querySelector('.diary-close-modal');
    const postBtn = document.getElementById('modal-post-diary-btn');

    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.getElementById('modal-diary-date').value = new Date().toISOString().split('T')[0];
    });

    closeBtn.addEventListener('click', () => modal.style.display = 'none');

    postBtn.addEventListener('click', () => {
        const date = document.getElementById('modal-diary-date').value;
        const text = document.getElementById('modal-new-diary-entry').value;
        const pw = document.getElementById('modal-diary-password').value;

        if (pw === 'shuta0426' && text.trim()) {
            const posts = getSavedPosts();
            posts.push({ date, title: `${date}: New Entry`, content: text.replace(/\n/g, '<br>') });
            localStorage.setItem(DB_KEY, JSON.stringify(posts));
            displayLatestDiary();
            modal.style.display = 'none';
        } else {
            alert('Invalid Password or Empty Content');
        }
    });
}

// --- 5. 初期化 ---
document.addEventListener('DOMContentLoaded', () => {
    initParticles();     // 背景アニメーション
    setupTheme();         // テーマ（太陽/月）
    setupSkillAnimations(); 
    displayLatestDiary();
    setupDiaryModal();

    window.addEventListener('scroll', () => {
        document.querySelector('.site-header').classList.toggle('scrolled', window.scrollY > 50);
    });
});