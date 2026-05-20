(function () {
    'use strict';

    // Prevent scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Elements
    const brandHeading      = document.getElementById('brandHeading');
    const highlightTarget   = document.getElementById('highlightTarget');
    const subtitle          = document.querySelector('.brand-subtitle');
    const heroBadge         = document.querySelector('.hero-badge');
    const primaryHero       = document.getElementById('primaryHero');
    const boardContainer    = document.getElementById('boardSelectionContainer');
    const continueBtn       = document.getElementById('continueBtn');
    const logosRow          = document.querySelector('.logos-row');

    // Helper: Recursively wrap letters inside elements in spans of class 'char'
    function wrapTextInSpans(element) {
        const nodes = Array.from(element.childNodes);
        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                // Skip empty newline/whitespace nodes
                if (!text.trim() && text.includes('\n')) return;
                
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < text.length; i++) {
                    const char = text[i];
                    if (char === ' ') {
                        fragment.appendChild(document.createTextNode(' '));
                    } else {
                        const span = document.createElement('span');
                        span.textContent = char;
                        span.className = 'char';
                        fragment.appendChild(span);
                    }
                }
                node.parentNode.replaceChild(fragment, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                wrapTextInSpans(node);
            }
        });
    }

    // Initialize typewriter preparation
    if (brandHeading) {
        wrapTextInSpans(brandHeading);
        
        const chars = brandHeading.querySelectorAll('.char');
        let charIndex = 0;
        const typingSpeed = 95; // ms per letter

        // Typing loop function
        const typeNextChar = () => {
            if (charIndex < chars.length) {
                // Trigger logo fade-in once 40% of characters have been typed
                const threshold = Math.floor(chars.length * 0.4);
                if (charIndex === threshold && logosRow) {
                    logosRow.classList.add('show');
                }

                chars[charIndex].classList.add('typed');
                charIndex++;
                setTimeout(typeNextChar, typingSpeed + (Math.random() * 24 - 12));
            } else {
                finishTypingBrand();
            }
        };

        // Start typing immediately after a short load buffer (500ms)
        setTimeout(typeNextChar, 500);
    }

    function finishTypingBrand() {
        // Show the hero-badge and the subtitle
        if (heroBadge) {
            heroBadge.classList.add('show');
        }
        if (subtitle) {
            subtitle.classList.add('show');
        }

        // Trigger highlighter drawing shortly after subtitle has faded in
        setTimeout(() => {
            if (highlightTarget) {
                highlightTarget.classList.add('active');
            }
        }, 150);

        // Transition starts exactly 2 seconds (2000ms) after typing is complete
        setTimeout(transitionToBoardSelection, 2000);
    }

    function transitionToBoardSelection() {
        if (primaryHero && boardContainer) {
            // Slowly fade out primary hero in 5 seconds
            primaryHero.classList.add('fade-out');
            
            // Wait until 60% of the fade is out (3 seconds of 5 seconds) to start fading in board selection
            setTimeout(() => {
                boardContainer.classList.add('fade-in');
            }, 3000);
        }
    }

    // --- BOARD SELECTION LOGIC ---
    const boardCards = document.querySelectorAll('.board-card');
    const boardInput = document.getElementById('selectedBoardInput');

    boardCards.forEach(card => {
        card.addEventListener('click', () => {
            // Clear current selection
            boardCards.forEach(c => c.classList.remove('selected'));
            
            // Select clicked card
            card.classList.add('selected');
            const boardValue = card.dataset.value;
            
            if (boardInput) {
                boardInput.value = boardValue;
            }
            
            // Enable continue button
            if (continueBtn) {
                continueBtn.removeAttribute('disabled');
            }
        });
    });

    // Handle submit / continue
    continueBtn?.addEventListener('click', () => {
        const board = boardInput?.value;
        if (!board) {
            boardContainer.classList.add('shake');
            setTimeout(() => boardContainer.classList.remove('shake'), 450);
            return;
        }

        // Show loading spinner
        continueBtn.innerHTML = '<span class="loading-spinner"></span> Loading Classroom...';
        continueBtn.style.pointerEvents = 'none';
        continueBtn.style.opacity = '0.8';

        // Redirect to study path
        setTimeout(() => {
            window.location.href = `/study?grade=12&board=${encodeURIComponent(board)}`;
        }, 600);
    });

})();