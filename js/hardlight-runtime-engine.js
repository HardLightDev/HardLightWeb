// ================================================================
// HardLight + EVA: HARDLIGHT PORTFOLIO — RUNTIME INTERACTION ENGINE.
// Base estable tras pruebas de layout, contraste, hover y responsive. Cambiar con criterio, no por impulso.
// ================================================================

const State = {
    volume: 0.5,
    isManualScroll: false,
    fadeInterval: null,
    entered: false,
    isPerformanceMode: false,
    cursorX: -100,
    cursorY: -100,
    targetX: -100,
    targetY: -100,
    cursorVisible: false,
    uiVisible: false
};

const DOM = {
    cursor: null,
    dot: null,
    bgm: null,
    sfxEnter: null,
    sfxHover: null,
    sfxClick: null,
    sfxUiHover: null,
    sfxGlitch: null,
    mainContent: null,
    gateContainer: null,
    entryFlash: null,
    bgCanvas: null
};

// ================================================================
// HardLight + EVA: WEBGL SHADER BACKGROUND desactivado por rendimiento. El fondo debe sentirse continuo; si cada sección pinta de más, aparecen cortes visuales.
// ================================================================
const BackgroundShader = {
    init() { },
    start() { },
    stop() { },
    resize() { },
    render() { }
};

// ================================================================
// HardLight + EVA: Datos de habilidades destacadas. Las tarjetas deben explicar capacidades reales, no rellenar espacio con palabras bonitas.
// ================================================================
const PORTFOLIO_ITEMS = [
    {
        id: 1, name: 'DESARROLLO WEB', role: 'FRONTEND', color: '#29da78',
        suit: '✦', volume: 0.6,
        audio: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bons.wav',
        desc: 'Construyo interfaces web con HTML, CSS y JavaScript cuidando estructura semántica, responsive, rendimiento, estados de UI y compatibilidad real. Mi forma de trabajo es directa: primero que funcione, luego que respire, y al final que tenga identidad sin perder claridad.'
    },
    {
        id: 2, name: 'DISEÑO DE INTERFAZ', role: 'UI/UX', color: '#00D4FF',
        suit: '✧', volume: 0.5,
        audio: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/paus.wav',
        desc: 'Trabajo sistemas visuales con jerarquía, contraste, navegación, modales, tarjetas, estados y microinteracciones. No busco decorar pantallas: ordeno la experiencia para que quien la vea entienda qué es, dónde mirar y por qué se siente distinta.'
    },
    {
        id: 3, name: 'DIRECCIÓN CREATIVA', role: 'CRITERIO', color: '#C6F135',
        suit: '✺', volume: 0.62,
        audio: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/missil.mp3',
        desc: 'Tomo una idea y la llevo a una dirección visual concreta: tono, ritmo, referencias, límites, detalles que sí aportan y elementos que se descartan. Me interesa que cada proyecto tenga una voz propia, no un resultado intercambiable.'
    },
    {
        id: 4, name: 'EXPERIMENTACIÓN WEB', role: 'EXPLORACIÓN', color: '#8B5CF6',
        suit: '✦', volume: 0.56,
        audio: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bons.wav',
        desc: 'Exploro estilos y formatos para salir del molde sin perder usabilidad. Pruebo atmósferas, layouts, vidrio, movimiento, audio o textura cuando suman, y descarto lo que solo hace ruido. La creatividad tiene libertad, pero también criterio.'
    },
    {
        id: 5, name: 'PULIDO VISUAL', role: 'DETALLE', color: '#38BDF8',
        suit: '◆', volume: 0.48,
        audio: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/paus.wav',
        desc: 'Reviso contraste, espaciado, legibilidad, modo día/noche, scroll, hover, móvil, 1080p y 4K. Es una parte meticulosa del proceso: encontrar esos detalles pequeños que hacen que una web pase de ‘funciona’ a ‘está bien terminada’.'
    },
    {
        id: 6, name: 'ENTREGA TÉCNICA', role: 'PRODUCCIÓN', color: '#F472B6',
        suit: '✹', volume: 0.52,
        audio: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/missil.mp3',
        desc: 'Dejo el proyecto ordenado para revisar, subir y mostrar: archivos limpios, rutas coherentes, SEO básico, textos consistentes, assets controlados y pruebas mínimas. Una entrega debe sentirse lista, no como una maqueta sostenida con cinta.'
    }
];


function hexToRgbTuple(hex) {
    const clean = String(hex || '').replace('#', '').trim();
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return '41, 218, 120';
    const n = parseInt(clean, 16);
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatBoxText(value) {
    const ELLIPSIS_TOKEN = '__PORTFOLIO_ELLIPSIS__';

    return escapeHTML(value)
        .replace(/\.\.\./g, ELLIPSIS_TOKEN)
        .replace(/\r?\n/g, '<br>')
        // HardLight + EVA: Ritmo de texto solo dentro de boxes. Cada punto puede abrir una nueva línea para mejorar lectura sin afectar correos ni dominios.
        // HardLight + EVA: También contempla cierres con comillas, por ejemplo: "caso de estudio". Se requiere... sin romper emails ni URLs.
        .replace(/([^\s@\/\.][.!?])([&quot;"”’']?)(\s+)(?=[A-ZÁÉÍÓÚÜÑ¿¡0-9])/g, '$1$2<br>')
        .replace(new RegExp(ELLIPSIS_TOKEN, 'g'), '...');
}

const NEWS = [
    {
        cat: 'PORTAFOLIO', date: '29 DIC 2025',
        title: 'Portafolio Para Enviar Por DM',
        desc: 'Esta página responde rápido cuando alguien pide portafolio: qué hago, cómo pienso una interfaz y qué nivel de cuidado puedo sostener. No intento llenar espacio; intento que el trabajo se entienda en pocos segundos.'
    },
    {
        cat: 'DIRECCIÓN CREATIVA', date: '20 OCT 2026',
        title: 'Diseño Web Con Criterio Propio',
        desc: 'Cada bloque está pensado como una decisión: jerarquía, contraste, ritmo, movimiento y tono visual. Mi enfoque no parte de fórmulas cerradas; parte de una intención y se ajusta hasta que comunica mejor.'
    },
    {
        cat: 'EXPERIMENTACIÓN WEB', date: '15 NOV 2026',
        title: 'Experimentar También Es Método',
        desc: 'Pruebo estilos, vidrio, layouts, microinteracciones y atmósferas para encontrar caminos menos obvios. La experimentación no es adorno: es una forma de descubrir cómo una web puede sentirse más clara y propia.'
    }
];

const FAQS = [
    {
        q: 'PF_01 // MANIFIESTO',
        a: 'Este portafolio existe para mostrar que una web puede ser funcional, legible y aun así tener carácter. No busco decorar por decorar; busco que cada decisión visual ayude a que la idea se entienda mejor.'
    },
    {
        q: 'PF_02 // ENFOQUE_TÉCNICO',
        a: 'Trabajo desde desarrollo web, diseño de interfaz y dirección creativa. Me interesa construir páginas con estructura limpia, responsive sólido, textos claros y una estética pensada para el proyecto.'
    },
    {
        q: 'PF_03 // CONTACTO',
        a: 'Para trabajos, referencias visuales o propuestas relacionadas con diseño y desarrollo web, puedes ubicarme como HardLight Dev. @hardlight_editor en Discord.'
    }
];

// ================================================================
// HardLight + EVA: DOM INIT. Este bloque conecta referencias críticas; tocarlo solo después de revisar dependencias.
// ================================================================
function initDOM() {
    DOM.cursor = document.getElementById('cursor');
    DOM.dot = document.getElementById('cursor-dot');
    DOM.bgm = document.getElementById('bgmPlayer');
    DOM.sfxEnter = document.getElementById('sfx-enter');
    DOM.sfxHover = document.getElementById('sfx-hover');
    DOM.sfxClick = document.getElementById('sfx-click');
    DOM.sfxUiHover = document.getElementById('sfx-ui-hover');
    DOM.sfxGlitch = document.getElementById('sfx-glitch');
    DOM.mainContent = document.getElementById('main-content');
    DOM.gateContainer = document.getElementById('gate-container');
    DOM.entryFlash = document.getElementById('entry-flash');
}
initDOM();

// ================================================================
// HardLight + EVA: APP INIT. Orden de arranque probado; documentar cualquier cambio antes de moverlo.
// ================================================================
window.addEventListener('load', () => {
    if (!DOM.gateContainer) initDOM();

    document.body.classList.remove('no-js');

    // HardLight + EVA: Seguridad visual: ocultar interfaces iniciales después de sus animaciones para evitar estados intermedios.
    setTimeout(() => {
        const boot = document.getElementById('aero-boot-overlay');
        if (boot) { boot.style.display = 'none'; boot.style.opacity = '0'; }
    }, 2000);
    setTimeout(() => {
        const flash = document.getElementById('entry-flash');
        if (flash) { flash.style.display = 'none'; flash.style.opacity = '0'; }
    }, 8000);

    initAeroTheme();
    BackgroundShader.init();
    createParticles();
    renderPortfolioItems();
    renderNews();
    renderFaqs();
    ScrollSystem.init();
    initIntersectionObserver();
    initCardTilt3D();
    initMagneticButtons();
    initSmoothCursor();

    document.body.style.overflow = 'hidden';

    // HardLight + EVA: Timeout de entrada: si no hay interacción, el sitio avanza para no dejar al usuario bloqueado.
    setTimeout(() => {
        if (!State.entered && DOM.gateContainer && DOM.gateContainer.style.display !== 'none') {
            triggerEntrySequence();
        }
    }, 7000);
});

// ================================================================
// HardLight + EVA: VISIBILITY API. Pausa lógica cuando la pestaña no está activa para ahorrar recursos.
// ================================================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (DOM.bgm && !DOM.bgm.paused) DOM.bgm.pause();
        BackgroundShader.stop();
    } else {
        if (State.entered && !State.isPerformanceMode) {
            if (DOM.bgm && State.volume > 0) DOM.bgm.play().catch(() => { });
            const canvas = document.getElementById('glcanvas');
            if (canvas && canvas.style.opacity !== '0') {
                BackgroundShader.start();
            }
        }
    }
});

// ================================================================
// HardLight + EVA: SMOOTH CURSOR SYSTEM. No cambiar tamaño o SVG sin probar click, hover y botón central.
// ================================================================
function initSmoothCursor() {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;

    if (!DOM.cursor || !DOM.dot) return;

    // HardLight + EVA: GSAP posiciona con transforms x/y; no duplicar centrado porque desajusta el cursor.
    gsap.set(DOM.cursor, { xPercent: 0, yPercent: 0 });
    gsap.set(DOM.dot, { xPercent: -50, yPercent: -50 });

    let isAutoscrolling = false;
    let autoscrollStartY = 0;
    let autoscrollVelocity = 0;

    const xToCursor = gsap.quickTo(DOM.cursor, "x", { duration: 0.5, ease: "expo.out" });
    const yToCursor = gsap.quickTo(DOM.cursor, "y", { duration: 0.5, ease: "expo.out" });

    document.addEventListener('mousemove', (e) => {
        if (State.isPerformanceMode) return;
        xToCursor(e.clientX);
        yToCursor(e.clientY);

        if (isAutoscrolling) {
            autoscrollVelocity = (e.clientY - autoscrollStartY) * 0.05;
        }

        if (!State.cursorVisible) {
            State.cursorVisible = true;
            DOM.cursor.classList.add('visible');
            DOM.dot.classList.add('visible');
        }
    });

    function updateAutoscroll() {
        if (isAutoscrolling) {
            window.scrollBy(0, autoscrollVelocity);
            requestAnimationFrame(updateAutoscroll);
        }
    }

    let isHovered = false;
    document.addEventListener('mouseover', (e) => {
        if (State.isPerformanceMode) return;
        const target = e.target.closest('button, a, .nav-link, .roster-card, .logo-box, .audio-btn-enhanced, input[type=range], .faq-item, #custom-scroll-thumb, .hover-trigger, .btn-modal-close');
        const shouldHover = !!target;
        if (shouldHover !== isHovered) {
            isHovered = shouldHover;
            if (shouldHover) {
                DOM.cursor.classList.add('hovered');
            } else {
                DOM.cursor.classList.remove('hovered');
            }
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (State.isPerformanceMode) return;
        if (e.button === 1) { // HardLight + EVA: Middle click. Revisar SVG y hitbox si se toca este estado.
            e.preventDefault();
            isAutoscrolling = true;
            autoscrollStartY = e.clientY;
            autoscrollVelocity = 0;
            updateAutoscroll();
            DOM.cursor.classList.add('middle-clicking');
            if (DOM.sfxGlitch && State.volume > 0) {
                DOM.sfxGlitch.currentTime = 0;
                playAudio(DOM.sfxGlitch, 0.4);
            }
        } else if (e.button === 0) { // HardLight + EVA: Left click. Mantener simple para que la respuesta visual sea clara.
            DOM.cursor.classList.add('clicking');
            if (DOM.sfxClick && State.volume > 0) {
                DOM.sfxClick.currentTime = 0;
                playAudio(DOM.sfxClick, Math.max(0.3, Math.min(State.volume + 0.2, 0.8)));
            }
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (State.isPerformanceMode) return;
        isAutoscrolling = false;
        DOM.cursor.classList.remove('clicking', 'middle-clicking', 'scrolling');
    });

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (State.isPerformanceMode) return;
        DOM.cursor.classList.add('denied');
        if (DOM.sfxGlitch) {
            DOM.sfxGlitch.currentTime = 0;
            playAudio(DOM.sfxGlitch, 0.6);
        }
        setTimeout(() => DOM.cursor.classList.remove('denied'), 500);
    });
}

// ================================================================
// HardLight + EVA: SCROLLBAR & NAV SYSTEM. Zona sensible: probar 720p, 1080p y 4K antes de ajustar offsets.
// ================================================================
const ScrollSystem = {
    track: null,
    thumb: null,
    isDragging: false,
    startY: 0,
    startThumbTop: 0,
    lastScrollY: -1,
    ticking: false,
    sectionOffsets: {},

    sections: [
        ['inicio', 'nav-inicio', 'mob-inicio'],
        ['proyectos', 'nav-proyectos', 'mob-proyectos'],
        ['intel', 'nav-intel', 'mob-intel'],
        ['data', 'nav-data', 'mob-data'],
    ],

    init() {
        this.track = document.getElementById('custom-scrollbar');
        this.thumb = document.getElementById('custom-scroll-thumb');
        if (!this.track || !this.thumb) return;

        this.track.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());
        window.addEventListener('resize', () => {
            this.updateDimensions();
            this.updateOffsets();
        });

        new ResizeObserver(() => {
            this.updateDimensions();
            this.updateOffsets();
        }).observe(document.body);

        this.updateDimensions();
        this.updateOffsets();

        // HardLight + EVA: Listener pasivo para scroll fluido. Cambiarlo puede afectar rendimiento.
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.onScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });

        this.onScroll();
    },

    updateOffsets() {
        for (const [sectionId] of this.sections) {
            const el = document.getElementById(sectionId);
            if (el) {
                // HardLight + EVA: offsetTop absoluto contra documento; necesario para que la navegación active la sección correcta.
                this.sectionOffsets[sectionId] = el.getBoundingClientRect().top + window.scrollY;
            }
        }
    },

    onScroll() {
        const scrollY = window.scrollY;
        if (scrollY !== this.lastScrollY) {
            this.lastScrollY = scrollY;
            if (!this.isDragging) this.updateThumbPosition();
            this.updateActiveSection();
        }
    },

    getTrackMetrics() {
        const style = window.getComputedStyle(this.track);
        const padTop = parseFloat(style.paddingTop) || 0;
        const padBottom = parseFloat(style.paddingBottom) || 0;
        const trackHeight = this.track.clientHeight;
        const usableHeight = Math.max(trackHeight - padTop - padBottom, 1);
        return { padTop, padBottom, trackHeight, usableHeight };
    },

    updateDimensions() {
        if (!this.track || !this.thumb) return;
        if (!State.uiVisible) {
            this.track.style.display = 'none';
            return;
        }
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        if (docHeight <= winHeight) {
            this.track.style.display = 'none';
            return;
        }
        this.track.style.display = 'block';
        const { usableHeight } = this.getTrackMetrics();
        const thumbHeight = Math.max((winHeight / docHeight) * usableHeight, 50);
        this.thumb.style.height = thumbHeight + 'px';
        this.updateThumbPosition();
    },

    updateThumbPosition() {
        if (!this.track || !this.thumb) return;
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const { usableHeight } = this.getTrackMetrics();
        const maxThumbTop = Math.max(usableHeight - this.thumb.offsetHeight, 0);
        const scrollable = Math.max(docHeight - winHeight, 1);
        const ratio = Math.max(0, Math.min(scrollTop / scrollable, 1));
        this.thumb.style.transform = 'translateY(' + Math.round(ratio * maxThumbTop) + 'px)';
    },

    updateActiveSection() {
        const triggerY = window.innerHeight * 0.4;
        const scrollY = window.scrollY;
        let currentId = this.sections[0][0];
        for (const [sectionId] of this.sections) {
            const offset = this.sectionOffsets[sectionId];
            if (offset === undefined) continue;
            const top = offset - scrollY;
            if (top <= triggerY) currentId = sectionId;
        }
        for (const [sectionId, navId, mobId] of this.sections) {
            const isActive = sectionId === currentId;
            const navEl = document.getElementById(navId);
            if (navEl) navEl.classList.toggle('active', isActive);
            const mobEl = document.getElementById(mobId);
            if (mobEl) mobEl.classList.toggle('active', isActive);
        }
    },

    onMouseDown(e) {
        if (e.target === this.thumb || this.thumb.contains(e.target)) {
            e.preventDefault();
            this.isDragging = true;
            this.startY = e.clientY;
            const winHeight = window.innerHeight;
            const { usableHeight } = this.getTrackMetrics();
            const maxThumbTop = Math.max(usableHeight - this.thumb.offsetHeight, 0);
            const scrollable = Math.max(document.documentElement.scrollHeight - winHeight, 1);
            const scrollRatio = Math.max(0, Math.min(window.scrollY / scrollable, 1));
            this.startThumbTop = scrollRatio * maxThumbTop;
            this.thumb.classList.add('dragging');
            document.body.style.userSelect = 'none';
            document.body.style.scrollBehavior = 'auto';
        } else {
            const rect = this.track.getBoundingClientRect();
            const { padTop, usableHeight } = this.getTrackMetrics();
            const clickY = Math.max(0, Math.min(e.clientY - rect.top - padTop, usableHeight));
            const ratio = clickY / usableHeight;
            window.scrollTo({
                top: ratio * (document.documentElement.scrollHeight - window.innerHeight),
                behavior: 'smooth'
            });
        }
    },

    onMouseMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const deltaY = e.clientY - this.startY;
        const winHeight = window.innerHeight;
        const { usableHeight } = this.getTrackMetrics();
        const maxThumbTop = Math.max(usableHeight - this.thumb.offsetHeight, 1);
        const newThumbTop = Math.max(0, Math.min(this.startThumbTop + deltaY, maxThumbTop));
        this.thumb.style.transform = 'translateY(' + newThumbTop + 'px)';
        window.scrollTo(0, (newThumbTop / maxThumbTop) * (document.documentElement.scrollHeight - winHeight));
    },

    onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.thumb.classList.remove('dragging');
            document.body.style.userSelect = '';
            document.body.style.scrollBehavior = 'smooth';
        }
    }
};

// ================================================================
// HardLight + EVA: GATE / ENTRY SEQUENCE. La primera impresión depende de este orden; evitar cambios grandes sin probar.
// ================================================================
function triggerEntrySequence() {
    if (!DOM.gateContainer) DOM.gateContainer = document.getElementById('gate-container');
    if (!DOM.gateContainer) return;
    if (State.entered) return;
    State.entered = true;

    playAudio(DOM.sfxEnter, 0.5);

    if (DOM.bgm) {
        DOM.bgm.volume = 0;
        DOM.bgm.play().catch(() => { });
    }

    const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" }
    });

    // HardLight + EVA: Fase 1: aparece la apertura central.
    tl.to(".central-slit", {
        scaleY: 1, opacity: 1, duration: 0.7,
        ease: "power2.out"
    })
        .to(".light-door-container", { opacity: 1, duration: 0.4 }, "<0.1");

    // HardLight + EVA: Fase 2: las puertas se abren.
    tl.to(".door-panel.left", { x: "-105vw", duration: 1.4, ease: "power4.inOut" }, "+=0.15")
        .to(".door-panel.right", { x: "105vw", duration: 1.4, ease: "power4.inOut" }, "<");

    // HardLight + EVA: Fase 3: flash de transición.
    if (DOM.entryFlash) {
        tl.set(DOM.entryFlash, { display: "block", opacity: 0 }, "-=1.0")
            .to(DOM.entryFlash, { opacity: 1, duration: 0.8, ease: "power2.in" }, "-=0.8");
    }

    // HardLight + EVA: Fase 4: se retira la pantalla de entrada.
    tl.to(DOM.gateContainer, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.3")
        .set(DOM.gateContainer, { display: "none" });

    // HardLight + EVA: Fase 5: baja el flash y aparece el contenido.
    if (DOM.entryFlash) {
        tl.to(DOM.entryFlash, { opacity: 0, duration: 1.8, ease: "power2.out" }, "-=0.2")
            .set(DOM.entryFlash, { display: "none" });
    }

    // HardLight + EVA: Fase 6: entra el contenido principal.
    tl.call(() => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        State.uiVisible = true;
        ScrollSystem.updateDimensions();
        const toggle = document.getElementById('aero-theme-toggle');
        if (toggle) toggle.classList.add('visible');
    }, null, "-=1.5")
        .to(DOM.mainContent, {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.4,
            ease: "power3.out"
        }, "-=1.4");

    // HardLight + EVA: Fase 7: refresca reveals, audio y estado del tema.
    tl.call(() => {
        triggerReveals();
        if (DOM.bgm) {
            updateAudioUI(true);
            fadeAudio(DOM.bgm, 0, State.volume, 3000);
        }
    }, null, "-=0.8")

}

// ================================================================
// HardLight + EVA: PARTICLES. Efecto decorativo controlado; evitar densidad alta para no ensuciar lectura.
// ================================================================
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const suits = ['○', '◦', '•', '♡', '✦', '✧', '◌', '◇', '○'];
    const count = window.innerWidth < 768 ? 14 : 32;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'suit-particle';
        p.innerText = suits[Math.floor(Math.random() * suits.length)];

        const left = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = 14 + Math.random() * 16;
        const size = 10 + Math.random() * 24;

        p.style.left = left + '%';
        p.style.animationDelay = delay + 's';
        p.style.animationDuration = duration + 's';
        p.style.fontSize = size + 'px';

        const aeroCols = [
            'rgba(41, 218, 120, 0.50)',
            'rgba(255,255,255,0.65)',
            'rgba(0,212,255,0.45)',
            'rgba(184,200,216,0.55)',
            'rgba(41, 218, 120, 0.40)'
        ];
        p.style.color = aeroCols[Math.floor(Math.random() * aeroCols.length)];

        frag.appendChild(p);
    }
    container.appendChild(frag);
}

// ================================================================
// HardLight + EVA: SLOT TEXT. El cifrado es intencional en reposo y debe decodificar limpio en hover.
// ================================================================
const slotChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789◇◆✦✧Ø';
const slotCipherMap = {
    A: '4', B: 'B', C: 'C', D: 'D', E: '3', F: 'F', G: 'G', H: 'H', I: '1',
    J: 'J', K: 'K', L: 'L', M: 'M', N: 'N', Ñ: 'N', O: '0', P: 'P', Q: 'Q',
    R: 'R', S: '5', T: '7', U: 'U', V: 'V', W: 'W', X: 'X', Y: 'Y', Z: 'Z',
    Á: '4', É: '3', Í: '1', Ó: '0', Ú: 'U', Ü: 'U'
};

function generateRandomString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += slotChars[Math.floor(Math.random() * slotChars.length)];
    }
    return result;
}

function generateSkillCipher(text) {
    // HardLight + EVA: reposo cifrado, hover claro. No usar random permanente aquí:
    // si cada frame cambia el ancho, la tarjeta pierde estabilidad visual.
    return Array.from(String(text || '').toUpperCase()).map(char => {
        if (char === ' ') return ' ';
        return slotCipherMap[char] || char;
    }).join('');
}

function normalizeSlotString(value, length) {
    const chars = Array.from(String(value || ''));
    if (chars.length === length) return chars.join('');
    if (chars.length > length) return chars.slice(0, length).join('');
    return chars.concat(Array(Math.max(0, length - chars.length)).fill(' ')).join('');
}

function getSkillTitleLines(name) {
    // HardLight + EVA: mapa de líneas para habilidades largas.
    // No dejar que el navegador decida el corte: los títulos compuestos necesitan líneas controladas.
    const cleanName = String(name || '').trim();
    const customLines = {
        'DESARROLLO WEB': ['DESARROLLO', 'WEB'],
        'DISEÑO DE INTERFAZ': ['DISEÑO DE', 'INTERFAZ'],
        'DIRECCIÓN CREATIVA': ['DIRECCIÓN', 'CREATIVA'],
        'EXPERIMENTACIÓN WEB': ['EXPERIMENTACIÓN', 'WEB'],
        'PULIDO VISUAL': ['PULIDO', 'VISUAL'],
        'ENTREGA TÉCNICA': ['ENTREGA', 'TÉCNICA']
    };
    return customLines[cleanName] || cleanName.split(/\s+/).filter(Boolean);
}

function renderSlotTitleLines(name) {
    const lines = getSkillTitleLines(name);
    return lines.map((line, index) => {
        const safeLine = escapeHTML(line);
        const cipherLine = escapeHTML(generateSkillCipher(line));
        return `<span class="slot-line" data-line-index="${index}" data-original="${safeLine}" data-cipher="${cipherLine}">${cipherLine}</span>`;
    }).join('');
}

function renderPortfolioItems() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = PORTFOLIO_ITEMS.map((t, index) => {
        // HardLight + EVA: regla actual: reposo cifrado, hover decodificado.
        // No volver a random infinito; mantiene mal el ancho y rompe la lectura.
        const displayName = escapeHTML(t.name);
        const cipherName = escapeHTML(generateSkillCipher(t.name));
        const delayClass = index % 2 === 0 ? '' : 'delay-100';
        const titleFitClass = t.name.length >= 17 ? ' is-title-long' : '';

        return `
            <div class="roster-card reveal ${delayClass}" tabindex="0" style="--card-color: ${t.color}; --card-color-rgb: ${hexToRgbTuple(t.color)};"
                 onclick="openModal('project-' + ${t.id})"
                 onmouseenter="handleCardHover(this, '${t.name}', 'audio-project-${t.id}', ${t.volume})"
                 onmouseleave="handleCardLeave(this, '${t.name}')" role="article" aria-label="Habilidad ${t.name} - ${t.role}">

                <audio id="audio-project-${t.id}" src="${t.audio}" preload="none"></audio>

                <div class="aero-glass-card">
                    <!-- HardLight + EVA: símbolo decorativo; no es relleno, aporta identidad visual. -->
                    <div class="card-bg-symbol" aria-hidden="true">${t.suit}</div>

                    <!-- HardLight + EVA: cabecera de tarjeta; badge y punto sostienen identidad, no moverlos por impulso. -->
                    <div class="card-header-row">
                        <div class="card-code">PF_${String(t.id).padStart(2, '0')}</div>
                        <div class="project-dot"></div>
                    </div>

                    <!-- HardLight + EVA: título cifrado por líneas controladas. No volver a textContent plano: ahí nacen los cortes raros en DISEÑO/DIRECCIÓN. -->
                    <h2 class="slot-text${titleFitClass} is-encoded" data-original="${escapeHTML(t.name)}" data-cipher="${escapeHTML(generateSkillCipher(t.name))}" aria-label="${displayName}">${renderSlotTitleLines(t.name)}</h2>

                    <!-- HardLight + EVA: rol y símbolo; pequeño, pero ayuda a ubicar la habilidad sin cargar la tarjeta. -->
                    <p class="card-role">${t.role} <span class="card-suit">${t.suit}</span></p>

                    <!-- HardLight + EVA: panel hover solo con descripción útil. Los stats numéricos se retiraron porque ocupaban espacio sin explicar técnica real. -->
                    <div class="hover-panel">
                        <p class="project-desc box-copy">${formatBoxText(t.desc)}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // HardLight + EVA: primer frame blindado. Ahora el reposo cifrado es intencional:
    // si el cursor no está encima, cada tarjeta guarda su identidad como archivo encriptado.
    requestAnimationFrame(() => restoreAllSlotTexts());
}

// ================================================================
// HardLight + EVA: MAGNETIC BUTTONS. Mantener movimiento sutil para no distraer del contenido.
// ================================================================
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic-wrap');
    magneticElements.forEach(wrapper => {
        const btn = wrapper.querySelector('button');
        if (!btn) return;

        const xTo = gsap.quickTo(btn, "x", { duration: 0.7, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.7, ease: "elastic.out(1, 0.4)" });

        let rect = null;

        wrapper.addEventListener('mouseenter', () => {
            rect = wrapper.getBoundingClientRect();
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (State.isPerformanceMode) return;
            if (!rect) rect = wrapper.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            xTo(x);
            yTo(y);
        });

        wrapper.addEventListener('mouseleave', () => {
            xTo(0);
            yTo(0);
            rect = null;
        });
    });
}

// ================================================================
// HardLight + EVA: 3D CARD TILT. El efecto suma profundidad; no debe tapar texto ni competir con la descripción.
// ================================================================
function initCardTilt3D() {
    const cards = document.querySelectorAll('.roster-card');
    cards.forEach(card => {
        const inner = card.querySelector('.aero-glass-card');
        if (!inner) return;

        // HardLight + EVA: Ensure proper perspective. Probar cambios pequeños; un ajuste mínimo puede alterar el layout.
        gsap.set(inner, { transformPerspective: 1200 });

        let rect = null;

        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
            // HardLight + EVA: Elevate card z-index so it renders on top during 3D tilt. Las tarjetas combinan glow y tilt; priorizar lectura, ancho estable y hover limpio.
            gsap.to(card, { zIndex: 10, duration: 0.1 });
        });

        card.addEventListener('mousemove', e => {
            if (State.isPerformanceMode) return;
            if (!rect) rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // HardLight + EVA: 3D Tilt calculation (between -10 and 10 degrees). Funciona estable; documentar antes de cambiar.
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(inner, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1200,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: "auto"
            });

            // HardLight + EVA: Set mouse position percentage for CSS gloss highlight. Mantener intención, escala y compatibilidad.
            const pctX = (x / rect.width) * 100;
            const pctY = (y / rect.height) * 100;
            inner.style.setProperty('--mouse-x', pctX + '%');
            inner.style.setProperty('--mouse-y', pctY + '%');
        });

        card.addEventListener('mouseleave', () => {
            // HardLight + EVA: Spring rebound elastic reset back to flat center (matching tarjeta.html rebound). Las tarjetas combinan glow y tilt; priorizar lectura, ancho estable y hover limpio.
            gsap.to(inner, {
                rotateX: 0,
                rotateY: 0,
                duration: 1,
                ease: "elastic.out(1, 0.4)",
                overwrite: "auto"
            });
            gsap.to(card, { zIndex: 1, duration: 0.1, delay: 0.5 });
            rect = null;
        });
    });
}

// ================================================================
// HardLight + EVA: SLOT TEXT ANIMATION. Regla visual actual:
// reposo cifrado, hover decodificado. El truco debe sentirse técnico y limpio,
// No debe sentirse random ni romper el layout. Probar mouseenter/mouseleave antes de cambiar.
// ================================================================
function cancelSlotAnimation(element) {
    if (!element) return;
    if (element.dataset.animationId) {
        cancelAnimationFrame(Number(element.dataset.animationId));
        delete element.dataset.animationId;
    }
}

function getSlotRealName(element, fallback = '') {
    return String(element?.dataset?.original || fallback || '').trim();
}

function getSlotCipherName(element, realName = '') {
    const stableName = getSlotRealName(element, realName);
    const cipher = String(element?.dataset?.cipher || generateSkillCipher(stableName)).trim();
    if (element) {
        element.dataset.original = stableName;
        element.dataset.cipher = cipher;
    }
    return cipher;
}

function getSlotLineNodes(element) {
    return element ? Array.from(element.querySelectorAll('.slot-line')) : [];
}

function setSlotTextDecoded(element, text) {
    if (!element) return;
    const stableName = getSlotRealName(element, text);
    const lines = getSlotLineNodes(element);
    cancelSlotAnimation(element);

    if (lines.length) {
        lines.forEach(line => {
            line.textContent = line.dataset.original || '';
        });
    } else {
        element.textContent = stableName;
    }

    element.classList.remove('is-scrambling', 'is-encoded', 'is-encoding', 'is-decoding');
}

function setSlotTextEncoded(element, text) {
    if (!element) return;
    const stableName = getSlotRealName(element, text);
    const cipherName = getSlotCipherName(element, stableName);
    const lines = getSlotLineNodes(element);
    cancelSlotAnimation(element);

    if (lines.length) {
        lines.forEach(line => {
            line.textContent = line.dataset.cipher || generateSkillCipher(line.dataset.original || '');
        });
    } else {
        element.textContent = cipherName;
    }

    element.classList.remove('is-scrambling', 'is-encoding', 'is-decoding');
    element.classList.add('is-encoded');
}

function restoreAllSlotTexts() {
    // HardLight + EVA: seguro de estado. Tarjeta sin hover = cifrada; tarjeta con hover = clara.
    // Este equilibrio evita el caos anterior donde una runa random decidía vivir para siempre.
    document.querySelectorAll('.slot-text[data-original]').forEach(el => {
        const card = el.closest('.roster-card');
        if (card && card.matches(':hover')) {
            setSlotTextDecoded(el, el.dataset.original);
        } else {
            setSlotTextEncoded(el, el.dataset.original);
        }
    });
}

function slotBridgeGlyph(index, progress, startChar, targetChar, mode) {
    if (targetChar === ' ' || startChar === ' ') return targetChar === ' ' ? ' ' : startChar;

    const lengthBias = index * 0.055;
    const sweep = progress * 1.22 - lengthBias;

    if (sweep <= 0) return startChar;
    if (sweep >= 1) return targetChar;

    const pulse = Math.floor((progress * 34) + index) % 4;
    if (mode === 'decode') {
        if (pulse === 0 || sweep > 0.68) return targetChar;
        if (pulse === 1) return startChar;
        return slotChars[(index + Math.floor(progress * 19)) % slotChars.length];
    }

    if (pulse === 0 || sweep > 0.62) return targetChar;
    if (pulse === 1) return startChar;
    return slotChars[(index * 3 + Math.floor(progress * 23)) % slotChars.length];
}

function animateSlotText(element, realText, duration = 620, mode = 'decode') {
    if (!element) return;

    const stableName = getSlotRealName(element, realText);
    if (!stableName) return;

    const lineNodes = getSlotLineNodes(element);
    const cipherName = getSlotCipherName(element, stableName);
    const targetText = mode === 'encode' ? cipherName : stableName;
    const startFallback = mode === 'encode' ? stableName : cipherName;

    // HardLight + EVA: si hay líneas, animamos línea por línea para que el título no cambie
    // de geometría a mitad del hover. Esto protege DISEÑO DE INTERFAZ y DIRECCIÓN CREATIVA.
    const animationRows = lineNodes.length ? lineNodes.map((line, rowIndex) => {
        const original = line.dataset.original || '';
        const cipher = line.dataset.cipher || generateSkillCipher(original);
        const rowTarget = mode === 'encode' ? cipher : original;
        const rowFallback = mode === 'encode' ? original : cipher;
        const maxLength = Math.max(Array.from(rowTarget).length, Array.from(rowFallback).length);
        return {
            node: line,
            rowIndex,
            target: rowTarget,
            start: normalizeSlotString(line.textContent || rowFallback, maxLength),
            final: normalizeSlotString(rowTarget, maxLength),
            length: maxLength
        };
    }) : [{
        node: element,
        rowIndex: 0,
        target: targetText,
        start: normalizeSlotString(element.textContent || startFallback, Math.max(Array.from(targetText).length, Array.from(startFallback).length)),
        final: normalizeSlotString(targetText, Math.max(Array.from(targetText).length, Array.from(startFallback).length)),
        length: Math.max(Array.from(targetText).length, Array.from(startFallback).length)
    }];

    cancelSlotAnimation(element);
    element.classList.add('is-scrambling');
    element.classList.toggle('is-encoding', mode === 'encode');
    element.classList.toggle('is-decoding', mode !== 'encode');
    element.classList.toggle('is-encoded', mode === 'encode');

    let startTime = null;

    function update(time) {
        if (!startTime) startTime = time;
        const rawProgress = Math.min((time - startTime) / duration, 1);
        const progress = 1 - Math.pow(1 - rawProgress, 3);

        animationRows.forEach(row => {
            const rowDelay = row.rowIndex * 0.075;
            const rowProgress = Math.max(0, Math.min((progress - rowDelay) / (1 - rowDelay), 1));
            let currentString = '';

            for (let i = 0; i < row.length; i++) {
                currentString += slotBridgeGlyph(i, rowProgress, row.start[i] || ' ', row.final[i] || ' ', mode);
            }

            row.node.textContent = rawProgress >= 1 ? row.target : currentString.trimEnd();
        });

        if (rawProgress < 1) {
            element.dataset.animationId = requestAnimationFrame(update);
            return;
        }

        delete element.dataset.animationId;
        element.classList.remove('is-scrambling', 'is-encoding', 'is-decoding');
        element.classList.toggle('is-encoded', mode === 'encode');
        animationRows.forEach(row => { row.node.textContent = row.target; });
    }

    element.dataset.animationId = requestAnimationFrame(update);
}

function handleCardHover(cardElement, realName, audioId, customVolume) {
    const textEl = cardElement.querySelector('.slot-text');
    if (!textEl) return;
    const stableName = getSlotRealName(textEl, realName);
    if (audioId) {
        const sfx = document.getElementById(audioId);
        if (sfx) playAudio(sfx, customVolume || 0.5);
    }
    animateSlotText(textEl, stableName, 560, 'decode');
}

function handleCardLeave(cardElement, realName) {
    const textEl = cardElement.querySelector('.slot-text');
    if (!textEl) return;
    const stableName = getSlotRealName(textEl, realName);
    // HardLight + EVA: salida cifrada permanente hasta el próximo hover. Es vitrina técnica,
    // no ruido visual: termina estable, compacto y sin símbolos fuera de lugar.
    animateSlotText(textEl, stableName, 420, 'encode');
    window.setTimeout(() => {
        if (!cardElement.matches(':hover')) setSlotTextEncoded(textEl, stableName);
    }, 460);
}

// ================================================================
// HardLight + EVA: NEWS & FAQ RENDERING. Aquí se ajustan textos visibles y ritmo de tarjetas. Mantenerlo claro, directo y comprobable; nada de frases de relleno.
// ================================================================
function renderNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;
    const accentByCat = {
        'PORTAFOLIO': '#8BC34A',
        'DIRECCIÓN CREATIVA': '#00D4FF',
        'EXPERIMENTACIÓN WEB': '#8B5CF6',
        'PROTOCOLO': '#8BC34A',
        'EXPANSIÓN': '#00D4FF',
        'SISTEMA': '#3DC8B4'
    };

    grid.innerHTML = NEWS.map((n, i) => {
        const accent = accentByCat[n.cat] || '#8BC34A';
        const accentRgb = hexToRgbTuple(accent);
        const delay = i === 1 ? 'delay-100' : (i === 2 ? 'delay-200' : '');
        return `
            <article class="news-card aero-glass-card reveal ${delay}" style="--card-color: ${accent}; --card-color-rgb: ${accentRgb}; --news-flow-delay: ${i * 0.18}s;">
                <span class="news-card-signal" aria-hidden="true"></span>
                <div class="news-header">
                    <span class="news-chip" aria-hidden="true">
                        <span class="dot"></span>
                        <span class="txt">${n.cat}</span>
                    </span>
                    <span class="news-date">${n.date}</span>
                </div>
                <h3>${n.title}</h3>
                <p class="box-copy">${formatBoxText(n.desc)}</p>
            </article>
        `;
    }).join('');
}

function renderFaqs() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    container.innerHTML = FAQS.map((f, i) => `
        <div class="faq-item aero-glass-card reveal delay-${i}00" id="faq-item-${i}">
            <button onclick="toggleFaq(${i})" onmouseenter="startNumberRoll(this)" class="faq-btn" aria-expanded="false" aria-controls="faq-content-${i}">
                <div class="faq-btn-left">
                    <span class="faq-label number-roll" data-original="ARCHIVO_0${i + 1}">
                        ARCHIVO_0${i + 1}
                    </span>
                    <span class="faq-title">${f.q}</span>
                </div>
                <span class="faq-icon" id="faq-icon-${i}">+</span>
            </button>
            <div class="faq-content" id="faq-content-${i}" aria-hidden="true">
                <div class="faq-text">
                    <span class="faq-arrow" aria-hidden="true">&gt;</span>
                    <span class="box-copy">${formatBoxText(f.a)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleFaq(index) {
    const content = document.getElementById('faq-content-' + index);
    const icon = document.getElementById('faq-icon-' + index);
    if (!content || !icon) return;

    const allContents = document.querySelectorAll('.faq-content');
    allContents.forEach(el => {
        if (el !== content && el.classList.contains('open')) {
            gsap.to(el, {
                height: 0, duration: 0.5, ease: "power3.inOut", onComplete: () => {
                    el.classList.remove('open');
                    el.setAttribute('aria-hidden', 'true');
                }
            });
        }
    });

    document.querySelectorAll('[id^="faq-icon-"]').forEach(el => {
        if (el !== icon) {
            gsap.to(el, { rotation: 0, duration: 0.4, ease: "power2.out" });
            el.style.color = '#94A3B8';
            setTimeout(() => el.innerText = '+', 200);
        }
    });

    if (content.classList.contains('open')) {
        gsap.to(content, {
            height: 0, duration: 0.5, ease: "power3.inOut", onComplete: () => {
                content.classList.remove('open');
                content.setAttribute('aria-hidden', 'true');
            }
        });
        gsap.to(icon, { rotation: 0, duration: 0.4, ease: "power2.out" });
        icon.style.color = '#94A3B8';
        setTimeout(() => icon.innerText = '+', 200);
    } else {
        content.classList.add('open');
        content.setAttribute('aria-hidden', 'false');

        gsap.set(content, { height: "auto" });
        const targetHeight = content.offsetHeight;
        gsap.fromTo(content, { height: 0 }, { height: targetHeight, duration: 0.7, ease: "elastic.out(1, 0.6)" });

        const textEl = content.querySelector('.faq-text');
        if (textEl) {
            gsap.fromTo(textEl, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: "power2.out" });
        }

        gsap.to(icon, { rotation: 45, duration: 0.6, ease: "back.out(2)" });
        icon.style.color = '#00D4FF';
        icon.innerText = '-';
    }

    setTimeout(() => ScrollSystem.updateDimensions(), 700);
}

function startNumberRoll(btn) {
    const numEl = btn.querySelector('.number-roll');
    if (!numEl || numEl.dataset.rolling === '1') return;
    numEl.dataset.rolling = '1';
    const original = numEl.getAttribute('data-original');
    let count = 0;
    const max = 10;
    const interval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 99);
        numEl.innerText = 'ARCHIVO_' + (randomNum < 10 ? '0' + randomNum : randomNum);
        count++;
        if (count > max) {
            clearInterval(interval);
            numEl.innerText = original;
            delete numEl.dataset.rolling;
        }
    }, 30);
}

// ================================================================
// HardLight + EVA: AUDIO SYSTEM. Probar permisos del navegador antes de cambiar eventos de reproducción.
// ================================================================
function playAudio(audio, vol) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.volume = typeof vol === 'number' ? vol : 1;
    audio.play().catch(() => { });
}

function fadeAudio(audio, startVol, targetVol, duration, callback) {
    if (State.fadeInterval) clearInterval(State.fadeInterval);
    const steps = 30;
    const stepTime = duration / steps;
    const volStep = (targetVol - startVol) / steps;
    let currentStep = 0;
    audio.volume = startVol;

    State.fadeInterval = setInterval(() => {
        currentStep++;
        let newVol = startVol + (volStep * currentStep);
        if (newVol > 1) newVol = 1;
        if (newVol < 0) newVol = 0;
        audio.volume = newVol;
        if (currentStep >= steps) {
            clearInterval(State.fadeInterval);
            audio.volume = targetVol;
            if (callback) callback();
        }
    }, stepTime);
}

function toggleAudio() {
    if (!DOM.bgm) DOM.bgm = document.getElementById('bgmPlayer');
    if (!DOM.bgm) return;

    if (DOM.bgm.paused) {
        DOM.bgm.volume = 0;
        DOM.bgm.play().then(() => {
            updateAudioUI(true);
            fadeAudio(DOM.bgm, 0, State.volume, 1200);
        }).catch(() => { });
    } else {
        updateAudioUI(false);
        fadeAudio(DOM.bgm, DOM.bgm.volume, 0, 800, () => { DOM.bgm.pause(); });
    }
}

function changeVolume(val) {
    State.volume = parseFloat(val);
    document.documentElement.style.setProperty('--vol-pos', (State.volume * 100) + '%');

    if (DOM.sfxEnter) DOM.sfxEnter.volume = State.volume;
    if (DOM.sfxHover) DOM.sfxHover.volume = State.volume;
    if (DOM.sfxClick) DOM.sfxClick.volume = Math.min(State.volume, 0.8);
    if (DOM.sfxUiHover) DOM.sfxUiHover.volume = Math.min(State.volume, 0.6);

    if (!DOM.bgm) DOM.bgm = document.getElementById('bgmPlayer');
    if (DOM.bgm && !DOM.bgm.paused && DOM.bgm.volume > 0) {
        DOM.bgm.volume = State.volume;
    }
    if (DOM.bgm && State.volume > 0 && DOM.bgm.paused) {
        DOM.bgm.volume = 0;
        DOM.bgm.play().then(() => {
            fadeAudio(DOM.bgm, 0, State.volume, 600);
            updateAudioUI(true);
        }).catch(() => { });
    } else if (DOM.bgm && State.volume == 0) {
        DOM.bgm.pause();
        updateAudioUI(false);
    }
}

function updateAudioUI(isOn) {
    const icon = document.getElementById('audio-icon');
    const mobIcon = document.getElementById('mob-audio-icon');
    const val = isOn ? 'volume_up' : 'volume_off';
    if (icon) icon.innerText = val;
    if (mobIcon) mobIcon.innerText = val;
    if (isOn) {
        if (icon) icon.style.color = '#3B82F6';
        if (mobIcon) mobIcon.parentElement.style.color = '#3B82F6';
    } else {
        if (icon) icon.style.color = '';
        if (mobIcon) mobIcon.parentElement.style.color = '';
    }
}

// ================================================================
// HardLight + EVA: INTERSECTION OBSERVER. Controla reveals; ajustar timings solo con pruebas de scroll.
// ================================================================
function initIntersectionObserver() {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    else return;

    gsap.utils.toArray('.reveal').forEach(el => {
        let delay = 0;
        if (el.classList.contains('delay-100')) delay = 0.12;
        else if (el.classList.contains('delay-200')) delay = 0.24;
        else if (el.classList.contains('delay-300')) delay = 0.36;

        gsap.set(el, { autoAlpha: 0, y: 50, filter: 'blur(4px)' });

        ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            onEnter: () => {
                gsap.to(el, {
                    autoAlpha: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    delay: delay,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            },
            once: true
        });
    });
}

function triggerReveals() {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

// ================================================================
// HardLight + EVA: NAVIGATION. Mantiene el estado activo y el desplazamiento entre secciones.
// ================================================================
function scrollToSection(id) {
    State.isManualScroll = true;
    updateNavActive(id);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { State.isManualScroll = false; }, 1000);
}

function updateNavActive(id) {
    document.querySelectorAll('.nav-link, .mobile-btn').forEach(b => b.classList.remove('active'));
    const nav = document.getElementById('nav-' + id);
    const mob = document.getElementById('mob-' + id);
    if (nav) nav.classList.add('active');
    if (mob) mob.classList.add('active');
}

// ================================================================
// HardLight + EVA: MODAL SYSTEM. Mantener apertura/cierre sincronizados para evitar parpadeos.
// ================================================================
function openModal(type) {
    restoreAllSlotTexts();
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const text = document.getElementById('modal-text');

    const data = {
        protocol: {
            t: 'MI CRITERIO DE TRABAJO',
            b: 'HardLight Portfolio muestra cómo trabajo una web: claridad primero, identidad visual después y movimiento solo cuando aporta. Me interesa que una página se sienta diseñada, desarrollada y dirigida con intención, no inflada con efectos porque sí. Si un detalle no mejora la lectura o la experiencia, se ajusta hasta que deje de estorbar.'
        },
        legal: {
            t: 'USO DE ESTA REFERENCIA',
            b: 'Este sitio funciona como portafolio y referencia visual de HardLight Dev. Los textos, estilos e interacciones están pensados para presentar habilidades de desarrollo web, diseño de interfaz y dirección creativa. Puede servir como referencia, pero debe adaptarse antes de reutilizarse en otro contexto profesional.'
        },
        privacidad: {
            t: 'PRIVACIDAD',
            b: 'Esta versión del portafolio no necesita datos personales para navegar. Si más adelante se añaden formularios, analítica o contacto directo, deben configurarse avisos claros y un manejo responsable de la información, sin convertir una página creativa en una trampa de datos.'
        },
        creditos: {
            t: 'CREDITOS',
            b: 'Dirección creativa, diseño y desarrollo web: HardLight Dev.\nAsistencia técnica, revisión visual y paciencia digital: EVA.\nSistema visual: HardLight Aero Portfolio.'
        }
    };

    if (data[type] && modal) {
        title.innerText = data[type].t;
        text.innerHTML = formatBoxText(data[type].b);
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-visible');
    } else if (type.startsWith('project-') && modal) {
        const tId = parseInt(type.split('-')[1]);
        const item = PORTFOLIO_ITEMS.find(t => t.id === tId);
        if (item) {
            title.innerText = item.name + ' // ' + item.role;
            text.innerHTML = formatBoxText(item.desc || 'Información clasificada.');
            modal.classList.remove('modal-hidden');
            modal.classList.add('modal-visible');
        }
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    modal.classList.add('modal-hidden');
}

// ================================================================
// HardLight + EVA: AERO THEME TOGGLE. Probar día/noche en 1080p antes de tocar colores.
// ================================================================
function initAeroTheme() {
    const savedTheme = localStorage.getItem('aero-theme');
    if (savedTheme === 'night') {
        document.documentElement.setAttribute('data-aero-night', 'true');
    }
}

function toggleAeroTheme() {
    const html = document.documentElement;
    const isNight = html.hasAttribute('data-aero-night');

    if (DOM.sfxClick && State.entered) playAudio(DOM.sfxClick, 0.3);

    const performToggle = () => {
        if (isNight) {
            html.removeAttribute('data-aero-night');
            localStorage.setItem('aero-theme', 'day');
        } else {
            html.setAttribute('data-aero-night', 'true');
            localStorage.setItem('aero-theme', 'night');
        }
    };

    if (document.startViewTransition) {
        document.startViewTransition(performToggle);
    } else {
        // HardLight + EVA: Fallback para navegadores sin View Transitions. Mantiene el cambio de tema estable.
        const overlay = document.getElementById('theme-wipe-overlay');
        if (overlay) {
            overlay.classList.add('wiping');
            setTimeout(() => {
                performToggle();
                setTimeout(() => overlay.classList.remove('wiping'), 100);
            }, 400);
        } else {
            performToggle();
        }
    }
}
