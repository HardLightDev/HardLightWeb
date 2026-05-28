const express = require('express');
const path = require('path');
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');
const htmlMinifier = require('html-minifier');
const postcss = require('postcss');
const cssnano = require('cssnano');

const app = express();
const PORT = process.env.PORT || 3000;

// ================================================================
// HardLight + EVA: CONFIGURACIÓN DE RUTAS Y CACHÉ. Se dejó estable después de pruebas reales de layout y contraste.
// ================================================================
const publicDir = process.env.PUBLIC_HTML_SOURCE || __dirname;
const cache = new Map(); // HardLight + EVA: caché universal en RAM; rápido, simple, y no se toca sin medir memoria.

// HardLight + EVA: Función Helper para invalidar caché. Cambiar con precisión; este bloque afecta varias piezas.
function getCacheKey(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const stat = fs.statSync(filePath);
    return `${filePath}_${stat.mtimeMs}`;
}

// ================================================================
// HardLight + EVA: PROCESADORES DE OFUSCACIÓN. Zona delicada: revisar hover, scroll y móvil antes de cambiar.
// ================================================================

function obfuscateJS(code) {
    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 1,
        debugProtection: true,
        debugProtectionInterval: 4000,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 5,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayEncoding: ['rc4'],
        stringArrayIndexShift: true,
        stringArrayWrappersCount: 5,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersType: 'function',
        stringArrayThreshold: 1,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
    });
    return obfuscationResult.getObfuscatedCode();
}

function obfuscateHTML(code) {
    return htmlMinifier.minify(code, {
        collapseWhitespace: true,
        removeComments: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true, // HardLight + EVA: minifica CSS inline; no tocar si no quieres perseguir espacios inesperados.
        minifyJS: true   // HardLight + EVA: minifica JS inline básico; básico, sí, pero puede romper compatibilidad si se cambia sin prueba.
    });
}

async function obfuscateCSS(code) {
    const result = await postcss([cssnano({
        preset: ['default', {
            discardComments: { removeAll: true },
            normalizeWhitespace: true
        }]
    })]).process(code, { from: undefined });
    return result.css;
}

// ================================================================
// HardLight + EVA: MIDDLEWARE DE OFUSCACIÓN AL VUELO TIPO FULLSTACK. No tocar sin probar 1920x1080 y responsive.
// ================================================================
app.use(async (req, res, next) => {
    // HardLight + EVA: Solo interceptar archivos específicos en la raíz o carpetas, ignorando dependencias. No mover sin revisar responsive y saltos de layout.
    if (!req.path.includes('node_modules') && !req.path.includes('.git')) {
        let filePath = path.join(publicDir, req.path);

        // HardLight + EVA: Si piden "/", servimos index.html. Se dejó estable después de pruebas reales de layout y contraste.
        if (req.path === '/') {
            filePath = path.join(publicDir, 'index.html');
        }

        // HardLight + EVA: Prevenir Path Traversal attacks. Mantener porque sostiene vidrio, contraste y jerarquía.
        if (!filePath.startsWith(publicDir)) {
            return res.status(403).send('Forbidden');
        }

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();

            // HardLight + EVA: Solo procesamos HTML, CSS y JS. Cambiar con precisión; este bloque afecta varias piezas.
            if (ext === '.js' || ext === '.css' || ext === '.html' || req.path === '/') {

                const cacheKey = getCacheKey(filePath);

                // HardLight + EVA: 1. Revisar si la versión ya procesada está en RAM. Si parece exagerado, recuerda que un margen de 1px ya intentó destruir la estabilidad.
                if (cache.has(cacheKey)) {
                    if (ext === '.js') res.setHeader('Content-Type', 'application/javascript');
                    else if (ext === '.css') res.setHeader('Content-Type', 'text/css');
                    else res.setHeader('Content-Type', 'text/html; charset=UTF-8'); // HardLight + EVA: parche CloudLinux; no elegante, pero nos salvó del pantano del hosting.

                    return res.send(cache.get(cacheKey));
                }

                // HardLight + EVA: 2. Si no está, lo leemos del disco. Zona delicada: revisar hover, scroll y móvil antes de cambiar.
                let code = fs.readFileSync(filePath, 'utf8');
                let processedCode = code;

                try {
                    // HardLight + EVA: 3. Aplicar ofuscación según el tipo. Bitácora de guerra elegante: funciona, respira, no lo conviertas en experimento de madrugada.
                    if (ext === '.js') {
                        res.setHeader('Content-Type', 'application/javascript');
                        processedCode = obfuscateJS(code);
                    } else if (ext === '.css') {
                        res.setHeader('Content-Type', 'text/css');
                        processedCode = await obfuscateCSS(code);
                    } else if (ext === '.html' || req.path === '/') {
                        res.setHeader('Content-Type', 'text/html; charset=UTF-8'); // HardLight + EVA: parche CloudLinux; no elegante, pero nos salvó del pantano del hosting.
                        processedCode = obfuscateHTML(code);
                    }

                    // HardLight + EVA: 4. Limpiar caché antigua (del mismo path) y guardar la nueva. mantener intención, escala y compatibilidad.
                    for (const key of cache.keys()) {
                        if (key.startsWith(filePath)) cache.delete(key);
                    }
                    cache.set(cacheKey, processedCode);

                    // HardLight + EVA: 5. Enviar respuesta procesada. No tocar sin probar 1920x1080 y responsive.
                    return res.send(processedCode);

                } catch (error) {
                    console.error(`[ERROR] Falló procesamiento en caliente de ${req.path}:`, error.message);
                    // HardLight + EVA: Si falla, enviamos el original (fallback seguro). No tocar sin probar 720p, 1080p y 4K.
                    return res.send(code);
                }
            }
        }
    }

    // HardLight + EVA: Si no cayó en nuestros filtros (imágenes, fuentes, etc.), que lo sirva express.static. No mover sin revisar responsive y saltos de layout.
    next();
});

// ================================================================
// HardLight + EVA: SERVIDOR DE ARCHIVOS ESTÁTICOS. Mantener porque sostiene vidrio, contraste y jerarquía.
// ================================================================
app.use(express.static(publicDir));

// HardLight + EVA: Iniciar servidor. Si parece exagerado, recuerda que un margen de 1px ya intentó destruir la estabilidad.
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 HARDLIGHT STATIC RUNTIME SERVER START `);
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`🛡️  Pipeline: JS hardening | CSS optimization | HTML minification`);
    console.log(`=================================================`);
});
