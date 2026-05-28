// HardLight + EVA: Runtime integrity guard for presentation builds. Candado de exhibición: no es blindaje militar, pero evita manos curiosas y clicks demasiado felices.
(function () {
    // HardLight + EVA: Block Right Click. No cambiar tamaños del cursor sin revisar click, hover y middle-click.
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // HardLight + EVA: Block Keyboard Shortcuts. Candado de exhibición: no es blindaje militar, pero evita manos curiosas y clicks demasiado felices.
    document.addEventListener('keydown', function (e) {
        // HardLight + EVA: F12. Candado de exhibición: no es blindaje militar, pero evita manos curiosas y clicks demasiado felices.
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
        }

        // HardLight + EVA: Ctrl+Shift+I (Windows/Linux DevTools) or Cmd+Opt+I (Mac DevTools). Candado de exhibición: no es blindaje militar, pero evita manos curiosas y clicks demasiado felices.
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
            e.preventDefault();
        }

        // HardLight + EVA: Ctrl+Shift+J (Windows/Linux Console) or Cmd+Opt+J (Mac Console). Zona delicada: revisar hover, scroll y móvil antes de cambiar.
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
            e.preventDefault();
        }

        // HardLight + EVA: Ctrl+Shift+C (Windows/Linux Inspect Element) or Cmd+Opt+C (Mac Inspect Element). Funciona estable; documentar antes de cambiar.
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
            e.preventDefault();
        }

        // HardLight + EVA: Ctrl+U (Windows/Linux View Source) or Cmd+U (Mac View Source). Candado de exhibición: no es blindaje militar, pero evita manos curiosas y clicks demasiado felices.
        if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
            e.preventDefault();
        }

        // HardLight + EVA: Ctrl+S / Cmd+S (Save Page). No tocar sin probar 1920x1080 y responsive.
        if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
            e.preventDefault();
        }

        // HardLight + EVA: Ctrl+P / Cmd+P (Print Page). No tocar sin probar 720p, 1080p y 4K.
        if ((e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p')) {
            e.preventDefault();
        }
    });

    // HardLight + EVA: Additional anti-debug tactic: debugger looping. Candado de exhibición: no es blindaje militar, pero evita manos curiosas y clicks demasiado felices.
    // HardLight + EVA: This will pause the thread constantly if DevTools is somehow opened. Candado de exhibición: no es blindaje militar, pero evita manos curiosas y clicks demasiado felices.
    setInterval(function () {
        var before = new Date().getTime();
        debugger;
        var after = new Date().getTime();
        if (after - before > 100) {
            // HardLight + EVA: Someone paused the debugger. Candado de exhibición: no es blindaje militar, pero evita manos curiosas y clicks demasiado felices.
            document.body.innerHTML = "Brecha de seguridad detectada no permitida.";
        }
    }, 1000);
})();
