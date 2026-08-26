/* =============================================
   RHYTHMBLOOM ACADEMY — MAIN JS
   Theme, RTL, Navbar, Scroll reveal, Active nav
   ============================================= */

(function () {
  'use strict';

  /* ── Theme Management ── */
  const THEME_KEY = 'rb-theme';
  const DIR_KEY   = 'rb-dir';

  function getTheme() { return localStorage.getItem(THEME_KEY) || 'light'; }
  function getDir()   { return localStorage.getItem(DIR_KEY) || 'ltr'; }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    // Update all toggle buttons
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const iconLight = btn.querySelector('.theme-icon-light');
      const iconDark  = btn.querySelector('.theme-icon-dark');
      if (iconLight) iconLight.style.display = theme === 'dark' ? 'none' : '';
      if (iconDark)  iconDark.style.display  = theme === 'dark' ? '' : 'none';
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('aria-label', btn.getAttribute('title'));
    });

    // Switch Light / Dark logo images
    document.querySelectorAll('.rb-logo-light').forEach(img => {
      img.style.display = theme === 'dark' ? 'none' : 'block';
    });
    document.querySelectorAll('.rb-logo-dark').forEach(img => {
      img.style.display = theme === 'dark' ? 'block' : 'none';
    });
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('aria-label', btn.getAttribute('title'));
      const lbl = btn.querySelector('.dir-label');
      if (lbl) lbl.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  function toggleTheme() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  function toggleDir() {
    applyDir(getDir() === 'rtl' ? 'ltr' : 'rtl');
  }

  // Apply on load
  applyTheme(getTheme());
  applyDir(getDir());

  document.addEventListener('DOMContentLoaded', function () {

    /* ── Re-apply (for icons that render after DOMContentLoaded) ── */
    applyTheme(getTheme());
    applyDir(getDir());

    /* ── Bind toggles ── */
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.addEventListener('click', toggleDir);
    });

    /* ── Navbar Scroll ── */
    const navbar = document.querySelector('.rb-navbar');
    if (navbar) {
      const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ── Mobile Menu ── */
    const menuToggle  = document.querySelector('.rb-menu-toggle');
    const mobileMenu  = document.querySelector('.rb-mobile-menu');
    const menuOverlay = document.querySelector('.rb-menu-overlay');

    if (menuToggle && mobileMenu) {
      const menuIcon = menuToggle.querySelector('i');

      const setMobileMenuState = (isOpen) => {
        mobileMenu.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        if (menuIcon) {
          menuIcon.classList.toggle('bi-list', !isOpen);
          menuIcon.classList.toggle('bi-x-lg', isOpen);
        }
      };

      menuToggle.addEventListener('click', () => {
        setMobileMenuState(!mobileMenu.classList.contains('open'));
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') &&
            !mobileMenu.contains(e.target) &&
            !menuToggle.contains(e.target)) {
          setMobileMenuState(false);
        }
      });

      // Close on nav link click
      mobileMenu.querySelectorAll('.rb-mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          setMobileMenuState(false);
        });
      });
    }

    /* ── Active Navigation ── */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    function setActiveLinks(selector) {
      document.querySelectorAll(selector).forEach(link => {
        const href = (link.getAttribute('href') || '').split('/').pop();
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    setActiveLinks('.rb-nav-link');
    setActiveLinks('.rb-mobile-nav-link');

    /* ── Scroll Reveal ── */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(el => observer.observe(el));
    }

    /* ── FAQ Accordion ── */
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
          openItem.classList.remove('open');
        });

        // Toggle clicked
        if (!isOpen) item.classList.add('open');
      });
    });

    /* ── Smooth Scroll ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = (parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--navbar-height')) || 72) + 16;
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - offset,
            behavior: 'smooth'
          });
        }
      });
    });

    /* ── Counter Animation ── */
    function animateCounter(el) {
      const target = parseInt(el.textContent.replace(/\D/g, ''));
      const suffix = el.textContent.replace(/[\d]/g, '');
      if (!target) return;
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 20);
    }

    const counterEls = document.querySelectorAll('.stat-number, .hero-stat-value');
    if (counterEls.length > 0) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counterEls.forEach(el => counterObserver.observe(el));
    }

    /* ── Toast Utility ── */
    window.showToast = function (message, type = 'info', duration = 3500) {
      const container = document.querySelector('.toast-container') || (() => {
        const c = document.createElement('div');
        c.className = 'toast-container';
        document.body.appendChild(c);
        return c;
      })();

      const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i><span>${message}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(32px)';
        toast.style.transition = '0.3s ease';
        setTimeout(() => toast.remove(), 320);
      }, duration);
    };

    /* ── Floating Back to Top Arrow ── */
    let backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.id = 'back-to-top';
      backToTopBtn.className = 'back-to-top-btn';
      backToTopBtn.setAttribute('aria-label', 'Scroll back to top');
      backToTopBtn.setAttribute('title', 'Scroll back to top');
      backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
      document.body.appendChild(backToTopBtn);
    }

    const toggleBackToTop = () => {
      if (window.scrollY > 280) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

  }); // end DOMContentLoaded

})();
