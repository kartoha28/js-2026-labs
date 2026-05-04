function createCarousel(selector, options = {}) {
    const container = document.querySelector(selector);
    if (!container) return;

    const settings = {
        slides: [],
        speed: 500,
        autoplay: false,
        autoplaySpeed: 3000,
        arrows: true,
        dots: true,
        ...options
    };

    let currentIndex = 0;
    let timer = null;
    let isHovered = false;

    let track = null;
    let prevBtn = null;
    let nextBtn = null;
    let pagination = null;
    let dots = [];

    function buildDOM() {
        track = document.createElement('div');
        track.className = 'carousel-track';
        track.style.transitionDuration = `${settings.speed}ms`;

        settings.slides.forEach(slideContent => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';

            if (slideContent.match(/\.(jpeg|jpg|gif|png|svg)$/i)) {
                slide.innerHTML = `<img src="${slideContent}" alt="slide">`;
            } else {
                slide.innerHTML = `<span>${slideContent}</span>`;
            }
            track.appendChild(slide);
        });
        container.appendChild(track);

        if (settings.arrows) {
            prevBtn = document.createElement('button');
            prevBtn.className = 'slider-arrow prev';
            prevBtn.innerHTML = '&#10094;';

            nextBtn = document.createElement('button');
            nextBtn.className = 'slider-arrow next';
            nextBtn.innerHTML = '&#10095;';

            container.appendChild(prevBtn);
            container.appendChild(nextBtn);
        }

        if (settings.dots) {
            pagination = document.createElement('div');
            pagination.className = 'slider-pagination';

            settings.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
                dot.dataset.index = index;
                pagination.appendChild(dot);
                dots.push(dot);
            });
            container.appendChild(pagination);
        }
    }

    function goToSlide(index) {
        const total = settings.slides.length;

        if (index < 0) {
            currentIndex = total - 1;
        } else if (index >= total) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    function next() { goToSlide(currentIndex + 1); }
    function prev() { goToSlide(currentIndex - 1); }

    function updateDots() {
        if (!settings.dots) return;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    function setupEvents() {
        if (settings.arrows) {
            prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
            nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
        }

        if (settings.dots) {
            pagination.addEventListener('click', (e) => {
                if (e.target.classList.contains('slider-dot')) {
                    goToSlide(parseInt(e.target.dataset.index));
                    resetAutoplay();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
            if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
        });

        if (settings.autoplay) {
            container.addEventListener('mouseenter', () => {
                isHovered = true;
                stopAutoplay();
            });
            container.addEventListener('mouseleave', () => {
                isHovered = false;
                startAutoplay();
            });
        }
    }

    function startAutoplay() {
        stopAutoplay();
        timer = setInterval(() => {
            if (!isHovered) next();
        }, settings.autoplaySpeed);
    }

    function stopAutoplay() {
        if (timer) clearInterval(timer);
    }

    function resetAutoplay() {
        if (settings.autoplay && !isHovered) {
            startAutoplay();
        }
    }

    buildDOM();
    setupEvents();
    if (settings.autoplay) {
        startAutoplay();
    }
}

createCarousel('#my-slider', {
    slides: [
        'Slide 1 (Текст)',
        'Slide 2 (Текст)',
        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
        'Slide 4 (Текст)'
    ],
    speed: 600,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: true
});