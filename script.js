/* ==========================================================================
   STUDIO NAMMA - JAVASCRIPT LOGIC & ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. PRELOADER & INITIALIZATION
  // ------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloaderProgress');
  
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('loaded');
      }, 300);
    }
    if (preloaderProgress) preloaderProgress.style.width = progress + '%';
  }, 80);

  // ------------------------------------------------------------------------
  // 2. SMOOTH SCROLLING (LENIS) + GSAP INTEGRATION
  // ------------------------------------------------------------------------
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ------------------------------------------------------------------------
  // 3. THEME TOGGLE (LIGHT / DARK MODE)
  // ------------------------------------------------------------------------
  const modeSwitch = document.getElementById('modeSwitch');
  const modeSwitchText = document.getElementById('modeSwitchText');

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonText(savedTheme);

  if (modeSwitch) {
    modeSwitch.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeButtonText(newTheme);
    });
  }

  function updateThemeButtonText(theme) {
    if (modeSwitchText) {
      modeSwitchText.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    }
  }

  // ------------------------------------------------------------------------
  // 4. REAL-TIME WORLD CLOCKS TICKER
  // ------------------------------------------------------------------------
  const timezones = {
    timeParis: 'Europe/Paris',
    timeLA: 'America/Los_Angeles',
    timeBarcelona: 'Europe/Madrid',
    timeHK: 'Asia/Hong_Kong'
  };

  function updateClocks() {
    const now = new Date();
    for (const [id, tz] of Object.entries(timezones)) {
      const el = document.getElementById(id);
      if (el) {
        try {
          const timeStr = now.toLocaleTimeString('en-US', {
            timeZone: tz,
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
          });
          el.textContent = timeStr;
        } catch (e) {
          el.textContent = '--:--';
        }
      }
    }
  }
  updateClocks();
  setInterval(updateClocks, 1000);

  // ------------------------------------------------------------------------
  // 5. CUSTOM MAGNETIC CURSOR WITH DYNAMIC HOVER TEXT
  // ------------------------------------------------------------------------
  const cursor = document.getElementById('customCursor');
  const cursorText = document.getElementById('cursorText');
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) cursor.classList.add('active');
  });

  function renderCursor() {
    // Smooth magnetic easing (lerp)
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    if (cursor) {
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Attach dynamic cursor hover listeners
  const cursorTargets = document.querySelectorAll('[data-cursor], a, button, .link, .service-item');
  cursorTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      if (!cursor) return;
      cursor.classList.add('hovering');
      const text = target.getAttribute('data-cursor');
      if (text && cursorText) {
        cursorText.textContent = text;
      } else if (cursorText) {
        cursorText.textContent = 'View';
      }
    });

    target.addEventListener('mouseleave', () => {
      if (!cursor) return;
      cursor.classList.remove('hovering');
      if (cursorText) cursorText.textContent = '';
    });
  });

  // ------------------------------------------------------------------------
  // 6. 3D FOLD-OUT OVERLAY MENU TOGGLE
  // ------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const menuToggleText = document.getElementById('menuToggleText');
  const navMenu = document.getElementById('navMenu');
  const pageMain = document.getElementById('pageMain');
  const menuCloseTriggers = document.querySelectorAll('.menu-close-trigger');

  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      navMenu.classList.add('open');
      pageMain.classList.add('menu-active');
      if (menuToggleText) menuToggleText.textContent = 'Close';
      if (lenis) lenis.stop();
    } else {
      navMenu.classList.remove('open');
      pageMain.classList.remove('menu-active');
      if (menuToggleText) menuToggleText.textContent = 'Menu';
      if (lenis) lenis.start();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  menuCloseTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  // ------------------------------------------------------------------------
  // 7. INTERACTIVE WORD HOVER MEDIA CARDS (DETAIL & PLAYGROUND)
  // ------------------------------------------------------------------------
  const hoverMediaCard = document.getElementById('hoverMediaCard');
  const hoverMediaImg = document.getElementById('hoverMediaImg');

  const mediaMap = {
    detail: 'https://cdn.prod.website-files.com/679cb9cacf00799ba4b4c985/68d143844e199c5fe25893c6_Details%201.webp',
    playground: 'https://cdn.prod.website-files.com/679cb9cacf00799ba4b4c985/68d1446a128c7643746e47f9_Playground1.webp'
  };

  const wordTriggers = document.querySelectorAll('.home_intro_hover');
  wordTriggers.forEach((word) => {
    word.addEventListener('mouseenter', (e) => {
      const visualKey = word.getAttribute('data-visual');
      if (visualKey && mediaMap[visualKey]) {
        hoverMediaImg.src = mediaMap[visualKey];
        hoverMediaCard.classList.add('active');
      }
    });

    word.addEventListener('mousemove', (e) => {
      if (hoverMediaCard) {
        hoverMediaCard.style.left = e.clientX + 'px';
        hoverMediaCard.style.top = e.clientY + 'px';
      }
    });

    word.addEventListener('mouseleave', () => {
      if (hoverMediaCard) hoverMediaCard.classList.remove('active');
    });
  });

  // ------------------------------------------------------------------------
  // 8. SERVICE EXPANDABLE VIDEO PREVIEW HOVER MODAL
  // ------------------------------------------------------------------------
  const serviceModal = document.getElementById('servicePreviewModal');
  const serviceVideo = document.getElementById('servicePreviewVideo');
  const serviceItems = document.querySelectorAll('.service-item');

  serviceItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const videoSrc = item.getAttribute('data-video');
      if (videoSrc && serviceVideo) {
        serviceVideo.src = videoSrc;
        serviceVideo.play().catch(() => {});
        serviceModal.classList.add('active');
      }
    });

    item.addEventListener('mousemove', (e) => {
      if (serviceModal) {
        serviceModal.style.left = e.clientX + 'px';
        serviceModal.style.top = e.clientY + 'px';
      }
    });

    item.addEventListener('mouseleave', () => {
      if (serviceModal) serviceModal.classList.remove('active');
    });
  });

  // ------------------------------------------------------------------------
  // 9. CONTACT MODAL OVERLAY & FORM HANDLER
  // ------------------------------------------------------------------------
  const contactOverlay = document.getElementById('contactOverlay');
  const openContactHeader = document.getElementById('openContactHeader');
  const openContactCta = document.getElementById('openContactCta');
  const menuContactBtn = document.getElementById('menuContactBtn');
  const closeContactBtn = document.getElementById('closeContactBtn');
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');

  function openContactModal() {
    if (contactOverlay) contactOverlay.classList.add('open');
    if (isMenuOpen) toggleMenu();
    if (lenis) lenis.stop();
  }

  function closeContactModal() {
    if (contactOverlay) contactOverlay.classList.remove('open');
    if (lenis) lenis.start();
  }

  if (openContactHeader) openContactHeader.addEventListener('click', openContactModal);
  if (openContactCta) openContactCta.addEventListener('click', openContactModal);
  if (menuContactBtn) menuContactBtn.addEventListener('click', openContactModal);
  if (closeContactBtn) closeContactBtn.addEventListener('click', closeContactModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', () => {
    closeContactModal();
    if (contactForm) contactForm.style.display = 'block';
    if (contactSuccess) contactSuccess.classList.remove('show');
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      if (contactSuccess) contactSuccess.classList.add('show');
    });
  }

  // ------------------------------------------------------------------------
  // 10. COOKIE BANNER DISMISSAL
  // ------------------------------------------------------------------------
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptCookie = document.getElementById('acceptCookie');

  if (acceptCookie && cookieBanner) {
    acceptCookie.addEventListener('click', () => {
      cookieBanner.classList.add('dismissed');
    });
  }

  // ------------------------------------------------------------------------
  // 11. GSAP SCROLLTRIGGER REVEAL ANIMATIONS
  // ------------------------------------------------------------------------
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    
    // Hero Title Entrance
    gsap.from('.hero-appear', {
      opacity: 0,
      y: 60,
      duration: 1.4,
      ease: 'power4.out',
      delay: 0.5
    });

    // Hero Moving Visual Scale
    gsap.from('.moving-visual_wrapper', {
      scale: 0.8,
      opacity: 0,
      duration: 1.6,
      ease: 'power3.out',
      delay: 0.8
    });

    // Showreel Entrance
    gsap.from('.grow-appear', {
      scrollTrigger: {
        trigger: '.section_home-video',
        start: 'top 80%',
      },
      scale: 0.9,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });

    // Project Cards Entrance
    gsap.utils.toArray('.project-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: index * 0.1
      });
    });

    // Service Items Line Entrance
    gsap.utils.toArray('.service-item').forEach((item, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: index * 0.05
      });
    });

  }

});
