# HardLight CSS Build Pipeline
# Genera el CSS principal cuando se necesita reconstruir la capa visual desde fuente.

import codecs
css = '''@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&family=Outfit:wght@400;700;900&family=Varela+Round&display=swap');

:root {
  --lime: #76b900;
  --lime-b: #a4e500;
  --lime-dk: #4b7a00;
  --cyan: #00d2ff;
  --cyan-dim: rgba(0,210,255,0.2);
  --cyan-glow: rgba(0,210,255,0.7);
  --lime-dim: rgba(118,185,0,0.2);
  --lime-glow: rgba(118,185,0,0.6);

  --glass-bg: rgba(255, 255, 255, 0.45);
  --glass-border: rgba(255, 255, 255, 0.8);
  --glass-highlight: rgba(255, 255, 255, 0.95);
  --glass-blur: blur(28px) saturate(180%);
  
  --t-main: #061f33;
  --t-sec: #22435e;
  --t-muted: #50718c;

  --bg-day: linear-gradient(145deg, #e0f2fe 0%, #bae6fd 40%, #7dd3fc 70%, #d9f99d 100%);
  --bg-night: linear-gradient(145deg, #022c22 0%, #064e3b 40%, #0f766e 70%, #0284c7 100%);

  --shadow-card: 0 12px 36px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1);
  --shadow-btn: 0 8px 20px rgba(0,0,0,0.15), inset 0 2px 3px rgba(255,255,255,0.9), inset 0 -10px 15px rgba(0,0,0,0.1);
  --shadow-glow: 0 0 20px var(--cyan-glow);

  --sidebar: 85px;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

html[data-aero-night] {
  --glass-bg: rgba(10, 25, 41, 0.55);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-highlight: rgba(255, 255, 255, 0.3);
  --t-main: #f0f9ff;
  --t-sec: #bae6fd;
  --t-muted: #7dd3fc;
  --shadow-card: 0 12px 36px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  --shadow-btn: 0 8px 20px rgba(0,0,0,0.4), inset 0 2px 3px rgba(255,255,255,0.3), inset 0 -10px 15px rgba(0,0,0,0.4);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; }
html::-webkit-scrollbar { display: none; }
body { background: var(--bg-day); background-attachment: fixed; color: var(--t-main); font-family: 'Nunito', sans-serif; overflow-x: hidden; cursor: none; user-select: none; -webkit-font-smoothing: antialiased; }
html[data-aero-night] body { background: var(--bg-night); background-attachment: fixed; }

body::before, body::after { content: ''; position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(60px); }
body::before { top: -10%; right: -5%; width: 50vw; height: 50vw; background: radial-gradient(circle, var(--lime-dim) 0%, transparent 60%); animation: floatOrb 12s ease-in-out infinite; }
body::after { bottom: -15%; left: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, var(--cyan-dim) 0%, transparent 60%); animation: floatOrb 15s ease-in-out infinite reverse; }

@keyframes floatOrb { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.05); } }
@keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
@keyframes aeroBoot { 0%, 60% { opacity: 1; } 100% { opacity: 0; pointer-events: none; } }
@keyframes glossSweep { 0% { left: -100%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { left: 200%; opacity: 0; } }
@keyframes etherealPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; text-shadow: 0 0 15px #fff; } }

.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
a, button, input { cursor: none !important; border: none; background: none; outline: none; font: inherit; }

#cursor { position: fixed; width: 34px; height: 34px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 0 15px rgba(0,210,255,0.5), inset 0 0 10px rgba(255,255,255,0.5); pointer-events: none; z-index: 999998; transform: translate(-50%, -50%); transition: width 0.2s, height 0.2s, border-color 0.2s; backdrop-filter: blur(2px); }
#cursor-dot { position: fixed; width: 8px; height: 8px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 10px var(--cyan-glow); pointer-events: none; z-index: 999999; transform: translate(-50%, -50%); }
#cursor.hovered { width: 50px; height: 50px; border-color: var(--lime); box-shadow: 0 0 20px var(--lime-glow); }
#cursor.clicking { width: 24px; height: 24px; border-width: 4px; }
html[data-aero-night] #cursor { border-color: var(--cyan); box-shadow: 0 0 20px var(--cyan-glow); }

#gate-container { position: fixed; inset: 0; z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #e0f2fe, #bae6fd); transition: opacity 0.8s, visibility 0.8s; }
#gate-container.door-burst { opacity: 0; visibility: hidden; }
.gate-sky { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(125,211,252,0.8) 60%, rgba(2,132,199,0.8) 100%); }
.gate-scene { position: relative; z-index: 20; display: flex; flex-direction: column; align-items: center; }
.celestial-logo { display: flex; flex-direction: column; align-items: center; animation: floatLogo 6s ease-in-out infinite; }
.logo-icon-wrapper { width: 44px; height: 44px; color: #fff; filter: drop-shadow(0 0 20px rgba(255,255,255,0.9)); margin-bottom: 24px; animation: pulse 3s infinite; }
.logo-icon-wrapper svg { width: 100%; height: 100%; }
.logo-text { font-family: 'Outfit', sans-serif; font-size: clamp(3.5rem, 10vw, 7rem); color: #fff; letter-spacing: 0.25em; text-shadow: 0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(0,212,255,0.4); font-weight: 900; }
.logo-subtext { font-family: monospace; font-size: 12px; color: #0284c7; letter-spacing: 0.5em; text-transform: uppercase; margin-top: 10px; font-weight: bold; }
.click-to-start { margin-top: 50px; display: flex; flex-direction: column; align-items: center; gap: 16px; font-family: 'Nunito', sans-serif; font-size: 12px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,0.9); font-weight: 800; animation: etherealPulse 2.5s infinite; }
.click-to-start .line { width: 2px; height: 40px; background: linear-gradient(to bottom, #fff, transparent); }

.light-door-container { position: absolute; inset: 0; z-index: 8; opacity: 0; overflow: hidden; transition: opacity 0.4s; }
.door-panel { position: absolute; top: 0; bottom: 0; width: 50vw; background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(224,242,254,0.6)); backdrop-filter: blur(30px); transition: transform 1.5s cubic-bezier(0.7,0,0.2,1); }
.door-panel::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); }
.door-panel.left { left: 0; border-right: 2px solid rgba(255,255,255,0.9); box-shadow: inset -5px 0 20px rgba(255,255,255,0.5); }
.door-panel.right { right: 0; border-left: 2px solid rgba(255,255,255,0.9); box-shadow: inset 5px 0 20px rgba(255,255,255,0.5); }
.central-slit { position: absolute; top: 0; bottom: 0; left: 50%; width: 4px; background: #fff; transform: translateX(-50%) scaleY(0); box-shadow: 0 0 30px 10px #fff, 0 0 60px 20px var(--cyan-glow); opacity: 0; z-index: 9; transition: transform 0.6s, opacity 0.4s; }

#gate-container.door-opening .light-door-container, #gate-container.door-opening .central-slit { opacity: 1; }
#gate-container.door-opening .central-slit { transform: translateX(-50%) scaleY(1); }
#gate-container.door-burst .door-panel.left { transform: translateX(-100vw); }
#gate-container.door-burst .door-panel.right { transform: translateX(100vw); }
#entry-flash { position: fixed; inset: 0; z-index: 9001; opacity: 0; pointer-events: none; background: radial-gradient(circle at center, #fff 0%, rgba(186,230,253,0.9) 40%, rgba(125,211,252,0.8) 100%); transition: opacity 0.8s ease-in; }

#aero-theme-toggle { position: fixed; top: 24px; right: 24px; z-index: 9000; display: flex; align-items: center; gap: 8px; background: var(--glass-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-top: 1px solid var(--glass-highlight); padding: 8px 16px; border-radius: 40px; box-shadow: var(--shadow-card); font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: var(--t-main); opacity: 0; visibility: hidden; transition: all 0.3s; cursor: pointer; }
#aero-theme-toggle.visible { opacity: 1; visibility: visible; }
#aero-theme-toggle:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.1), inset 0 2px 5px rgba(255,255,255,0.8); }
.toggle-track { width: 40px; height: 20px; background: rgba(0,0,0,0.1); border-radius: 10px; position: relative; box-shadow: inset 0 2px 5px rgba(0,0,0,0.15); }
.toggle-thumb { width: 16px; height: 16px; background: linear-gradient(135deg, #fff, #f0f9ff); border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.4s var(--ease-spring); box-shadow: 0 2px 5px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.9); }
html[data-aero-night] .toggle-thumb { transform: translateX(20px); background: linear-gradient(135deg, #7dd3fc, #0284c7); border-color: #7dd3fc; box-shadow: 0 0 10px var(--cyan-glow); }

.main-content { position: relative; z-index: 10; width: 100%; padding-right: calc(var(--sidebar) + 20px); opacity: 0; transform: scale(1.03); filter: blur(10px); transition: opacity 1.5s var(--ease-out), transform 1.5s var(--ease-out), filter 1.5s var(--ease-out); }
.main-content.revealed { opacity: 1; transform: scale(1); filter: blur(0); }
@media (max-width: 1023px) { .main-content { padding-right: 0; padding-bottom: 80px; } }

.desktop-sidebar { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); height: auto; padding: 24px 12px; background: var(--glass-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-top: 1px solid var(--glass-highlight); border-left: 1px solid var(--glass-highlight); border-radius: 40px; box-shadow: var(--shadow-card); z-index: 50; display: none; flex-direction: column; align-items: center; gap: 32px; }
@media (min-width: 1024px) { .desktop-sidebar { display: flex; } }
.logo-box { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #fff, #bae6fd); border: 2px solid #fff; box-shadow: var(--shadow-btn); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; transition: transform 0.3s var(--ease-spring); cursor: pointer; }
.logo-box::before { content: ''; position: absolute; top: 2px; left: 10%; right: 10%; height: 40%; background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.1)); border-radius: 50px 50px 20px 20px; }
.logo-box span { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 900; color: #0284c7; z-index: 1; text-shadow: 0 1px 2px rgba(255,255,255,0.8); }
.logo-box:hover { transform: scale(1.1); box-shadow: 0 10px 25px rgba(0,212,255,0.4), inset 0 2px 5px #fff; }

.sidebar-nav { display: flex; flex-direction: column; gap: 16px; }
.nav-link { width: 56px; height: 56px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); color: var(--t-sec); font-family: 'Nunito', sans-serif; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; justify-content: center; transition: all 0.3s var(--ease-spring); position: relative; overflow: hidden; cursor: pointer; }
.nav-link:hover, .nav-link.active { background: linear-gradient(135deg, #bae6fd, #38bdf8); color: #0c4a6e; border-color: #fff; box-shadow: var(--shadow-btn); transform: scale(1.1); }
.nav-link::before { content: ''; position: absolute; top: 2px; left: 15%; right: 15%; height: 35%; background: linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0)); border-radius: 20px 20px 10px 10px; }

.audio-btn-enhanced { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #d9f99d, #84cc16); border: 2px solid #fff; color: #3f6212; box-shadow: var(--shadow-btn); display: flex; align-items: center; justify-content: center; position: relative; transition: all 0.3s var(--ease-spring); overflow: hidden; cursor: pointer; }
.audio-btn-enhanced::before { content: ''; position: absolute; top: 2px; left: 15%; right: 15%; height: 35%; background: linear-gradient(to bottom, rgba(255,255,255,0.9), transparent); border-radius: 20px 20px 10px 10px; }
.audio-btn-enhanced:hover { transform: scale(1.1); box-shadow: 0 10px 25px rgba(132,204,22,0.5), inset 0 2px 5px #fff; }

.section-observer { min-height: 100vh; padding: 100px 24px; position: relative; display: flex; flex-direction: column; justify-content: center; }
@media (min-width: 1024px) { .section-observer { padding: 100px 120px; } }
.reveal { opacity: 0; transform: translateY(40px); transition: all 1s var(--ease-out); }
.reveal.active { opacity: 1; transform: translateY(0); }
.delay-100 { transition-delay: 0.1s; } .delay-200 { transition-delay: 0.2s; }

.hero-section { overflow: hidden; }
.hero-bg-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
.hero-bg-text span { font-family: 'Outfit', sans-serif; font-size: 15vw; font-weight: 900; color: rgba(255,255,255,0.15); white-space: nowrap; text-shadow: 0 10px 30px rgba(0,0,0,0.05); }
html[data-aero-night] .hero-bg-text span { color: rgba(255,255,255,0.03); text-shadow: none; }

.hero-content { max-width: 900px; position: relative; z-index: 10; }
.hero-tagline { font-size: 13px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; color: var(--t-sec); display: flex; align-items: center; gap: 12px; margin-bottom: 24px; background: var(--glass-bg); padding: 10px 24px; border-radius: 30px; display: inline-flex; border: 1px solid var(--glass-border); box-shadow: var(--shadow-card); backdrop-filter: var(--glass-blur); }
.pulse-star { font-size: 20px; color: var(--cyan); animation: pulse 2s infinite; text-shadow: 0 0 10px var(--cyan-glow); }
.aero-title { font-family: 'Varela Round', sans-serif; font-size: clamp(3.5rem, 8vw, 6.5rem); font-weight: 900; line-height: 1; color: var(--t-main); margin-bottom: 32px; letter-spacing: -0.03em; text-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.aero-title-glow { background: linear-gradient(90deg, #0284c7, #38bdf8, #84cc16); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15)); }

.hero-paragraph { font-size: 1.25rem; line-height: 1.7; color: var(--t-sec); max-width: 700px; margin-bottom: 48px; font-weight: 600; background: var(--glass-bg); padding: 24px; border-radius: 20px; border: 1px solid var(--glass-border); box-shadow: var(--shadow-card); backdrop-filter: var(--glass-blur); border-left: 6px solid var(--cyan); }

.hero-actions { display: flex; gap: 24px; flex-wrap: wrap; }
.btn-casino { background: linear-gradient(to bottom, #d9f99d, #84cc16); border: 1px solid #fff; box-shadow: var(--shadow-btn); border-radius: 40px; padding: 18px 48px; color: #3f6212; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; position: relative; overflow: hidden; transition: transform 0.3s var(--ease-spring), box-shadow 0.3s; cursor: pointer; }
.btn-casino::before { content: ''; position: absolute; top: 2px; left: 10px; right: 10px; height: 40%; background: linear-gradient(to bottom, rgba(255,255,255,0.9), transparent); border-radius: 30px 30px 10px 10px; pointer-events: none; }
.btn-casino::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.8), transparent); transform: skewX(-25deg); animation: glossSweep 4s infinite; pointer-events: none; }
.btn-casino:hover { transform: scale(1.05) translateY(-3px); box-shadow: 0 15px 30px rgba(132,204,22,0.4), inset 0 2px 5px #fff; color: #1a2e05; }
.btn-casino:active { transform: scale(0.95); }

.btn-protocolo { background: var(--glass-bg); border: 1px solid var(--glass-border); box-shadow: var(--shadow-card); border-radius: 40px; padding: 18px 48px; color: var(--t-main); font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; backdrop-filter: var(--glass-blur); transition: all 0.3s var(--ease-spring); position: relative; overflow: hidden; cursor: pointer; }
.btn-protocolo::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.6), rgba(255,255,255,0)); transform: translateX(-100%); transition: transform 0.5s; }
.btn-protocolo:hover { background: rgba(255,255,255,0.8); border-color: #fff; transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
.btn-protocolo:hover::before { transform: translateX(100%); }

.easter-egg-btn { display: inline-flex; align-items: center; gap: 12px; padding: 12px 24px; border-radius: 30px; background: rgba(236,72,153,0.1); transition: all 0.3s; position: relative; overflow: hidden; border: 1px solid rgba(236,72,153,0.3); backdrop-filter: blur(10px); cursor: pointer; }
.easter-egg-btn:hover { background: rgba(236,72,153,0.2); box-shadow: 0 0 20px rgba(236,72,153,0.4); border-color: #EC4899; transform: scale(1.05); }
.signal-dot { width: 8px; height: 8px; background: #EC4899; border-radius: 50%; box-shadow: 0 0 10px #EC4899; animation: pulse 1s infinite; }
.signal-text { font-family: monospace; font-size: 11px; font-weight: bold; letter-spacing: 0.2em; color: #EC4899; z-index: 2; }

.aero-glass-card, .info-box, .faq-item { background: var(--glass-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-top: 1.5px solid var(--glass-highlight); border-left: 1.5px solid var(--glass-highlight); border-radius: 24px; box-shadow: var(--shadow-card); position: relative; overflow: hidden; }
.aero-glass-card::before, .info-box::before, .faq-item::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 50%; background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent); pointer-events: none; border-radius: 24px 24px 0 0; }

.section-header h2 { font-family: 'Outfit', sans-serif; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; color: var(--t-main); margin-bottom: 16px; text-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.section-divider { width: 80px; height: 4px; background: linear-gradient(90deg, var(--cyan), var(--lime)); border-radius: 4px; box-shadow: 0 0 15px var(--cyan-glow); margin-bottom: 24px; }
.section-hint { font-size: 14px; font-weight: 600; color: var(--t-sec); }

.talents-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 40px; margin-top: 60px; }
.roster-card { height: 480px; position: relative; perspective: 1500px; transform-style: preserve-3d; cursor: pointer; }
.roster-card .aero-glass-card { position: absolute; inset: 0; transition: transform 0.5s var(--ease-spring), box-shadow 0.5s; padding: 12px; }
.roster-card:hover .aero-glass-card { transform: translateY(-15px) rotateX(5deg); box-shadow: 0 30px 60px rgba(0,0,0,0.2), inset 0 2px 10px #fff; border-color: #fff; }
.card-chip { position: absolute; top: 24px; left: 24px; background: linear-gradient(135deg, #38bdf8, #0284c7); padding: 6px 16px; border-radius: 30px; font-family: monospace; font-weight: 900; color: #fff; font-size: 12px; box-shadow: var(--shadow-btn); z-index: 20; border: 1px solid rgba(255,255,255,0.6); }
.talent-art-container { width: 100%; height: 100%; border-radius: 16px; overflow: hidden; position: relative; background: rgba(0,0,0,0.05); }
.talent-art-container img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s var(--ease-out); }
.roster-card:hover .talent-art-container img { transform: scale(1.12); }
.card-content-wrapper { position: absolute; bottom: 12px; left: 12px; right: 12px; background: var(--glass-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); padding: 20px; border-radius: 16px; z-index: 30; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-top: 1px solid rgba(255,255,255,0.9); }
.slot-text { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 900; color: var(--t-main); margin-top: 4px; }

.news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; margin-top: 40px; }
.news-card { padding: 32px; transition: transform 0.4s var(--ease-spring), box-shadow 0.4s; cursor: pointer; }
.news-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.15), inset 0 2px 10px #fff; border-color: #fff; }
.news-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.news-chip { background: var(--glass-bg); padding: 6px 14px; border-radius: 20px; font-family: monospace; font-size: 11px; font-weight: 800; color: var(--t-main); border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.news-chip .dot { width: 8px; height: 8px; background: var(--card-color); border-radius: 50%; box-shadow: 0 0 10px var(--card-color); }
.news-card h3 { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 800; color: var(--t-main); margin-bottom: 12px; line-height: 1.3; }
.news-card p { font-family: monospace; font-size: 13px; color: var(--t-sec); line-height: 1.6; }

.info-box { padding: 48px; margin-top: 40px; }
.info-header { border-bottom: 2px solid rgba(255,255,255,0.4); padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; }
.info-header h3 { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; color: var(--cyan); text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.info-desc { font-size: 16px; font-weight: 600; line-height: 1.8; color: var(--t-main); margin-bottom: 32px; }
.info-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; list-style: none; font-family: 'Nunito', sans-serif; font-weight: 700; color: var(--t-sec); }

.faq-container { margin-top: 40px; display: flex; flex-direction: column; gap: 20px; }
.faq-item { padding: 0; transition: transform 0.3s; }
.faq-item:hover { transform: scale(1.02); box-shadow: 0 15px 30px rgba(0,0,0,0.1); border-color: #fff; }
.faq-btn { width: 100%; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
.faq-btn-left { display: flex; align-items: center; gap: 24px; }
.faq-label { background: var(--glass-bg); padding: 8px 16px; border-radius: 20px; font-family: monospace; font-size: 12px; font-weight: 800; color: var(--cyan); border: 1px solid var(--glass-border); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.faq-title { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 800; color: var(--t-main); }
.faq-icon { width: 32px; height: 32px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--cyan); box-shadow: var(--shadow-btn); transition: transform 0.4s; }
.faq-btn[aria-expanded="true"] .faq-icon { transform: rotate(45deg); background: var(--cyan); color: #fff; }
.faq-content { max-height: 0; overflow: hidden; transition: max-height 0.5s var(--ease-spring); }
.faq-content.open { max-height: 300px; }
.faq-text { padding: 0 32px 32px 32px; font-size: 15px; font-weight: 600; color: var(--t-sec); line-height: 1.8; }

.mobile-dock { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 400px; height: 70px; background: var(--glass-bg); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-top: 1.5px solid var(--glass-highlight); border-radius: 40px; box-shadow: var(--shadow-card); display: grid; grid-template-columns: repeat(5, 1fr); z-index: 1000; padding: 0 10px; }
@media (min-width: 1024px) { .mobile-dock { display: none; } }
.mobile-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--t-muted); gap: 4px; font-family: 'Nunito', sans-serif; font-size: 9px; font-weight: 900; transition: all 0.3s; position: relative; cursor: pointer; }
.mobile-btn .material-symbols-outlined { font-size: 24px; transition: transform 0.3s var(--ease-spring); }
.mobile-btn.active { color: var(--cyan); }
.mobile-btn.active .material-symbols-outlined { transform: translateY(-4px); filter: drop-shadow(0 4px 6px rgba(0,212,255,0.4)); }
.mobile-btn.active::after { content: ''; position: absolute; bottom: 6px; width: 6px; height: 6px; background: var(--cyan); border-radius: 50%; box-shadow: 0 0 10px var(--cyan-glow); }

.main-footer { padding: 80px 24px 60px 24px; text-align: center; position: relative; z-index: 10; background: linear-gradient(to top, rgba(255,255,255,0.5), transparent); }
.footer-logo { font-family: 'Outfit', sans-serif; font-size: clamp(3rem, 8vw, 6rem); font-weight: 900; color: rgba(255,255,255,0.5); letter-spacing: 0.3em; margin-bottom: 40px; text-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.footer-links { display: flex; justify-content: center; gap: 40px; margin-bottom: 40px; }
.footer-links button { font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 800; color: var(--t-sec); text-transform: uppercase; letter-spacing: 0.2em; transition: color 0.3s; cursor: pointer; }
.footer-links button:hover { color: var(--cyan); text-shadow: 0 0 10px var(--cyan-glow); }
.footer-sub { font-family: monospace; font-size: 11px; font-weight: bold; color: var(--t-muted); letter-spacing: 0.2em; margin-bottom: 8px; }

.modal-overlay { position: fixed; inset: 0; z-index: 9900; background: rgba(2, 44, 34, 0.4); backdrop-filter: blur(20px) saturate(150%); display: none; align-items: center; justify-content: center; padding: 24px; opacity: 0; transition: opacity 0.4s; }
.modal-overlay.flex { display: flex; }
.modal-overlay.opacity-100 { opacity: 1; }
.modal-card { max-width: 500px; width: 100%; padding: 48px; border-radius: 30px; }
.modal-title { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 900; color: var(--cyan); margin-bottom: 24px; }
.modal-text { font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 600; color: var(--t-main); line-height: 1.8; margin-bottom: 40px; }
.btn-modal-close { background: linear-gradient(135deg, #fff, #e0f2fe); border: 2px solid #fff; box-shadow: var(--shadow-btn); border-radius: 30px; padding: 12px 32px; color: #0284c7; font-family: 'Nunito', sans-serif; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; transition: all 0.3s; cursor: pointer; }
.btn-modal-close:hover { transform: scale(1.05); box-shadow: 0 10px 20px rgba(0,212,255,0.3); }

.poketime-overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.85); backdrop-filter: blur(30px); flex-direction: column; align-items: center; justify-content: center; }
.poketime-overlay.hidden { display: none !important; }
.poketime-overlay.flex { display: flex; }
.btn-poketime-close { font-family: monospace; font-size: 16px; font-weight: bold; color: #f43f5e; border: 2px solid #f43f5e; border-radius: 8px; padding: 10px 24px; transition: all 0.3s; cursor: pointer; }
.btn-poketime-close:hover { background: #f43f5e; color: #fff; box-shadow: 0 0 20px rgba(244,63,94,0.6); }
'''
with codecs.open('d:/WEB_PRINCIPAL/css/hardlight-interface-core.css', 'w', 'utf-8') as f:
    f.write(css)
