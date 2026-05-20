(function () {
    'use strict';
    
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    function flashClass(el, cls, duration = 500) {
        el.classList.add(cls);
        setTimeout(() => el.classList.remove(cls), duration);
    }

    const modal         = document.getElementById('boardModal');
    const cancelBtn     = document.getElementById('cancelBtn');
    const submitBtn     = document.getElementById('submitBtn');
    const selectWrapper = document.getElementById('boardSelectWrapper');
    const selectTrigger = document.getElementById('boardSelectTrigger');
    const boardOptions  = document.getElementById('boardOptions');
    const boardInput    = document.getElementById('boardSelect');

    function dismissModal() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    cancelBtn?.addEventListener('click', dismissModal);

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) dismissModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') dismissModal();
    });

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const clientHeight = window.innerHeight || document.documentElement.clientHeight;
        
        const scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        const maxScroll = Math.max(0, scrollHeight - clientHeight);
        
        const footer = document.querySelector('.site-footer');
        const fadeDistance = footer ? footer.offsetHeight + 80 : 250;
        const fadeStartPx = Math.max(0, maxScroll - fadeDistance);
        
        let fadeFraction = 0;
        if (maxScroll > 0 && scrollTop >= fadeStartPx) {
            fadeFraction = (scrollTop - fadeStartPx) / (maxScroll - fadeStartPx);
        }
        
        if (maxScroll > 0 && maxScroll - scrollTop <= 20) {
            fadeFraction = 1;
        }
        
        fadeFraction = Math.max(0, Math.min(1, fadeFraction));

        // Show modal when page is 70% faded
        if (modal) {
            modal.style.opacity = '';
            modal.style.pointerEvents = '';
            modal.style.transition = '';
            
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = '';
                modalContent.style.transition = '';
            }

            if (fadeFraction >= 0.7) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Optional: lock scroll once open
            } else {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }, { passive: true });

    window.dispatchEvent(new Event('scroll'));

    selectTrigger?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = selectWrapper.classList.toggle('open');
        selectTrigger.setAttribute('aria-expanded', isOpen);
    });

    boardOptions?.querySelectorAll('.custom-option').forEach((opt) => {
        opt.addEventListener('click', () => {
            const value = opt.dataset.value;
            const text  = opt.textContent.trim();

            if (boardInput) boardInput.value = value;

            const label = selectTrigger?.querySelector('span');
            if (label) label.textContent = text;

            boardOptions.querySelectorAll('.custom-option').forEach((o) => {
                o.classList.remove('selected');
                o.setAttribute('aria-selected', 'false');
            });

            opt.classList.add('selected');
            opt.setAttribute('aria-selected', 'true');

            setTimeout(() => {
                selectWrapper.classList.remove('open');
                selectTrigger.setAttribute('aria-expanded', 'false');
            }, 150);
        });
    });

    document.addEventListener('click', (e) => {
        if (selectWrapper && !selectWrapper.contains(e.target)) {
            selectWrapper.classList.remove('open');
            selectTrigger?.setAttribute('aria-expanded', 'false');
        }
    });

    submitBtn?.addEventListener('click', () => {
        const board = boardInput?.value;

        if (!board) {
            flashClass(selectTrigger, 'shake', 450);
            return;
        }
        else {
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Loading...';
            submitBtn.style.opacity = '0.8';
            submitBtn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                window.location.href = `/study?grade=12&board=${encodeURIComponent(board)}`;
            }, 400);
        }
    });

    window.addEventListener('pageshow', (e) => {
        if (e.persisted && submitBtn) {
            submitBtn.innerHTML = 'Continue';
            submitBtn.style.opacity = '';
            submitBtn.style.pointerEvents = '';
        }
    });

    const revealTargets = document.querySelectorAll(
        '.feature-item, .section-cta, .chalk-divider'
    );

    if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        revealTargets.forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.08}s`;
            revealObs.observe(el);
        });
    } else {
        revealTargets.forEach((el) => el.classList.add('visible'));
    }

    const navbar = document.querySelector('.navbar');

    if (navbar) {
        const onScroll = () => {
            if (window.scrollY > 12) {
                navbar.style.boxShadow = '0 2px 0 rgba(0,0,0,0.10)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    (function setupSwipeDismiss() {
        const content = modal?.querySelector('.modal-content');
        if (!content) return;

        let startY     = 0;
        let isDragging = false;

        content.addEventListener(
            'touchstart',
            (e) => {
                startY     = e.touches[0].clientY;
                isDragging = true;
            },
            { passive: true }
        );

        content.addEventListener(
            'touchmove',
            (e) => {
                if (!isDragging) return;

                const dy = e.touches[0].clientY - startY;

                if (dy > 0) {
                    content.style.transition = 'none';
                    content.style.transform  = `translateY(${dy}px)`;
                }
            },
            { passive: true }
        );

        content.addEventListener('touchend', (e) => {
            if (!isDragging) return;

            isDragging = false;

            const dy = e.changedTouches[0].clientY - startY;

            content.style.transition = '';
            content.style.transform  = '';

            if (dy > 120) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    })();

    document.querySelectorAll('.feature-item').forEach((card) => {
        card.addEventListener('pointerdown', () => {
            card.style.filter = 'brightness(0.97)';
        });

        card.addEventListener('pointerup', () => {
            card.style.filter = '';
        });

        card.addEventListener('pointerleave', () => {
            card.style.filter = '';
        });
    });

    const logoX = document.querySelector('.logo-x');

    logoX?.addEventListener('click', () => {
        flashClass(logoX, 'shake', 420);
    });

    function wrapLettersAndWords(el) {
        Array.from(el.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;

                if (!text.trim() && text.includes('\n')) return;

                const fragment = document.createDocumentFragment();
                let currentWordSpan = null;

                for (let i = 0; i < text.length; i++) {
                    const char = text[i];

                    if (char === ' ' || char === '\n' || char === '\t') {
                        currentWordSpan = null;
                        fragment.appendChild(document.createTextNode(char));
                    } else {
                        if (!currentWordSpan) {
                            currentWordSpan = document.createElement('span');
                            currentWordSpan.className = 'type-word';
                            currentWordSpan.style.whiteSpace = 'nowrap';
                            fragment.appendChild(currentWordSpan);
                        }

                        const span = document.createElement('span');
                        span.textContent = char;
                        span.className = 'type-letter';

                        currentWordSpan.appendChild(span);
                    }
                }

                node.parentNode.replaceChild(fragment, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                wrapLettersAndWords(node);
            }
        });
    }

    const typeTargets = document.querySelectorAll(
        '.hero-headline, .footer-tagline'
    );

    typeTargets.forEach((target) => {
        if (!target) return;

        target.style.opacity = '1';
        target.style.animation = 'none';

        wrapLettersAndWords(target);

        const letters = target.querySelectorAll('.type-letter');

        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.classList.add('typed');
            }, index * 60 + 300);
        });
    });
})();