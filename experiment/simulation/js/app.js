(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const parameterIds = ["alpha", "beta", "m0", "m1", "dt", "v1"];
  const defaults = { alpha: 15.6, beta: 28, m0: -1.143, m1: -0.714, dt: 0.01, v1: 0.2 };
  let running = false;
  let animationId = null;
  let latest = null;

  const colors = { cyan: "#5ce1e6", blue: "#7d9cff", orange: "#ffb86b" };
  const commonOptions = {
    responsive: true, maintainAspectRatio: false, animation: false,
    interaction: { mode: "nearest", intersect: false },
    plugins: { legend: { labels: { color: "#c5d4eb", boxWidth: 12, usePointStyle: true } } },
    scales: {
      x: { type: "linear", ticks: { color: "#8396b5", maxTicksLimit: 8 }, grid: { color: "#26334a" }, title: { display: true, text: "Time (τ)", color: "#9aabc7" } },
      y: { ticks: { color: "#8396b5", maxTicksLimit: 6 }, grid: { color: "#26334a" } }
    },
    elements: { point: { radius: 0 }, line: { borderWidth: 1.7, tension: 0 } }
  };

  const waveChart = new Chart($("waveChart"), {
    type: "line", data: { datasets: [
      { label: "x (scaled v₁)", data: [], borderColor: colors.cyan },
      { label: "y (scaled v₂)", data: [], borderColor: colors.blue }
    ]}, options: structuredClone(commonOptions)
  });
  const phaseOpts = structuredClone(commonOptions);
  phaseOpts.scales.x.title.text = "x (scaled v₁)";
  phaseOpts.scales.y.title.text = "y (scaled v₂)";
  phaseOpts.plugins.legend.display = false;
  const phaseChart = new Chart($("phaseChart"), {
    type: "scatter", data: { datasets: [{ label: "Phase trajectory", data: [], showLine: true, borderColor: colors.cyan, backgroundColor: colors.cyan }] }, options: phaseOpts
  });
  const currentOpts = structuredClone(commonOptions);
  currentOpts.scales.y.title.text = "z (current-related state)";
  const currentChart = new Chart($("currentChart"), {
    type: "line", data: { datasets: [{ label: "z (current-related state)", data: [], borderColor: colors.orange }] }, options: currentOpts
  });

  function params() {
    return Object.fromEntries(parameterIds.map(id => [id, Number($(id).value)]));
  }
  function syncLabels() {
    const p = params();
    for (const id of parameterIds) $(id + "Val").textContent = String(p[id]);
  }
  function h(x, p) {
    return p.m1 * x + 0.5 * (p.m0 - p.m1) * (Math.abs(x + 1) - Math.abs(x - 1));
  }
  function deriv(s, p) {
    const [x, y, z] = s;
    return [p.alpha * (y - x - h(x, p)), x - y + z, -p.beta * y];
  }
  function add(s, k, scale) { return s.map((v, i) => v + k[i] * scale); }
  function rk4(s, dt, p) {
    const k1 = deriv(s, p);
    const k2 = deriv(add(s, k1, dt / 2), p);
    const k3 = deriv(add(s, k2, dt / 2), p);
    const k4 = deriv(add(s, k3, dt), p);
    return s.map((v, i) => v + dt * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]) / 6);
  }

  function integrate(p, steps = 12000) {
    let s = [p.v1, 0, 0.0];
    let t = 0;
    const xs = [], ys = [], zs = [], times = [];
    for (let i = 0; i < steps; i++) {
      s = rk4(s, p.dt, p);
      t += p.dt;
      if (!s.every(Number.isFinite) || s.some(v => Math.abs(v) > 1e6)) {
        throw new Error("The numerical solution diverged. Try smaller time step or different parameters.");
      }
      // Save each integration step for clear, high-resolution graphs.
      times.push({ x: t, y: s[0] });
      xs.push({ x: t, y: s[0] });
      ys.push({ x: t, y: s[1] });
      zs.push({ x: t, y: s[2] });
    }
    return { xs, ys, zs, phase: xs.map((point, i) => ({ x: point.y, y: ys[i].y })) };
  }

  function setStatus(text, active = false) {
    $("statusText").textContent = text;
    $("statusDot").style.background = active ? colors.cyan : "#70e1a1";
    $("statusDot").style.boxShadow = active ? "0 0 12px #5ce1e666" : "0 0 12px #70e1a166";
  }
  function paint(result) {
    waveChart.data.datasets[0].data = result.xs;
    waveChart.data.datasets[1].data = result.ys;
    phaseChart.data.datasets[0].data = result.phase;
    currentChart.data.datasets[0].data = result.zs;
    waveChart.update("none"); phaseChart.update("none"); currentChart.update("none");
  }
  function stop() {
    running = false;
    if (animationId !== null) cancelAnimationFrame(animationId);
    animationId = null;
    $("runBtn").disabled = false;
    $("pauseBtn").disabled = true;
  }
  function run() {
    stop();
    try {
      setStatus("Simulating", true);
      latest = integrate(params());
      paint(latest);
      setStatus("Simulation complete");
    } catch (error) {
      setStatus("Simulation error");
      alert(error.message);
    }
  }
  function animateRun() {
    stop();
    running = true;
    $("runBtn").disabled = true;
    $("pauseBtn").disabled = false;
    setStatus("Running", true);
    const p = params();
    let s = [p.v1, 0, 0], t = 0;
    const xData = [], yData = [], zData = [], phaseData = [];
    const maxPoints = 2500;
    function frame() {
      if (!running) return;
      try {
        for (let j = 0; j < 80; j++) {
          s = rk4(s, p.dt, p); t += p.dt;
          if (!s.every(Number.isFinite) || s.some(v => Math.abs(v) > 1e6)) throw new Error("Numerical solution diverged. Adjust parameters.");
          xData.push({x:t,y:s[0]}); yData.push({x:t,y:s[1]}); zData.push({x:t,y:s[2]});
          phaseData.push({x:s[0],y:s[1]});
          if (xData.length > maxPoints) { xData.shift(); yData.shift(); zData.shift(); phaseData.shift(); }
        }
        waveChart.data.datasets[0].data = xData;
        waveChart.data.datasets[1].data = yData;
        phaseChart.data.datasets[0].data = phaseData;
        currentChart.data.datasets[0].data = zData;
        waveChart.update("none"); phaseChart.update("none"); currentChart.update("none");
        animationId = requestAnimationFrame(frame);
      } catch (error) {
        stop(); setStatus("Simulation error"); alert(error.message);
      }
    }
    animationId = requestAnimationFrame(frame);
  }

  parameterIds.forEach(id => $(id).addEventListener("input", () => {
    syncLabels();
    stop();
    setStatus("Parameters changed");
  }));
  $("runBtn").addEventListener("click", animateRun);
  $("pauseBtn").addEventListener("click", () => {
    stop(); setStatus("Paused");
  });
  $("stepBtn").addEventListener("click", run);
  $("resetBtn").addEventListener("click", () => {
    stop();
    for (const [id, value] of Object.entries(defaults)) $(id).value = value;
    syncLabels();
    run();
  });
  syncLabels();
  run();
})();
