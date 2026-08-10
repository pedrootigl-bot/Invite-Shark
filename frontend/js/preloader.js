(() => {
    "use strict";

    const preloader = document.getElementById("preloader");
    if (!preloader) {
        document.body.classList.remove("is-loading");
        document.dispatchEvent(new CustomEvent("preloader:done"));
        return;
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let finished = false;

    function finishPreloader() {
        if (finished) return;
        finished = true;

        document.body.classList.remove("is-loading");
        document.dispatchEvent(new CustomEvent("preloader:done"));
        preloader.remove();
    }

    function exitPreloader() {
        preloader.classList.add("is-exit");

        const onEnd = (event) => {
            if (event.propertyName !== "transform") return;
            preloader.removeEventListener("transitionend", onEnd);
            finishPreloader();
        };

        preloader.addEventListener("transitionend", onEnd);
        window.setTimeout(finishPreloader, 1100);
    }

    function runPreloader() {
        if (prefersReducedMotion) {
            finishPreloader();
            return;
        }

        requestAnimationFrame(() => {
            preloader.classList.add("is-ready");
        });

        window.setTimeout(() => {
            preloader.classList.add("is-curve");
        }, 1400);

        window.setTimeout(exitPreloader, 2600);
    }

    if (document.fonts && document.fonts.ready) {
        Promise.race([
            document.fonts.ready,
            new Promise((resolve) => window.setTimeout(resolve, 1200)),
        ]).then(runPreloader);
    } else {
        window.setTimeout(runPreloader, 80);
    }
})();
