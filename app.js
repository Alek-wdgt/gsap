class HeaderAnimator {
    constructor(containerSelector, mouseSelector, imageSelector, cardHolderSelector, imageHeaderSelector, titleSelector) {
        this.container = document.querySelector(containerSelector);
        this.mouse = document.querySelector(mouseSelector);
        this.image = document.querySelector(imageSelector);
        this.imageHeader = document.querySelector(imageHeaderSelector);
        this.titleHeader = document.querySelector(titleSelector);
        this.cardHolder = document.querySelector(cardHolderSelector);
        this.parentDiv = this.container.parentElement;
        this.containerRect = this.container.getBoundingClientRect();
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastScrollTop = 0;
        this.resizing = false;
        this.imageExpanded = false;

        this.moveAnim = this.moveAnim.bind(this);
        this.updateMousePosition = this.updateMousePosition.bind(this);
        this.updateHalfwayPoint = this.updateHalfwayPoint.bind(this);
        this.resetImagePosition = this.resetImagePosition.bind(this);
        this.debouncedScroll = this.debouncedScroll.bind(this);
        this.throttledResize = this.throttledResize.bind(this);
        this.fadeTitle = this.fadeTitle.bind(this);
        this.fadeImage = this.fadeImage.bind(this);

        this.init();
    }

    init() {
        this.container.addEventListener('mousemove', this.moveAnim);
        window.addEventListener('scroll', this.debouncedScroll);
        window.addEventListener('resize', this.throttledResize);
        this.container.addEventListener('mouseleave', this.resetImagePosition);

        this.updateMousePosition();
        this.updateHalfwayPoint();
    }

    moveAnim(e) {
        this.mouseX = e.clientX - this.containerRect.left - this.mouse.clientWidth / 2;
        this.mouseY = e.clientY - this.containerRect.top - this.mouse.clientHeight / 2;
        this.mouseX = Math.min(this.containerRect.width - this.mouse.offsetWidth, Math.max(0, this.mouseX));
        this.mouseY = Math.min(this.containerRect.height - this.mouse.offsetHeight, Math.max(0, this.mouseY));
    }

    updateMousePosition() {
        const newX = this.mouseX;
        const newY = this.mouseY;
        gsap.to(this.mouse, {
            duration: 0.5,
            x: newX,
            y: newY,
            ease: 'easy.in',
        });
        requestAnimationFrame(this.updateMousePosition);
    }

    updateHalfwayPoint() {
        this.halfwayPoint = this.parentDiv.scrollHeight / 2;
    }

    resetImagePosition() {
        gsap.to(this.image, {
            duration: 0.5,
            x: 0,
            y: 0,
            ease: 'power3.out',
        });
    }

    debouncedScroll() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPosition = window.innerHeight + window.scrollY;

        if (!this.resizing) {
            if (st > this.lastScrollTop) {
                gsap.to(this.image, {
                    duration: 0.5,
                    ease: 'power3.in(0.75)',
                    width: '100%',
                    scale: 1.5,
                });
            } else {
                gsap.to(this.image, {
                    duration: 0.5,
                    ease: 'power3.out(0.75)',
                    width: '320px',
                    scale: 1,
                });
            }

            let titleOpacity = 0; // Default opacity until the scroll position condition is met
            if (scrollPosition >= this.parentDiv.scrollHeight / 2 && this.imageExpanded) {
                this.cardHolder.classList.add('fixed-top');
                gsap.to(window, { duration: 1, scrollTo: { y: '.section', offsetY: 100 } });
                titleOpacity = 1 - (scrollPosition / this.parentDiv.scrollHeight);

            } else {
                this.cardHolder.classList.remove('fixed-top');
                titleOpacity = 1 - (scrollPosition / this.parentDiv.scrollHeight);
                titleOpacity = Math.max(0, titleOpacity);s
            }

            this.fadeTitle(titleOpacity);
            this.fadeImage(titleOpacity);
        }

        this.lastScrollTop = st <= 0 ? 0 : st;
    }

    throttledResize() {
        this.containerRect = this.container.getBoundingClientRect();
        this.resizing = true;
        gsap.to(this.image, {
            duration: 0.5,
            width: this.container.clientWidth + 'px',
            scale: 1.1,
            ease: 'elastic.out',
            onComplete: () => {
                gsap.to(this.image, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.out',
                });
                gsap.set(this.image, { position: 'fixed', top: '50%', left: '0', transform: 'translate(-50%, -50%)' });
                this.resizing = false;
            }
        });
    }

    fadeTitle(opacity) {
        gsap.to(this.titleHeader, {
            duration: 0.5,
            opacity: opacity,
            ease: 'power3.out',
        });
    }

    fadeImage(opacity) {
        gsap.to(this.imageHeader, {
            duration: 0.5,
            opacity: opacity,
            ease: 'power3.out',
        });
    }
}

// Usage
const animator = new HeaderAnimator('.container', '.mouse', '.mouse img', '.card-holder', '.header__image', '.header__title');
