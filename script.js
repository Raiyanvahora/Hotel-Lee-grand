/* ===================================================
   Hotel Lee Grand — Website Interactions
   =================================================== */

(function () {
    'use strict';

    // --- Sticky Header ---
    const header = document.getElementById('siteHeader');
    let lastScroll = 0;

    function handleScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Mobile Navigation ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleNav() {
        const isOpen = mainNav.classList.toggle('open');
        menuToggle.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    }

    function closeNav() {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('nav-open');
    }

    menuToggle.addEventListener('click', toggleNav);
    overlay.addEventListener('click', closeNav);

    // Close nav on link click
    mainNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeNav);
    });

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = header.offsetHeight + 16;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // --- Scroll Reveal ---
    var reveals = document.querySelectorAll('.reveal');

    function checkReveal() {
        var windowHeight = window.innerHeight;
        reveals.forEach(function (el) {
            var top = el.getBoundingClientRect().top;
            if (top < windowHeight - 80) {
                el.classList.add('revealed');
            }
        });
    }

    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('load', checkReveal);
    checkReveal();

    // --- Gallery Lightbox ---
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var galleryItems = document.querySelectorAll('.gallery-item');
    var galleryImages = [];
    var currentIndex = 0;

    galleryItems.forEach(function (item, i) {
        var img = item.querySelector('img');
        galleryImages.push({ src: img.src, alt: img.alt });
        item.addEventListener('click', function () {
            currentIndex = i;
            openLightbox(currentIndex);
        });
    });

    function openLightbox(index) {
        lightboxImg.src = galleryImages[index].src;
        lightboxImg.alt = galleryImages[index].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.querySelector('.lightbox-prev').addEventListener('click', function (e) {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentIndex);
    });

    document.querySelector('.lightbox-next').addEventListener('click', function (e) {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryImages.length;
        openLightbox(currentIndex);
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox(currentIndex);
        }
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            openLightbox(currentIndex);
        }
    });

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = this.parentElement;
            var isActive = item.classList.contains('active');

            // Close all others
            document.querySelectorAll('.faq-item.active').forEach(function (openItem) {
                openItem.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Active nav highlighting on scroll ---
    var sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        var scrollY = window.scrollY + header.offsetHeight + 100;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            var link = mainNav.querySelector('a[href="#' + id + '"]');

            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.style.color = 'var(--color-text)';
                } else {
                    link.style.color = '';
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    // --- Mobile Slider Dots ---
    function initSliderDots(sliderSelector, dotContainerId, itemSelector) {
        var slider = document.querySelector(sliderSelector);
        if (!slider) return;

        function isMobile() {
            return window.innerWidth <= 768;
        }

        // Create dot container
        var dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        dotsContainer.id = dotContainerId;
        slider.parentNode.insertBefore(dotsContainer, slider.nextSibling);

        function buildDots() {
            dotsContainer.innerHTML = '';
            if (!isMobile()) {
                dotsContainer.style.display = 'none';
                return;
            }
            dotsContainer.style.display = 'flex';

            var items = slider.querySelectorAll(itemSelector);
            var totalDots = Math.min(items.length, 8);
            for (var i = 0; i < totalDots; i++) {
                var dot = document.createElement('button');
                dot.className = 'slider-dot';
                dot.setAttribute('aria-label', 'Slide ' + (i + 1));
                dot.dataset.index = i;
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', function () {
                    var idx = parseInt(this.dataset.index);
                    var target = items[idx];
                    if (target) {
                        slider.scrollTo({ left: target.offsetLeft - slider.offsetLeft, behavior: 'smooth' });
                    }
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            if (!isMobile()) return;
            var items = slider.querySelectorAll(itemSelector);
            var dots = dotsContainer.querySelectorAll('.slider-dot');
            if (!dots.length) return;

            var scrollLeft = slider.scrollLeft;
            var activeIndex = 0;
            var minDist = Infinity;

            for (var i = 0; i < items.length && i < dots.length; i++) {
                var dist = Math.abs(items[i].offsetLeft - slider.offsetLeft - scrollLeft);
                if (dist < minDist) {
                    minDist = dist;
                    activeIndex = i;
                }
            }

            dots.forEach(function (d, i) {
                d.classList.toggle('active', i === activeIndex);
            });
        }

        slider.addEventListener('scroll', updateDots, { passive: true });
        window.addEventListener('resize', buildDots);
        buildDots();
    }

    // Initialize dots for each slider section
    initSliderDots('.reviews-grid', 'reviews-dots', '.review-card');
    initSliderDots('.amenities-grid', 'amenities-dots', '.amenity-item');

})();
