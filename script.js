// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile navigation
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal sections on scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// Gallery lightbox
const shots = Array.from(document.querySelectorAll('.shot'));
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let current = 0;

function showPhoto(index) {
  current = (index + shots.length) % shots.length;
  const img = shots[current].querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
}

function openLightbox(index) {
  showPhoto(index);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  shots[current].focus();
}

shots.forEach((shot, i) => shot.addEventListener('click', () => openLightbox(i)));
document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => showPhoto(current - 1));
document.getElementById('lbNext').addEventListener('click', () => showPhoto(current + 1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPhoto(current - 1);
  if (e.key === 'ArrowRight') showPhoto(current + 1);
});

// Swipe support for the lightbox on phones
let startX = 0;
lightbox.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const diff = e.changedTouches[0].clientX - startX;
  if (Math.abs(diff) > 50) showPhoto(current + (diff < 0 ? 1 : -1));
});
