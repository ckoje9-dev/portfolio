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
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    const projectSection = document.getElementById('projects');
    const langBlocks = document.querySelectorAll('[data-lang-block]');

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
            'hero.desc': 'Passionate AI developer and architect.\nBased in Seoul.\n8+ years at Heerim and Midas IT.',
            'hero.cta': 'View Projects',
            'skills.title': 'Skills',
            'projects.title': 'My Projects',
            'project1.title': 'DWG-DXF Conversion, AI Analysis & Generation Platform',
            'project1.desc': 'Improve AI drawing task accuracy by analyzing CAD drawings in text form.',
            'project2.title': 'Bank AI Onboarding Platform',
            'project2.desc': 'AI counseling simulation, quiz learning, and chatbot for new bankers.',
            'project3.title': 'ArchiDesign / MidasCAD',
            'project3.desc': 'PM for CAD product family roadmap and feature delivery.',
            'project4.title': 'Kwangdong HQ Design (Gwacheon)',
            'project4.desc': 'Schematic & detailed design for the new HQ in Gwacheon Tech Valley.',
            'project5.title': 'Incheon Airport Phase 4 Aux Buildings',
            'project5.desc': 'Design and execution drawings for T2 long-term parking, ICT center, and more.',
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

        langBlocks.forEach((el) => {
            const shouldShow = el.dataset.langBlock === lang;
            el.classList.toggle('d-none', !shouldShow);
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
        const contentByLang = Array.from(card.querySelectorAll('.project-detail-content')).find(
            (c) => c.dataset.lang === currentLang
        );
        const finalContent = contentByLang || content;
        if (!finalContent) return;

        detailContainer.innerHTML = finalContent.innerHTML;

        detailWrapper.classList.remove('d-none');
        detailWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const carousels = detailContainer.querySelectorAll('.carousel');
        carousels.forEach((el, idx) => {
            try {
                const newId = `detail-carousel-${idx}`;
                el.id = newId;

                el.querySelectorAll('[data-bs-target]').forEach((btn) => {
                    btn.setAttribute('data-bs-target', `#${newId}`);
                });
                el.querySelectorAll('[data-bs-slide-to]').forEach((btn, i) => {
                    btn.setAttribute('data-bs-slide-to', i.toString());
                });

                const existing = bootstrap.Carousel.getInstance(el);
                if (existing) existing.dispose();
                new bootstrap.Carousel(el, { interval: false, ride: false });
            } catch (err) {
                // ignore if bootstrap not available
            }
        });

        scrollTopBtn?.classList.remove('d-none');
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

    scrollTopBtn?.addEventListener('click', () => {
        projectSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    window.addEventListener('scroll', () => {
        if (!scrollTopBtn || !projectSection) return;
        const threshold = projectSection.offsetTop + 50;
        if (window.scrollY >= threshold) {
            scrollTopBtn.classList.remove('d-none');
        } else {
            scrollTopBtn.classList.add('d-none');
        }
    });

    // Keep default language text from HTML; only change on explicit selection.
});
