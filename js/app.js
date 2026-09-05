document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = nav ? Array.from(nav.querySelectorAll('a')) : [];

  // Toggle mobile menu
  if (menuToggle && nav) {
    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when a navigation link is clicked (useful on mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.setAttribute('aria-label', 'Open menu');
        }

        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // Close menu with Escape key
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
        menuToggle.focus();
      }
    });
  }

  // Highlight the current page link based on the URL
  try {
    const current = location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(l => {
      const href = l.getAttribute('href');
      // normalize and compare
      if (href === current || (href === 'index.html' && current === '')) {
        navLinks.forEach(x => x.classList.remove('active'));
        l.classList.add('active');
      }
    });
  } catch (err) {
    // ignore if nav not present
  }

  // Fill copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
