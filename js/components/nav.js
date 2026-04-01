// Navigation Component
class Navigation {
    constructor() {
        this.nav = document.querySelector('nav');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => {
                this.navLinks.classList.toggle('active');
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navLinks && !this.nav.contains(e.target)) {
                this.navLinks.classList.remove('active');
            }
        });
        
        // Highlight active page
        this.highlightActivePage();
    }
    
    highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = this.navLinks.querySelectorAll('a');
        
        links.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.style.color = 'var(--color-accent)';
            }
        });
    }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Navigation());
} else {
    new Navigation();
}
