/* ═══════════════════════════════════════════════════════════════
   CHATWIZE PRESENTATION — Navigation & Animation Controller
   ═══════════════════════════════════════════════════════════════ */

(function() {
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const counter = document.getElementById('currentSlide');
  const progressFill = document.getElementById('progressFill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const hint = document.getElementById('hint');

  let currentIndex = 0;
  let isTransitioning = false;

  // ─── Set initial state ───
  function init() {
    slides.forEach((slide, i) => {
      if (i === 0) slide.classList.add('active');
    });
    updateUI();
    triggerSlideAnimations(0);

    // Hide hint after 5s
    setTimeout(() => hint && hint.classList.add('hidden'), 5000);
  }

  // ─── Navigate to a specific slide ───
  function goToSlide(newIndex) {
    if (isTransitioning) return;
    if (newIndex < 0 || newIndex >= totalSlides) return;
    if (newIndex === currentIndex) return;

    isTransitioning = true;

    const current = slides[currentIndex];
    const next = slides[newIndex];

    // Mark direction for transform
    if (newIndex > currentIndex) {
      current.classList.add('prev');
    } else {
      current.classList.remove('prev');
      next.classList.add('prev');
    }

    current.classList.remove('active');

    // Small delay for the fade-out before fade-in
    setTimeout(() => {
      next.classList.add('active');
      next.classList.remove('prev');
      current.classList.remove('prev');
      currentIndex = newIndex;
      updateUI();
      triggerSlideAnimations(newIndex);

      setTimeout(() => { isTransitioning = false; }, 550);
    }, 80);

    // Hide hint on first nav
    if (hint && !hint.classList.contains('hidden')) hint.classList.add('hidden');
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  // ─── UI updates (counter, progress, buttons, body class) ───
  const totalEl = document.getElementById('totalSlides');
  if (totalEl) totalEl.textContent = String(totalSlides).padStart(2, '0');

  function updateUI() {
    const slideNum = currentIndex + 1;
    counter.textContent = String(slideNum).padStart(2, '0');
    progressFill.style.width = `${(slideNum / totalSlides) * 100}%`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;

    // Body class for conditional header visibility
    document.body.className = `on-slide-${slideNum}`;
  }

  // ─── Animation triggers per slide ───
  function triggerSlideAnimations(index) {
    const slide = slides[index];

    // Apply reveal delays
    const revealItems = slide.querySelectorAll('.reveal-item');
    revealItems.forEach(el => {
      const delay = parseInt(el.dataset.delay || '0', 10);
      el.style.animationDelay = `${delay}ms`;
      // Force reflow to restart animation
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });

    // Chat bubble anim-in delays
    const animIns = slide.querySelectorAll('.anim-in');
    animIns.forEach(el => {
      const delay = parseInt(el.dataset.delay || '0', 10);
      el.style.animationDelay = `${delay}ms`;
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });

    // Slide-specific animations
    const slideNum = index + 1;
    switch (slideNum) {
      case 6:
        animateCounters(slide);
        break;
      case 10:
        animateUrlTyping(slide);
        break;
    }
  }

  // ─── Slide 4: Animate prediction bars ───
  function animatePredictionBars(slide) {
    const fills = slide.querySelectorAll('.pred-fill');
    fills.forEach(f => f.style.width = '0%');
    setTimeout(() => {
      fills.forEach(f => {
        const pct = f.dataset.pct;
        f.style.width = `${pct}%`;
      });
    }, 600);
  }

  // ─── Slide 7: Count up numbers ───
  function animateCounters(slide) {
    const nums = slide.querySelectorAll('.stat-num');
    nums.forEach(el => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const startTime = performance.now();
      const isDecimal = target % 1 !== 0;

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        let value = target * eased;
        const display = isDecimal ? value.toFixed(1) : Math.floor(value);
        el.textContent = String(display).replace('.', ',') + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = (isDecimal ? target.toFixed(1).replace('.', ',') : target) + suffix;
      }
      requestAnimationFrame(step);
    });
  }

  // ─── Slide 8: Typewriter URL animation ───
  function animateUrlTyping(slide) {
    const target = slide.querySelector('#urlTyper');
    if (!target) return;
    const url = 'chatwize.ai';
    target.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      target.textContent = url.slice(0, i + 1);
      i++;
      if (i === url.length) clearInterval(interval);
    }, 90);
  }

  // ─── Event listeners ───
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      goToSlide(0);
    } else if (e.key === 'End') {
      goToSlide(totalSlides - 1);
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === 'Escape') {
      // browser handles exiting fullscreen; just update button icon
    } else if (e.key >= '1' && e.key <= '9') {
      goToSlide(parseInt(e.key, 10) - 1);
    }
  });

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // ─── Fullscreen toggle ───
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const fsEnter = fullscreenBtn.querySelector('.fs-enter');
  const fsExit = fullscreenBtn.querySelector('.fs-exit');

  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const el = document.documentElement;
      (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
  }

  function updateFullscreenIcon() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    fsEnter.style.display = isFs ? 'none' : '';
    fsExit.style.display = isFs ? '' : 'none';
  }

  fullscreenBtn.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenIcon);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);

  // Click anywhere on slide to advance (but ignore buttons and input area)
  document.querySelectorAll('.slide').forEach(slide => {
    slide.addEventListener('click', (e) => {
      if (e.target.closest('button, input, a, .chat-mock, .browser, .nav')) return;
      nextSlide();
    });
  });

  // Touch swipe
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 60) {
      if (diff < 0) nextSlide(); else prevSlide();
    }
  }, { passive: true });

  // ─── Start ───
  init();
})();
