document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar-collapse');
    const langButtons = document.querySelectorAll('[data-lang]');
    const i18nElements = document.querySelectorAll('[data-i18n]');
    const defaultLang = 'ko';
    const projectButtons = document.querySelectorAll('.project-detail-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const detailWrapper = document.getElementById('project-detail');
    const detailContainer = document.getElementById('detail-container');

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
            'hero.desc': 'Passionate AI developer and architect.\nBased in Seoul.\nFormerly at Heerim and Midas IT for 8+ years.',
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

    const renderDetail = (btn) => {
        if (!detailWrapper || !detailContainer) return;

        const card = btn.closest('.project-card');
        if (!card) return;

        projectCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');

        const content = card.querySelector('.project-detail-content');
        if (!content) return;

        detailContainer.innerHTML = content.innerHTML;

        detailWrapper.classList.remove('d-none');
        detailWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    projectButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            renderDetail(btn);
        });
    });

    // Anchor navigation inside project detail (smooth scroll)
    detailContainer?.addEventListener('click', (e) => {
        const target = e.target.closest('a[href^="#"]');
        if (!target) return;
        const href = target.getAttribute('href');
        if (!href || href.length < 2) return;

        const anchor = detailContainer.querySelector(href);
        if (anchor) {
            e.preventDefault();
            anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Keep default language text from HTML; only change on explicit selection.
});
