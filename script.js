/* ============================================================
   Medieval Fantasy × Cybersecurity Portfolio — script.js
   Complete interactive layer: particles, GSAP animations,
   scroll-driven effects, custom cursor, typed text, and more.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------------
  // 0. Helpers & Preferences
  // ----------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobile = window.innerWidth < 768;

  // ----------------------------------------------------------
  // 1. Lucide Icons Initialization
  // ----------------------------------------------------------
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ----------------------------------------------------------
  // 2. Page Loader
  // ----------------------------------------------------------
  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add('loaded');
      pageLoader.addEventListener('transitionend', () => {
        pageLoader.remove();
      }, { once: true });
      // Fallback removal if no transition fires
      setTimeout(() => {
        if (pageLoader.parentNode) pageLoader.remove();
      }, 1500);
    }, 500);
  }

  // ----------------------------------------------------------
  // 3. Particle Canvas System
  // ----------------------------------------------------------
  const canvas = document.getElementById('particle-canvas');
  let particles = [];
  let animFrameId = null;
  const mouse = { x: -9999, y: -9999 };

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const PARTICLE_COLORS = ['#fde047', '#10b981', '#06b6d4', '#dc2626', '#fef08a'];
    const PARTICLE_COUNT = isMobile ? 30 : 60;
    const MOUSE_RADIUS = 120;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
      };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }
    initParticles();

    // Mouse / touch tracking for particles
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });
    window.addEventListener('touchend', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Clamp velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2) {
          p.vx = (p.vx / speed) * 2;
          p.vy = (p.vy / speed) * 2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -p.radius) p.x = canvas.width + p.radius;
        else if (p.x > canvas.width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = canvas.height + p.radius;
        else if (p.y > canvas.height + p.radius) p.y = -p.radius;

        // Draw
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.radius * 3;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        animFrameId = requestAnimationFrame(animateParticles);
      }
    }

    if (!prefersReducedMotion) {
      animateParticles();
    } else {
      // Draw single static frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // ----------------------------------------------------------
  // 4. Custom Cursor Enhancement
  // ----------------------------------------------------------
  let cursorTrail = null;
  const cursorPos = { x: 0, y: 0 };
  const trailPos = { x: 0, y: 0 };

  if (!isTouchDevice && !prefersReducedMotion) {
    cursorTrail = document.createElement('div');
    cursorTrail.classList.add('cursor-trail');
    Object.assign(cursorTrail.style, {
      position: 'fixed',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, #fde047 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: '9999',
      mixBlendMode: 'screen',
      transform: 'translate(-50%, -50%)',
      transition: 'opacity 0.3s',
      opacity: '0'
    });
    document.body.appendChild(cursorTrail);

    window.addEventListener('mousemove', (e) => {
      cursorPos.x = e.clientX;
      cursorPos.y = e.clientY;
      cursorTrail.style.opacity = '1';
    });

    window.addEventListener('mouseleave', () => {
      cursorTrail.style.opacity = '0';
    });

    function updateCursorTrail() {
      trailPos.x += (cursorPos.x - trailPos.x) * 0.15;
      trailPos.y += (cursorPos.y - trailPos.y) * 0.15;
      cursorTrail.style.left = trailPos.x + 'px';
      cursorTrail.style.top = trailPos.y + 'px';
      requestAnimationFrame(updateCursorTrail);
    }
    updateCursorTrail();
  }

  // ----------------------------------------------------------
  // 5. Navigation — Active Section Tracking
  // ----------------------------------------------------------
  const sections = document.querySelectorAll('#hero, #about, #skills, #projects, #contact');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: [0.3],
      rootMargin: '0px 0px -20% 0px'
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ----------------------------------------------------------
  // 6. Navigation — Smooth Scroll
  // ----------------------------------------------------------
  const NAV_OFFSET = 80;
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const top = targetEl.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Close mobile menu if open
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('open');
      }
    });
  });

  // ----------------------------------------------------------
  // 7. Mobile Menu Toggle
  // ----------------------------------------------------------
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      mobileMenuToggle.classList.toggle('open');
      const expanded = mobileMenu.classList.contains('open');
      mobileMenuToggle.setAttribute('aria-expanded', String(expanded));
    });

    document.querySelectorAll('.mobile-menu a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileMenuToggle.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----------------------------------------------------------
  // 8. Threat Level Widget
  // ----------------------------------------------------------
  const threatLevels = ['LOW', 'GUARDED', 'ELEVATED', 'HIGH', 'SEVERE'];
  const threatColors = ['#10b981', '#06b6d4', '#fde047', '#f97316', '#dc2626'];
  let currentThreatIndex = 0;
  const threatText = document.querySelector('.threat-level-text');
  const threatDot = document.querySelector('.threat-dot');
  const threatGauge = document.querySelector('.threat-gauge');

  function updateThreatLevel(level, color) {
    if (threatText) {
      threatText.textContent = level;
      threatText.style.color = color;
    }
    if (threatDot) {
      threatDot.style.backgroundColor = color;
      threatDot.style.boxShadow = '0 0 8px ' + color;
    }
    if (threatGauge) {
      threatGauge.classList.add('flash');
      setTimeout(() => threatGauge.classList.remove('flash'), 400);
    }
  }

  let threatIntervalId = setInterval(() => {
    currentThreatIndex = (currentThreatIndex + 1) % threatLevels.length;
    updateThreatLevel(threatLevels[currentThreatIndex], threatColors[currentThreatIndex]);
  }, 4000);

  // Initialize first state
  updateThreatLevel(threatLevels[0], threatColors[0]);

  // ----------------------------------------------------------
  // 9. GSAP Animations — Hero Section
  // ----------------------------------------------------------
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (!prefersReducedMotion) {
      // Hero entrance
      gsap.from('.hero-headline', {
        opacity: 0,
        y: 60,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      });

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
      });

      gsap.from('.hero-cta', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.9,
        ease: 'power3.out'
      });

      gsap.from('.shield-container', {
        opacity: 0,
        scale: 0.5,
        duration: 1.2,
        delay: 0.4,
        ease: 'elastic.out(1, 0.5)'
      });

      // -------------------------------------------------------
      // 10. GSAP Animations — Scroll-triggered sections
      // -------------------------------------------------------

      // Generic .animate-on-scroll
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        const hasStagger = el.classList.contains('stagger-children');
        if (hasStagger && el.children.length > 0) {
          gsap.from(el.children, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          });
        } else {
          gsap.from(el, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          });
        }
      });

      // Scroll cards (parchment unroll)
      document.querySelectorAll('.scroll-card').forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          rotationX: -10,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      });

      // Skill bars
      document.querySelectorAll('.skill-fill').forEach((bar) => {
        const level = bar.getAttribute('data-level') || '0';
        gsap.fromTo(bar,
          { width: '0%' },
          {
            width: level + '%',
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bar.closest('#skills') || bar,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // Cert badges
      const certBadges = document.querySelectorAll('.cert-badge');
      if (certBadges.length > 0) {
        gsap.from(certBadges, {
          opacity: 0,
          scale: 0,
          rotation: -20,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: certBadges[0].closest('#about') || certBadges[0].parentElement,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    } else {
      // Reduced motion: snap everything to final state
      gsap.set('.hero-headline, .hero-subtitle, .hero-cta, .shield-container', {
        opacity: 1, y: 0, scale: 1
      });
      gsap.set('.animate-on-scroll, .scroll-card', {
        opacity: 1, y: 0, rotationX: 0
      });
      document.querySelectorAll('.skill-fill').forEach((bar) => {
        const level = bar.getAttribute('data-level') || '0';
        bar.style.width = level + '%';
      });
      gsap.set('.cert-badge', { opacity: 1, scale: 1, rotation: 0 });
    }
  }

  // ----------------------------------------------------------
  // 11. Interactive Shield (Hero)
  // ----------------------------------------------------------
  const shieldContainer = document.querySelector('.shield-container');
  const heroSection = document.getElementById('hero');
  let lastSparkTime = 0;

  if (shieldContainer && heroSection && !prefersReducedMotion) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = shieldContainer.getBoundingClientRect();
      const shieldCenterX = rect.left + rect.width / 2;
      const shieldCenterY = rect.top + rect.height / 2;
      const dx = e.clientX - shieldCenterX;
      const dy = e.clientY - shieldCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Tilt shield toward mouse (max ±10deg)
      const maxAngle = 10;
      const rotateY = Math.max(-maxAngle, Math.min(maxAngle, (dx / (window.innerWidth / 2)) * maxAngle));
      const rotateX = Math.max(-maxAngle, Math.min(maxAngle, -(dy / (window.innerHeight / 2)) * maxAngle));

      if (typeof gsap !== 'undefined') {
        gsap.to(shieldContainer, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800
        });
      }

      // Spawn sparks near the shield
      const now = Date.now();
      if (distance < 250 && now - lastSparkTime > 200) {
        lastSparkTime = now;
        spawnSpark(rect, dx, dy, distance);
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(shieldContainer, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });
  }

  function spawnSpark(shieldRect, dx, dy, distance) {
    if (typeof gsap === 'undefined') return;

    const spark = document.createElement('div');
    spark.className = 'spark';
    Object.assign(spark.style, {
      position: 'fixed',
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      backgroundColor: '#fde047',
      boxShadow: '0 0 6px #fde047, 0 0 12px #f59e0b',
      pointerEvents: 'none',
      zIndex: '50'
    });

    // Position on the edge of shield facing mouse
    const angle = Math.atan2(dy, dx);
    const edgeRadius = shieldRect.width / 2;
    const startX = shieldRect.left + shieldRect.width / 2 + Math.cos(angle) * edgeRadius;
    const startY = shieldRect.top + shieldRect.height / 2 + Math.sin(angle) * edgeRadius;

    spark.style.left = startX + 'px';
    spark.style.top = startY + 'px';
    document.body.appendChild(spark);

    const moveX = Math.cos(angle) * (30 + Math.random() * 40);
    const moveY = Math.sin(angle) * (30 + Math.random() * 40);

    gsap.fromTo(spark,
      { scale: 0, opacity: 1 },
      {
        scale: 1,
        opacity: 0,
        x: moveX,
        y: moveY,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => spark.remove()
      }
    );
  }

  // ----------------------------------------------------------
  // 12. Scroll-to-Top Button
  // ----------------------------------------------------------
  let scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (!scrollTopBtn) {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    Object.assign(scrollTopBtn.style, {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: '1px solid rgba(253, 224, 71, 0.4)',
      background: 'rgba(30, 20, 10, 0.85)',
      color: '#fde047',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '100',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 0.3s, transform 0.3s',
      backdropFilter: 'blur(6px)'
    });
    document.body.appendChild(scrollTopBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.style.opacity = '1';
      scrollTopBtn.style.pointerEvents = 'auto';
    } else {
      scrollTopBtn.style.opacity = '0';
      scrollTopBtn.style.pointerEvents = 'none';
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----------------------------------------------------------
  // 13. Accordion Functionality
  // ----------------------------------------------------------
  document.querySelectorAll('.accordion-header').forEach((header) => {
    // Accessibility
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');

    function toggleAccordion() {
      const content = header.nextElementSibling;
      if (!content) return;

      const isOpen = content.classList.contains('open');

      // Close all other accordions
      document.querySelectorAll('.accordion-header').forEach((otherHeader) => {
        const otherContent = otherHeader.nextElementSibling;
        if (otherContent && otherHeader !== header) {
          otherContent.classList.remove('open');
          otherHeader.setAttribute('aria-expanded', 'false');
          const otherChevron = otherHeader.querySelector('.chevron, [data-lucide="chevron-down"], svg');
          if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
        }
      });

      // Toggle current
      content.classList.toggle('open');
      header.setAttribute('aria-expanded', String(!isOpen));

      const chevron = header.querySelector('.chevron, [data-lucide="chevron-down"], svg');
      if (chevron) {
        chevron.style.transition = 'transform 0.3s ease';
        chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    }

    header.addEventListener('click', toggleAccordion);
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion();
      }
    });
  });

  // ----------------------------------------------------------
  // 14. Contact Form Handler
  // ----------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');

      const nameVal = name ? name.value.trim() : '';
      const emailVal = email ? email.value.trim() : '';
      const messageVal = message ? message.value.trim() : '';

      // Validation
      if (!nameVal || !emailVal || !messageVal) {
        showToast('All fields are required. Fill in every field to send your raven.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        showToast('Invalid email format. The raven cannot find that address.', 'error');
        return;
      }

      // Success
      showToast('Your message has been sent by raven! The guild will respond shortly.', 'success');
      contactForm.reset();
    });
  }

  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-' + type;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      border: type === 'success'
        ? '1px solid rgba(16, 185, 129, 0.5)'
        : '1px solid rgba(220, 38, 38, 0.5)',
      background: type === 'success'
        ? 'rgba(16, 185, 129, 0.15)'
        : 'rgba(220, 38, 38, 0.15)',
      backdropFilter: 'blur(10px)',
      color: type === 'success' ? '#6ee7b7' : '#fca5a5',
      fontSize: '0.9rem',
      zIndex: '10000',
      opacity: '0',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      maxWidth: '90vw',
      textAlign: 'center',
      fontFamily: 'inherit',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
    });
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Remove after 4 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 600);
    }, 4000);
  }

  // ----------------------------------------------------------
  // 15. Typed Text Effect for Hero
  // ----------------------------------------------------------
  const typedTextEl = document.querySelector('.typed-text');

  if (typedTextEl) {
    const strings = [
      'Threat Hunter',
      'Blue Team Defender',
      'Vulnerability Researcher',
      'Digital Sentinel'
    ];
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout = null;

    // Create blinking cursor
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    cursor.textContent = '|';
    Object.assign(cursor.style, {
      display: 'inline-block',
      animation: 'blink-cursor 0.7s step-end infinite',
      marginLeft: '2px',
      fontWeight: '100'
    });
    typedTextEl.parentNode.insertBefore(cursor, typedTextEl.nextSibling);

    // Add blink keyframe
    if (!document.getElementById('typed-cursor-style')) {
      const style = document.createElement('style');
      style.id = 'typed-cursor-style';
      style.textContent = '@keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }';
      document.head.appendChild(style);
    }

    function typeStep() {
      const currentString = strings[stringIndex];

      if (!isDeleting) {
        // Typing forward
        typedTextEl.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentString.length) {
          // Finished typing — pause then delete
          isDeleting = true;
          typingTimeout = setTimeout(typeStep, 2000);
          return;
        }
        typingTimeout = setTimeout(typeStep, 50);
      } else {
        // Deleting
        typedTextEl.textContent = currentString.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          stringIndex = (stringIndex + 1) % strings.length;
          typingTimeout = setTimeout(typeStep, 400);
          return;
        }
        typingTimeout = setTimeout(typeStep, 30);
      }
    }

    // Start after hero animation completes
    setTimeout(typeStep, 1500);
  }

  // ----------------------------------------------------------
  // 16. Parallax on Scroll
  // ----------------------------------------------------------
  if (!prefersReducedMotion) {
    const heroBgElements = document.querySelectorAll('.hero-bg-element');
    if (heroBgElements.length > 0) {
      const parallaxRates = [0.3, 0.5, 0.2, 0.4, 0.35];
      let ticking = false;

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            heroBgElements.forEach((el, i) => {
              const rate = parallaxRates[i % parallaxRates.length];
              el.style.transform = 'translateY(' + (scrollY * rate) + 'px)';
            });
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }

  // ----------------------------------------------------------
  // 17. Sound-free Torch Flicker
  // ----------------------------------------------------------
  document.querySelectorAll('.torch-icon').forEach((torch, i) => {
    const delay = Math.random() * 2;
    torch.style.animationDelay = delay + 's';
    // Also vary duration slightly for organic feel
    const duration = 1.5 + Math.random() * 1.5;
    torch.style.animationDuration = duration + 's';
  });

  // ----------------------------------------------------------
  // 18. Wax Seal Pulse
  // ----------------------------------------------------------
  if (!prefersReducedMotion) {
    document.querySelectorAll('.wax-seal').forEach((seal) => {
      // Each seal pulses with a slightly different timing
      const delay = Math.random() * 2;
      seal.style.animationDelay = delay + 's';
    });
  }

  // ----------------------------------------------------------
  // 19. Social Link Hover Enhancement
  // ----------------------------------------------------------
  document.querySelectorAll('.social-links a').forEach((link) => {
    link.addEventListener('mouseenter', () => {
      if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        gsap.to(link, {
          scale: 1.2,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      }
    });
    link.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        gsap.to(link, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  });

  // ----------------------------------------------------------
  // 20. Easter Egg — Konami Code
  // ----------------------------------------------------------
  const konamiSequence = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  let konamiIndex = 0;
  let konamiActive = false;

  window.addEventListener('keydown', (e) => {
    const expected = konamiSequence[konamiIndex];
    if (e.code === expected) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        if (!konamiActive) {
          activateKonamiEasterEgg();
        }
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateKonamiEasterEgg() {
    konamiActive = true;

    // Override threat level
    clearInterval(threatIntervalId);
    updateThreatLevel('LEGENDARY', '#a855f7');

    // Burst of gold particles
    if (canvas && !prefersReducedMotion) {
      const burstCount = 50;
      for (let i = 0; i < burstCount; i++) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angle = (Math.PI * 2 * i) / burstCount;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 2,
          opacity: 0.8 + Math.random() * 0.2,
          color: '#fde047'
        });
      }
    }

    // Flash the page border purple briefly
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      border: '3px solid #a855f7',
      pointerEvents: 'none',
      zIndex: '99999',
      boxShadow: 'inset 0 0 60px rgba(168, 85, 247, 0.3)',
      transition: 'opacity 1s ease'
    });
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = '0';
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    }, 2000);

    // Reset after 5 seconds
    setTimeout(() => {
      konamiActive = false;
      // Remove extra burst particles (trim back to normal count)
      const normalCount = isMobile ? 30 : 60;
      if (particles.length > normalCount) {
        particles.length = normalCount;
      }
      // Restart threat cycle
      currentThreatIndex = 0;
      updateThreatLevel(threatLevels[0], threatColors[0]);
      threatIntervalId = setInterval(() => {
        currentThreatIndex = (currentThreatIndex + 1) % threatLevels.length;
        updateThreatLevel(threatLevels[currentThreatIndex], threatColors[currentThreatIndex]);
      }, 4000);
    }, 5000);
  }

  // ----------------------------------------------------------
  // 21. Castle Nav — hide/show on scroll
  // ----------------------------------------------------------
  const castleNav = document.querySelector('.castle-nav');
  let lastScrollY = 0;

  if (castleNav) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        castleNav.style.transform = 'translateY(-100%)';
      } else {
        castleNav.style.transform = 'translateY(0)';
      }
      castleNav.style.transition = 'transform 0.35s ease';
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // ----------------------------------------------------------
  // Console signature
  // ----------------------------------------------------------
  console.log(
    '%c⚔️ Medieval Cyber Portfolio ⚔️\n%cCrafted with arcane JavaScript',
    'color: #fde047; font-size: 16px; font-weight: bold;',
    'color: #10b981; font-size: 11px;'
  );
});
