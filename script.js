document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar-collapse');

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('show')) {
                new bootstrap.Collapse(navbar).hide();
            }
        });
    });
});
