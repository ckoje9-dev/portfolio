document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar-collapse');
    const langButtons = document.querySelectorAll('[data-lang]');
    const i18nElements = document.querySelectorAll('[data-i18n]');

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('show')) {
                new bootstrap.Collapse(navbar).hide();
            }
        });
    });

    const translations = {
        ko: {
            'nav.about': 'About',
            'nav.skills': 'Skills',
            'nav.projects': 'Projects',
            'nav.contact': 'Contact',
            'hero.title': '안녕하세요, 김개발입니다',
            'hero.desc': '열정적인 웹 개발자를 꿈꾸는 정보통신공학과 학생입니다.',
            'hero.cta': '프로젝트 보기',
            'skills.title': 'Skills',
            'projects.title': 'My Projects',
            'project1.title': '쇼핑몰 웹사이트',
            'project1.desc': 'HTML, CSS, JavaScript를 활용한 반응형 쇼핑몰 프로젝트',
            'project2.title': '날씨 앱',
            'project2.desc': 'API 연동을 활용한 실시간 날씨 정보 제공 애플리케이션',
            'project3.title': '할 일 관리 앱',
            'project3.desc': '로컬 스토리지를 활용한 할 일 관리 애플리케이션',
            'project.cta': '자세히 보기',
        },
        en: {
            'nav.about': 'About',
            'nav.skills': 'Skills',
            'nav.projects': 'Projects',
            'nav.contact': 'Contact',
            'hero.title': "Hi, I'm Kim Dev",
            'hero.desc': 'Information & Communication Engineering student with a passion for web development.',
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

    let currentLang = 'ko';

    const applyLanguage = (lang) => {
        if (!translations[lang]) return;

        i18nElements.forEach((el) => {
            const key = el.dataset.i18n;
            const text = translations[lang][key];
            if (text) {
                el.textContent = text;
            }
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

    applyLanguage(currentLang);
});
