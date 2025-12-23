// Church Digital AI Website JavaScript
console.debug('Church Digital AI website loaded successfully!');

// DOM Elements
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');
const contactForm = document.getElementById('contactForm');

// Mobile Menu Toggle
mobileMenuToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isExpanded = navMenu.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
});

// Close mobile menu when clicking on links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
});

// Header Scroll Effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop;
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .challenge-card, .product-card, .testimonial-card, .benefit-item');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter Animation for Statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.ceil(start) + (element.dataset.suffix || '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.dataset.suffix || '');
        }
    }

    updateCounter();
}

// Initialize counters when visible
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        if (text.includes('%')) {
            stat.dataset.target = parseInt(text);
            stat.dataset.suffix = '%';
        } else if (text.includes('+')) {
            stat.dataset.target = parseInt(text);
            stat.dataset.suffix = '+';
        } else if (text === '24/7') {
            stat.dataset.target = 24;
            stat.dataset.suffix = '/7';
        } else {
            stat.dataset.target = parseInt(text);
        }
        statObserver.observe(stat);
    });
});

// Form Validation and Submission
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Reset previous error states
        clearErrors();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            showSuccessMessage();
            contactForm.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage();
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    let isValid = true;

    if (!name.value.trim()) {
        showError(name, 'Church name is required');
        isValid = false;
    }

    if (!email.value.trim()) {
        showError(email, 'Email address is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(element, message) {
    const formGroup = element.closest('.form-group');
    formGroup.classList.add('error');

    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-message success';
    successDiv.innerHTML = `
        <div class="message-icon">✅</div>
        <div class="message-content">
            <h4>Thank you for your interest!</h4>
            <p>We'll contact you within 24 hours to schedule your free consultation.</p>
        </div>
    `;

    insertMessage(successDiv);
}

function showErrorMessage() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-message error';
    errorDiv.innerHTML = `
        <div class="message-icon">❌</div>
        <div class="message-content">
            <h4>Oops! Something went wrong.</h4>
            <p>Please try again or contact us directly at hello@churchdigital.ai</p>
        </div>
    `;

    insertMessage(errorDiv);
}

function insertMessage(messageElement) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const formWrapper = document.querySelector('.contact-form-wrapper');
    formWrapper.insertBefore(messageElement, formWrapper.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Add form message styles
const formStyles = document.createElement('style');
formStyles.textContent = `
    .form-message {
        display: flex;
        align-items: center;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        animation: slideDown 0.3s ease;
    }

    .form-message.success {
        background: #d1fae5;
        border: 1px solid #10b981;
        color: #059669;
    }

    .form-message.error {
        background: #fee2e2;
        border: 1px solid #ef4444;
        color: #dc2626;
    }

    .message-icon {
        font-size: 1.5rem;
        margin-right: 1rem;
    }

    .message-content h4 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
        font-weight: 600;
    }

    .message-content p {
        margin: 0;
        font-size: 0.875rem;
    }

    .form-group.error label {
        color: #ef4444;
    }

    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #ef4444;
    }

    .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(formStyles);

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - scrolled / 600;
    }
});

// Dynamic typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title .highlight');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Only apply typing effect on larger screens
        if (window.innerWidth > 768) {
            typeWriter(heroTitle, originalText, 80);
        }
    }
});

// Product demo button handlers
document.querySelectorAll('.product-card .btn-outline').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const productName = this.closest('.product-card').querySelector('h3').textContent;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'demo-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeDemoModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="closeDemoModal()">×</button>
                <h3>Request ${productName} Demo</h3>
                <p>Fill out the form below and we'll contact you to schedule a personalized demo.</p>
                <form class="demo-form">
                    <div class="form-group">
                        <input type="text" placeholder="Your Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" placeholder="Phone Number">
                    </div>
                    <div class="form-group">
                        <textarea placeholder="Tell us about your church and what you'd like to see in the demo" rows="4"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Schedule Demo</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Add modal styles
        if (!document.querySelector('#modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'modal-styles';
            modalStyles.textContent = `
                .demo-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }

                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                }

                .modal-content {
                    position: relative;
                    background: white;
                    max-width: 500px;
                    margin: 5% auto;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.3s ease;
                }

                .modal-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #6b7280;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }

                .modal-close:hover {
                    background: #f3f4f6;
                    color: #1f2937;
                }

                .demo-form .form-group {
                    margin-bottom: 1rem;
                }

                .demo-form input,
                .demo-form textarea {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .demo-form input:focus,
                .demo-form textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(modalStyles);
        }

        // Handle form submission
        modal.querySelector('.demo-form').addEventListener('submit', (e) => {
            e.preventDefault();
            closeDemoModal();
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'demo-success';
            successDiv.textContent = 'Demo request received! We\'ll contact you soon.';
            successDiv.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
                z-index: 10001;
                animation: slideInRight 0.3s ease;
            `;
            document.body.appendChild(successDiv);

            setTimeout(() => successDiv.remove(), 3000);
        });
    });
});

// Close modal function
window.closeDemoModal = function() {
    const modal = document.querySelector('.demo-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
};

// Add keyboard support for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDemoModal();
    }
});

// Analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, properties);

    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const btnText = this.textContent.trim();
        trackEvent('button_click', {
            button_text: btnText,
            button_type: this.className.includes('primary') ? 'primary' :
                       this.className.includes('secondary') ? 'secondary' : 'outline'
        });
    });
});

// Track form interactions
if (contactForm) {
    contactForm.addEventListener('submit', () => {
        trackEvent('contact_form_submit', {
            form_type: 'consultation_request'
        });
    });
}

// Performance optimization - Lazy load images when implemented
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();