(() => {
    "use strict";

    const header = document.getElementById("navbar");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileNav = document.getElementById("mobile-navigation");
    const navOverlay = document.getElementById("nav-overlay");
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function initHeaderScroll() {
        if (!header) return;

        const onScroll = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 18);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

   function setMenuOpen(isOpen) {
    if (!menuToggle || !mobileNav) return;

    const shouldOpen = Boolean(isOpen) && window.innerWidth <= 900;

    mobileNav.classList.toggle("is-open", shouldOpen);
    mobileNav.hidden = !shouldOpen;

    menuToggle.classList.toggle("is-active", shouldOpen);

    menuToggle.setAttribute(
        "aria-expanded",
        String(shouldOpen)
    );

    menuToggle.setAttribute(
        "aria-label",
        shouldOpen ? "Fechar menu" : "Abrir menu"
    );

    document.body.classList.toggle(
        "menu-open",
        shouldOpen
    );

    if (navOverlay) {
        navOverlay.classList.toggle(
            "is-open",
            shouldOpen
        );

        navOverlay.hidden = !shouldOpen;
    }
}


function initMobileMenu() {
    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener("click", () => {
        const isOpen =
            mobileNav.classList.contains("is-open");

        setMenuOpen(!isOpen);
    });


    /* =========================================
       FECHAR AO CLICAR NO OVERLAY
    ========================================= */

    navOverlay?.addEventListener("click", () => {
        setMenuOpen(false);

        menuToggle.focus();
    });


    /* =========================================
       FECHAR AO CLICAR EM UM LINK
    ========================================= */

    mobileNav
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener("click", () => {
                setMenuOpen(false);
            });

        });


    /* =========================================
       ESC FECHA O MENU
    ========================================= */

    window.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") return;

        if (!mobileNav.classList.contains("is-open")) {
            return;
        }

        setMenuOpen(false);

        menuToggle.focus();

    });


    /* =========================================
       RESIZE
    ========================================= */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {
                setMenuOpen(false);
            }

        },
        { passive: true }
    );
}

    function initCopyLink() {
        const copyButton = document.querySelector(".link-box button");
        if (!copyButton) return;

        copyButton.addEventListener("click", async () => {
            const value = copyButton
                .closest(".link-box")
                ?.querySelector("span")
                ?.textContent?.trim();

            if (!value || !navigator.clipboard) return;

            try {
                await navigator.clipboard.writeText(value);
                const icon = copyButton.querySelector("i");
                if (!icon) return;

                icon.className = "fa-solid fa-check";
                window.setTimeout(() => {
                    icon.className = "fa-solid fa-copy";
                }, 1400);
            } catch {
                /* silently ignore clipboard errors */
            }
        });
    }

    function setFaqBodyHeight(body, open) {
        if (!body) return;

        if (prefersReducedMotion) {
            body.style.height = open ? "auto" : "0px";
            return;
        }

        if (open) {
            body.style.height = "0px";
            requestAnimationFrame(() => {
                body.style.height = `${body.scrollHeight}px`;
            });
            return;
        }

        body.style.height = `${body.scrollHeight}px`;
        requestAnimationFrame(() => {
            body.style.height = "0px";
        });
    }

    function closeFaqItem(item) {
        const body = item.querySelector(".faq-item__body");

        item.classList.remove("is-open");
        setFaqBodyHeight(body, false);

        const onEnd = (event) => {
            if (event.propertyName !== "height") return;
            item.open = false;
            body?.removeEventListener("transitionend", onEnd);
        };

        if (prefersReducedMotion || !body) {
            item.open = false;
            return;
        }

        body.addEventListener("transitionend", onEnd);
    }

    function openFaqItem(item) {
        const body = item.querySelector(".faq-item__body");

        item.open = true;
        item.classList.add("is-open");
        setFaqBodyHeight(body, true);

        if (!body || prefersReducedMotion) {
            if (body) body.style.height = "auto";
            return;
        }

        const onEnd = (event) => {
            if (event.propertyName !== "height") return;
            if (item.classList.contains("is-open")) {
                body.style.height = "auto";
            }
            body.removeEventListener("transitionend", onEnd);
        };

        body.addEventListener("transitionend", onEnd);
    }

    function initFaqAccordion() {
        const items = Array.from(document.querySelectorAll(".faq-item"));
        if (!items.length) return;

        items.forEach((item) => {
            const summary = item.querySelector("summary");
            const body = item.querySelector(".faq-item__body");
            if (!summary || !body) return;

            body.style.height = "0px";

            summary.addEventListener("click", (event) => {
                event.preventDefault();

                const isOpen = item.classList.contains("is-open");

                items.forEach((other) => {
                    if (other !== item && other.classList.contains("is-open")) {
                        closeFaqItem(other);
                    }
                });

                if (isOpen) {
                    closeFaqItem(item);
                } else {
                    openFaqItem(item);
                }
            });
        });

        window.addEventListener(
            "resize",
            () => {
                items.forEach((item) => {
                    if (!item.classList.contains("is-open")) return;
                    const body = item.querySelector(".faq-item__body");
                    if (!body) return;
                    body.style.height = "auto";
                    const height = body.scrollHeight;
                    body.style.height = `${height}px`;
                });
            },
            { passive: true }
        );
    }

    function initNestedReveals() {
        document.querySelectorAll(".qualified__criteria").forEach((group) => {
            Array.from(group.children).forEach((child, index) => {
                child.style.setProperty("--reveal-delay", `${120 + index * 90}ms`);
            });
        });
    }

    function initStepsCarousel() {
        const root = document.querySelector("[data-steps-carousel]");
        if (!root) return;

        const viewport = root.querySelector("[data-steps-viewport]");
        const track = root.querySelector("[data-steps-track]");
        const prevBtn = root.querySelector("[data-steps-prev]");
        const nextBtn = root.querySelector("[data-steps-next]");
        const dotsRoot = root.querySelector("[data-steps-dots]");
        const cards = Array.from(root.querySelectorAll(".step-card"));

        if (!viewport || !track || !cards.length) return;

        const AUTO_MS = 4200;
        let index = 0;
        let visible = 1;
        let maxIndex = 0;
        let pointerId = null;
        let startX = 0;
        let deltaX = 0;
        let dragging = false;
        let autoTimer = 0;
        let paused = false;

        function getVisibleCount() {
            const raw = getComputedStyle(root)
                .getPropertyValue("--steps-visible")
                .trim();
            const parsed = Number.parseInt(raw, 10);
            return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
        }

        function getStepSize() {
            const card = cards[0];
            if (!card) return 0;

            const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
            return card.getBoundingClientRect().width + gap;
        }

        function wrapIndex(value) {
            if (maxIndex <= 0) return 0;
            const total = maxIndex + 1;
            return ((value % total) + total) % total;
        }

        function renderDots() {
            if (!dotsRoot) return;

            const pageCount = maxIndex + 1;
            dotsRoot.innerHTML = "";

            for (let i = 0; i < pageCount; i += 1) {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = "steps-carousel__dot";
                dot.setAttribute("role", "tab");
                dot.setAttribute("aria-label", `Ir para o passo ${i + 1}`);
                dot.addEventListener("click", () => {
                    goTo(i);
                    restartAutoplay();
                });
                dotsRoot.appendChild(dot);
            }
        }

        function updateUI() {
            const offset = getStepSize() * index;
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;

            if (prevBtn) prevBtn.disabled = maxIndex <= 0;
            if (nextBtn) nextBtn.disabled = maxIndex <= 0;

            if (dotsRoot) {
                Array.from(dotsRoot.children).forEach((dot, i) => {
                    const active = i === index;
                    dot.classList.toggle("is-active", active);
                    dot.setAttribute("aria-selected", String(active));
                });
            }
        }

        function goTo(nextIndex) {
            index = wrapIndex(nextIndex);
            updateUI();
        }

        function stopAutoplay() {
            window.clearInterval(autoTimer);
            autoTimer = 0;
        }

        function startAutoplay() {
            stopAutoplay();

            if (
                prefersReducedMotion ||
                paused ||
                dragging ||
                maxIndex <= 0 ||
                document.hidden
            ) {
                return;
            }

            autoTimer = window.setInterval(() => {
                goTo(index + 1);
            }, AUTO_MS);
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        function setPaused(nextPaused) {
            paused = nextPaused;

            if (paused) {
                stopAutoplay();
                return;
            }

            startAutoplay();
        }

        function refresh() {
            visible = getVisibleCount();
            maxIndex = Math.max(0, cards.length - visible);
            index = wrapIndex(index);
            renderDots();
            updateUI();
            restartAutoplay();
        }

        prevBtn?.addEventListener("click", () => {
            goTo(index - 1);
            restartAutoplay();
        });

        nextBtn?.addEventListener("click", () => {
            goTo(index + 1);
            restartAutoplay();
        });

        viewport.addEventListener(
            "pointerdown",
            (event) => {
                if (event.pointerType === "mouse" && event.button !== 0) return;

                pointerId = event.pointerId;
                startX = event.clientX;
                deltaX = 0;
                dragging = true;
                root.classList.add("is-dragging");
                stopAutoplay();

                try {
                    viewport.setPointerCapture(pointerId);
                } catch (_) {
                    /* ignore */
                }
            },
            { passive: true }
        );

        viewport.addEventListener(
            "pointermove",
            (event) => {
                if (!dragging || event.pointerId !== pointerId) return;

                deltaX = event.clientX - startX;
                const offset = getStepSize() * index - deltaX;
                track.style.transform = `translate3d(${-offset}px, 0, 0)`;
            },
            { passive: true }
        );

        function endDrag(event) {
            if (!dragging || event.pointerId !== pointerId) return;

            dragging = false;
            root.classList.remove("is-dragging");

            const threshold = Math.min(80, Math.max(36, getStepSize() * 0.22));

            if (deltaX > threshold) {
                goTo(index - 1);
            } else if (deltaX < -threshold) {
                goTo(index + 1);
            } else {
                updateUI();
            }

            pointerId = null;
            deltaX = 0;
            restartAutoplay();
        }

        viewport.addEventListener("pointerup", endDrag);
        viewport.addEventListener("pointercancel", endDrag);

        root.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goTo(index - 1);
                restartAutoplay();
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                goTo(index + 1);
                restartAutoplay();
            }
        });

        root.addEventListener("mouseenter", () => setPaused(true));
        root.addEventListener("mouseleave", () => setPaused(false));
        root.addEventListener("focusin", () => setPaused(true));
        root.addEventListener("focusout", (event) => {
            if (!root.contains(event.relatedTarget)) {
                setPaused(false);
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopAutoplay();
                return;
            }

            startAutoplay();
        });

        let resizeTimer = 0;
        window.addEventListener(
            "resize",
            () => {
                window.clearTimeout(resizeTimer);
                resizeTimer = window.setTimeout(refresh, 120);
            },
            { passive: true }
        );

        refresh();
    }

    function init() {
        initHeaderScroll();
        initMobileMenu();
        initCopyLink();
        initFaqAccordion();
        initNestedReveals();
        initStepsCarousel();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
