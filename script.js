// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initMobileMenu();
    initScrollAnimations();
    initDownloadTracking();
    initPerformanceOptimizations();
});

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu Functionality
function initMobileMenu() {
    // Create mobile menu button if it doesn't exist
    const navbar = document.querySelector('.navbar .container');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth <= 768) {
        // Create hamburger menu button
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-btn';
        menuButton.innerHTML = '☰';
        menuButton.setAttribute('aria-label', 'فتح القائمة');
        
        // Add mobile menu styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu-btn {
                display: none;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #333;
            }
            
            @media (max-width: 768px) {
                .mobile-menu-btn {
                    display: block;
                }
                
                .nav-menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    right: 0;
                    left: 0;
                    background: #fff;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    flex-direction: column;
                    padding: 1rem;
                    gap: 1rem;
                }
                
                .nav-menu.active {
                    display: flex;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add menu button to navbar
        navbar.appendChild(menuButton);
        
        // Toggle menu on button click
        menuButton.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
            this.setAttribute('aria-label', 
                navMenu.classList.contains('active') ? 'إغلاق القائمة' : 'فتح القائمة'
            );
        });
        
        // Close menu when clicking on a link
        navMenu.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                menuButton.innerHTML = '☰';
                menuButton.setAttribute('aria-label', 'فتح القائمة');
            }
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Add animation styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Apply animations to sections
    const sections = document.querySelectorAll('.features, .screenshots, .download');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Apply animations to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// Download Tracking and Analytics
function initDownloadTracking() {
    const downloadButtons = document.querySelectorAll('.download-btn, .btn-primary');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const isDownload = this.hasAttribute('download') || this.href.includes('.apk');
            
            // Track download event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    'event_category': 'App',
                    'event_label': buttonText,
                    'value': 1
                });
            }
            
            // Show download confirmation for APK files
            if (isDownload && this.href.includes('.apk')) {
                const confirmed = confirm('هل تريد تحميل التطبيق؟ تأكد من تفعيل "المصادر غير المعروفة" في إعدادات الأمان.');
                if (!confirmed) {
                    e.preventDefault();
                }
            }
            
            // Update download counter (simulate)
            updateDownloadCounter();
        });
    });
}

// Update Download Counter
function updateDownloadCounter() {
    const downloadCountElement = document.querySelector('.stat-number');
    if (downloadCountElement) {
        let currentCount = downloadCountElement.textContent;
        // This is a simulation - in real app, you'd update from server
        console.log('Download tracked:', currentCount);
    }
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
    
    // Preload critical resources
    const criticalImages = [
        'images/logo.png',
        'images/app-mockup.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Service Worker Registration (for PWA capabilities)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Scroll to Top Functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'العودة إلى الأعلى');
    
    // Add styles for scroll button
    const scrollButtonStyle = document.createElement('style');
    scrollButtonStyle.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(30,60,114,0.3);
        }

        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }

        .scroll-to-top:hover {
            background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(30,60,114,0.4);
        }
    `;
    document.head.appendChild(scrollButtonStyle);
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    // Scroll to top on button click
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top
initScrollToTop();

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Performance Monitoring
window.addEventListener('load', function() {
    // Measure page load performance
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
        
        // Track performance if analytics is available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                'name': 'load',
                'value': loadTime
            });
        }
    }
});

// Accessibility Improvements
document.addEventListener('keydown', function(e) {
    // Skip to main content with keyboard
    if (e.key === 'Tab' && e.target.classList.contains('skip-link')) {
        e.preventDefault();
        document.getElementById('main-content').focus();
    }
});

// RTL Support Enhancements
function enhanceRTLSupport() {
    // Ensure proper RTL behavior for dynamic content
    const rtlElements = document.querySelectorAll('[dir="rtl"]');
    rtlElements.forEach(element => {
        element.style.textAlign = 'right';
    });
}

// Initialize RTL enhancements
enhanceRTLSupport();
