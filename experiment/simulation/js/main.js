<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chua's Circuit | Virtual Laboratory</title>
<head>
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
<header><div class="kicker">ELECTRONICS • NONLINEAR DYNAMICS • VIRTUAL LAB</div><h1>Chua's Circuit Analysis for Electronic Chaos Generation</h1><p>Interactive numerical experiment · Dimensionless state-space model · Double-scroll attractor</p></header>
<main>
<aside class="panel">
<h2>Experiment Controls</h2>
<p style="color:var(--muted);font-size:13px">Change model parameters and observe how the chaotic response evolves.</p>
<div id="controls"></div>
<div class="buttons"><button id="start">▶ Start</button><button class="secondary" id="pause">Ⅱ Pause</button><button class="secondary" id="reset">↺ Reset</button></div>
<div class="buttons"><button class="secondary" id="preset">Load classic preset</button><button class="secondary" id="download">Export CSV</button></div>
<h3>Initial conditions</h3>
<label>x(0) <span class="value" id="x0v">0.10</span></label><input id="x0" type="range" min="-2" max="2" step=".01" value=".1">
<label>y(0) <span class="value" id="y0v">0.00</span></label><input id="y0" type="range" min="-2" max="2" step=".01" value="0">
<label>z(0) <span class="value" id="z0v">0.00</span></label><input id="z0" type="range" min="-3" max="3" step=".01" value="0">
<p class="note">This is a dimensionless mathematical simulation, not a physical circuit measurement. The component-level schematic is a conceptual reference; real hardware requires component selection, tolerances and safety review.</p>
</aside>
<section class="workspace">
<div class="panel"><h2>Conceptual Chua's Circuit</h2>
<svg class="diagram" viewBox="0 0 900 230" role="img" aria-label="Conceptual Chua circuit block diagram">
<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="#35d6e8"/></marker></defs>
<g fill="none" stroke="#35d6e8" stroke-width="3"><path d="M80 100 H220 M320 100 H440 M540 100 H680" marker-end="url(#arr)"/><path d="M270 100 V165 M490 100 V165" stroke="#ffb454"/><path d="M710 100 V165" stroke="#ffb454"/></g>
<g fill="#102b43" stroke="#35d6e8" stroke-width="2"><rect x="30" y="65" width="150" height="70" rx="10"/><rect x="220" y="65" width="100" height="70" rx="10"/><rect x="440" y="65" width="100" height="70" rx="10"/><rect x="680" y="65" width="170" height="70" rx="10"/></g>
<g fill="#eaf3fb" font-size="19" text-anchor="middle" font-weight="600"><text x="105" y="94">Chua diode</text><text x="105" y="118" font-size="13">Nonlinear element</text><text x="270" y="106">C₁</text><text x="490" y="106">L</text><text x="765" y="94">State-space</text><text x="765" y="118" font-size="13">response / plots</text></g>
<g fill="#ffb454" font-size="14" text-anchor="middle"><text x="270" y="190">v₁ state</text><text x="490" y="190">inductor current</text><text x="710" y="190">C₂ / v₂ state</text></g>
<text x="450" y="32" text-anchor="middle" fill="#9bb0c4" font-size="14">Conceptual functional representation (not a wiring diagram)</text></svg>
</div>
<div class="topgrid">
<div class="panel"><h2>Time-domain response</h2><div class="canvas-wrap"><canvas id="time"></canvas></div><div class="legend"><span><i class="dot" style="background:#35d6e8"></i>x(t)</span><span><i class="dot" style="background:#ffb454"></i>y(t)</span><span><i class="dot" style="background:#b99cff"></i>z(t)</span></div></div>
<div class="panel"><h2>Phase-plane portrait</h2><div class="canvas-wrap"><canvas id="phase"></canvas></div><div class="legend"><span><i class="dot" style="background:#35d6e8"></i>x versus y</span></div></div>
</div>
<div class="panel wide"><h2>Double-scroll attractor · x versus z</h2><div class="canvas-wrap"><canvas id="attractor"></canvas></div><div class="stats"><div class="stat"><small>Simulation time</small><strong id="clock">0.00</strong></div><div class="stat"><small>Samples</small><strong id="samples">0</strong></div><div class="stat"><small>Current x state</small><strong id="cx">0.100</strong></div></div></div>
<div class="panel"><h2>Mathematical model</h2>
<p><b>Dimensionless Chua equations:</b></p>
<p style="font-family:Georgia,serif;font-size:18px;color:#fff">ẋ = α [y − x − h(x)]</p>
<p style="font-family:Georgia,serif;font-size:18px;color:#fff">ẏ = x − y + z</p>
<p style="font-family:Georgia,serif;font-size:18px;color:#fff">ż = −βy</p>
<p>Piecewise-linear Chua diode characteristic:</p>
<p style="font-family:Georgia,serif;font-size:17px;color:#fff">h(x) = m₁x + ½(m₀−m₁)(|x+1|−|x−1|)</p>
<p class="note">α and β control the normalized dynamics; m₀ and m₁ are the inner and outer slopes of the nonlinear characteristic. The classic preset is a commonly used dimensionless parameter set; outcomes depend on integration step and initial conditions.</p>
</div>
</section></main><footer>Virtual laboratory demonstration for educational analysis. Use the controls to explore parameter sensitivity, transient behaviour and phase-space structure.</footer>
<script src="js/main.js"></script>
</body></html>

