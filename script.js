// Enhanced Pakistani Matrimony Website JavaScript

// Language switching functionality
function changeLanguage() {
    const select = document.getElementById('languageSelect');
    const selectedLang = select.value;
    const body = document.body;
    
    // Set body language attribute and document direction
    body.setAttribute('data-lang', selectedLang);
    document.documentElement.lang = selectedLang === 'ur' ? 'ur' : 'en';
    document.documentElement.setAttribute('dir', selectedLang === 'ur' ? 'rtl' : 'ltr');
    
    // Update all elements with data attributes
    const elementsToTranslate = document.querySelectorAll('[data-en][data-ur]');
    
    elementsToTranslate.forEach(element => {
        if (selectedLang === 'ur') {
            element.textContent = element.getAttribute('data-ur');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
    
    // Update placeholders with new attribute system
    const inputsWithPlaceholders = document.querySelectorAll('input[data-en-placeholder][data-ur-placeholder], textarea[data-en-placeholder][data-ur-placeholder]');
    
    inputsWithPlaceholders.forEach(input => {
        if (selectedLang === 'ur') {
            input.placeholder = input.getAttribute('data-ur-placeholder');
        } else {
            input.placeholder = input.getAttribute('data-en-placeholder');
        }
    });
    
    // Update select options
    const selectOptions = document.querySelectorAll('option[data-en][data-ur]');
    
    selectOptions.forEach(option => {
        if (selectedLang === 'ur') {
            option.textContent = option.getAttribute('data-ur');
        } else {
            option.textContent = option.getAttribute('data-en');
        }
    });
    
    // Update select default options
    const selectsWithDefaults = document.querySelectorAll('select[data-en-default][data-ur-default]');
    
    selectsWithDefaults.forEach(select => {
        const firstOption = select.querySelector('option[value=""]');
        if (firstOption) {
            if (selectedLang === 'ur') {
                firstOption.textContent = select.getAttribute('data-ur-default');
            } else {
                firstOption.textContent = select.getAttribute('data-en-default');
            }
        }
    });
    
    // Store preference in localStorage
    localStorage.setItem('preferredLanguage', selectedLang);
}

// Load saved language preference
function loadLanguagePreference() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    const select = document.getElementById('languageSelect');
    
    if (select) {
        select.value = savedLang;
        changeLanguage();
    }
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    loadLanguagePreference();
});

// Initialize all website functionality
function initializeWebsite() {
    setupNavigation();
    setupFormValidation();
    setupFormSubmission();
    setupContactForm();
    setupAnimations();
    setupMobileMenu();
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', highlightActiveNav);
}

function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// Search tabs functionality
function setupSearchTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update form based on selected tab
            updateSearchForm(this.dataset.tab);
        });
    });
}

function updateSearchForm(tabType) {
    const searchForm = document.querySelector('.search-form');
    const searchBtn = document.querySelector('.search-btn');
    
    if (tabType === 'bride') {
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Find Bride';
        searchBtn.style.background = 'linear-gradient(45deg, #8B0000, #DC143C)';
    } else {
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Find Groom';
        searchBtn.style.background = 'linear-gradient(45deg, #4A90E2, #357ABD)';
    }
}

// Form validation functionality
function setupFormValidation() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Custom validation rules
    setupCustomValidation();
}

function validateField(event) {
    const field = event.target;
    const fieldGroup = field.closest('.form-group');
    
    // Remove existing error messages
    removeFieldError(fieldGroup);
    
    // Validate field
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    } else if (field.type === 'tel' && !isValidPhone(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    } else if (field.name === 'dateOfBirth' && !isValidAge(field.value)) {
        isValid = false;
        errorMessage = 'You must be at least 18 years old';
    }
    
    if (!isValid) {
        showFieldError(fieldGroup, errorMessage);
    }
    
    return isValid;
}

function setupCustomValidation() {
    // Password confirmation if login form exists
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('blur', validatePasswordConfirmation);
    }
    
    // Age validation for partner preferences
    const partnerAgeFrom = document.getElementById('partnerAgeFrom');
    const partnerAgeTo = document.getElementById('partnerAgeTo');
    
    if (partnerAgeFrom && partnerAgeTo) {
        partnerAgeFrom.addEventListener('change', validateAgeRange);
        partnerAgeTo.addEventListener('change', validateAgeRange);
    }
}

function validatePasswordConfirmation(event) {
    const confirmPassword = event.target;
    const password = document.getElementById('password');
    const fieldGroup = confirmPassword.closest('.form-group');
    
    removeFieldError(fieldGroup);
    
    if (password && confirmPassword.value !== password.value) {
        showFieldError(fieldGroup, 'Passwords do not match');
        return false;
    }
    
    return true;
}

function validateAgeRange() {
    const ageFrom = document.getElementById('partnerAgeFrom');
    const ageTo = document.getElementById('partnerAgeTo');
    
    if (ageFrom.value && ageTo.value) {
        if (parseInt(ageFrom.value) >= parseInt(ageTo.value)) {
            const fieldGroup = ageTo.closest('.form-group');
            removeFieldError(fieldGroup);
            showFieldError(fieldGroup, 'To age must be greater than from age');
            return false;
        }
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function isValidAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age >= 18;
}

function showFieldError(fieldGroup, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    fieldGroup.appendChild(errorDiv);
    
    const input = fieldGroup.querySelector('input, select, textarea');
    if (input) {
        input.style.borderColor = '#dc3545';
        input.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    }
}

function removeFieldError(fieldGroup) {
    const errorDiv = fieldGroup.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    
    const input = fieldGroup.querySelector('input, select, textarea');
    if (input) {
        input.style.borderColor = '#e9ecef';
        input.style.boxShadow = 'none';
    }
}

function clearFieldError(event) {
    const fieldGroup = event.target.closest('.form-group');
    removeFieldError(fieldGroup);
}

// Form submission functionality
function setupFormSubmission() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
}

// Contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }
}

function handleContactFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    requiredFields.forEach(field => {
        const fieldEvent = { target: field };
        if (!validateField(fieldEvent)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
    
    // Simulate form submission
    setTimeout(() => {
        // Reset loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        
        // Show success message
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
    }, 2000);
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;
    
    requiredFields.forEach(field => {
        const fieldEvent = { target: field };
        if (!validateField(fieldEvent)) {
            isFormValid = false;
        }
    });
    
    // Check terms agreement
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
        showNotification('Please agree to the Terms & Conditions', 'error');
        isFormValid = false;
    }
    
    if (!isFormValid) {
        showNotification('Please correct the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Profile...';
    
    // Simulate form submission
    setTimeout(() => {
        // Collect form data
        const formData = new FormData(form);
        const profileData = {};
        
        for (let [key, value] of formData.entries()) {
            profileData[key] = value;
        }
        
        // Store in localStorage (in real app, send to server)
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        
        // Reset loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-heart"></i> Create My Profile';
        
        // Show success message
        showNotification('Profile created successfully! Welcome to PakMatrimony!', 'success');
        
        // Reset form
        form.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    }, 2000);
}

function handleSearchSubmission(event) {
    event.preventDefault();
    
    const searchForm = document.querySelector('.search-form');
    const formData = new FormData(searchForm);
    const searchCriteria = {};
    
    for (let [key, value] of formData.entries()) {
        if (value) {
            searchCriteria[key] = value;
        }
    }
    
    // Show search results (simulate)
    showSearchResults(searchCriteria);
}

function showSearchResults(criteria) {
    // This would typically navigate to a results page
    // For demo purposes, show a notification
    let message = 'Searching for profiles';
    if (criteria.age) message += ` aged ${criteria.age}`;
    if (criteria.religion) message += ` of ${criteria.religion} religion`;
    if (criteria.city) message += ` in ${criteria.city}`;
    
    showNotification(message + '...', 'info');
    
    // Scroll to browse section
    setTimeout(() => {
        const browseSection = document.getElementById('browse');
        if (browseSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            window.scrollTo({
                top: browseSection.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    }, 1000);
}

// Profile cards functionality
function setupProfileCards() {
    const profileCards = document.querySelectorAll('.profile-card');
    const viewProfileBtns = document.querySelectorAll('.view-profile-btn');
    
    // Add hover effects
    profileCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
        });
    });
    
    // Handle profile view buttons
    viewProfileBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const profileCard = this.closest('.profile-card');
            const profileName = profileCard.querySelector('h3').textContent;
            
            showProfileModal(profileName);
        });
    });
}

function showProfileModal(profileName) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'profile-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${profileName}'s Profile</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="profile-details">
                        <div class="profile-photo">
                            <img src="https://via.placeholder.com/300x300" alt="${profileName}">
                        </div>
                        <div class="profile-info-detailed">
                            <h3>About ${profileName}</h3>
                            <p>This is a sample profile. In a real application, this would show detailed information about the person including their background, education, family details, and preferences.</p>
                            
                            <div class="info-grid">
                                <div class="info-item">
                                    <strong>Age:</strong> 25 years
                                </div>
                                <div class="info-item">
                                    <strong>Location:</strong> Karachi, Pakistan
                                </div>
                                <div class="info-item">
                                    <strong>Education:</strong> Masters in Computer Science
                                </div>
                                <div class="info-item">
                                    <strong>Occupation:</strong> Software Engineer
                                </div>
                                <div class="info-item">
                                    <strong>Religion:</strong> Islam
                                </div>
                                <div class="info-item">
                                    <strong>Height:</strong> 5'4"
                                </div>
                            </div>
                            
                            <div class="contact-actions">
                                <button class="btn-contact">Send Interest</button>
                                <button class="btn-message">Send Message</button>
                                <button class="btn-favorite">Add to Favorites</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 15px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    `;
    
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        padding: 2rem;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
    `;
    
    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        padding: 2rem;
    `;
    
    // Add to DOM
    document.body.appendChild(modal);
    
    // Setup modal close functionality
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Restore body scroll when modal is closed
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                Array.from(mutation.removedNodes).forEach((node) => {
                    if (node === modal) {
                        document.body.style.overflow = '';
                        observer.disconnect();
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, { childList: true });
}

// Animation functionality
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.profile-card, .story-card, .form-section');
    animatedElements.forEach(el => observer.observe(el));
    
    // Counter animation for stats
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    const speed = 200;
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const count = parseInt(counter.getAttribute('data-count') || '0');
            const increment = target / speed;
            
            if (count < target) {
                counter.setAttribute('data-count', Math.ceil(count + increment));
                counter.textContent = Math.ceil(count + increment).toLocaleString() + '+';
                setTimeout(updateCount, 1);
            } else {
                counter.textContent = target.toLocaleString() + '+';
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    // Create mobile menu toggle button
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    `;
    
    navbar.insertBefore(mobileToggle, navLinks);
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        const icon = mobileToggle.querySelector('i');
        
        if (navLinks.classList.contains('mobile-open')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Add mobile styles
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block !important;
            }
            
            .nav-links {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);
                flex-direction: column;
                padding: 1rem;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .nav-links.mobile-open {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
        }
    `;
    document.head.appendChild(mobileStyles);
}

// Filter functionality for browse section
function setupFilterFunctionality() {
    // Create filter controls
    const browseSection = document.getElementById('browse');
    const profilesGrid = browseSection.querySelector('.profiles-grid');
    
    // Create filter bar
    const filterBar = document.createElement('div');
    filterBar.className = 'filter-bar';
    filterBar.innerHTML = `
        <div class="filter-controls">
            <select id="filterAge" class="filter-select">
                <option value="">All Ages</option>
                <option value="20-25">20-25 years</option>
                <option value="26-30">26-30 years</option>
                <option value="31-35">31-35 years</option>
                <option value="36-40">36-40 years</option>
            </select>
            
            <select id="filterLocation" class="filter-select">
                <option value="">All Locations</option>
                <option value="karachi">Karachi</option>
                <option value="lahore">Lahore</option>
                <option value="islamabad">Islamabad</option>
                <option value="faisalabad">Faisalabad</option>
            </select>
            
            <select id="filterEducation" class="filter-select">
                <option value="">All Education</option>
                <option value="masters">Masters</option>
                <option value="bachelors">Bachelors</option>
                <option value="phd">PhD</option>
                <option value="diploma">Diploma</option>
            </select>
            
            <button id="clearFilters" class="clear-filters-btn">Clear Filters</button>
        </div>
    `;
    
    // Add filter styles
    filterBar.style.cssText = `
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    `;
    
    // Insert filter bar before profiles grid
    profilesGrid.parentNode.insertBefore(filterBar, profilesGrid);
    
    // Setup filter event listeners
    const filterSelects = filterBar.querySelectorAll('.filter-select');
    const clearFiltersBtn = filterBar.querySelector('#clearFilters');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', applyFilters);
    });
    
    clearFiltersBtn.addEventListener('click', clearAllFilters);
}

function applyFilters() {
    const profiles = document.querySelectorAll('.profile-card');
    const ageFilter = document.getElementById('filterAge').value;
    const locationFilter = document.getElementById('filterLocation').value;
    const educationFilter = document.getElementById('filterEducation').value;
    
    profiles.forEach(profile => {
        let shouldShow = true;
        
        // Apply age filter (this is a simplified example)
        if (ageFilter && !profile.textContent.includes(ageFilter.split('-')[0])) {
            shouldShow = false;
        }
        
        // Apply location filter
        if (locationFilter && !profile.textContent.toLowerCase().includes(locationFilter)) {
            shouldShow = false;
        }
        
        // Apply education filter
        if (educationFilter && !profile.textContent.toLowerCase().includes(educationFilter)) {
            shouldShow = false;
        }
        
        // Show/hide profile
        if (shouldShow) {
            profile.style.display = 'block';
            profile.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            profile.style.display = 'none';
        }
    });
    
    // Show message if no profiles match
    const visibleProfiles = document.querySelectorAll('.profile-card[style*="block"]');
    const profilesGrid = document.querySelector('.profiles-grid');
    
    let noResultsMessage = document.querySelector('.no-results-message');
    
    if (visibleProfiles.length === 0) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: #ddd;"></i>
                    <h3>No profiles found</h3>
                    <p>Try adjusting your filters to see more results</p>
                </div>
            `;
            profilesGrid.appendChild(noResultsMessage);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

function clearAllFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    const profiles = document.querySelectorAll('.profile-card');
    const noResultsMessage = document.querySelector('.no-results-message');
    
    // Reset all filters
    filterSelects.forEach(select => {
        select.value = '';
    });
    
    // Show all profiles
    profiles.forEach(profile => {
        profile.style.display = 'block';
    });
    
    // Remove no results message
    if (noResultsMessage) {
        noResultsMessage.remove();
    }
    
    showNotification('Filters cleared', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease forwards;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    document.body.appendChild(notification);
    
    // Setup close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization
window.addEventListener('scroll', throttle(highlightActiveNav, 100));
window.addEventListener('resize', debounce(() => {
    // Handle responsive updates
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (window.innerWidth > 768) {
        navLinks.classList.remove('mobile-open');
        if (mobileToggle) {
            mobileToggle.querySelector('i').className = 'fas fa-bars';
        }
    }
}, 250));

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('Something went wrong. Please try again.', 'error');
});

// Service Worker registration (for PWA capabilities)
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
