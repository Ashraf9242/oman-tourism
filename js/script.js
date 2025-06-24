// Oman Tourism Website - Enhanced JavaScript

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const languageToggle = document.getElementById('languageToggle');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const scrollTopBtn = document.getElementById('scrollTop');
const html = document.documentElement;

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';
let currentLanguage = localStorage.getItem('language') || 'en';

// Initialize theme and language
function initializeApp() {
    setTheme(currentTheme);
    setLanguage(currentLanguage);
    setupEventListeners();
    setupScrollAnimations();
    setupIntersectionObserver();
}

// Theme switching functionality
function setTheme(theme) {
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    const themeIcon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeIcon.style.color = '#DAA520';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeIcon.style.color = '#8B4513';
    }
}

// Language switching functionality
function setLanguage(lang) {
    currentLanguage = lang;
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('lang', lang);
    localStorage.setItem('language', lang);
    
    // Update language toggle text
    languageToggle.innerHTML = `<i class="fas fa-globe"></i> ${lang.toUpperCase()}`;
    
    // Update all translatable elements
    updateTextContent(lang);
    
    // Update chatbot elements
    updateChatbotLanguage(lang);
}

// Update chatbot language-specific elements
function updateChatbotLanguage(lang) {
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotTitle = document.querySelector('.chatbot-title span');
    
    if (chatbotInput) {
        chatbotInput.placeholder = lang === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question here...';
    }
    
    if (chatbotTitle) {
        chatbotTitle.textContent = lang === 'ar' ? 'مساعد السياحة العُمانية' : 'Oman Tourism Assistant';
    }
    
    // Update chatbot instance if it exists
    if (window.omanChatbot) {
        window.omanChatbot.updateLanguage(lang);
    }
}

// Update text content based on language
function updateTextContent(lang) {
    const translatableElements = document.querySelectorAll('[data-en][data-ar]');
    
    translatableElements.forEach(element => {
        const text = lang === 'ar' ? element.getAttribute('data-ar') : element.getAttribute('data-en');
        if (text) {
            element.textContent = text;
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
    
    // Language toggle
    languageToggle.addEventListener('click', () => {
        const newLang = currentLanguage === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Scroll to top button
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Smooth scrolling for anchor links
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
        });
    });
}

// Scroll animations
function setupScrollAnimations() {
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
    const animatedElements = document.querySelectorAll('.feature-card, .highlight-item, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Intersection Observer for parallax effects
function setupIntersectionObserver() {
    const parallaxElements = document.querySelectorAll('.hero, .cta');
    
    const parallaxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    parallaxElements.forEach(el => {
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'transform 1s ease';
        parallaxObserver.observe(el);
    });
}

// Enhanced form handling for contact page
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

// Form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();
        
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Field validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'fullName':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
}

// Clear field error
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    });
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Filter functionality for attractions page
function setupAttractionFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const attractionCards = document.querySelectorAll('.attraction-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter cards
            attractionCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Resize handler
const handleResize = debounce(() => {
    // Handle responsive adjustments
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}, 250);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupContactForm();
    setupAttractionFilters();
    setupLazyLoading();
    
    // Initialize new AI features
    window.omanChatbot = new Chatbot();
    window.omanRecommendations = new RecommendationsSystem();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Add page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Service Worker registration for PWA features
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

// Export functions for potential external use
window.OmanTourism = {
    setTheme,
    setLanguage,
    showNotification,
    setupContactForm,
    setupAttractionFilters,
    get chatbot() { return window.omanChatbot; },
    get recommendations() { return window.omanRecommendations; }
};

// --- Promo Video Mute/Unmute ---
window.addEventListener('DOMContentLoaded', function() {
    var muteBtn = document.getElementById('muteBtn');
    var videoFrame = document.getElementById('omanVideo');
    var isMuted = true;
    if (muteBtn && videoFrame) {
        muteBtn.addEventListener('click', function() {
            videoFrame.contentWindow.postMessage('{"event":"command","func":"' + (isMuted ? 'unMute' : 'mute') + '","args":""}', '*');
            isMuted = !isMuted;
        });
    }
});

// --- Smart Search Bar ---
const attractionsList = [
    "جامع السلطان قابوس الأكبر",
    "سوق مطرح",
    "وادي شاب",
    "جبل شمس",
    "رمال وهيبة",
    "قلعة نزوى",
    "قلعة بهلاء",
    "شاطئ القرم",
    "الجبل الأخضر",
    "مسجد السلطان تيمور",
    "محمية رأس الجنز",
    "مدينة صلالة"
];
const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');
if (searchInput && suggestions) {
    searchInput.addEventListener('input', function() {
        const value = this.value.trim();
        suggestions.innerHTML = '';
        if (value.length > 0) {
            const filtered = attractionsList.filter(item => item.includes(value));
            filtered.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                li.onclick = function() {
                    searchInput.value = item;
                    suggestions.innerHTML = '';
                };
                suggestions.appendChild(li);
            });
        }
    });
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.innerHTML = '';
        }
    });
}

// --- AI Chatbot System ---
const chatbotData = {
    // Questions and Answers Database
    qa: [
        {
            question: "ما هي أفضل الأوقات لزيارة عُمان؟",
            answer: "أفضل وقت لزيارة عُمان هو من أكتوبر إلى أبريل، حيث يكون الطقس معتدلاً وممتعاً. تجنب الصيف (مايو-سبتمبر) لأنه حار جداً خاصة في المناطق الصحراوية."
        },
        {
            question: "هل أحتاج تأشيرة لزيارة عُمان؟",
            answer: "يمكن لمواطني العديد من البلدان الحصول على تأشيرة عند الوصول لمدة 30 يوماً. تحقق من السفارة العُمانية في بلدك للمتطلبات المحددة."
        },
        {
            question: "ما هي الأماكن السياحية الأكثر شهرة في عُمان؟",
            answer: "أشهر الأماكن تشمل: مسجد السلطان قابوس الأكبر، سوق مطرح، وادي شاب، جبل شمس، رمال وهيبة، قلعة نزوى، ومدينة صلالة."
        },
        {
            question: "هل عُمان آمنة للسياح؟",
            answer: "نعم، عُمان من أكثر البلدان أماناً في المنطقة. معدلات الجريمة منخفضة جداً والسكان ودودون ومضيافون."
        },
        {
            question: "ما هي العملة المستخدمة في عُمان؟",
            answer: "العملة الرسمية هي الريال العُماني (OMR). يمكنك تبادل العملات في البنوك أو مراكز الصرافة."
        },
        {
            question: "ما هي اللغة الرسمية في عُمان؟",
            answer: "اللغة الرسمية هي العربية، لكن الإنجليزية مستخدمة على نطاق واسع في السياحة والأعمال."
        },
        {
            question: "هل يمكنني قيادة السيارة في عُمان؟",
            answer: "نعم، يمكنك قيادة السيارة برخصة قيادة دولية. الطرق جيدة والقيادة آمنة نسبياً."
        },
        {
            question: "ما هي المأكولات التقليدية في عُمان؟",
            answer: "المأكولات الشهيرة تشمل: الشواء، المجبوس، الحلوى العُمانية، القهوة العربية، والتمر."
        },
        {
            question: "هل يمكنني زيارة الصحراء في عُمان؟",
            answer: "نعم! رمال وهيبة من أشهر الوجهات الصحراوية. يمكنك التخييم، ركوب الجمال، والتزلج على الكثبان."
        },
        {
            question: "ما هي أفضل الأنشطة في عُمان؟",
            answer: "الأنشطة الشائعة: التخييم في الصحراء، السباحة في الوديان، تسلق الجبال، مشاهدة الدلافين، وزيارة القلاع التاريخية."
        },
        {
            question: "هل يمكنني السباحة في عُمان؟",
            answer: "نعم! يمكنك السباحة في الشواطئ الجميلة أو في برك الوديان العذبة مثل وادي شاب."
        },
        {
            question: "ما هي تكلفة السفر إلى عُمان؟",
            answer: "التكلفة معقولة نسبياً. الإقامة: 50-200 ريال/ليلة، الطعام: 10-30 ريال/وجبة، النقل: 20-50 ريال/يوم."
        }
    ],
    
    // Welcome messages
    welcomeMessages: [
        "مرحباً! أنا مساعد السياحة العُمانية. كيف يمكنني مساعدتك اليوم؟",
        "أهلاً وسهلاً! أنا هنا لمساعدتك في التخطيط لرحلتك إلى عُمان. ما الذي تريد معرفته؟",
        "مرحباً بك! أنا مساعدك الشخصي لاستكشاف عُمان. اسألني أي شيء عن السياحة في عُمان!"
    ],
    
    // Fallback responses
    fallbackResponses: [
        "عذراً، لم أفهم سؤالك. هل يمكنك إعادة صياغته؟",
        "هذا سؤال مثير للاهتمام! لكنني لا أملك إجابة محددة له. هل يمكنك طرح سؤال آخر عن السياحة في عُمان؟",
        "أعتذر، لا أملك معلومات كافية عن هذا الموضوع. هل تريد معرفة المزيد عن الأماكن السياحية في عُمان؟"
    ]
};

// --- Recommendations System ---
const recommendationsData = {
    places: [
        {
            id: 1,
            name: "مسجد السلطان قابوس الأكبر",
            nameEn: "Sultan Qaboos Grand Mosque",
            description: "أكبر مسجد في عُمان وأحد أجمل المساجد في العالم، يتميز بالعمارة الإسلامية الرائعة والحدائق الخلابة.",
            descriptionEn: "The largest mosque in Oman and one of the most beautiful mosques in the world, featuring stunning Islamic architecture and beautiful gardens.",
            image: "assets/مسجد سلطان قابوس الاكبر.jpeg",
            categories: ["historical", "culture", "architecture"],
            location: "مسقط",
            locationEn: "Muscat",
            score: 95,
            tags: ["تاريخي", "ثقافي", "عمارة إسلامية"]
        },
        {
            id: 2,
            name: "سوق مطرح",
            nameEn: "Mutrah Souq",
            description: "سوق تقليدي قديم يبيع التوابل، المجوهرات الفضية، البخور، والهدايا التذكارية العُمانية الأصيلة.",
            descriptionEn: "A traditional old souq selling spices, silver jewelry, incense, and authentic Omani souvenirs.",
            image: "assets/سوق مطرح.jpeg",
            categories: ["culture", "shopping", "historical"],
            location: "مسقط",
            locationEn: "Muscat",
            score: 88,
            tags: ["تسوق", "ثقافي", "تقليدي"]
        },
        {
            id: 3,
            name: "وادي شاب",
            nameEn: "Wadi Shab",
            description: "وادي خلاب مع برك زرقاء صافية وشلالات، مثالي للسباحة والمشي في الطبيعة.",
            descriptionEn: "A stunning wadi with crystal clear blue pools and waterfalls, perfect for swimming and nature walks.",
            image: "assets/وادي شاب.jpeg",
            categories: ["nature", "adventure", "swimming"],
            location: "الشرقية",
            locationEn: "Eastern Region",
            score: 92,
            tags: ["طبيعة", "مغامرة", "سباحة"]
        },
        {
            id: 4,
            name: "جبل شمس",
            nameEn: "Jebel Shams",
            description: "أعلى قمة في عُمان مع إطلالات بانورامية مذهلة على الوديان والجبال المحيطة.",
            descriptionEn: "The highest peak in Oman with breathtaking panoramic views of surrounding valleys and mountains.",
            image: "assets/جبل شمس.jpeg",
            categories: ["nature", "adventure", "hiking"],
            location: "الداخلية",
            locationEn: "Ad Dakhiliyah",
            score: 90,
            tags: ["طبيعة", "مغامرة", "تسلق"]
        },
        {
            id: 5,
            name: "رمال وهيبة",
            nameEn: "Wahiba Sands",
            description: "صحراء رائعة مع كثبان ذهبية، مثالية للتخييم الصحراوي وركوب الجمال.",
            descriptionEn: "A magnificent desert with golden dunes, perfect for desert camping and camel riding.",
            image: "assets/رمال وهيبة.jpeg",
            categories: ["nature", "adventure", "desert"],
            location: "الشرقية",
            locationEn: "Eastern Region",
            score: 87,
            tags: ["صحراء", "مغامرة", "تخييم"]
        },
        {
            id: 6,
            name: "قلعة نزوى",
            nameEn: "Nizwa Fort",
            description: "قلعة تاريخية مذهلة من القرن السابع عشر، تقدم نظرة على تاريخ عُمان العريق.",
            descriptionEn: "A stunning historical fort from the 17th century, offering insights into Oman's rich history.",
            image: "assets/قلعة نزوى.jpeg",
            categories: ["historical", "culture", "architecture"],
            location: "نزوى",
            locationEn: "Nizwa",
            score: 89,
            tags: ["تاريخي", "قلعة", "عمارة"]
        },
        {
            id: 7,
            name: "قلعة بهلاء",
            nameEn: "Bahla Fort",
            description: "قلعة قديمة مدرجة في قائمة اليونسكو للتراث العالمي، مثال رائع على العمارة العُمانية التقليدية.",
            descriptionEn: "An ancient fort listed as a UNESCO World Heritage site, a fine example of traditional Omani architecture.",
            image: "assets/قلعة بهلا.jpeg",
            categories: ["historical", "culture", "unesco"],
            location: "بهلاء",
            locationEn: "Bahla",
            score: 85,
            tags: ["تاريخي", "يونسكو", "تراث عالمي"]
        },
        {
            id: 8,
            name: "مشاهدة الدلافين في مسقط",
            nameEn: "Dolphin Watching in Muscat",
            description: "رحلة بحرية ممتعة لمشاهدة الدلافين في موطنها الطبيعي على طول الساحل العُماني.",
            descriptionEn: "An exciting boat trip to see dolphins in their natural habitat along the Omani coastline.",
            image: "assets/مشاهدة دلافين مسقط.jpeg",
            categories: ["nature", "adventure", "wildlife"],
            location: "مسقط",
            locationEn: "Muscat",
            score: 83,
            tags: ["طبيعة", "دلافين", "رحلة بحرية"]
        }
    ],
    
    // Interest categories mapping
    interestMapping: {
        "historical": ["historical", "culture", "architecture", "unesco"],
        "nature": ["nature", "wildlife", "landscape"],
        "adventure": ["adventure", "hiking", "swimming", "desert"],
        "culture": ["culture", "historical", "traditional"],
        "food": ["culture", "traditional", "local"],
        "shopping": ["shopping", "culture", "traditional"]
    }
};

// Chatbot functionality
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentLanguage = 'ar'; // Default to Arabic
        this.init();
    }
    
    init() {
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const send = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');
        const window = document.getElementById('chatbotWindow');
        const messages = document.getElementById('chatbotMessages');
        const badge = document.getElementById('chatbotBadge');
        
        if (!toggle || !close || !send || !input || !window || !messages) return;
        
        // Set initial language
        this.currentLanguage = document.documentElement.getAttribute('lang') || 'ar';
        this.updateLanguage(this.currentLanguage);
        
        // Toggle chat window
        toggle.addEventListener('click', () => {
            this.toggleChat();
        });
        
        // Close chat window
        close.addEventListener('click', () => {
            this.closeChat();
        });
        
        // Send message
        send.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send message on Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Hide badge after first interaction
        toggle.addEventListener('click', () => {
            if (badge) {
                badge.style.display = 'none';
            }
        });
        
        // Send welcome message after a delay
        setTimeout(() => {
            this.addBotMessage(this.getRandomWelcomeMessage());
        }, 2000);
    }
    
    updateLanguage(lang) {
        this.currentLanguage = lang;
        const input = document.getElementById('chatbotInput');
        const title = document.querySelector('.chatbot-title span');
        
        if (input) {
            input.placeholder = lang === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question here...';
        }
        
        if (title) {
            title.textContent = lang === 'ar' ? 'مساعد السياحة العُمانية' : 'Oman Tourism Assistant';
        }
    }
    
    toggleChat() {
        const window = document.getElementById('chatbotWindow');
        if (!window) return;
        
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            window.classList.add('active');
        } else {
            window.classList.remove('active');
        }
    }
    
    closeChat() {
        const window = document.getElementById('chatbotWindow');
        if (!window) return;
        
        this.isOpen = false;
        window.classList.remove('active');
    }
    
    sendMessage() {
        const input = document.getElementById('chatbotInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Add user message
        this.addUserMessage(message);
        input.value = '';
        
        // Simulate typing delay
        setTimeout(() => {
            const response = this.getResponse(message);
            this.addBotMessage(response);
        }, 1000);
    }
    
    addUserMessage(text) {
        this.addMessage(text, 'user');
    }
    
    addBotMessage(text) {
        this.addMessage(text, 'bot');
    }
    
    addMessage(text, type) {
        const messages = document.getElementById('chatbotMessages');
        if (!messages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}`;
        messageDiv.textContent = text;
        
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
        
        this.messages.push({ text, type, timestamp: new Date() });
    }
    
    getResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for exact matches first
        for (const qa of chatbotData.qa) {
            if (message.includes(qa.question.toLowerCase()) || 
                qa.question.toLowerCase().includes(message)) {
                return qa.answer;
            }
        }
        
        // Check for keyword matches based on language
        const keywords = this.currentLanguage === 'ar' ? {
            'تأشيرة': 'يمكن لمواطني العديد من البلدان الحصول على تأشيرة عند الوصول لمدة 30 يوماً. تحقق من السفارة العُمانية في بلدك للمتطلبات المحددة.',
            'وقت': 'أفضل وقت لزيارة عُمان هو من أكتوبر إلى أبريل، حيث يكون الطقس معتدلاً وممتعاً.',
            'أمان': 'عُمان من أكثر البلدان أماناً في المنطقة. معدلات الجريمة منخفضة جداً والسكان ودودون.',
            'عملة': 'العملة الرسمية هي الريال العُماني (OMR). يمكنك تبادل العملات في البنوك أو مراكز الصرافة.',
            'لغة': 'اللغة الرسمية هي العربية، لكن الإنجليزية مستخدمة على نطاق واسع في السياحة.',
            'قيادة': 'يمكنك قيادة السيارة برخصة قيادة دولية. الطرق جيدة والقيادة آمنة نسبياً.',
            'طعام': 'المأكولات الشهيرة تشمل: الشواء، المجبوس، الحلوى العُمانية، القهوة العربية، والتمر.',
            'صحراء': 'رمال وهيبة من أشهر الوجهات الصحراوية. يمكنك التخييم، ركوب الجمال، والتزلج على الكثبان.',
            'سباحة': 'يمكنك السباحة في الشواطئ الجميلة أو في برك الوديان العذبة مثل وادي شاب.',
            'تكلفة': 'التكلفة معقولة نسبياً. الإقامة: 50-200 ريال/ليلة، الطعام: 10-30 ريال/وجبة.'
        } : {
            'visa': 'Citizens of many countries can obtain a visa on arrival for 30 days. Check with your local Omani embassy for specific requirements.',
            'time': 'The best time to visit Oman is from October to April, when the weather is pleasant and enjoyable.',
            'safe': 'Oman is one of the safest countries in the region with very low crime rates and friendly locals.',
            'currency': 'The official currency is the Omani Rial (OMR). You can exchange currencies at banks or exchange centers.',
            'language': 'The official language is Arabic, but English is widely used in tourism and business.',
            'drive': 'You can drive with an international driving license. Roads are good and driving is relatively safe.',
            'food': 'Popular dishes include: Shuwa, Majboos, Omani Halwa, Arabic coffee, and dates.',
            'desert': 'Wahiba Sands is one of the most famous desert destinations. You can camp, ride camels, and dune bashing.',
            'swim': 'You can swim in beautiful beaches or fresh pools in wadis like Wadi Shab.',
            'cost': 'Costs are relatively reasonable. Accommodation: 50-200 rials/night, Food: 10-30 rials/meal.'
        };
        
        for (const [keyword, response] of Object.entries(keywords)) {
            if (message.includes(keyword)) {
                return response;
            }
        }
        
        // Return random fallback response
        return this.getRandomFallbackResponse();
    }
    
    getRandomWelcomeMessage() {
        const messages = this.currentLanguage === 'ar' ? chatbotData.welcomeMessages : [
            "Hello! I'm your Oman Tourism Assistant. How can I help you today?",
            "Welcome! I'm here to help you plan your trip to Oman. What would you like to know?",
            "Hi there! I'm your personal assistant for exploring Oman. Ask me anything about tourism in Oman!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    getRandomFallbackResponse() {
        const responses = this.currentLanguage === 'ar' ? chatbotData.fallbackResponses : [
            "Sorry, I didn't understand your question. Could you rephrase it?",
            "That's an interesting question! But I don't have a specific answer for it. Could you ask another question about tourism in Oman?",
            "I apologize, I don't have enough information about this topic. Would you like to know more about tourist attractions in Oman?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Recommendations functionality
class RecommendationsSystem {
    constructor() {
        this.init();
    }
    
    init() {
        const button = document.getElementById('getRecommendations');
        if (!button) return;
        
        button.addEventListener('click', () => {
            this.showRecommendations();
        });
    }
    
    showRecommendations() {
        const selectedInterests = this.getSelectedInterests();
        
        if (selectedInterests.length === 0) {
            showNotification('الرجاء اختيار مجالات الاهتمام أولاً', 'warning');
            return;
        }
        
        const recommendations = this.getRecommendations(selectedInterests);
        this.displayRecommendations(recommendations);
    }
    
    getSelectedInterests() {
        const checkboxes = document.querySelectorAll('input[name="interests"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    getRecommendations(interests) {
        const relevantCategories = new Set();
        
        // Get relevant categories for selected interests
        interests.forEach(interest => {
            const categories = recommendationsData.interestMapping[interest] || [];
            categories.forEach(cat => relevantCategories.add(cat));
        });
        
        // Filter places by relevant categories
        const filteredPlaces = recommendationsData.places.filter(place => {
            return place.categories.some(cat => relevantCategories.has(cat));
        });
        
        // Sort by score and return top 6
        return filteredPlaces
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);
    }
    
    displayRecommendations(recommendations) {
        const display = document.getElementById('recommendationsDisplay');
        const grid = document.getElementById('recommendationsGrid');
        
        if (!display || !grid) return;
        
        if (recommendations.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">لا توجد توصيات متاحة للاهتمامات المختارة.</p>';
            display.style.display = 'block';
            return;
        }
        
        grid.innerHTML = '';
        
        recommendations.forEach(place => {
            const card = this.createRecommendationCard(place);
            grid.appendChild(card);
        });
        
        display.style.display = 'block';
        
        // Scroll to recommendations
        display.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    createRecommendationCard(place) {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        
        const isArabic = document.documentElement.getAttribute('dir') === 'rtl';
        const name = isArabic ? place.name : place.nameEn;
        const description = isArabic ? place.description : place.descriptionEn;
        const location = isArabic ? place.location : place.locationEn;
        
        card.innerHTML = `
            <h4>${name}</h4>
            <p>${description}</p>
            <div class="recommendation-tags">
                ${place.tags.map(tag => `<span class="recommendation-tag">${tag}</span>`).join('')}
            </div>
            <div class="recommendation-score">
                <span class="score-label">${isArabic ? 'التقييم' : 'Rating'}</span>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${place.score}%"></div>
                </div>
                <span class="score-value">${place.score}%</span>
            </div>
        `;
        
        return card;
    }
}