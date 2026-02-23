/**
 * Shuta's Portfolio - Script
 */

const DB_KEY = 'shuta_portfolio_diary';

// --- LocalStorage ---
const getSavedPosts = () => JSON.parse(localStorage.getItem(DB_KEY) || '[]');
const saveToDB = (entry) => {
    const posts = getSavedPosts();
    posts.push(entry);
    localStorage.setItem(DB_KEY, JSON.stringify(posts));
};

// --- UI Components ---
function setupNav() {
    const btn = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('open');
        btn.textContent = menu.classList.contains('open') ? '✕' : '☰';
    });
}

function setupSkillAnimations() {
    const skillSection = document.getElementById('skills');
    const skillCards = document.querySelectorAll('.skill-card');
    const progressBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillCards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('animate'), i * 150);
                });
                progressBars.forEach(bar => {
                    bar.style.width = bar.getAttribute('data-level');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (skillSection) observer.observe(skillSection);
}

// --- Diary Engine ---
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
    const msg = document.getElementById('modal-diary-message');

    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.getElementById('modal-diary-date').value = new Date().toISOString().split('T')[0];
    });

    const closeModal = () => { modal.style.display = 'none'; msg.style.display = 'none'; };
    closeBtn.addEventListener('click', closeModal);

    postBtn.addEventListener('click', () => {
        const date = document.getElementById('modal-diary-date').value;
        const text = document.getElementById('modal-new-diary-entry').value;
        const pw = document.getElementById('modal-diary-password').value;

        if (pw === 'shuta0426') {
            if (!text.trim()) return;
            saveToDB({ date, title: `${date}: Update`, content: text.replace(/\n/g, '<br>') });
            displayLatestDiary();
            msg.textContent = 'Saved!'; msg.style.color = 'var(--primary)';
            msg.style.display = 'block';
            setTimeout(closeModal, 1000);
        } else {
            msg.textContent = 'Invalid Code'; msg.style.color = 'var(--error-color)';
            msg.style.display = 'block';
        }
    });
}

function setupProgressBar() {
    const bar = document.querySelector('.scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        if (bar) bar.style.width = scrolled + "%";
    });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    setupProgressBar();
    displayLatestDiary();
    setupDiaryModal();
    setupSkillAnimations();

    window.addEventListener('scroll', () => {
        document.querySelector('.site-header').classList.toggle('scrolled', window.scrollY > 50);
    });

    if (typeof Swiper !== 'undefined') {
        new Swiper('.gallery-swiper', {
            loop: true,
            pagination: { el: '.swiper-pagination' },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
        });
    }
});