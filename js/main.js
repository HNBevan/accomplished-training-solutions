// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileSearchToggle = document.querySelector('.mobile-search-toggle');
const headerNav = document.querySelector('.header-nav');
const searchContainer = document.querySelector('.search-container');
const menuBackdrop = document.querySelector('.mobile-menu-backdrop');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        headerNav.classList.toggle('active');
        menuBackdrop.classList.toggle('active');
        searchContainer.classList.remove('active');
    });
}

if (mobileSearchToggle) {
    mobileSearchToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        searchContainer.classList.toggle('active');
        headerNav.classList.remove('active');
        menuBackdrop.classList.remove('active');
    });
}

// Close menu when clicking on backdrop
if (menuBackdrop) {
    menuBackdrop.addEventListener('click', function() {
        headerNav.classList.remove('active');
        menuBackdrop.classList.remove('active');
        searchContainer.classList.remove('active');
    });
}

// Handle dropdown toggles on mobile and tablet
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        // Only prevent default and toggle on mobile and tablet (under 1024px)
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            e.stopPropagation();

            const dropdown = this.closest('.dropdown');
            const isCurrentlyActive = dropdown.classList.contains('active');

            // Close all dropdowns first
            document.querySelectorAll('.dropdown').forEach(d => {
                d.classList.remove('active');
            });

            // Toggle current dropdown (open if it was closed, stay closed if it was open)
            if (!isCurrentlyActive) {
                dropdown.classList.add('active');
            }
        }
    });
});

// Close mobile menu when clicking nav links (but not dropdown toggles)
const navLinks = document.querySelectorAll('.header-nav a:not(.dropdown-toggle)');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        if (headerNav) headerNav.classList.remove('active');
        if (searchContainer) searchContainer.classList.remove('active');
        // Close all dropdowns
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    });
});

// Scroll Reveal Animation
function revealOnScroll() {
    // Handle grid containers specially (accreditations, services, info cards, etc)
    const gridContainers = ['.accreditation-logos', '.services-grid', '.info-grid'];

    gridContainers.forEach(containerSelector => {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const items = container.querySelectorAll('.reveal-scale, .reveal, .reveal-left, .reveal-right, .reveal-fade');
        if (items.length === 0) return;

        const windowHeight = window.innerHeight;

        // Check each item individually and activate with stagger when in viewport
        items.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;
            const itemBottom = item.getBoundingClientRect().bottom;

            // If item is in viewport and not already active, activate it with delay
            if (itemTop < windowHeight * 0.85 && itemBottom > 0) {
                if (!item.classList.contains('active')) {
                    // Get stagger number from class (e.g., stagger-1, stagger-2)
                    let staggerDelay = 0;
                    const staggerClass = Array.from(item.classList).find(cls => cls.startsWith('stagger-'));
                    if (staggerClass) {
                        const staggerNum = parseInt(staggerClass.replace('stagger-', ''));
                        staggerDelay = (staggerNum - 1) * 200; // 200ms delay between each item
                    } else {
                        staggerDelay = index * 150; // Fallback to index-based delay
                    }

                    setTimeout(() => {
                        item.classList.add('active');
                    }, staggerDelay);
                }
            }
        });
    });

    // Handle other reveal elements individually
    const otherReveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    otherReveals.forEach(element => {
        // Skip if already handled in grid containers
        const isInGrid = element.closest('.accreditation-logos, .services-grid, .info-grid');
        if (isInGrid) return;

        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;

        // Trigger when element is 15% into viewport
        if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
            element.classList.add('active');
        }
    });
}

// Run on scroll
window.addEventListener('scroll', revealOnScroll);

// Run on page load
window.addEventListener('load', revealOnScroll);

// Run immediately in case some elements are already in view
revealOnScroll();

// Global form data storage
let heroFormData = {
    name: '',
    email: '',
    phone: '',
    course: ''
};

// Image Slider functionality with form data preservation
const slides = document.querySelectorAll('.slide');

if (slides.length > 0) {
    let currentSlide = 0;

    // Function to save form data from ALL forms
    function saveFormData() {
        // Save from any active form
        const allForms = document.querySelectorAll('.hero-contact-form');
        allForms.forEach(form => {
            const nameInput = form.querySelector('input[type="text"]');
            const emailInput = form.querySelector('input[type="email"]');
            const phoneInput = form.querySelector('input[type="tel"]');
            const courseSelect = form.querySelector('select');

            if (nameInput && nameInput.value) heroFormData.name = nameInput.value;
            if (emailInput && emailInput.value) heroFormData.email = emailInput.value;
            if (phoneInput && phoneInput.value) heroFormData.phone = phoneInput.value;
            if (courseSelect && courseSelect.value) heroFormData.course = courseSelect.value;
        });
    }

    // Function to restore form data to ALL forms
    function restoreFormData() {
        const allForms = document.querySelectorAll('.hero-contact-form');
        allForms.forEach(form => {
            const nameInput = form.querySelector('input[type="text"]');
            const emailInput = form.querySelector('input[type="email"]');
            const phoneInput = form.querySelector('input[type="tel"]');
            const courseSelect = form.querySelector('select');

            if (nameInput) nameInput.value = heroFormData.name;
            if (emailInput) emailInput.value = heroFormData.email;
            if (phoneInput) phoneInput.value = heroFormData.phone;
            if (courseSelect) courseSelect.value = heroFormData.course;
        });
    }

    // Add input listeners to all forms to keep data synced
    const allForms = document.querySelectorAll('.hero-contact-form');
    allForms.forEach(form => {
        form.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', saveFormData);
            input.addEventListener('change', saveFormData);
        });
    });

    function showSlide(n) {
        saveFormData(); // Save data before switching
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');

        // Restore data after slide becomes active
        setTimeout(restoreFormData, 10);
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);

    // Initialize form data on first load
    restoreFormData();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu after clicking link
        const headerNav = document.querySelector('.header-nav');
        const searchContainer = document.querySelector('.search-container');
        if (headerNav) headerNav.classList.remove('active');
        if (searchContainer) searchContainer.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const headerNav = document.querySelector('.header-nav');
    const searchContainer = document.querySelector('.search-container');

    if (!event.target.closest('.header-container')) {
        if (headerNav) headerNav.classList.remove('active');
        if (searchContainer) searchContainer.classList.remove('active');
    }
});

// Contact form submission handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you within 24 hours.');
        this.reset();
    });
}

// Hero form submission handler
const heroForms = document.querySelectorAll('.hero-contact-form');

heroForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your quote request! We will contact you within 24 hours.');

        // Clear all forms and stored data
        heroForms.forEach(f => f.reset());

        // Clear stored form data
        heroFormData.name = '';
        heroFormData.email = '';
        heroFormData.phone = '';
        heroFormData.course = '';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Select all elements with the 'data-accordion-item' attribute
    const accordionItems = document.querySelectorAll('[data-accordion-item]');

    accordionItems.forEach(item => {
        // Find the button (header) and content within each item
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            // Check if the current item is already open
            const isOpen = item.classList.contains('active');

            // 1. Close all other open items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.accordion-content').classList.remove('active');
                }
            });

            // 2. Toggle the current item
            if (isOpen) {
                // If it was open, close it
                item.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
                content.classList.remove('active');
            } else {
                // If it was closed, open it
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                content.classList.add('active');
            }

            // NOTE: The visual open/close is handled by the CSS transition on max-height.
        });
    });
});

// Contact Form - Course Category Dropdown
const courseData = {
    'first-aid': [
        { value: 'efaw', text: 'Emergency First Aid at Work' },
        { value: 'faw', text: 'First Aid at Work (3 Day)' },
        { value: 'faw-requalification', text: 'FAW Requalification' },
        { value: 'paediatric', text: 'Paediatric First Aid' },
        { value: 'basic', text: 'Basic First Aid Awareness' }
    ],
    'fire-safety': [
        { value: 'fire-warden', text: 'Fire Warden Training' },
        { value: 'fire-marshal', text: 'Fire Marshal Training' },
        { value: 'fire-awareness', text: 'Fire Safety Awareness' },
        { value: 'fire-risk', text: 'Fire Risk Assessment' }
    ],
    'food-safety': [
        { value: 'level1', text: 'Level 1 Food Safety' },
        { value: 'level2', text: 'Level 2 Food Hygiene' },
        { value: 'level3', text: 'Level 3 Food Safety' },
        { value: 'allergen', text: 'Allergen Awareness' }
    ],
    'health-safety': [
        { value: 'manual-handling', text: 'Manual Handling' },
        { value: 'working-heights', text: 'Working at Heights' },
        { value: 'hs-awareness', text: 'H&S Awareness' },
        { value: 'iosh', text: 'IOSH Managing Safely' },
        { value: 'risk-assessment', text: 'Risk Assessment' },
        { value: 'coshh', text: 'COSHH Awareness' }
    ]
};

const courseCategorySelect = document.getElementById('courseCategory');
const specificCourseGroup = document.getElementById('specificCourseGroup');
const specificCourseSelect = document.getElementById('specificCourse');

if (courseCategorySelect) {
    courseCategorySelect.addEventListener('change', function() {
        const category = this.value;

        // Clear previous options
        specificCourseSelect.innerHTML = '<option value="">-- Select a Specific Course --</option>';

        if (category && courseData[category]) {
            // Show the specific course dropdown
            specificCourseGroup.style.display = 'block';

            // Populate with courses for this category
            courseData[category].forEach(course => {
                const option = document.createElement('option');
                option.value = course.value;
                option.textContent = course.text;
                specificCourseSelect.appendChild(option);
            });
        } else {
            // Hide the specific course dropdown if no category or "Other" selected
            specificCourseGroup.style.display = 'none';
        }
    });
}