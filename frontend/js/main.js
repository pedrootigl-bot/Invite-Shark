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

    function init() {
        initHeaderScroll();
        initMobileMenu();
        initCopyLink();
        initFaqAccordion();
        initNestedReveals();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
