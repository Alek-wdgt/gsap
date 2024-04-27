document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.js-home-slider-hero', {
        direction: 'vertical', // Set swiper direction to vertical
        loop: true,
        autoplay: {
            delay: 5000,
        },
        mousewheel: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        allowTouchMove: false,
        modules: [SwiperFadeEffect, SwiperMousewheel], // Include necessary modules
        on: {
            afterInit: function (swiper) {
                afterInit(swiper);
            },
            slideChange: function () {
                setActiveSlide(swiper.activeIndex);
                animateProgress(swiper.activeIndex, swiper);
                currentSlide = swiper.activeIndex;
            },
        },
    });

    function afterInit(swiper) {
        console.log('Swiper initialized');
        setActiveSlide(swiper.activeIndex);
        animateProgress(swiper.activeIndex, swiper);
    }

    function setActiveSlide(index) {
        const activeSlide = document.querySelector('.swiper-slide-active');
        const activeSlideIndex = Array.from(activeSlide.parentNode.children).indexOf(activeSlide);
        if (activeSlideIndex !== index) {
            activeSlide.classList.remove('swiper-slide-active');
            activeSlide.parentNode.children[index].classList.add('swiper-slide-active');
        }
    }

    function animateProgress(index, swiper) {
        const progressBar = document.querySelector('.swiper-progress-bar');
        const progress
            = (index + 1) * (100 / swiper.slides.length);
        progressBar.style.width = progress + '%';
    }

    swiper.init();
});
