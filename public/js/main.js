document.addEventListener('DOMContentLoaded', () => {

  // ─── HERO 3D TILT PARALLAX ──────────────────────────────
  const tiltWrap = document.getElementById('heroTilt');
  if (tiltWrap) {
    const inner = tiltWrap.querySelector('.ht-inner');
    const glare = tiltWrap.querySelector('.ht-glare');
    const badge = tiltWrap.querySelector('.ht-badge');
    const MAX_TILT  = 10;   // max degrees
    const MAX_GLARE = 0.18; // max glare opacity

    tiltWrap.addEventListener('mousemove', (e) => {
      const rect   = tiltWrap.getBoundingClientRect();
      // normalise -1 to +1
      const xRatio = (e.clientX - rect.left)  / rect.width  - 0.5;
      const yRatio = (e.clientY - rect.top)   / rect.height - 0.5;

      const rotateY =  xRatio * MAX_TILT * 2;
      const rotateX = -yRatio * MAX_TILT * 2;

      inner.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;

      // move glare to follow cursor
      const glareX = (xRatio + 0.5) * 100;
      const glareY = (yRatio + 0.5) * 100;
      glare.style.background = `radial-gradient(
        circle at ${glareX}% ${glareY}%,
        rgba(255,255,255,${MAX_GLARE}) 0%,
        transparent 60%
      )`;

      // badge floats opposite direction for parallax depth
      if (badge) {
        badge.style.transform =
          `translateZ(30px) translate(${-xRatio * 8}px, ${-yRatio * 8}px)`;
      }

      // dynamic shadow follows tilt
      inner.style.boxShadow = `
        ${-rotateY * 2}px ${rotateX * 2}px 56px rgba(0,0,0,0.65),
        0 0 0 1px rgba(233,184,114,0.2)
      `;
    });

    tiltWrap.addEventListener('mouseleave', () => {
      inner.classList.add('resetting');
      inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      inner.style.boxShadow = '';
      glare.style.background = '';
      if (badge) badge.style.transform = 'translateZ(30px)';
      setTimeout(() => inner.classList.remove('resetting'), 650);
    });

    // gyroscope for mobile
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (!e.beta || !e.gamma) return;
        const rotateX = Math.max(-MAX_TILT, Math.min(MAX_TILT, e.beta  * 0.3));
        const rotateY = Math.max(-MAX_TILT, Math.min(MAX_TILT, e.gamma * 0.3));
        inner.style.transform =
          `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }, { passive: true });
    }
  }

  // ─── HEADER SCROLL STATE ─────────────────────────────────
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    const onScroll = () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ─── HAMBURGER MENU ─────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      mainNav.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // close nav when a link is clicked (mobile)
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });

    // close nav on outside click
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
        navToggle.classList.remove('open');
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      }
    });
  }

  // ─── SCROLL REVEAL ──────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ─── COUNTER ANIMATION ──────────────────────────────────
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = +el.dataset.target;
        const duration = 1200; // ms
        const steps    = 50;
        const stepTime = duration / steps;
        let current    = 0;

        const timer = setInterval(() => {
          current += target / steps;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, stepTime);

        counterObserver.unobserve(el);
      });
    }, { threshold: 0.6 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // ─── SLIDESHOW ───────────────────────────────────────────
  const slideshow  = document.getElementById('projectsSlideshow');
  const dotsWrap   = document.getElementById('slideDots');
  if (slideshow && dotsWrap) {
    const slides   = slideshow.querySelectorAll('.slide');
    const captions = slideshow.querySelectorAll('.slide-caption');
    const prevBtn  = slideshow.querySelector('.slide-prev');
    const nextBtn  = slideshow.querySelector('.slide-next');
    let current    = 0;
    let timer      = null;
    const INTERVAL = 3500; // ms between auto-advances

    // build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = () => dotsWrap.querySelectorAll('.slide-dot');

    function goTo(index) {
      // mark leaving
      slides[current].classList.add('leaving');
      captions[current].classList.remove('active');
      dots()[current].classList.remove('active');

      // after transition remove leaving
      const leaving = slides[current];
      setTimeout(() => leaving.classList.remove('leaving'), 950);

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('active');
      captions[current].classList.add('active');
      dots()[current].classList.add('active');

      // remove active from old slide after it fades
      slides.forEach((s, i) => { if (i !== current) s.classList.remove('active'); });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(next, INTERVAL);
    }

    // pause on hover, resume on leave
    slideshow.addEventListener('mouseenter', () => clearInterval(timer));
    slideshow.addEventListener('mouseleave', startTimer);

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startTimer(); });

    startTimer();
  }

  // ─── SERVICES PAGE: enquire buttons ─────────────────────
  const enquireButtons = document.querySelectorAll('.js-service-enquire');
  enquireButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const service    = btn.getAttribute('data-service') || '';
      const contactUrl = `/contact?service=${encodeURIComponent(service)}`;
      window.location.href = contactUrl;
    });
  });

  // ─── CONTACT PAGE: sync hidden service field ─────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const serviceSelect = contactForm.querySelector('#serviceSelect');
    const serviceField  = contactForm.querySelector('#serviceField');

    const syncHiddenField = () => {
      if (serviceField && serviceSelect) {
        serviceField.value = serviceSelect.value;
      }
    };

    if (serviceSelect) {
      serviceSelect.addEventListener('change', syncHiddenField);
      syncHiddenField();
    }
  }

});

