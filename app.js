// =========================
// GLOBAL VARIABLES
// =========================
window.__DEV__ = true; // Development flag for debugging

const assetManifest = [
  'k1.jpg',
  'style.css',
  'script.js',
  // Add more assets as needed
];

// Portfolio data
const portfolioData = {
  personal: {
    name: "Bhuvanesh D",
    title: "Full-Stack Developer",
    roles: ["Java Developer", "React Specialist", "Flutter Developer", "AI Enthusiast"],
    location: "Tamil Nadu, India",
    email: "dbhuvanesh210@gmail.com",
    phone: "+91 8925597374",
    github: "https://github.com/bhuvanesh8399",
    linkedin: "https://www.linkedin.com/in/bhuvanesh-d-4a1642370",
    bio: "Final-year B.Tech (IT) student with a strong foundation in Java and working knowledge of Python, C, React, Flutter, and AI. Passionate about problem-solving and continuous learning.",
    image: "k1.jpg",
    resume_file: "assets/Bhuvanesh_SoftwareEngg_leet code_resume.pdf"
  },
  skills: [
    {"name": "Java", "level": 90, "category": "Backend", "description": "Strong foundation with Spring Boot framework"},
    {"name": "Python", "level": 75, "category": "Backend", "description": "Data science and web development"},
    {"name": "React", "level": 80, "category": "Frontend", "description": "Modern UI development with hooks"},
    {"name": "Spring Boot", "level": 85, "category": "Framework", "description": "Enterprise application development"},
    {"name": "Flutter", "level": 70, "category": "Mobile", "description": "Cross-platform mobile apps"},
    {"name": "MySQL", "level": 80, "category": "Database", "description": "Relational database design"},
    {"name": "JavaScript", "level": 75, "category": "Frontend", "description": "ES6+ and modern web APIs"},
    {"name": "Git", "level": 85, "category": "Tools", "description": "Version control and collaboration"},
    {"name": "Docker", "level": 60, "category": "DevOps", "description": "Containerization basics"},
    {"name": "MongoDB", "level": 70, "category": "Database", "description": "NoSQL document database"}
  ],
  projects: [
    {
      name: "Encrypted Exchange",
      description: "Implemented Homomorphic Encryption, ZKPs, and Blockchain to ensure secure data sharing. Built full-stack solutions integrating React, Express.js, MongoDB, and decentralized storage (IPFS). Developed AI-powered modules for encryption updates and anomaly detection.",
      tech: ["Blockchain", "React", "Express.js", "MongoDB", "IPFS", "AI"],
      category: "Full Stack + Blockchain",
      highlights: ["Advanced Encryption", "Blockchain Integration", "AI-Powered Security"]
    },
    {
      name: "TravelMate - Smart Travel Planner",
      description: "Built a web app that helps users plan travel itineraries with location-based suggestions. Integrated AI model to recommend destinations based on user interests and seasonality. Implemented real-time weather API and Google Maps for route optimization.",
      tech: ["React", "Node.js", "AI/ML", "Google Maps API", "Weather API"],
      category: "Full Stack + AI",
      highlights: ["AI Recommendations", "Real-time APIs", "Route Optimization"]
    },
    {
      name: "Weather App",
      description: "Successfully implemented a dynamic weather application leveraging Node.js to handle API requests and responses, showcasing proficiency in backend development and API integration.",
      tech: ["Node.js", "Express", "Weather API", "JavaScript"],
      category: "Backend Development",
      highlights: ["API Integration", "Real-time Data", "Responsive Design"]
    },
    {
      name: "Event Registration App",
      description: "Built a cross-platform mobile app using Flutter and Dart for event browsing and registration. Integrated Firebase for authentication and real-time data. Focused on clean UI and smooth user experience.",
      tech: ["Flutter", "Dart", "Firebase", "Mobile UI"],
      category: "Mobile Development",
      highlights: ["Cross-platform", "Real-time Database", "Clean UI"]
    }
  ],
  timeline: [
    { year: "2022", title: "Started B.Tech IT", description: "Began journey at Kalasalingam University", type: "education" },
    { year: "2023", title: "First Major Project", description: "Built Weather App with Node.js", type: "project" },
    { year: "2024", title: "Hackathon Winner", description: "Won Encryptcon 24-Hr Hackathon", type: "achievement" },
    { year: "2025", title: "Final Year Focus", description: "Advanced projects in AI and Blockchain", type: "current" }
  ]
};

// Global variables
let currentRoleIndex = 0;
let particlesArray = [];
let isLoaded = false;
let currentProgress = 0;

// =========================
// LOADER
// =========================
class Loader {
  constructor() {
    this.loadingScreen = document.getElementById('loadingScreen');
    this.loadingProgress = document.getElementById('loadingProgress');
    this.loadingPercentage = document.getElementById('loadingPercentage');
    this.loadingLogo = document.getElementById('loadingLogo');
    this.sparkleCanvas = document.getElementById('sparkleCanvas');
    this.progressBar = document.querySelector('.loading-bar');
    
    this.progress = 0;
    this.targetProgress = 0;
    this.isComplete = false;
    this.startTime = Date.now();
    this.maxDuration = 3500; // 3.5s timeout
    
    this.initSparkles();
    this.checkSkipCondition();
  }

  checkSkipCondition() {
    const lastLoad = sessionStorage.getItem('portfolioLoaded');
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (lastLoad && (now - parseInt(lastLoad)) < twentyFourHours) {
      if (window.__DEV__) console.log('Loader: Skipping (within 24h)');
      this.skipLoader();
      return;
    }
    
    this.startLoading();
  }

  skipLoader() {
    this.loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      this.cleanup();
      this.onComplete();
    }, 300);
  }

  startLoading() {
    if (window.__DEV__) console.log('Loader: Starting real progress tracking');
    
    // Start progress animation
    this.animateProgress();
    
    // Preload assets
    this.preloadAssets();
    
    // Timeout fallback
    setTimeout(() => {
      if (!this.isComplete) {
        if (window.__DEV__) console.log('Loader: Timeout reached, completing');
        this.complete();
      }
    }, this.maxDuration);
  }

  preloadAssets() {
    let loadedCount = 0;
    const totalAssets = assetManifest.length;
    
    const updateProgress = () => {
      loadedCount++;
      this.targetProgress = Math.min((loadedCount / totalAssets) * 100, 100);
      
      if (loadedCount >= totalAssets) {
        setTimeout(() => this.complete(), 500);
      }
    };

    assetManifest.forEach((asset, index) => {
      // Add delay for better UX
      setTimeout(() => {
        this.loadAsset(asset)
          .then(updateProgress)
          .catch(() => {
            if (window.__DEV__) console.warn(`Failed to load: ${asset}`);
            updateProgress(); // Count failed assets as loaded
          });
      }, index * 100);
    });
  }

  loadAsset(assetPath) {
    return new Promise((resolve, reject) => {
      if (assetPath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        // Load image
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = assetPath;
      } else if (assetPath.match(/\.(css|js)$/i)) {
        // Check if resource exists
        fetch(assetPath, { method: 'HEAD' })
          .then(response => response.ok ? resolve() : reject())
          .catch(reject);
      } else {
        // Default case
        resolve();
      }
    });
  }

  animateProgress() {
    const animate = () => {
      if (this.isComplete) return;
      
      // Smooth progress animation
      const diff = this.targetProgress - this.progress;
      this.progress += diff * 0.1;
      
      // Update UI
      this.updateUI();
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  updateUI() {
    const roundedProgress = Math.round(this.progress);
    
    // Update progress bar
    this.loadingProgress.style.width = `${this.progress}%`;
    
    // Update percentage
    this.loadingPercentage.textContent = `${roundedProgress}%`;
    
    // Update ARIA
    this.progressBar.setAttribute('aria-valuenow', roundedProgress);
  }

  initSparkles() {
    if (!this.sparkleCanvas) return;
    
    const canvas = this.sparkleCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const sparkles = [];
    const numSparkles = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 12;
    
    // Create sparkles
    for (let i = 0; i < numSparkles; i++) {
      sparkles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    
    const animateSparkles = () => {
      if (this.isComplete) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      sparkles.forEach(sparkle => {
        // Update position
        sparkle.x += sparkle.speedX;
        sparkle.y += sparkle.speedY;
        
        // Wrap around edges
        if (sparkle.x < 0) sparkle.x = canvas.width;
        if (sparkle.x > canvas.width) sparkle.x = 0;
        if (sparkle.y < 0) sparkle.y = canvas.height;
        if (sparkle.y > canvas.height) sparkle.y = 0;
        
        // Draw sparkle
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(33, 128, 141, ${sparkle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animateSparkles);
    };
    
    if (numSparkles > 0) {
      animateSparkles();
    }
  }

  complete() {
    if (this.isComplete) return;
    this.isComplete = true;
    
    if (window.__DEV__) console.log('Loader: Complete');
    
    // Ensure 100%
    this.progress = 100;
    this.updateUI();
    
    // Set session storage
    sessionStorage.setItem('portfolioLoaded', Date.now().toString());
    
    // Play reveal animation
    setTimeout(() => {
      this.playRevealAnimation();
    }, 500);
  }

  playRevealAnimation() {
    // Confetti burst (reduced motion aware)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.showConfetti();
    }
    
    // Collapse animation
    this.loadingScreen.classList.add('reveal-animation');
    
    setTimeout(() => {
      this.cleanup();
      this.onComplete();
    }, 800);
  }

  showConfetti() {
    const confetti = ['🎉', '✨', '🚀', '💻', '⚡'];
    
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const emoji = document.createElement('div');
        emoji.textContent = confetti[Math.floor(Math.random() * confetti.length)];
        emoji.style.cssText = `
          position: fixed;
          z-index: 10001;
          font-size: 1.5rem;
          pointer-events: none;
          left: ${Math.random() * 100}vw;
          top: 50vh;
          animation: confettiFall 2s ease-out forwards;
        `;
        
        document.body.appendChild(emoji);
        
        setTimeout(() => emoji.remove(), 2000);
      }, i * 100);
    }
    
    // Add confetti animation if not exists
    if (!document.querySelector('#confetti-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-style';
      style.textContent = `
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(50vh) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  cleanup() {
    // Remove canvas listeners and clear context
    if (this.sparkleCanvas) {
      const ctx = this.sparkleCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.sparkleCanvas.width, this.sparkleCanvas.height);
    }
    
    // Remove from DOM
    if (this.loadingScreen) {
      this.loadingScreen.remove();
    }
  }

  onComplete() {
    document.body.classList.add('app-ready');
    
    // Return focus to main content
    const main = document.getElementById('main');
    if (main) {
      main.focus();
      main.removeAttribute('tabindex'); // Clean up after focus
    }
    
    // Initialize app
    initializeApp();
  }
}

// Dev helper: Force loader (bound to L key)
window.forceLoader = function() {
  sessionStorage.removeItem('portfolioLoaded');
  location.reload();
};

// =========================
// PAGE TRANSITIONS
// =========================
function initPageTransitions() {
  const pageTransition = document.getElementById('pageTransition');
  
  // Smooth anchor links with page wipe
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Play transition
        pageTransition.classList.add('active');
        
        setTimeout(() => {
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update nav active state
          updateActiveNavLink(targetId);
          
          setTimeout(() => {
            pageTransition.classList.remove('active');
          }, 300);
        }, 300);
      }
    });
  });
}

// =========================
// NAVIGATION ENHANCEMENTS
// =========================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navIndicator = document.getElementById('navIndicator');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  
  // Scroll detection
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Update active section
    updateActiveNavLink();
  });
  
  // Mobile menu toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Elastic nav indicator
  function updateNavIndicator() {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink && navIndicator) {
      const rect = activeLink.getBoundingClientRect();
      const navRect = navbar.getBoundingClientRect();
      
      navIndicator.style.left = `${rect.left - navRect.left}px`;
      navIndicator.style.width = `${rect.width}px`;
    }
  }
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', updateNavIndicator);
  });
  
  // Initial indicator position
  setTimeout(updateNavIndicator, 100);
  window.addEventListener('resize', updateNavIndicator);
}

function updateActiveNavLink(activeSection) {
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (activeSection) {
    // Manually set active section
    navLinks.forEach(link => {
      link.classList.toggle('active', 
        link.getAttribute('data-section') === activeSection);
    });
  } else {
    // Auto-detect based on scroll position
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.id;
      }
    });
    
    navLinks.forEach(link => {
      link.classList.toggle('active', 
        link.getAttribute('data-section') === currentSection);
    });
  }
}

// =========================
// CERTIFICATES ACCORDION
// =========================
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isOpen = header.getAttribute('aria-expanded') === 'true';
      
      // Close all other accordions
      accordionHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          otherHeader.nextElementSibling.classList.remove('open');
        }
      });
      
      // Toggle current accordion
      header.setAttribute('aria-expanded', !isOpen);
      content.classList.toggle('open');
    });
  });
  
  // Handle deep links
  const hash = window.location.hash;
  if (hash.startsWith('#cert-')) {
    const certItem = document.querySelector(hash);
    if (certItem) {
      const header = certItem.querySelector('.accordion-header');
      header?.click();
      setTimeout(() => {
        certItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }
}

// =========================
// BACK TO TOP ROCKET
// =========================
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  const rocket = document.getElementById('rocket');
  
  if (!backToTop) return;
  
  // Show/hide based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  // Click handler
  const scrollToTop = () => {
    // Rocket lift-off animation
    rocket.classList.add('lift-off');
    
    // Scroll to top
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
    
    // Reset animation
    setTimeout(() => {
      rocket.classList.remove('lift-off');
    }, 600);
  };
  
  backToTop.addEventListener('click', scrollToTop);
  
  // Keyboard support
  backToTop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  });
}

// =========================
// THEME TOGGLE
// =========================
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  if (!themeToggle) return;
  
  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-color-scheme', savedTheme);
  updateThemeIcon(savedTheme);
  
  // Toggle theme
  const toggleTheme = () => {
    const currentTheme = html.getAttribute('data-color-scheme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Add switching animation
    themeToggle.classList.add('switching');
    
    html.setAttribute('data-color-scheme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    setTimeout(() => {
      themeToggle.classList.remove('switching');
    }, 500);
  };
  
  themeToggle.addEventListener('click', toggleTheme);
  
  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// =========================
// CURSOR PARALLAX
// =========================
function initCursorParallax() {
  // Skip on touch devices and reduced motion
  if ('ontouchstart' in window || 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax')) || 0.05;
      const x = (mouseX - centerX) * speed;
      const y = (mouseY - centerY) * speed;
      
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// =========================
// KEYBOARD SHORTCUTS
// =========================
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Skip if user is typing in an input
    if (e.target.matches('input, textarea, [contenteditable]')) {
      return;
    }
    
    switch(e.key.toLowerCase()) {
      case 'l':
        if (window.forceLoader) {
          window.forceLoader();
        }
        break;
      case 'd':
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.click();
        break;
    }
  });
}

// =========================
// CUSTOM CURSOR
// =========================
function initCustomCursor() {
  // Skip on touch devices
  if ('ontouchstart' in window) return;
  
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  
  if (!cursor || !cursorFollower) return;
  
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  
  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Animate cursors
  function animateCursor() {
    // Main cursor follows immediately
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Follower has delay
    const speed = 0.15;
    followerX += (mouseX - followerX) * speed;
    followerY += (mouseY - followerY) * speed;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Interactive elements
  const interactiveElements = document.querySelectorAll('a, button, [role="button"], [tabindex="0"]');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursorFollower.style.transform = 'scale(1.5)';
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursorFollower.style.transform = 'scale(1)';
    });
  });
}

// =========================
// PARTICLES BACKGROUND
// =========================
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  // Skip on reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    particlesContainer.style.display = 'none';
    return;
  }
  
  // Create particles
  const particleCount = window.innerWidth < 768 ? 30 : 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position and animation delay
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    
    particlesContainer.appendChild(particle);
  }
}

// =========================
// ROLE ROTATION
// =========================
function initRoleRotation() {
  const roleText = document.getElementById('roleText');
  if (!roleText) return;
  
  const roles = portfolioData.personal.roles;
  let currentIndex = 0;
  
  function rotateRole() {
    roleText.style.opacity = '0';
    
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % roles.length;
      roleText.textContent = roles[currentIndex];
      roleText.style.opacity = '1';
    }, 300);
  }
  
  // Start rotation
  setInterval(rotateRole, 3000);
}

// =========================
// STATS COUNTER
// =========================
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateStats = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseInt(element.getAttribute('data-target'));
        let current = 0;
        const increment = target / 60; // 60 frames for 1 second
        
        const counter = setInterval(() => {
          current += increment;
          element.textContent = Math.floor(current);
          
          if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
          }
        }, 16); // ~60fps
      }
    });
  };
  
  const observer = new IntersectionObserver(animateStats, {
    threshold: 0.7
  });
  
  statNumbers.forEach(stat => {
    observer.observe(stat);
  });
}

// =========================
// SKILLS PROGRESS
// =========================
function initSkillsProgress() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  const animateSkills = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const targetWidth = progressBar.getAttribute('data-width');
        
        setTimeout(() => {
          progressBar.style.width = targetWidth + '%';
        }, 200);
      }
    });
  };
  
  const observer = new IntersectionObserver(animateSkills, {
    threshold: 0.5
  });
  
  skillBars.forEach(bar => {
    observer.observe(bar);
  });
}

// =========================
// PROJECTS LOADING
// =========================
function loadProjects() {
  const projectsGrid = document.getElementById('projectsGrid');
  if (!projectsGrid) return;
  
  portfolioData.projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
      <div class="project-header">
        <h3 class="project-title">${project.name}</h3>
        <span class="project-category">${project.category}</span>
      </div>
      <div class="project-body">
        <p class="project-description">${project.description}</p>
        <div class="project-tech">
          ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
      </div>
    `;
    
    projectsGrid.appendChild(projectCard);
  });
}

// =========================
// TIMELINE LOADING
// =========================
function loadTimeline() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  
  portfolioData.timeline.forEach((item, index) => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.innerHTML = `
      <div class="timeline-year">${item.year}</div>
      <div class="timeline-content">
        <h4 class="timeline-title">${item.title}</h4>
        <p class="timeline-description">${item.description}</p>
      </div>
    `;
    
    timeline.appendChild(timelineItem);
  });
  
  // Animate timeline items on scroll
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const animateTimeline = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  };
  
  const observer = new IntersectionObserver(animateTimeline, {
    threshold: 0.3
  });
  
  timelineItems.forEach(item => {
    observer.observe(item);
  });
}

// =========================
// CONTACT FORM
// =========================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate form
    const formData = new FormData(form);
    const errors = validateForm(formData);
    
    // Clear previous errors
    clearErrors();
    
    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      return;
    }
    
    // Simulate form submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
      submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        form.reset();
        clearErrors();
      }, 2000);
    }, 1500);
  });
  
  // Real-time validation
  const inputs = form.querySelectorAll('.form-control');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      clearFieldError(input);
    });
  });
}

function validateForm(formData) {
  const errors = {};
  
  // Name validation
  const name = formData.get('name')?.trim();
  if (!name) {
    errors.name = 'Name is required';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  // Email validation
  const email = formData.get('email')?.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Subject validation
  const subject = formData.get('subject')?.trim();
  if (!subject) {
    errors.subject = 'Subject is required';
  }
  
  // Message validation
  const message = formData.get('message')?.trim();
  if (!message) {
    errors.message = 'Message is required';
  } else if (message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  
  return errors;
}

function validateField(input) {
  const formData = new FormData();
  formData.append(input.name, input.value);
  const errors = validateForm(formData);
  
  if (errors[input.name]) {
    showFieldError(input, errors[input.name]);
  } else {
    clearFieldError(input);
  }
}

function showErrors(errors) {
  Object.keys(errors).forEach(fieldName => {
    const input = document.querySelector(`[name="${fieldName}"]`);
    showFieldError(input, errors[fieldName]);
  });
}

function showFieldError(input, message) {
  const errorElement = document.getElementById(`${input.name}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    input.classList.add('error');
    input.classList.remove('success');
  }
}

function clearFieldError(input) {
  const errorElement = document.getElementById(`${input.name}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    input.classList.remove('error');
    if (input.value.trim()) {
      input.classList.add('success');
    }
  }
}

function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  const inputs = document.querySelectorAll('.form-control');
  
  errorElements.forEach(error => error.textContent = '');
  inputs.forEach(input => {
    input.classList.remove('error', 'success');
  });
}

// =========================
// RESUME DOWNLOAD
// =========================
function downloadResume() {
  const resumeButtons = document.querySelectorAll('.resume-download-btn');
  const successMessage = document.getElementById('downloadSuccess');
  
  resumeButtons.forEach(btn => {
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    btn.disabled = true;
    
    // Simulate download process
    setTimeout(() => {
      // Create download link
      const link = document.createElement('a');
      link.href = portfolioData.personal.resume_file;
      link.download = portfolioData.personal.resume_file;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update button state
      btn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
      btn.style.backgroundColor = 'var(--color-success)';
      
      // Show success message
      if (successMessage) {
        successMessage.classList.add('show');
        setTimeout(() => {
          successMessage.classList.remove('show');
        }, 3000);
      }
      
      // Reset button
      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.backgroundColor = '';
        btn.disabled = false;
      }, 3000);
    }, 1000);
  });
}

// =========================
// MAIN INITIALIZATION
// =========================
function initializeApp() {
  if (window.__DEV__) console.log('App: Initializing...');
  
  // Initialize all features
  initPageTransitions();
  initNavigation();
  initAccordion();
  initBackToTop();
  initThemeToggle();
  initCursorParallax();
  initKeyboardShortcuts();
  initCustomCursor();
  initParticles();
  initRoleRotation();
  initStatsCounter();
  initSkillsProgress();
  initContactForm();
  
  // Load dynamic content
  loadProjects();
  loadTimeline();
  
  if (window.__DEV__) console.log('App: Initialized successfully');
}

// =========================
// START APPLICATION
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // Start with loader
  new Loader();
});

// Global resize handler
window.addEventListener('resize', () => {
  // Reinitialize particles on resize
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    particlesContainer.innerHTML = '';
    initParticles();
  }
});

// Error handling
window.addEventListener('error', (e) => {
  if (window.__DEV__) {
    console.error('Portfolio Error:', e.error);
  }
});

// Export for global access
window.portfolioApp = {
  downloadResume,
  forceLoader: window.forceLoader
};
