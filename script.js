const yearNode = document.getElementById('year');
yearNode.textContent = new Date().getFullYear();

const progressBar = document.getElementById('scroll-progress');
const heroContent = document.getElementById('hero-content');

const updateScrollEffects = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(progress, 1)})`;

  // Subtle hero parallax to add depth while scrolling.
  heroContent.style.transform = `translateY(${Math.min(scrollTop * 0.14, 52)}px)`;
};

window.addEventListener('scroll', updateScrollEffects, { passive: true });
updateScrollEffects();

// Reveal content blocks when they enter the viewport.
const revealNodes = document.querySelectorAll('.reveal');
revealNodes.forEach((node, index) => {
  node.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 70, 350)}ms`);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealNodes.forEach((node) => observer.observe(node));

const navLinks = document.querySelectorAll('.nav-link');
const sectionNodes = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('is-active', isMatch);
    });
  });
}, { threshold: 0.45 });

sectionNodes.forEach((section) => sectionObserver.observe(section));

// Smooth-scroll for in-page navigation.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();
      const offset = 84;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme-mode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    if (savedTheme === 'light') {
      html.classList.add('light-mode');
    } else {
      html.classList.remove('light-mode');
    }
  } else {
    // Use system preference if no saved theme
    if (!prefersDark) {
      html.classList.add('light-mode');
    }
  }
};

// Handle theme toggle
themeToggle.addEventListener('click', () => {
  // Add rotation animation to icons
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');
  
  // Add spinning animation
  themeToggle.style.animation = 'iconSpin 600ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  
  setTimeout(() => {
    themeToggle.style.animation = '';
  }, 600);
  
  // Toggle theme
  html.classList.toggle('light-mode');
  const isLightMode = html.classList.contains('light-mode');
  localStorage.setItem('theme-mode', isLightMode ? 'light' : 'dark');
});

// Initialize theme on page load
initializeTheme();