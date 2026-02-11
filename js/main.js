/* ============================================
   THIS IS ISTANBUL — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* --- Scroll Reveal (Intersection Observer) --- */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --- Header Scroll Behavior --- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var lastScroll = 0;
    var scrollThreshold = 60;

    window.addEventListener('scroll', function () {
      var current = window.pageYOffset;
      if (current > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = current;
    }, { passive: true });
  }

  /* --- Mobile Navigation --- */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.nav-mobile');
    if (!toggle || !mobileNav) return;

    var links = mobileNav.querySelectorAll('a');

    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open');
      toggle.classList.toggle('active');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- FAQ Accordion --- */
  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isActive = item.classList.contains('active');

        // Close all
        items.forEach(function (other) {
          other.classList.remove('active');
          var otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        });

        // Open clicked (if it wasn't already active)
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* --- Smooth Scroll for Anchor Links --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var headerHeight = document.querySelector('.site-header')
            ? document.querySelector('.site-header').offsetHeight
            : 0;
          var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* --- Lazy Loading Images --- */
  function initLazyLoad() {
    var images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    if ('IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            imgObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px 0px'
      });

      images.forEach(function (img) {
        imgObserver.observe(img);
      });
    } else {
      // Fallback: load all
      images.forEach(function (img) {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
      });
    }
  }

  /* --- Parallax on Hero (subtle, desktop only) --- */
  function initParallax() {
    if (window.innerWidth < 768) return;

    var heroBg = document.querySelector('.hero-bg img');
    if (!heroBg) return;

    window.addEventListener('scroll', function () {
      var scroll = window.pageYOffset;
      if (scroll < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + (scroll * 0.3) + 'px) scale(1.05)';
      }
    }, { passive: true });
  }

  /* --- Counter Animation for Ferry Stats --- */
  function initCounters() {
    var counters = document.querySelectorAll('.ferry-stat-number[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.dataset.count, 10);
          var suffix = el.dataset.suffix || '';
          var duration = 1500;
          var start = 0;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          }

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --- Initialize Everything --- */
  function init() {
    initReveal();
    initHeader();
    initMobileNav();
    initFAQ();
    initSmoothScroll();
    initLazyLoad();
    initParallax();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
