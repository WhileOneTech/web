document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    injectEmailLink();
});

const THEME_STORAGE_KEY = 'whileone-theme';
const THEME_MODES = ['system', 'light', 'dark'];

function initThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const initialMode = getStoredThemeMode() || 'system';

    applyThemeMode(initialMode);

    if (!toggle) {
        return;
    }

    toggle.addEventListener('click', () => {
        const currentMode = document.documentElement.getAttribute('data-theme-mode') || 'system';
        const nextMode = getNextThemeMode(currentMode);

        persistThemeMode(nextMode);
        applyThemeMode(nextMode);
    });

    if (!mediaQuery) {
        return;
    }

    const syncWithSystem = () => {
        const activeMode = document.documentElement.getAttribute('data-theme-mode') || getStoredThemeMode() || 'system';

        if (activeMode === 'system') {
            applyThemeMode('system');
        }
    };

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', syncWithSystem);
        return;
    }

    mediaQuery.addListener(syncWithSystem);
}

function getStoredThemeMode() {
    try {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

        if (THEME_MODES.includes(storedTheme)) {
            return storedTheme;
        }
    } catch (error) {
        return null;
    }

    return null;
}

function getNextThemeMode(mode) {
    const currentMode = THEME_MODES.includes(mode) ? mode : 'system';
    const currentIndex = THEME_MODES.indexOf(currentMode);

    return THEME_MODES[(currentIndex + 1) % THEME_MODES.length];
}

function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
}

function persistThemeMode(mode) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, THEME_MODES.includes(mode) ? mode : 'system');
    } catch (error) {
        return;
    }
}

function resolveTheme(mode) {
    if (mode === 'dark') {
        return 'dark';
    }

    if (mode === 'light') {
        return 'light';
    }

    return getSystemTheme();
}

function applyThemeMode(mode) {
    const resolvedMode = THEME_MODES.includes(mode) ? mode : 'system';

    document.documentElement.setAttribute('data-theme-mode', resolvedMode);
    updateThemeToggle(resolvedMode);
    updateThemeColor(resolveTheme(resolvedMode));
}

function updateThemeToggle(mode) {
    const toggle = document.querySelector('.theme-toggle');

    if (!toggle) {
        return;
    }

    const modeLabels = {
        system: 'system',
        light: 'light',
        dark: 'dark'
    };
    const nextMode = getNextThemeMode(mode);
    const label = `Theme: ${modeLabels[mode]}. Switch to ${modeLabels[nextMode]} mode.`;

    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
}

function updateThemeColor(theme) {
    const themeColor = document.querySelector('meta[name="theme-color"]');

    if (!themeColor) {
        return;
    }

    themeColor.setAttribute('content', theme === 'dark' ? '#0b1526' : '#f6f8fb');
}

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
