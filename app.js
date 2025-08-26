/*!
 * Portfolio App - Vanilla JavaScript
 * Author: Bhuvanesh D
 * Version: 2.0.0
 */

'use strict';

// ====== EMAILJS CONFIGURATION ====== 
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; 
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

// ====== GLOBAL VARIABLES ======
const APP = {
    isLoaded: false,
    currentTheme: 'dark',
    mobileMenuOpen: false,
    firstVisit: !localStorage.getItem('portfolio-visited'),
    roles: [
        'Full-Stack Developer',
        'Java Specialist', 
        'React Developer',
        'Flutter Expert',
        'AI Enthusiast',
        'Problem Solver'
    ],
    currentRoleIndex: 0,
    
    // Portfolio Data
    skills: [
        { name: 'Java', level: 90, icon: 'fab fa-java', description: 'Enterprise-grade applications with Spring Boot' },
        { name: 'Python', level: 75, icon: 'fab fa-python', description: 'Data science and web development' },
        { name: 'React', level: 80, icon: 'fab fa-react', description: 'Modern UI development with hooks' },
        { name: 'Flutter', level: 70, icon: 'fas fa-mobile-alt', description: 'Cross-platform mobile apps' },
        { name: 'Node.js', level: 75, icon: 'fab fa-node-js', description: 'Scalable backend services' },
        { name: 'MySQL', level: 80, icon: 'fas fa-database', description: 'Relational database design' },
        { name: 'MongoDB', level: 70, icon: 'fas fa-leaf', description: 'NoSQL document database' },
        { name: 'Docker', level: 60, icon: 'fab fa-docker', description: 'Containerization and deployment' },
        { name: 'Git', level: 85, icon: 'fab fa-git-alt', description: 'Version control and collaboration' },
        { name: 'JavaScript', level: 85, icon: 'fab fa-js-square', description: 'Modern ES6+ development' }
    ],
    
    projects: [
        {
            title: 'Encrypted Exchange',
            category: 'Full Stack + Blockchain',
            description: 'Secure data sharing platform using Homomorphic Encryption, ZKPs, and Blockchain. Built with React, Express.js, MongoDB, and IPFS with AI-powered security modules.',
            tech: ['Blockchain', 'React', 'Express.js', 'MongoDB', 'IPFS', 'AI'],
            github: 'https://github.com/bhuvanesh8399',
            demo: '#',
            image: null
        },
        {
            title: 'TravelMate - AI Travel Planner',
            category: 'Full Stack + AI',
            description: 'Smart travel planning app with AI-powered destination recommendations, real-time weather integration, and Google Maps route optimization.',
            tech: ['React', 'Node.js', 'AI/ML', 'Google Maps API', 'Weather API'],
            github: 'https://github.com/bhuvanesh8399',
            demo: '#',
            image: null
        },
        {
            title: 'Weather App',
            category: 'Backend Development',
            description: 'Dynamic weather application with Node.js backend for real-time API integration and responsive design.',
            tech: ['Node.js', 'Express', 'Weather API', 'JavaScript'],
            github: 'https://github.com/bhuvanesh8399',
            demo: '#',
            image: null
        },
        {
            title: 'Event Registration App',
            category: 'Mobile Development',
            description: 'Cross-platform mobile app built with Flutter and Firebase for event management with real-time authentication.',
            tech: ['Flutter', 'Dart', 'Firebase', 'Mobile UI'],
            github: 'https://github.com/bhuvanesh8399',
            demo: '#',
            image: null
        }
    ]
};

// ====== UTILITY FUNCTIONS ======
const Utils = {
    // DOM Selection
    $(selector) {
        return document.querySelector(selector);
    },
    
    $$(selector) {
        return document.querySelectorAll(selector);
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Generate stars for skill rating
    generateStars(level) {
        const stars = Math.round(level / 20);
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += i <= stars ? 
                '<i class="fas fa-star skill-star"></i>' : 
                '<i class="far fa-star skill-star"></i>';
        }
        return starsHTML;
    },
    
    // Animate number counting
    animateNumber(element, target, duration = 1000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const counter = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(counter);
            }
        }, 16);
    }
};

// ====== LOADING SCREEN ======
const LoadingScreen = {
    element: null,
    progressBar: null,
    
    init() {
        this.element = Utils.$('#loadingScreen');
        this.progressBar = Utils.$('#loadingBar');
        
        if (!this.element) return;
        
        this.show();
        this.simulateLoading();
    },
    
    show() {
        this.element.classList.remove('hidden');
    },
    
    hide() {
        this.element.classList.add('hidden');
        setTimeout(() => {
            if (this.element) {
                this.element.remove();
            }
        }, 500);
    },
    
    simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hide(), 500);
            }
            
            if (this.progressBar) {
                this.progressBar.style.width = `${progress}%`;
            }
        }, 200);
    }
};

// ====== CUSTOM CURSOR ======
const CustomCursor = {
    cursor: null,
    follower: null,
    
    init() {
        if (window.innerWidth < 768 || 'ontouchstart' in window) return;
        
        this.cursor = Utils.$('#cursor');
        this.follower = Utils.$('#cursorFollower');
        
        if (!this.cursor || !this.follower) return;
        
        this.bindEvents();
    },
    
    bindEvents() {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            this.cursor.style.left = mouseX + 'px';
            this.cursor.style.top = mouseY + 'px';
        });
        
        const animateFollower = () => {
            const speed = 0.15;
            followerX += (mouseX - followerX) * speed;
            followerY += (mouseY - followerY) * speed;
            
            this.follower.style.left = followerX + 'px';
            this.follower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateFollower);
        };
        
        animateFollower();
        
        // Interactive elements
        const interactiveElements = Utils.$$('a, button, [role="button"], .skill-card, .project-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(2)';
                this.follower.style.transform = 'scale(1.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.follower.style.transform = 'scale(1)';
            });
        });
    }
};

// ====== CONFETTI ANIMATION ======
const Confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    
    init() {
        this.canvas = Utils.$('#confettiCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', Utils.debounce(() => this.resizeCanvas(), 250));
    },
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    createParticle(x, y) {
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -10,
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * 3 + 2,
            color: this.getRandomColor(),
            size: Math.random() * 4 + 2,
            gravity: 0.2,
            life: 100
        };
    },
    
    getRandomColor() {
        const colors = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    start() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        this.canvas.classList.add('active');
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            this.particles.push(this.createParticle());
        }
        
        this.animate();
        
        setTimeout(() => this.stop(), 3000);
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            particle.life--;
            
            if (particle.life <= 0 || particle.y > this.canvas.height) {
                this.particles.splice(i, 1);
                continue;
            }
            
            this.ctx.globalAlpha = particle.life / 100;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        }
        
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    },
    
    stop() {
        this.canvas.classList.remove('active');
        this.particles = [];
    }
};

// ====== THEME TOGGLE ======
const ThemeToggle = {
    button: null,
    
    init() {
        this.button = Utils.$('#themeToggle');
        if (!this.button) return;
        
        this.loadTheme();
        this.bindEvents();
    },
    
    loadTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        APP.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateIcon();
    },
    
    bindEvents() {
        this.button.addEventListener('click', () => this.toggle());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                APP.currentTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', APP.currentTheme);
                this.updateIcon();
            }
        });
    },
    
    toggle() {
        APP.currentTheme = APP.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', APP.currentTheme);
        localStorage.setItem('portfolio-theme', APP.currentTheme);
        this.updateIcon();
    },
    
    updateIcon() {
        const icon = this.button.querySelector('i');
        icon.className = APP.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
};

// ====== NAVIGATION ======
const Navigation = {
    nav: null,
    menuButton: null,
    mobileMenu: null,
    navLinks: null,
    
    init() {
        this.nav = Utils.$('#nav');
        this.menuButton = Utils.$('#menuButton');
        this.mobileMenu = Utils.$('#mobileMenu');
        this.navLinks = Utils.$$('.nav-link, .mobile-nav-link');
        
        if (!this.nav) return;
        
        this.bindEvents();
        this.updateActiveLink();
    },
    
    bindEvents() {
        // Mobile menu toggle
        this.menuButton?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Scroll detection
        window.addEventListener('scroll', Utils.throttle(() => this.updateActiveLink(), 100));
        
        // Close mobile menu on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && APP.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (APP.mobileMenuOpen && !this.mobileMenu.contains(e.target) && !this.menuButton.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    },
    
    toggleMobileMenu() {
        if (APP.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },
    
    openMobileMenu() {
        APP.mobileMenuOpen = true;
        this.mobileMenu.classList.add('active');
        this.mobileMenu.setAttribute('aria-hidden', 'false');
        this.menuButton.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = this.mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    },
    
    closeMobileMenu() {
        APP.mobileMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        this.mobileMenu.setAttribute('aria-hidden', 'true');
        this.menuButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        this.menuButton.focus();
    },
    
    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.closest('a').getAttribute('href').substring(1);
        const targetSection = Utils.$(`#${targetId}`);
        
        if (targetSection) {
            if (APP.mobileMenuOpen) {
                this.closeMobileMenu();
            }
            
            this.scrollToSection(targetSection);
            this.updateActiveLink(targetId);
        }
    },
    
    scrollToSection(section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },
    
    updateActiveLink(activeSection) {
        if (!activeSection) {
            // Auto-detect current section
            const sections = Utils.$$('section[id]');
            let currentSection = 'home';
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) {
                    currentSection = section.id;
                }
            });
            
            activeSection = currentSection;
        }
        
        // Update active states
        Utils.$$('.nav-link').forEach(link => {
            const isActive = link.getAttribute('data-section') === activeSection;
            link.classList.toggle('active', isActive);
        });
    }
};

// ====== HERO SECTION ======
const HeroSection = {
    roleText: null,
    hero3d: null,
    particlesCanvas: null,
    
    init() {
        this.roleText = Utils.$('#roleText');
        this.hero3d = Utils.$('#hero3d');
        this.particlesCanvas = Utils.$('#particlesCanvas');
        
        this.initRoleRotation();
        this.init3DBackground();
        this.initParticles();
    },
    
    initRoleRotation() {
        if (!this.roleText) return;
        
        setInterval(() => {
            this.roleText.style.opacity = '0';
            
            setTimeout(() => {
                APP.currentRoleIndex = (APP.currentRoleIndex + 1) % APP.roles.length;
                this.roleText.textContent = APP.roles[APP.currentRoleIndex];
                this.roleText.style.opacity = '1';
            }, 300);
        }, 3000);
    },
    
    init3DBackground() {
        if (!this.hero3d) return;
        
        // Fallback to particles if Spline doesn't load
        this.hero3d.addEventListener('error', () => {
            this.hero3d.style.display = 'none';
            if (this.particlesCanvas) {
                this.particlesCanvas.style.display = 'block';
            }
        });
        
        // Check if iframe loads properly
        this.hero3d.addEventListener('load', () => {
            try {
                // Test if iframe content is accessible
                this.hero3d.contentWindow.location.href;
            } catch (e) {
                // Cross-origin or blocked, show particles instead
                this.hero3d.style.display = 'none';
                if (this.particlesCanvas) {
                    this.particlesCanvas.style.display = 'block';
                }
            }
        });
    },
    
    initParticles() {
        if (!this.particlesCanvas) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const ctx = this.particlesCanvas.getContext('2d');
        const particles = [];
        
        const resizeCanvas = () => {
            this.particlesCanvas.width = window.innerWidth;
            this.particlesCanvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', Utils.debounce(resizeCanvas, 250));
        
        // Create particles
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * this.particlesCanvas.width,
                y: Math.random() * this.particlesCanvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, this.particlesCanvas.width, this.particlesCanvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = this.particlesCanvas.width;
                if (particle.x > this.particlesCanvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.particlesCanvas.height;
                if (particle.y > this.particlesCanvas.height) particle.y = 0;
                
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = '#00d4ff';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
};

// ====== SKILLS SECTION ======
const SkillsSection = {
    skillsGrid: null,
    observer: null,
    
    init() {
        this.skillsGrid = Utils.$('#skillsGrid');
        if (!this.skillsGrid) return;
        
        this.renderSkills();
        this.initScrollAnimations();
    },
    
    renderSkills() {
        this.skillsGrid.innerHTML = APP.skills.map(skill => `
            <div class="skill-card fade-in" data-level="${skill.level}">
                <div class="skill-header">
                    <div class="skill-name">
                        <i class="${skill.icon}" aria-hidden="true"></i>
                        <span>${skill.name}</span>
                    </div>
                    <span class="skill-level">${skill.level}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress" data-width="${skill.level}"></div>
                </div>
                <div class="skill-description">${skill.description}</div>
                <div class="skill-stars">${Utils.generateStars(skill.level)}</div>
            </div>
        `).join('');
    },
    
    initScrollAnimations() {
        const skillCards = Utils.$$('.skill-card');
        const progressBars = Utils.$$('.skill-progress');
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate progress bars
                    const progressBar = entry.target.querySelector('.skill-progress');
                    if (progressBar) {
                        const width = progressBar.getAttribute('data-width');
                        setTimeout(() => {
                            progressBar.style.width = width + '%';
                        }, 300);
                    }
                }
            });
        }, { threshold: 0.3 });
        
        skillCards.forEach(card => {
            this.observer.observe(card);
        });
    },
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
};

// ====== PROJECTS SECTION ======
const ProjectsSection = {
    projectsGrid: null,
    observer: null,
    
    init() {
        this.projectsGrid = Utils.$('#projectsGrid');
        if (!this.projectsGrid) return;
        
        this.renderProjects();
        this.initScrollAnimations();
    },
    
    renderProjects() {
        this.projectsGrid.innerHTML = APP.projects.map(project => `
            <div class="project-card fade-in">
                <div class="project-image">
                    ${project.image ? 
                        `<img src="${project.image}" alt="${project.title}" loading="lazy">` :
                        `<div class="project-placeholder"><i class="fas fa-code"></i></div>`
                    }
                </div>
                <div class="project-content">
                    <div class="project-header">
                        <h3 class="project-title">${project.title}</h3>
                        <span class="project-category">${project.category}</span>
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.demo}" class="project-link primary" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                            <span>Live Demo</span>
                        </a>
                        <a href="${project.github}" class="project-link secondary" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-github" aria-hidden="true"></i>
                            <span>Source</span>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    initScrollAnimations() {
        const projectCards = Utils.$$('.project-card');
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });
        
        projectCards.forEach(card => {
            this.observer.observe(card);
        });
    },
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
};

// ====== ABOUT/JOURNEY SECTION ======
const AboutSection = {
    observer: null,
    
    init() {
        this.initScrollAnimations();
    },
    
    initScrollAnimations() {
        const timelineItems = Utils.$$('.timeline-item');
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.3 });
        
        timelineItems.forEach(item => {
            this.observer.observe(item);
        });
    },
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
};

// ====== CONTACT FORM ======
const ContactForm = {
    form: null,
    fields: {},
    submitButton: null,
    statusElement: null,
    
    init() {
        this.form = Utils.$('#contactForm');
        if (!this.form) return;
        
        this.fields = {
            name: Utils.$('#name'),
            email: Utils.$('#email'),
            message: Utils.$('#message')
        };
        
        this.submitButton = Utils.$('#submitButton');
        this.statusElement = Utils.$('#formStatus');
        
        this.bindEvents();
    },
    
    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        Object.entries(this.fields).forEach(([name, field]) => {
            if (field) {
                field.addEventListener('blur', () => this.validateField(name));
                field.addEventListener('input', () => this.clearFieldError(name));
            }
        });
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showStatus('Please fix the errors above.', 'error');
            return;
        }
        
        this.setSubmitting(true);
        
        try {
            if (this.isEmailJSConfigured()) {
                await this.sendEmailJS();
            } else {
                await this.mockSend();
            }
            
            this.showStatus('Message sent successfully! I\'ll get back to you soon. 🚀', 'success');
            this.form.reset();
            this.clearAllErrors();
            
            // Light confetti for success
            setTimeout(() => Confetti.start(), 300);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showStatus('Failed to send message. Please try again later.', 'error');
        }
        
        this.setSubmitting(false);
    },
    
    isEmailJSConfigured() {
        return EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" && 
               EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID" && 
               EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
               typeof emailjs !== 'undefined';
    },
    
    async sendEmailJS() {
        const templateParams = {
            from_name: this.fields.name.value,
            from_email: this.fields.email.value,
            message: this.fields.message.value,
            to_name: 'Bhuvanesh D'
        };
        
        return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
    },
    
    async mockSend() {
        // Mock API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve();
                } else {
                    reject(new Error('Mock error'));
                }
            }, 2000);
        });
    },
    
    validateForm() {
        let isValid = true;
        
        Object.keys(this.fields).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    validateField(fieldName) {
        const field = this.fields[fieldName];
        const value = field.value.trim();
        let errorMessage = '';
        
        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;
                
            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                } else if (!Utils.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }
        
        this.showFieldError(fieldName, errorMessage);
        this.updateFieldState(field, !errorMessage);
        
        return !errorMessage;
    },
    
    clearFieldError(fieldName) {
        this.showFieldError(fieldName, '');
        this.fields[fieldName].classList.remove('error');
    },
    
    clearAllErrors() {
        Object.keys(this.fields).forEach(fieldName => {
            this.clearFieldError(fieldName);
            this.fields[fieldName].classList.remove('success', 'error');
        });
    },
    
    showFieldError(fieldName, message) {
        const errorElement = Utils.$(`#${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    },
    
    updateFieldState(field, isValid) {
        field.classList.remove('error', 'success');
        if (field.value.trim()) {
            field.classList.add(isValid ? 'success' : 'error');
        }
    },
    
    setSubmitting(isSubmitting) {
        this.submitButton.disabled = isSubmitting;
        const icon = this.submitButton.querySelector('i');
        const text = this.submitButton.querySelector('span');
        
        if (isSubmitting) {
            icon.className = 'fas fa-spinner fa-spin';
            text.textContent = 'Sending...';
            this.showStatus('Sending your message...', 'loading');
        } else {
            icon.className = 'fas fa-paper-plane';
            text.textContent = 'Send Message';
        }
    },
    
    showStatus(message, type) {
        if (!this.statusElement) return;
        
        this.statusElement.textContent = message;
        this.statusElement.className = `form-status ${type} visible`;
        
        if (type === 'success') {
            setTimeout(() => {
                this.statusElement.classList.remove('visible');
            }, 5000);
        }
    }
};

// ====== SCROLL ANIMATIONS ======
const ScrollAnimations = {
    observer: null,
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe all fade-in elements
        const fadeElements = Utils.$$('.fade-in');
        fadeElements.forEach(element => {
            this.observer.observe(element);
        });
    },
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
};

// ====== KEYBOARD SHORTCUTS ======
const KeyboardShortcuts = {
    init() {
        document.addEventListener('keydown', (e) => {
            // Skip if user is typing in form fields
            if (e.target.matches('input, textarea, [contenteditable]')) {
                return;
            }
            
            switch(e.key.toLowerCase()) {
                case 't':
                    e.preventDefault();
                    ThemeToggle.toggle();
                    break;
                case 'h':
                    e.preventDefault();
                    Navigation.scrollToSection(Utils.$('#home'));
                    break;
                case 'escape':
                    if (APP.mobileMenuOpen) {
                        Navigation.closeMobileMenu();
                    }
                    break;
            }
        });
    }
};

// ====== APP INITIALIZATION ======
const App = {
    init() {
        console.log('🚀 Portfolio App Starting...');
        
        // Initialize loading screen first
        LoadingScreen.init();
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.onPageVisible();
            }
        });
    },
    
    initializeComponents() {
        try {
            // Core components
            CustomCursor.init();
            Confetti.init();
            ThemeToggle.init();
            Navigation.init();
            
            // Section components
            HeroSection.init();
            AboutSection.init();
            SkillsSection.init();
            ProjectsSection.init();
            ContactForm.init();
            
            // Additional features
            ScrollAnimations.init();
            KeyboardShortcuts.init();
            
            // Mark app as loaded
            APP.isLoaded = true;
            
            // First visit confetti
            if (APP.firstVisit) {
                localStorage.setItem('portfolio-visited', 'true');
                setTimeout(() => Confetti.start(), 2000);
            }
            
            console.log('✅ Portfolio App Initialized Successfully');
            
        } catch (error) {
            console.error('❌ App Initialization Error:', error);
        }
    },
    
    onPageVisible() {
        // Re-initialize components that might need refresh
        if (APP.isLoaded) {
            HeroSection.initParticles();
        }
    },
    
    destroy() {
        // Cleanup observers and event listeners
        SkillsSection.destroy();
        ProjectsSection.destroy();
        AboutSection.destroy();
        ScrollAnimations.destroy();
        
        console.log('🧹 App Cleanup Complete');
    }
};

// ====== GLOBAL ERROR HANDLING ======
window.addEventListener('error', (e) => {
    console.error('Global Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ====== START THE APP ======
App.init();

// ====== EXPORT FOR DEBUGGING ======
window.PortfolioApp = {
    APP,
    Utils,
    Navigation,
    ThemeToggle,
    ContactForm,
    Confetti
};

console.log('📱 Portfolio JavaScript Loaded Successfully');
