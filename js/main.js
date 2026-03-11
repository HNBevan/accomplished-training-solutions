// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileSearchToggle = document.querySelector('.mobile-search-toggle');
const headerNav = document.querySelector('.header-nav');
const searchContainer = document.querySelector('.search-container');
const menuBackdrop = document.querySelector('.mobile-menu-backdrop');

// Hide nav on scroll down, show on scroll up
(function () {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    const THRESHOLD = 4; // px — ignore tiny scroll jitter

    function updateHeader() {
        const currentScrollY = window.scrollY;
        const diff = currentScrollY - lastScrollY;

        if (currentScrollY < 80) {
            // Near top — always show
            header.classList.remove('header-hidden');
        } else if (diff > THRESHOLD) {
            // Scrolling down enough — hide
            header.classList.add('header-hidden');
            if (headerNav) headerNav.classList.remove('active');
            if (searchContainer) searchContainer.classList.remove('active');
            if (menuBackdrop) menuBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        } else if (diff < -THRESHOLD) {
            // Scrolling up enough — show
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // Fallback for mobile/tablet: show header when finger lifts after scrolling up
    let touchStartY = 0;
    window.addEventListener('touchstart', function (e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', function (e) {
        const touchEndY = e.changedTouches[0].clientY;
        const scrolledUp = touchEndY > touchStartY; // finger moved down = page scrolled up
        if (scrolledUp || window.scrollY < 80) {
            header.classList.remove('header-hidden');
        }
    }, { passive: true });
})();

// Inject phone button into hero section after CTA button (mobile/tablet only)
if (window.matchMedia('(max-width: 1024px)').matches) {
    document.querySelectorAll('.hero-content .cta-button').forEach(ctaBtn => {
        const phoneBtn = document.createElement('a');
        phoneBtn.href = 'tel:0800XXXXXXX';
        phoneBtn.className = 'hero-phone-btn';
        phoneBtn.innerHTML = '📞 Call Us: 0800 XXX XXXX';
        ctaBtn.insertAdjacentElement('afterend', phoneBtn);
    });
}

// Inject search icon into nav after Contact link
const headerNavUl = document.querySelector('.header-nav ul');
if (headerNavUl) {
    const searchLi = document.createElement('li');
    searchLi.className = 'nav-search-item';
    searchLi.innerHTML = '<button type="button" class="nav-search-toggle" aria-label="Toggle search"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"></circle><line x1="15" y1="15" x2="21" y2="21"></line></svg></button>';
    headerNavUl.appendChild(searchLi);

    searchLi.querySelector('.nav-search-toggle').addEventListener('click', function(e) {
        e.stopPropagation();
        if (searchContainer) {
            searchContainer.classList.toggle('active');
            headerNav.classList.remove('active');
            if (menuBackdrop) menuBackdrop.classList.remove('active');
        }
    });
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = headerNav.classList.toggle('active');
        menuBackdrop.classList.toggle('active');
        searchContainer.classList.remove('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
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
        document.body.style.overflow = '';
    });
}

// Handle dropdown toggles on mobile and tablet
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            e.preventDefault();
            e.stopPropagation();

            const dropdown = this.closest('.dropdown');
            const isCurrentlyActive = dropdown.classList.contains('active');

            // Close all dropdowns and sub-categories first
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            document.querySelectorAll('.dropdown-content > div').forEach(d => d.classList.remove('sub-active'));

            if (!isCurrentlyActive) {
                dropdown.classList.add('active');
            }
        }
    });
});

// Sub-category accordions inside "Our Courses" on mobile/tablet
// Toggle is now on the .sub-toggle button so the category link remains navigable
document.querySelectorAll('.sub-toggle').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const parentDiv = this.closest('div');
        const isActive = parentDiv.classList.contains('sub-active');

        // Close all sub-categories
        document.querySelectorAll('.dropdown-content > div').forEach(d => d.classList.remove('sub-active'));

        // Open this one if it was closed
        if (!isActive) {
            parentDiv.classList.add('sub-active');
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

// Close dropdowns when tapping outside the nav on mobile/tablet
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 1024) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        }
    }
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

function typeTitle(el) {
    if (!el) return;
    const text = el.dataset.originalText || el.textContent.trim();
    el.dataset.originalText = text;
    // Snapshot alignment and lock height BEFORE clearing — prevents layout shift
    const align = window.getComputedStyle(el).textAlign;
    el.style.textAlign = align;
    const h = el.offsetHeight;
    if (h > 0) el.style.minHeight = h + 'px';
    el.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            el.textContent += text[i++];
            setTimeout(type, 70);
        } else {
            el.style.minHeight = '';
        }
    }
    type();
}

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

        // Typing effect on the active slide's title
        const title = slides[currentSlide].querySelector('h1, .hero-title');
        typeTitle(title);
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);

    // Initialize form data on first load
    restoreFormData();

    // Typing effect on initial slide
    const firstTitle = slides[0].querySelector('h1, .hero-title');
    typeTitle(firstTitle);
}

// Typing effect on all inner-page hero titles
const innerHero = document.querySelector(
    '.courses-hero-content h1, .gallery-hero h1, .blog-hero h1, .testimonials-hero h1, .page-header h1'
);
if (innerHero) {
    innerHero.classList.remove('reveal');
    typeTitle(innerHero);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
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
        { value: 'basic', text: 'Basic First Aid Awareness' },
        { value: 'bls-nhs', text: 'BLS NHS Compliant' },
        { value: 'aed-cpr', text: 'AED & CPR Course' }
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
        { value: 'allergen', text: 'Allergen Awareness' }
    ],
    'health-safety': [
        { value: 'manual-handling', text: 'Manual Handling' },
        { value: 'working-heights', text: 'Working at Heights' },
        { value: 'hs-awareness', text: 'H&S Awareness' },
        { value: 'iosh', text: 'IOSH Managing Safely' },
        { value: 'risk-assessment', text: 'Risk Assessment' },
        { value: 'coshh', text: 'COSHH Awareness' }
    ],
    'specialist': [
        { value: 'disability-awareness', text: 'Disability Discrimination Awareness' },
        { value: 'mental-health-first-aid', text: 'Mental Health First Aid' }
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

// =====================
// Course Filter helpers
// =====================
function buildSuggestions(searchWrap, allNames, onSelect) {
    const ul = document.createElement('ul');
    ul.className = 'course-suggestions';
    ul.setAttribute('role', 'listbox');
    // Attach to body so it is never clipped by any stacking context
    document.body.appendChild(ul);

    let highlighted = -1;

    function positionDropdown() {
        const rect = searchWrap.getBoundingClientRect();
        ul.style.top    = (rect.bottom + 6) + 'px';
        ul.style.left   = rect.left + 'px';
        ul.style.width  = rect.width + 'px';
    }

    function highlightItem(index) {
        const items = ul.querySelectorAll('li');
        items.forEach(li => li.classList.remove('highlighted'));
        highlighted = index;
        if (items[highlighted]) items[highlighted].classList.add('highlighted');
    }

    function escapeRegex(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function showSuggestions(query) {
        ul.innerHTML = '';
        highlighted = -1;
        if (!query || query.length < 1) {
            ul.classList.remove('visible');
            return;
        }

        const matches = allNames.filter(n => n.toLowerCase().includes(query.toLowerCase()));
        if (matches.length === 0) {
            ul.classList.remove('visible');
            return;
        }

        const re = new RegExp('(' + escapeRegex(query) + ')', 'gi');
        matches.slice(0, 8).forEach(name => {
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.innerHTML = name.replace(re, '<mark>$1</mark>');
            li.addEventListener('mousedown', function (e) {
                e.preventDefault();
                onSelect(name);
                ul.classList.remove('visible');
            });
            ul.appendChild(li);
        });

        positionDropdown();
        ul.classList.add('visible');
    }

    // Keep dropdown aligned when page scrolls or resizes
    window.addEventListener('scroll', function () {
        if (ul.classList.contains('visible')) positionDropdown();
    }, { passive: true });
    window.addEventListener('resize', function () {
        if (ul.classList.contains('visible')) positionDropdown();
    });

    // Keyboard navigation
    const input = searchWrap.querySelector('.course-search-input');
    input.addEventListener('keydown', function (e) {
        const items = ul.querySelectorAll('li');
        if (!ul.classList.contains('visible')) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlightItem(Math.min(highlighted + 1, items.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlightItem(Math.max(highlighted - 1, 0));
        } else if (e.key === 'Enter' && highlighted >= 0) {
            e.preventDefault();
            items[highlighted].dispatchEvent(new MouseEvent('mousedown'));
        } else if (e.key === 'Escape') {
            ul.classList.remove('visible');
        }
    });

    input.addEventListener('blur', function () {
        setTimeout(() => ul.classList.remove('visible'), 150);
    });

    return showSuggestions;
}

// =====================
// Course Filter — courses.html (cards + category tabs)
// =====================
if (document.getElementById('course-filter-section') && document.querySelector('.course-category')) {
    const searchInput = document.getElementById('course-search');
    const clearBtn = document.getElementById('course-search-clear');
    const filterTabs = document.querySelectorAll('.course-filter-tab');
    const countEl = document.getElementById('course-filter-count');
    const noResults = document.getElementById('courses-no-results');
    const categories = document.querySelectorAll('.course-category');

    let activeFilter = 'all';

    // Collect all course names for suggestions
    const allCourseNames = Array.from(document.querySelectorAll('.course-card h3')).map(h => h.textContent.trim());

    const showSuggestions = buildSuggestions(
        searchInput.closest('.course-search-wrap'),
        allCourseNames,
        function (name) {
            searchInput.value = name;
            clearBtn.classList.add('visible');
            runFilter();
            searchInput.focus();
        }
    );

    function runFilter() {
        const query = searchInput.value.trim().toLowerCase();
        clearBtn.classList.toggle('visible', query.length > 0);

        let totalVisible = 0;

        categories.forEach(cat => {
            const catFilter = cat.dataset.category;
            const cards = cat.querySelectorAll('.course-card');
            let visibleInCat = 0;

            cards.forEach(card => {
                const name = (card.querySelector('h3') || {}).textContent || '';
                const desc = (card.querySelector('.course-description') || {}).textContent || '';
                const highlights = (card.querySelector('.course-highlights') || {}).textContent || '';
                const text = (name + ' ' + desc + ' ' + highlights).toLowerCase();

                const matchesText = query === '' || text.includes(query);
                const matchesCat = activeFilter === 'all' || catFilter === activeFilter;

                if (matchesText && matchesCat) {
                    card.style.display = '';
                    visibleInCat++;
                } else {
                    card.style.display = 'none';
                }
            });

            cat.style.display = visibleInCat > 0 ? '' : 'none';
            totalVisible += visibleInCat;
        });

        noResults.style.display = totalVisible === 0 ? 'block' : 'none';

        if (query || activeFilter !== 'all') {
            countEl.textContent = totalVisible === 1 ? '1 course found' : totalVisible + ' courses found';
        } else {
            countEl.textContent = '';
        }
    }

    searchInput.addEventListener('input', function () {
        showSuggestions(this.value.trim());
        runFilter();
    });

    clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        clearBtn.classList.remove('visible');
        runFilter();
        searchInput.focus();
    });

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            activeFilter = this.dataset.filter;
            runFilter();
        });
    });
}

// =====================
// Course Filter — individual course pages (course-detail sections)
// =====================
if (document.getElementById('course-filter-section') && document.querySelector('section.course-detail')) {
    const searchInput = document.getElementById('course-search');
    const clearBtn = document.getElementById('course-search-clear');
    const countEl = document.getElementById('course-filter-count');
    const detailSections = document.querySelectorAll('section.course-detail');

    const noResults = document.createElement('p');
    noResults.className = 'courses-no-results';
    noResults.innerHTML = '<strong>No courses found.</strong> Try a different search term.';
    noResults.style.display = 'none';
    document.getElementById('course-filter-section').insertAdjacentElement('afterend', noResults);

    // Collect course names for suggestions
    const allDetailNames = Array.from(detailSections).map(sec => {
        const h2 = sec.querySelector('h2');
        return h2 ? h2.textContent.trim() : '';
    }).filter(Boolean);

    function scrollToFirstResult() {
        const firstVisible = Array.from(detailSections).find(sec => sec.style.display !== 'none');
        if (firstVisible) {
            const headerH = document.querySelector('header')?.offsetHeight || 80;
            const filterH = document.getElementById('course-filter-section')?.offsetHeight || 0;
            const top = firstVisible.getBoundingClientRect().top + window.scrollY - headerH - filterH - 12;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    const showSuggestions = buildSuggestions(
        searchInput.closest('.course-search-wrap'),
        allDetailNames,
        function (name) {
            searchInput.value = name;
            clearBtn.classList.add('visible');
            runDetailFilter();
            scrollToFirstResult();
        }
    );

    function runDetailFilter() {
        const query = searchInput.value.trim().toLowerCase();
        clearBtn.classList.toggle('visible', query.length > 0);

        let total = 0;

        detailSections.forEach(sec => {
            const h2 = sec.querySelector('h2');
            const content = sec.querySelector('.course-detail-content');
            const text = ((h2 ? h2.textContent : '') + ' ' + (content ? content.textContent : '')).toLowerCase();

            if (query === '' || text.includes(query)) {
                sec.style.display = '';
                total++;
            } else {
                sec.style.display = 'none';
            }
        });

        noResults.style.display = total === 0 ? 'block' : 'none';
        countEl.textContent = query ? (total === 1 ? '1 course found' : total + ' courses found') : '';
    }

    searchInput.addEventListener('input', function () {
        showSuggestions(this.value.trim());
        runDetailFilter();
    });

    clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        clearBtn.classList.remove('visible');
        runDetailFilter();
        searchInput.focus();
    });
}

// =====================
// Gallery Page
// =====================
if (document.getElementById('gallery-grid')) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbCap = document.getElementById('lightbox-caption');
    const lbClose = document.getElementById('lightbox-close');

    const PER_PAGE = 20;
    let currentFilter = 'all';
    let currentPage = 1;

    function getAllCards() {
        return Array.from(document.querySelectorAll('.gallery-card'));
    }

    function getFilteredCards() {
        return getAllCards().filter(card => {
            if (currentFilter === 'all') return true;
            return card.dataset.category === currentFilter;
        });
    }

    let scrollObserver = null;

    function setupScrollReveal(cards) {
        if (scrollObserver) scrollObserver.disconnect();

        scrollObserver = new IntersectionObserver((entries) => {
            const entering = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

            entering.forEach((entry, i) => {
                const card = entry.target;
                card.style.animationDelay = (i * 60) + 'ms';
                card.classList.add('card-visible');
                scrollObserver.unobserve(card);
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -20px 0px'
        });

        cards.forEach(card => scrollObserver.observe(card));
    }

    function renderPage() {
        const filtered = getFilteredCards();
        const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * PER_PAGE;
        const end = start + PER_PAGE;

        getAllCards().forEach(card => {
            card.style.display = 'none';
            card.classList.remove('card-visible');
            card.style.animationDelay = '';
        });

        const visible = filtered.slice(start, end);
        visible.forEach(card => { card.style.display = ''; });

        renderPagination(totalPages);
        setupScrollReveal(visible);
    }

    function renderPagination(totalPages) {
        const container = document.getElementById('gallery-pagination');
        container.innerHTML = '';
        if (totalPages <= 1) return;

        const prev = document.createElement('button');
        prev.className = 'page-btn prev-next';
        prev.textContent = '← Prev';
        prev.disabled = currentPage === 1;
        prev.addEventListener('click', () => {
            currentPage--;
            renderPage();
            window.scrollTo({ top: document.querySelector('.gallery-page-section').offsetTop - 100, behavior: 'smooth' });
        });
        container.appendChild(prev);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
            btn.textContent = i;
            btn.addEventListener('click', (function(page) {
                return function() {
                    currentPage = page;
                    renderPage();
                    window.scrollTo({ top: document.querySelector('.gallery-page-section').offsetTop - 100, behavior: 'smooth' });
                };
            })(i));
            container.appendChild(btn);
        }

        const next = document.createElement('button');
        next.className = 'page-btn prev-next';
        next.textContent = 'Next →';
        next.disabled = currentPage === totalPages;
        next.addEventListener('click', () => {
            currentPage++;
            renderPage();
            window.scrollTo({ top: document.querySelector('.gallery-page-section').offsetTop - 100, behavior: 'smooth' });
        });
        container.appendChild(next);
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const grid = document.getElementById('gallery-grid');
            grid.style.transition = 'opacity .18s ease';
            grid.style.opacity = '0';
            setTimeout(() => {
                currentFilter = btn.dataset.filter;
                currentPage = 1;
                renderPage();
                grid.style.opacity = '1';
            }, 180);
        });
    });

    // Lightbox
    const lbPrev = document.getElementById('lightbox-prev');
    const lbNext = document.getElementById('lightbox-next');
    let lbIndex = -1;

    function getVisibleCards() {
        return getAllCards().filter(c => c.style.display !== 'none');
    }

    function updateArrows() {
        const cards = getVisibleCards();
        lbPrev.disabled = lbIndex <= 0;
        lbNext.disabled = lbIndex >= cards.length - 1;
    }

    function showLightboxAt(index) {
        const cards = getVisibleCards();
        if (index < 0 || index >= cards.length) return;
        lbIndex = index;
        const card = cards[lbIndex];
        const img = card.querySelector('img');
        const cap = card.querySelector('.gallery-card-overlay p');
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCap.textContent = cap ? cap.textContent : '';
        updateArrows();
    }

    function openLightbox(card) {
        const img = card.querySelector('img');
        if (!img.src || img.src === window.location.href) return;
        const cards = getVisibleCards();
        lbIndex = cards.indexOf(card);
        showLightboxAt(lbIndex);
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
    }

    lbPrev.addEventListener('click', e => { e.stopPropagation(); showLightboxAt(lbIndex - 1); });
    lbNext.addEventListener('click', e => { e.stopPropagation(); showLightboxAt(lbIndex + 1); });

    document.getElementById('gallery-grid').addEventListener('click', e => {
        const card = e.target.closest('.gallery-card');
        if (card) openLightbox(card);
    });
    lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', e => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showLightboxAt(lbIndex - 1);
        if (e.key === 'ArrowRight') showLightboxAt(lbIndex + 1);
    });

    // Touch swipe
    let touchStartX = 0;
    lb.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 50) {
            if (delta < 0) showLightboxAt(lbIndex + 1);
            else showLightboxAt(lbIndex - 1);
        }
    }, { passive: true });

    renderPage();
}