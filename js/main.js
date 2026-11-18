/* =========================================================
   NEON — студия маникюра и педикюра
   ========================================================= */
(function () {
  'use strict';

  /* -------------------------------------------------------
     ССЫЛКА НА ОНЛАЙН-ЗАПИСЬ
     Пока строка пустая — кнопки «Записаться» показывают
     сообщение-заглушку. Когда появится ссылка, вставьте её:
     var BOOKING_URL = 'https://dikidi.ru/...';
     ------------------------------------------------------- */
  var BOOKING_URL = 'https://dikidi.ru/1320558';

  var doc = document;
  var toast = doc.getElementById('toast');
  var toastTimer = null;

  /* ---------- сообщение ---------- */
  function showToast() {
    if (!toast) return;
    toast.hidden = false;
    // следующий кадр, чтобы сработал transition
    requestAnimationFrame(function () {
      toast.classList.add('is-on');
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-on');
      setTimeout(function () { toast.hidden = true; }, 320);
    }, 4000);
  }

  /* ---------- кнопки записи ---------- */
  var bookLinks = doc.querySelectorAll('.js-book');
  Array.prototype.forEach.call(bookLinks, function (link) {
    if (BOOKING_URL) {
      link.setAttribute('href', BOOKING_URL);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    } else {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        showToast();
      });
    }
  });

  /* подсказка-заглушка нужна только пока ссылки нет */
  if (BOOKING_URL) {
    Array.prototype.forEach.call(doc.querySelectorAll('.js-placeholder'), function (el) {
      el.parentNode.removeChild(el);
    });
  }

  /* ---------- клик по услуге: прокрутка и подсветка кнопки записи ---------- */
  var bookingSection = doc.getElementById('booking');
  var bookingBtn = bookingSection ? bookingSection.querySelector('.contact-card__cta .btn') : null;

  if (bookingBtn) {
    Array.prototype.forEach.call(doc.querySelectorAll('.service'), function (card) {
      card.addEventListener('click', function () {
        bookingBtn.classList.remove('is-flash');
        void bookingBtn.offsetWidth; // перезапуск анимации
        bookingBtn.classList.add('is-flash');
        window.setTimeout(function () {
          bookingBtn.classList.remove('is-flash');
        }, 2600);
      });
    });
  }

  /* ---------- шапка при прокрутке ---------- */
  var header = doc.getElementById('header');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- появление блоков ---------- */
  var revealItems = doc.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(revealItems, function (item) {
      observer.observe(item);
    });
  } else {
    Array.prototype.forEach.call(revealItems, function (item) {
      item.classList.add('is-in');
    });
  }

  /* ---------- год в подвале ---------- */
  var year = doc.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- просмотр работ ---------- */
  var lightbox = doc.getElementById('lightbox');
  var works = Array.prototype.slice.call(doc.querySelectorAll('.work'));
  var current = 0;
  var lastFocused = null;

  if (lightbox && works.length) {
    var lbImage = lightbox.querySelector('.lightbox__img');
    var lbClose = lightbox.querySelector('.lightbox__close');
    var lbPrev = lightbox.querySelector('.lightbox__nav--prev');
    var lbNext = lightbox.querySelector('.lightbox__nav--next');

    var render = function (index) {
      current = (index + works.length) % works.length;
      var work = works[current];
      var thumb = work.querySelector('img');
      if (lbImage) {
        lbImage.src = work.getAttribute('data-full');
        lbImage.alt = thumb ? thumb.alt : '';
      }
    };

    var openLightbox = function (index) {
      lastFocused = doc.activeElement;
      render(index);
      lightbox.hidden = false;
      doc.body.style.overflow = 'hidden';
      if (lbClose) lbClose.focus();
    };

    var closeLightbox = function () {
      lightbox.hidden = true;
      doc.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    };

    var step = function (direction) {
      render(current + direction);
    };

    works.forEach(function (work, index) {
      work.addEventListener('click', function () { openLightbox(index); });
    });

    if (lbPrev) lbPrev.addEventListener('click', function () { step(-1); });
    if (lbNext) lbNext.addEventListener('click', function () { step(1); });

    lightbox.addEventListener('click', function (event) {
      if (event.target.hasAttribute('data-close')) closeLightbox();
    });

    doc.addEventListener('keydown', function (event) {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'ArrowRight') step(1);
    });

    /* листание свайпом/мышью: справа налево — следующее фото */
    var startX = 0;
    var startY = 0;
    var pending = false;

    lightbox.addEventListener('pointerdown', function (event) {
      if (event.target.closest('button')) return;
      startX = event.clientX;
      startY = event.clientY;
      pending = true;
    });

    lightbox.addEventListener('pointerup', function (event) {
      if (!pending) return;
      pending = false;
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;

      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        step(dx < 0 ? 1 : -1);
      } else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
        closeLightbox();
      }
    });

    lightbox.addEventListener('pointercancel', function () { pending = false; });
  }
})();
