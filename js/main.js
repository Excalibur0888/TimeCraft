document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // Mobile menu
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav__list');
    const body = document.body;

    burger.addEventListener('click', function() {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });

    // Collections Tabs
    const tabs = document.querySelectorAll('.collections__tab');
    const panels = document.querySelectorAll('.collections__panel');

    // Устанавливаем начальное состояние
    if (tabs.length > 0 && panels.length > 0) {
        tabs[0].classList.add('active');
        panels[0].classList.add('active');
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Remove active classes
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and panel
            tab.classList.add('active');
            panels[index].classList.add('active');
        });
    });

    // Testimonials Slider
    class Slider {
        constructor(container) {
            this.container = container;
            this.track = container.querySelector('.testimonials__track');
            this.slides = Array.from(this.track.children);
            this.currentIndex = 0;
            
            // Set initial state
            this.updateSlides();
            this.createNavigation();
            this.startAutoplay();
            this.addTouchHandlers();
        }

        createNavigation() {
            const dots = document.createElement('div');
            dots.className = 'testimonials__dots';

            this.slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'testimonials__dot';
                dot.addEventListener('click', () => this.goToSlide(index));
                dots.appendChild(dot);
            });

            this.container.appendChild(dots);
            this.dots = Array.from(dots.children);
            this.updateDots();

            const prevButton = this.container.querySelector('.testimonials__button--prev');
            const nextButton = this.container.querySelector('.testimonials__button--next');

            prevButton?.addEventListener('click', () => this.prev());
            nextButton?.addEventListener('click', () => this.next());
        }

        updateSlides() {
            this.slides.forEach((slide, index) => {
                if (index === this.currentIndex) {
                    slide.classList.add('active');
                    slide.style.opacity = '1';
                } else {
                    slide.classList.remove('active');
                    slide.style.opacity = '0';
                }
            });
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            this.updateDots();
        }

        updateDots() {
            if (this.dots) {
                this.dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.currentIndex);
                });
            }
        }

        next() {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.updateSlides();
        }

        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.updateSlides();
        }

        goToSlide(index) {
            this.currentIndex = index;
            this.updateSlides();
        }

        startAutoplay() {
            this.autoplayInterval = setInterval(() => this.next(), 5000);
        }

        stopAutoplay() {
            clearInterval(this.autoplayInterval);
        }

        addTouchHandlers() {
            let startX = 0;
            let currentX = 0;

            this.container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                this.stopAutoplay();
            });

            this.container.addEventListener('touchmove', (e) => {
                currentX = e.touches[0].clientX;
            });

            this.container.addEventListener('touchend', () => {
                const diff = startX - currentX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) this.next();
                    else this.prev();
                }
                this.startAutoplay();
            });
        }
    }

    // Initialize slider
    const testimonialsContainer = document.querySelector('.testimonials__slider');
    if (testimonialsContainer) {
        new Slider(testimonialsContainer);
    }

    // Animate numbers
    function animateValue(element, start, end, duration) {
        if (start === end) return;
        
        const range = end - start;
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current + '+';
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // Observe numbers for animation
    const observeNumbers = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target;
                const finalValue = parseInt(numberElement.textContent.replace('+', ''));
                animateValue(numberElement, 0, finalValue, 2000);
                observer.unobserve(numberElement);
            }
        });
    };

    const numberObserver = new IntersectionObserver(observeNumbers, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    // Observe all number elements во всех секциях
    const numberElements = document.querySelectorAll('.craft-story__number, .benefits__number, .timeline__year');
    numberElements.forEach(number => {
        numberObserver.observe(number);
    });

    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline__item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.2
    });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Interactive Showcase
    const showcaseItems = document.querySelectorAll('.showcase__item');
    const cursor = document.querySelector('.showcase__cursor');
    const showcaseWrapper = document.querySelector('.showcase__wrapper');

    if (showcaseItems.length > 0 && cursor && showcaseWrapper) {
        showcaseItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                item.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                
                // Обновление позиции курсора
                cursor.style.opacity = '1';
                cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'perspective(2000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                cursor.style.opacity = '0';
            });
        });

        // Скрываем курсор при выходе за пределы showcase
        showcaseWrapper.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
    }
}); 