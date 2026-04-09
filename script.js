/* =============================================
   TERATOR LANDING PAGE - JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  const navbarLogo = document.getElementById('navbar-logo');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('navbar-scrolled');
      // Swap to colored logo when navbar is white
      navbarLogo.src = 'logo/terator.png';
    } else {
      navbar.classList.remove('navbar-scrolled');
      navbarLogo.src = 'logo/terator.png';
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  let menuOpen = false;

  mobileMenuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      mobileMenu.classList.remove('hidden');
      // Force reflow before adding animation class
      mobileMenu.offsetHeight;
      mobileMenu.classList.add('menu-open');
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-xmark');
    } else {
      mobileMenu.classList.remove('menu-open');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
      // Wait for transition to finish before hiding
      setTimeout(() => {
        if (!menuOpen) {
          mobileMenu.classList.add('hidden');
        }
      }, 400);
    }
  });

  // Close mobile menu when a link is clicked
  const mobileNavLinks = mobileMenu.querySelectorAll('a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('menu-open');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 400);
    });
  });

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // --- Active Nav Link Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('text-white', 'font-bold');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('font-bold');
            // When scrolled, highlight with primary color
            if (navbar.classList.contains('navbar-scrolled')) {
              link.style.color = '#4f46e5';
            } else {
              link.style.color = '#ffffff';
            }
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // --- Parallax-like effect for hero decorative elements ---
  const heroDecorations = document.querySelectorAll('#hero .absolute.inset-0.overflow-hidden > div');

  function handleParallax() {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
      heroDecorations.forEach((el, index) => {
        const speed = 0.1 + index * 0.05;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  // --- Lazy load YouTube iframe ---
  const ytIframe = document.querySelector('#tutorial iframe');
  if (ytIframe) {
    const ytObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const src = ytIframe.getAttribute('src');
            if (!ytIframe.dataset.loaded) {
              ytIframe.src = src;
              ytIframe.dataset.loaded = 'true';
            }
            ytObserver.unobserve(ytIframe);
          }
        });
      },
      { threshold: 0.1 }
    );
    ytObserver.observe(ytIframe);
  }

  // --- Counter Animation ---
  function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const startTime = performance.now();
    const startVal = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(startVal + (target - startVal) * easeOut);

      element.textContent = currentVal.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Observe stat numbers for counter animation
  const statElements = document.querySelectorAll('#hero .text-2xl.font-bold');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const text = entry.target.textContent.trim();

          if (text.includes('100')) {
            animateCounter(entry.target, 100, '+');
          } else if (text.includes('10K')) {
            entry.target.innerHTML = '';
            animateCounter(entry.target, 10, 'K+');
          }
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statElements.forEach(el => counterObserver.observe(el));

  // --- Preload critical images ---
  const criticalImages = [
    'screenshoots/home.jpeg',
    'logo/terator.png',
    'logo/terator-white.png',
  ];

  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
});
