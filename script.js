/* ===========================
   PORTFOLIO SCRIPT
   Расул Джанкорозов
=========================== */

/* ===========================
   LANGUAGE SWITCHER (RU / KG)
=========================== */
let currentLang = 'ru';

const langBtns = document.querySelectorAll('.lang-btn');

function applyLang(lang) {
  currentLang = lang;

  // Обновляем кнопки
  langBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Все элементы с data-ru / data-kg
  document.querySelectorAll('[data-ru]').forEach(el => {
    const text = el.dataset[lang];
    if (!text) return;

    // Если элемент — input или textarea, меняем placeholder
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    }
    // Для section-title — innerHTML (содержит <span class="gold">)
    else if (el.classList.contains('section-title') || el.classList.contains('about-desc')) {
      el.innerHTML = text;
    }
    // Для кнопки submit — innerHTML (содержит иконку)
    else if (el.tagName === 'BUTTON' && el.type === 'submit') {
      el.innerHTML = text;
    }
    // Всё остальное — textContent
    else {
      el.textContent = text;
    }
  });

  // Перезапускаем typewriter с нужным набором фраз
  resetTypewriter(lang);

  // Сохраняем выбор
  localStorage.setItem('portfolioLang', lang);
}

langBtns.forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// Восстанавливаем язык при загрузке
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('portfolioLang') || 'ru';
  applyLang(saved);
});


/* ===========================
   TYPEWRITER EFFECT
=========================== */
const phrasesByLang = {
  ru: [
    'Frontend Разработчик',
    'HTML · CSS · JavaScript',
    'React Developer',
    'IT Специалист'
  ],
  kg: [
    'Frontend Иштеп Чыгуучу',
    'HTML · CSS · JavaScript',
    'React Developer',
    'IT Адиси'
  ]
};

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typeTimer   = null;
const typeEl    = document.getElementById('typewriter');

function type() {
  const phrases = phrasesByLang[currentLang];
  const current = phrases[phraseIndex % phrases.length];

  if (isDeleting) {
    typeEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typeEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 90 : 160;

  if (!isDeleting && charIndex === current.length) {
    delay = 3000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting  = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 600;
  }

  typeTimer = setTimeout(type, delay);
}

function resetTypewriter(lang) {
  clearTimeout(typeTimer);
  charIndex   = 0;
  isDeleting  = false;
  phraseIndex = 0;
  if (typeEl) typeEl.textContent = '';
  typeTimer = setTimeout(type, 400);
}

// Первый запуск
window.addEventListener('load', () => setTimeout(type, 1200));


/* ===========================
   NAVBAR: scroll + active link
=========================== */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});


/* ===========================
   BURGER MENU
=========================== */
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ===========================
   INTERSECTION OBSERVER
   (карточки + skill bars)
=========================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => {
      el.classList.add('visible');
      const fill = el.querySelector('.skill-fill');
      if (fill) fill.style.width = fill.dataset.width + '%';
    }, delay);
    observer.unobserve(el);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.skill-card, .project-card').forEach(el => observer.observe(el));


/* ===========================
   SMOOTH SCROLL
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
  });
});


/* ===========================
   CONTACT FORM
=========================== */
const form     = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

const messages = {
  empty:   { ru: '⚠️ Заполните все поля.',         kg: '⚠️ Бардык талааларды толтуруңуз.' },
  email:   { ru: '⚠️ Введите корректный email.',   kg: '⚠️ Туура email киргизиңиз.' },
  success: { ru: '✅ Сообщение отправлено! Рахмат!', kg: '✅ Кат жөнөтүлдү! Рахмат!' },
  sending: { ru: 'Отправляем...',                   kg: 'Жөнөтүлүүдө...' }
};

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showNote(messages.empty[currentLang], 'warn'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNote(messages.email[currentLang], 'warn'); return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = messages.sending[currentLang];

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${currentLang === 'ru' ? 'Отправить' : 'Жөнөтүү'}`;
      showNote(messages.success[currentLang], 'success');
    }, 1500);
  });
}

function showNote(text, type) {
  formNote.textContent = text;
  formNote.style.color = type === 'success' ? 'var(--gold-light)' : '#FFB830';
  setTimeout(() => { formNote.textContent = ''; }, 5000);
}


/* ===========================
   HERO PARALLAX
=========================== */
document.addEventListener('mousemove', (e) => {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  const x = (e.clientX / window.innerWidth  - 0.5) * 18;
  const y = (e.clientY / window.innerHeight - 0.5) * 18;
  heroBg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
});
