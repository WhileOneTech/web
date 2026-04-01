document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    injectEmailLink();
});

function initMobileMenu() {
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelectorAll('.nav-links a');

    if (!nav || !toggle) {
        return;
    }

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('menu-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function injectEmailLink() {
    const mount = document.querySelector('#contact-email-mount');

    if (!mount) {
        return;
    }

    const user = String.fromCharCode(104, 101, 108, 108, 111);
    const host = ['whileone', 'se'].join(' dot ');
    mount.textContent = `Email: ${user} [at] ${host}`;
}
