document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fade-in animation for projects on scroll
    const projects = document.querySelectorAll('.project-card');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.2 // trigger when 20% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once the element is visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    projects.forEach(project => {
        project.classList.add('fade-in-element');
        observer.observe(project);
    });

    // Dark Mode Toggle Logic
    const modeToggleBtn = document.getElementById('mode-toggle');

    const enableDarkMode = () => {
        document.body.classList.add('dark-mode');
        modeToggleBtn.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    };

    const disableDarkMode = () => {
        document.body.classList.remove('dark-mode');
        modeToggleBtn.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    };

    // Check for user's saved preference, defaulting to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === null) {
        enableDarkMode();
    }

    modeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
});