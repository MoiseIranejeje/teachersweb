// Main JavaScript - Navigation, animations, and core functionality

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.publication-card').forEach(card => {
        observer.observe(card);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle form submissions
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('.btn[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                alert('Request submitted successfully. You will receive an email with download instructions if approved.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Active navigation highlighting based on current page
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage ||
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
