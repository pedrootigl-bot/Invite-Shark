(() => {
    "use strict";

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const COLORS = {
        blue: "53, 167, 255",
        blueDeep: "22, 119, 255",
        purple: "139, 92, 246",
        gold: "247, 200, 75",
        white: "245, 247, 255",
    };

    function resizeCanvas(canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        return { ctx, width, height, dpr };
    }

    /* -------------------------------------------------------
       STARDUST — partículas flutuantes no fundo do hero
    ------------------------------------------------------- */
    function initStardust(canvas) {
        if (!canvas || prefersReducedMotion) return () => {};

        let particles = [];
        let width = 0;
        let height = 0;
        let ctx = null;
        let raf = 0;
        let running = true;

        function createParticles() {
            const count = Math.min(140, Math.floor((width * height) / 9000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.6 + 0.3,
                speedY: Math.random() * 0.25 + 0.05,
                speedX: (Math.random() - 0.5) * 0.15,
                alpha: Math.random() * 0.55 + 0.15,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                tone: Math.random() > 0.78 ? COLORS.gold : COLORS.white,
            }));
        }

        function resize() {
            ({ ctx, width, height } = resizeCanvas(canvas));
            createParticles();
        }

        function draw() {
            if (!running) return;

            ctx.clearRect(0, 0, width, height);

            for (const p of particles) {
                p.y -= p.speedY;
                p.x += p.speedX;
                p.twinkle += p.twinkleSpeed;

                if (p.y < -4) {
                    p.y = height + 4;
                    p.x = Math.random() * width;
                }

                if (p.x < -4) p.x = width + 4;
                if (p.x > width + 4) p.x = -4;

                const a = p.alpha * (0.55 + 0.45 * Math.sin(p.twinkle));
                ctx.beginPath();
                ctx.fillStyle = `rgba(${p.tone}, ${a})`;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            raf = requestAnimationFrame(draw);
        }

        resize();
        draw();

        return () => {
            running = false;
            cancelAnimationFrame(raf);
        };
    }

    /* -------------------------------------------------------
       STARBURST — rastros radiais atrás do visual
    ------------------------------------------------------- */
    function initStarburst(canvas) {
        if (!canvas || prefersReducedMotion) return () => {};

        let streaks = [];
        let width = 0;
        let height = 0;
        let ctx = null;
        let raf = 0;
        let running = true;

        function createStreaks() {
            const count = Math.min(90, Math.floor((width * height) / 7000));
            streaks = Array.from({ length: count }, () => resetStreak({}));
        }

        function resetStreak(streak) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2.8 + 0.8;
            const toneRoll = Math.random();

            streak.x = width * 0.5;
            streak.y = height * 0.55;
            streak.vx = Math.cos(angle) * speed;
            streak.vy = Math.sin(angle) * speed;
            streak.life = 0;
            streak.maxLife = Math.random() * 70 + 40;
            streak.width = Math.random() * 1.4 + 0.4;
            streak.tone =
                toneRoll > 0.82
                    ? COLORS.gold
                    : toneRoll > 0.45
                      ? COLORS.blue
                      : COLORS.white;

            return streak;
        }

        function resize() {
            ({ ctx, width, height } = resizeCanvas(canvas));
            createStreaks();
        }

        function draw() {
            if (!running) return;

            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = "lighter";

            for (const s of streaks) {
                s.x += s.vx;
                s.y += s.vy;
                s.life += 1;
                s.vx *= 1.012;
                s.vy *= 1.012;

                const progress = s.life / s.maxLife;
                const alpha = Math.max(0, 1 - progress) * 0.55;
                const len = 8 + progress * 28;

                const nx = s.vx / (Math.hypot(s.vx, s.vy) || 1);
                const ny = s.vy / (Math.hypot(s.vx, s.vy) || 1);

                ctx.beginPath();
                ctx.strokeStyle = `rgba(${s.tone}, ${alpha})`;
                ctx.lineWidth = s.width;
                ctx.lineCap = "round";
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - nx * len, s.y - ny * len);
                ctx.stroke();

                if (
                    s.life >= s.maxLife ||
                    s.x < -40 ||
                    s.x > width + 40 ||
                    s.y < -40 ||
                    s.y > height + 40
                ) {
                    resetStreak(s);
                }
            }

            ctx.globalCompositeOperation = "source-over";
            raf = requestAnimationFrame(draw);
        }

        resize();
        draw();

        return () => {
            running = false;
            cancelAnimationFrame(raf);
        };
    }

    /* -------------------------------------------------------
       PIXEL ORB — esfera com matriz digital (Pixel Card)
    ------------------------------------------------------- */
    function initPixelOrb(canvas) {
        if (!canvas || prefersReducedMotion) return () => {};

        const glyphs = "01$#%+*xo·";
        const parent = canvas.parentElement;
        let cells = [];
        let cols = 0;
        let rows = 0;
        let cell = 10;
        let width = 0;
        let height = 0;
        let ctx = null;
        let raf = 0;
        let running = true;
        let tick = 0;

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const bounds = parent?.getBoundingClientRect() || canvas.getBoundingClientRect();
            width = Math.max(1, Math.floor(bounds.width));
            height = Math.max(1, Math.floor(bounds.height));

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = "100%";
            canvas.style.height = "100%";

            ctx = canvas.getContext("2d");
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            cell = width < 360 ? 7 : 8;
            cols = Math.ceil(width / cell) + 2;
            rows = Math.ceil(height / cell) + 2;
            cells = [];

            for (let y = 0; y < rows; y += 1) {
                for (let x = 0; x < cols; x += 1) {
                    cells.push({
                        x,
                        y,
                        char: glyphs[(x * 17 + y * 31) % glyphs.length],
                        phase: Math.random() * Math.PI * 2,
                        speed: Math.random() * 0.045 + 0.018,
                    });
                }
            }
        }

        function draw() {
            if (!running || !ctx) return;

            tick += 1;
            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;
            const radius = Math.min(width, height) / 2;

            const gradient = ctx.createRadialGradient(
                cx,
                cy * 0.42,
                radius * 0.02,
                cx,
                cy,
                radius
            );
            gradient.addColorStop(0, "rgba(53, 167, 255, 0.55)");
            gradient.addColorStop(0.35, "rgba(12, 24, 52, 0.96)");
            gradient.addColorStop(0.78, "rgba(5, 10, 24, 0.99)");
            gradient.addColorStop(1, "rgba(2, 5, 16, 1)");

            // Fill the full canvas; CSS border-radius clips to the circle.
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            ctx.font = `600 ${cell - 1}px "Ranade", sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            for (const cellItem of cells) {
                const px = cellItem.x * cell + cell / 2;
                const py = cellItem.y * cell + cell / 2;
                const dx = px - cx;
                const dy = py - cy;
                const dist = Math.hypot(dx, dy);

                if (dist > radius + cell) continue;

                cellItem.phase += cellItem.speed;

                if (tick % 14 === 0 && Math.random() > 0.9) {
                    cellItem.char =
                        glyphs[Math.floor(Math.random() * glyphs.length)];
                }

                const edgeFade = Math.max(0.65, 1 - (dist / radius) * 0.35);
                const pulse = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(cellItem.phase));
                const alpha = edgeFade * pulse;

                ctx.fillStyle = `rgba(${COLORS.blue}, ${alpha})`;
                ctx.fillText(cellItem.char, px, py);
            }

            const rim = ctx.createRadialGradient(
                cx,
                cy,
                radius * 0.86,
                cx,
                cy,
                radius
            );
            rim.addColorStop(0, "rgba(53, 167, 255, 0)");
            rim.addColorStop(1, "rgba(53, 167, 255, 0.4)");
            ctx.fillStyle = rim;
            ctx.fillRect(0, 0, width, height);

            const beam = ctx.createLinearGradient(cx, 0, cx, cy + radius * 0.2);
            beam.addColorStop(0, "rgba(53, 167, 255, 0.45)");
            beam.addColorStop(0.45, "rgba(22, 119, 255, 0.12)");
            beam.addColorStop(1, "rgba(22, 119, 255, 0)");
            ctx.fillStyle = beam;
            ctx.beginPath();
            ctx.moveTo(cx - 48, 0);
            ctx.lineTo(cx + 48, 0);
            ctx.lineTo(cx + 90, cy);
            ctx.lineTo(cx - 90, cy);
            ctx.closePath();
            ctx.fill();

            raf = requestAnimationFrame(draw);
        }

        resize();
        draw();

        return () => {
            running = false;
            cancelAnimationFrame(raf);
        };
    }

    /* -------------------------------------------------------
       HERO ENTRANCE + SCROLL REVEAL
    ------------------------------------------------------- */
    function afterPreloader(callback) {
        if (!document.body.classList.contains("is-loading")) {
            callback();
            return;
        }

        document.addEventListener("preloader:done", callback, { once: true });
    }

    function playHeroEntrance(nodes) {
        nodes.forEach((node) => node.classList.remove("is-in"));
        nodes.forEach((node) => {
            void node.offsetWidth;
        });
        requestAnimationFrame(() => {
            nodes.forEach((node) => node.classList.add("is-in"));
        });
    }

    function initHeroEntrance() {
        const nodes = Array.from(document.querySelectorAll("[data-animate]"));
        const hero = document.getElementById("inicio");

        nodes.forEach((node) => {
            const delay = Number(node.dataset.delay || 0);
            node.style.setProperty("--anim-delay", `${delay}ms`);
        });

        afterPreloader(() => {
            if (prefersReducedMotion) {
                nodes.forEach((node) => node.classList.add("is-in"));
                return;
            }

            playHeroEntrance(nodes);

            if (!hero || !("IntersectionObserver" in window)) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            playHeroEntrance(nodes);
                        } else {
                            nodes.forEach((node) => node.classList.remove("is-in"));
                        }
                    });
                },
                {
                    threshold: 0.35,
                }
            );

            observer.observe(hero);
        });
    }

    function restartVisibility(node, activeClass) {
        node.classList.remove(activeClass);
        void node.offsetWidth;
        node.classList.add(activeClass);
    }

    function initScrollReveal() {
        const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
        if (!nodes.length) return;

        const staggerGroups = new Map();

        nodes.forEach((node) => {
            if (!node.hasAttribute("data-stagger")) return;

            const parent = node.parentElement;
            if (!parent) return;

            if (!staggerGroups.has(parent)) {
                staggerGroups.set(parent, []);
            }

            staggerGroups.get(parent).push(node);
        });

        staggerGroups.forEach((group) => {
            const step = group[0]?.closest(".steps-carousel")
                ? 220
                : group[0]?.closest(".qualified__criteria")
                  ? 240
                  : 100;

            group.forEach((node, index) => {
                node.style.setProperty("--reveal-delay", `${index * step}ms`);
            });
        });

        nodes.forEach((node) => {
            if (node.dataset.delay && !node.hasAttribute("data-stagger")) {
                node.style.setProperty(
                    "--reveal-delay",
                    `${Number(node.dataset.delay)}ms`
                );
            }
        });

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            nodes.forEach((node) => node.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        restartVisibility(entry.target, "is-visible");
                        return;
                    }

                    entry.target.classList.remove("is-visible");
                });
            },
            {
                threshold: 0.08,
                rootMargin: "40px 0px -6% 0px",
            }
        );

        nodes.forEach((node) => observer.observe(node));
    }

    /* -------------------------------------------------------
       PROGRESS BOARD — enter/exit + barras animadas
    ------------------------------------------------------- */
    function clampPercent(current, goal) {
        if (!goal || goal <= 0) return 0;
        return Math.max(0, Math.min(100, (current / goal) * 100));
    }

    function animateCount(node, toValue, duration = 1100) {
        const target = Number(toValue) || 0;

        if (prefersReducedMotion) {
            node.textContent = String(target);
            return;
        }

        const start = performance.now();
        const from = 0;

        function frame(now) {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = String(Math.round(from + (target - from) * eased));

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }

        requestAnimationFrame(frame);
    }

    function activateProgressSection(section) {
        const invited = Number(section.dataset.invited || 0);
        const nextGoal = Number(section.dataset.nextGoal || 5);
        const nextLabel = section.querySelector("[data-progress-next-label]");
        const fills = section.querySelectorAll("[data-progress-fill]");
        const counts = section.querySelectorAll("[data-progress-count]");

        if (nextLabel) {
            nextLabel.textContent = `${invited} / ${nextGoal} indicados`;
        }

        // Reinicia a animação de entrada (sair → voltar).
        section.classList.remove("is-active");

        fills.forEach((fill) => {
            fill.style.transition = "none";
            fill.style.width = "0%";
        });

        counts.forEach((node) => {
            node.textContent = "0";
        });

        void section.offsetWidth;

        fills.forEach((fill) => {
            fill.style.transition = "";
        });

        requestAnimationFrame(() => {
            section.classList.add("is-active");

            requestAnimationFrame(() => {
                fills.forEach((fill) => {
                    const current = Number(fill.dataset.current || invited || 0);
                    const goal = Number(fill.dataset.goal || nextGoal || 1);
                    fill.style.width = `${clampPercent(current, goal)}%`;
                });

                counts.forEach((node) => {
                    animateCount(node, node.dataset.countTo || 0);
                });
            });
        });
    }

    function deactivateProgressSection(section) {
        section.classList.remove("is-active");

        section.querySelectorAll("[data-progress-fill]").forEach((fill) => {
            fill.style.transition = "none";
            fill.style.width = "0%";
            void fill.offsetWidth;
            fill.style.transition = "";
        });

        section.querySelectorAll("[data-progress-count]").forEach((node) => {
            node.textContent = "0";
        });
    }

    function lerp(start, end, t) {
        return start + (end - start) * t;
    }

    function clamp01(value) {
        return Math.min(1, Math.max(0, value));
    }

    // Cresce com presença no meio do scroll e assenta no fim
    function easeProgressImage(t) {
        const x = clamp01(t);
        return x * x * (3 - 2 * x);
    }

    function getProgressScaleRange() {
        const mobile = window.matchMedia("(max-width: 900px)").matches;
        if (mobile) {
            return {
                scaleFrom: 0.68,
                scaleTo: 1.02,
                yFrom: 8,
                yTo: 0,
                opacityFrom: 0.6,
                opacityTo: 1,
                glowFrom: 0.08,
                glowTo: 0.28,
                yUnit: "vh",
            };
        }
        return {
            scaleFrom: 0.6,
            scaleTo: 1.06,
            yFrom: 10,
            yTo: 0,
            opacityFrom: 0.55,
            opacityTo: 1,
            glowFrom: 0.1,
            glowTo: 0.32,
            yUnit: "vh",
        };
    }

    function getStickyTopOffset() {
        const raw = getComputedStyle(document.documentElement)
            .getPropertyValue("--header-height")
            .trim();
        const header = Number.parseFloat(raw) || 120;
        const viewH = window.innerHeight || 1;
        return header + viewH * 0.03;
    }

    function getStageScrollProgress(stage) {
        const media = stage.querySelector(".progress-board__media");
        const stageRect = stage.getBoundingClientRect();
        const mediaHeight = media
            ? media.getBoundingClientRect().height
            : (window.innerHeight || 1) * 0.68;

        // Distância real em que o sticky permanece ativo:
        // stageHeight - mediaHeight
        const stickyTravel = Math.max(stageRect.height - mediaHeight, 1);
        const stickyTop = getStickyTopOffset();

        // 0 = acabou de grudar; 1 = prestes a soltar
        const traveled = stickyTop - stageRect.top;

        // Expansão rápida: completa com bem menos scroll na trilha sticky
        const completeAt = stickyTravel * 0.38;
        return clamp01(traveled / Math.max(completeAt, 1));
    }

    function applyProgressImageTransform(stage, progress) {
        const eased = easeProgressImage(progress);
        const range = getProgressScaleRange();
        const y = lerp(range.yFrom, range.yTo, eased);

        stage.style.setProperty(
            "--progress-scale",
            lerp(range.scaleFrom, range.scaleTo, eased).toFixed(4)
        );
        stage.style.setProperty(
            "--progress-y",
            `${y.toFixed(2)}${range.yUnit}`
        );
        stage.style.setProperty(
            "--progress-opacity",
            lerp(range.opacityFrom, range.opacityTo, eased).toFixed(3)
        );
        stage.style.setProperty(
            "--progress-glow",
            lerp(range.glowFrom, range.glowTo, eased).toFixed(3)
        );
    }

    function initProgressImageScroll(section) {
        const stage = section.querySelector("[data-progress-stage]");
        const image = section.querySelector("[data-progress-image]");
        if (!stage || !image) return () => {};

        if (prefersReducedMotion) {
            stage.style.setProperty("--progress-scale", "1");
            stage.style.setProperty("--progress-y", "0px");
            stage.style.setProperty("--progress-opacity", "1");
            stage.style.setProperty("--progress-glow", "0.2");
            return () => {};
        }

        let raf = 0;
        let active = false;
        let currentProgress = getStageScrollProgress(stage);
        let targetProgress = currentProgress;

        const tick = () => {
            raf = 0;
            const delta = targetProgress - currentProgress;
            // Suaviza o scroll do mouse/trackpad sem atrasar demais
            currentProgress += delta * 0.16;

            if (Math.abs(delta) < 0.001) {
                currentProgress = targetProgress;
            }

            applyProgressImageTransform(stage, currentProgress);

            if (Math.abs(targetProgress - currentProgress) >= 0.001) {
                raf = requestAnimationFrame(tick);
            }
        };

        const requestUpdate = () => {
            targetProgress = getStageScrollProgress(stage);
            if (!raf) {
                raf = requestAnimationFrame(tick);
            }
        };

        const onScroll = () => {
            if (!active) return;
            requestUpdate();
        };

        const onResize = () => {
            currentProgress = getStageScrollProgress(stage);
            targetProgress = currentProgress;
            applyProgressImageTransform(stage, currentProgress);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    active = entry.isIntersecting;
                    if (active) {
                        requestUpdate();
                        return;
                    }
                    targetProgress = getStageScrollProgress(stage) < 0.5 ? 0 : 1;
                    requestUpdate();
                });
            },
            {
                threshold: [0, 0.05, 0.15, 0.35, 0.6, 1],
                rootMargin: "25% 0px 25% 0px",
            }
        );

        observer.observe(stage);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });
        applyProgressImageTransform(stage, currentProgress);

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            if (raf) cancelAnimationFrame(raf);
        };
    }

    function initProgressBoard() {
        const section = document.querySelector("[data-progress-section]");
        if (!section) return;

        const cleanupImageScroll = initProgressImageScroll(section);

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            activateProgressSection(section);
            return cleanupImageScroll;
        }

        let isActive = false;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // threshold baixo: no mobile a seção empilhada é mais alta
                    // que a viewport, então ratios altos nunca disparam.
                    const entered =
                        entry.isIntersecting && entry.intersectionRatio > 0;

                    if (entered) {
                        if (!isActive) {
                            isActive = true;
                            activateProgressSection(section);
                        }
                        return;
                    }

                    if (isActive) {
                        isActive = false;
                        deactivateProgressSection(section);
                    }
                });
            },
            {
                threshold: [0, 0.02, 0.08, 0.15],
                rootMargin: "60px 0px -6% 0px",
            }
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
            if (typeof cleanupImageScroll === "function") {
                cleanupImageScroll();
            }
        };
    }

    function initMissionsLine() {
        const track = document.querySelector("[data-missions-line]");
        if (!track) return;

        const progress = track.querySelector(".missions-line__progress");

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            track.classList.add("is-line-active");
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        track.classList.remove("is-line-active");
                        if (progress) {
                            progress.style.transition = "none";
                            progress.style.transform = "";
                            void progress.offsetWidth;
                            progress.style.transition = "";
                        }
                        requestAnimationFrame(() => {
                            track.classList.add("is-line-active");
                        });
                        return;
                    }

                    track.classList.remove("is-line-active");
                });
            },
            {
                threshold: [0, 0.08, 0.2],
                rootMargin: "80px 0px -4% 0px",
            }
        );

        observer.observe(track);
    }

    /* -------------------------------------------------------
       BENEFÍCIO R$500 — fade-in que repete ao entrar/voltar
    ------------------------------------------------------- */
    function initBenefitReplay() {
        const section = document.querySelector("[data-benefit-replay]");
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        section.classList.remove("is-in-view");
                        void section.offsetWidth;
                        section.classList.add("is-in-view");
                        return;
                    }

                    section.classList.remove("is-in-view");
                });
            },
            {
                threshold: 0.28,
                rootMargin: "0px 0px -8% 0px",
            }
        );

        observer.observe(section);
    }

    function init() {
        const cleanups = [];

        cleanups.push(initStardust(document.getElementById("hero-stardust")));
        cleanups.push(initStarburst(document.getElementById("hero-starburst")));
        cleanups.push(initPixelOrb(document.getElementById("hero-pixel")));

        initHeroEntrance();
        initScrollReveal();
        initBenefitReplay();
        cleanups.push(initProgressBoard());
        initMissionsLine();

        let resizeTimer = 0;
        const onResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                cleanups.forEach((fn) => fn && fn());
                cleanups.length = 0;
                cleanups.push(
                    initStardust(document.getElementById("hero-stardust"))
                );
                cleanups.push(
                    initStarburst(document.getElementById("hero-starburst"))
                );
                cleanups.push(initPixelOrb(document.getElementById("hero-pixel")));
                cleanups.push(initProgressBoard());
            }, 180);
        };

        window.addEventListener("resize", onResize, { passive: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
