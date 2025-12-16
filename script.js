document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar-collapse');
    const langButtons = document.querySelectorAll('[data-lang]');
    const i18nElements = document.querySelectorAll('[data-i18n]');
    const defaultLang = 'ko';

    const baseTexts = {};
    i18nElements.forEach((el) => {
        const key = el.dataset.i18n;
        if (key) baseTexts[key] = el.textContent;
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('show')) {
                new bootstrap.Collapse(navbar).hide();
            }
        });
    });

    const translations = {
        en: {
            'nav.about': 'About',
            'nav.skills': 'Skills',
            'nav.projects': 'Projects',
            'nav.contact': 'Contact',
            'hero.title': "Hi, I'm Seung Ho Yang",
            'hero.desc': 'Passionate AI developer and architect.\nBased in Seoul.\nFormerly at Heerim and Midas IT',
            'hero.cta': 'View Projects',
            'skills.title': 'Skills',
            'projects.title': 'My Projects',
            'project1.title': 'Shopping Mall Website',
            'project1.desc': 'Built a responsive shopping mall experience with HTML, CSS, and JavaScript.',
            'project2.title': 'Weather App',
            'project2.desc': 'Single-page app showing live weather data using public APIs.',
            'project3.title': 'Todo Manager',
            'project3.desc': 'Lightweight task manager that saves data via LocalStorage.',
            'project.cta': 'View Details',
        },
    };

    let currentLang = defaultLang;

    const applyLanguage = (lang) => {
        i18nElements.forEach((el) => {
            const key = el.dataset.i18n;
            if (!key) return;

            const text =
                lang === defaultLang
                    ? baseTexts[key]
                    : translations[lang]?.[key];

            if (text) el.textContent = text;
        });

        document.documentElement.lang = lang;
        langButtons.forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        currentLang = lang;
    };

    langButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang && lang !== currentLang) {
                applyLanguage(lang);
            }
        });
    });

    // Keep default language text from HTML; only change on explicit selection.
});
