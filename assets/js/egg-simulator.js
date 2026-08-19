/*
 * Egg Doneness Simulator — physics engine + shared rendering + UI wiring.
 * Implements the two-region (yolk/white) spherical finite-volume heat
 * conduction model from the "Egg Doneness Simulator" spec, Section 5, plus
 * the Sous Vide Mode add-on spec. The two UI panels are wired independently
 * (see the two DOMContentLoaded blocks below — neither reads nor writes the
 * other's state) but share this one physics and rendering engine, since the
 * underlying egg model, doneness rules, and chart/diagram visuals are
 * identical between modes; only the boundary condition and a couple of
 * chart annotations differ.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------
  // Constants (spec Sections 5.3, 5.4, 5.6, 7)
  // ---------------------------------------------------------------

  var MASS_BY_SIZE = { small: 53, medium: 58, large: 64, jumbo: 71 }; // grams
  var EGG_DENSITY = 1035; // kg/m^3, whole-egg approximation for geometry
  var YOLK_RADIUS_FRACTION = 0.58;

  var MATERIALS = {
    yolk: { k: 0.34, rho: 1034, cp: 3120 },
    white: { k: 0.54, rho: 1043, cp: 3800 },
  };

  // Liquid-phase (pre-set) conductivity boost. The literature k values above
  // are for already-*set* egg protein; while the yolk/white is still raw and
  // liquid, natural convection currents inside it move heat far faster than
  // pure conduction alone. Modeled as an elevated effective conductivity that
  // applies only until that material's own protein denatures/gels, at which
  // point conduction drops to the literature MATERIALS values above and
  // stays there (matches real cooking: once set, an egg cools and reheats by
  // conduction only). Without this, the model ran ~30-40% slower than every
  // well-tested source checked against it (Serious Eats/Kenji López-Alt, ATK,
  // and a from-cold-start technique) — a single fixed k per material could
  // not reproduce their reported early-vs-late doneness gap no matter how it
  // was tuned, because real yolks/whites cook faster early (while liquid)
  // and slower later (once set) than a constant-k sphere ever can.
  var YOLK_K_LIQUID = 1.8; // W/m*C, raw/liquid yolk
  var YOLK_GEL_C = 65; // C, yolk sets above this
  var WHITE_K_LIQUID = 2.5; // W/m*C, raw/liquid white
  var WHITE_GEL_C = 62; // C, white sets above this

  var H_WATER = 800; // W/m^2*C
  var H_PLUNGE = 500;
  var T_PLUNGE_WATER = 1; // C

  // Room-temperature removal (alternative to plunging): natural convection
  // in still air is far weaker than either boiling water or an ice bath —
  // roughly 50-80x weaker than H_WATER/H_PLUNGE — so the egg's own stored
  // heat keeps conducting outward from the interior for a long time after
  // removal, largely unaffected by the ambient air. That's the accurate,
  // if slow, physics: room-temperature removal doesn't meaningfully halt
  // carryover cooking the way a plunge does.
  var H_AIR = 10; // W/m^2*C, natural convection, still air
  var T_AMBIENT = 20; // C, room temperature

  // How much of the display window a late removal is allowed to occupy
  // before the window itself grows to keep a real cooling tail visible —
  // see solve()'s totalS calculation below.
  var AIR_COOL_TARGET_FRACTION = 0.4;

  // Minimum cooldown tail to keep visible after a plunge, however late the
  // removal happens (the cold-start protocol's 17-minute covered stand can
  // easily push removal itself past the old fixed 20-minute window).
  var PLUNGE_TAIL_S = 300;

  // Cold-start protocol: egg goes in with the water, tap water ramps up to a
  // boil, then heat is cut and the pot is covered to finish cooking on
  // residual heat. Advanced/hidden constants, not user controls.
  var COLD_START_T0 = 20; // C, typical tap water
  var COLD_START_RAMP_S = 480; // 8 minutes to reach a boil

  // Unlike simmer/boil (where the water is actively, continuously agitated
  // by the burner the whole time), cold-start's water isn't boiling yet
  // during the ramp and isn't boiling anymore once the heat's off — so it
  // doesn't get H_WATER's full nucleate-boiling convection either time.
  // H_COLDSTART_RAMP covers the pre-boil climb (still water, no bubbling);
  // H_COLDSTART_OFFHEAT covers the covered-pot coast afterward (residual
  // warmth, no agitation). Both lower than H_WATER for the same reason.
  var H_COLDSTART_RAMP = 60; // W/m^2*C
  var H_COLDSTART_OFFHEAT = 300; // W/m^2*C

  // Cooldown curve + both h values above tuned together against a chart of
  // real results at 3/4/6/10/15-minute covered stands (runny soft-boiled
  // through very firm hard-boiled) plus a 17-minute result (fully set yolk,
  // no jammy/liquid center, no sulfur ring, firm/opaque white) — i.e. the
  // white needs to fully finish (Firm, 80C+) within that window while the
  // yolk stays short of Chalky (78C+) the whole time. A single fixed h for
  // the whole protocol couldn't satisfy both: the white sits much closer to
  // the surface than the yolk, so it settles near whatever temperature the
  // water is coasting toward long before the yolk catches up, and getting
  // the white to actually reach Firm in time meant raising that coasting
  // temperature well past what the yolk alone would suggest — the yolk's
  // own thick insulating layer of white is what keeps it from following the
  // white all the way there by minute 17.
  var COLD_START_OFFHEAT_ASYMPTOTE_C = 82; // C, covered-pot cooldown target
  var COLD_START_OFFHEAT_SPAN_C = 18; // C, drop from 100 down toward the asymptote
  var COLD_START_OFFHEAT_TAU_S = 300; // s, cooldown time constant

  // Sous Vide Mode (add-on spec Sections 4, 6, 9). Independent boundary
  // condition and h — not shared with boiling mode's protocols/H_WATER.
  var H_SOUSVIDE = 300; // W/m^2*C, gentler circulator flow vs. boiling water
  var SV_BATH_MIN = 55, SV_BATH_MAX = 95, SV_BATH_DEFAULT = 75; // C
  var SV_DURATION_MIN_S = 10 * 60, SV_DURATION_MAX_S = 180 * 60, SV_DURATION_DEFAULT_S = 60 * 60;
  var SV_POST_PLUNGE_S = 300; // extra simulated cooling time past the duration mark

  var N_NODES = 20;
  var N_YOLK_NODES = 12; // indices 0-11 yolk, 12-19 white (node 19 = surface)
  var WHITE_MID_NODE = 16;
  var T_MAX_S = 1200; // 20 minutes, default boiling-mode window (stretched for long cold-start/room-cooling runs, see boilingTotalS)
  // 0.2s (not 1s): the liquid-phase conductivity boost above raises the
  // fastest-diffusing node's stability bound enough that 1s no longer carries
  // the >4x margin the original fixed-k model had; 0.2s restores it. Cheap
  // either way — worst case is a few thousand extra steps of trivial math.
  var DT_S = 0.2;

  // Boundaries follow egg-white protein chemistry, not just an even split:
  // ovotransferrin sets around 61C (the Liquid/Silky-set line below), but
  // ovalbumin — the majority protein by mass, and what actually gives a
  // white its firm, rubbery bite — doesn't denature until ~80-85C. A white
  // held anywhere in between (which covers most practical sous vide bath
  // temperatures) stays properly silky/tender, not firm, however long it's
  // held there — confirmed against a 75C/45min sous vide bath, which reads
  // silky-set here, matching the real result.
  var WHITE_LABELS = ['Liquid', 'Silky-set', 'Firm', 'Rubbery'];
  var WHITE_THRESH = [60, 80, 85];
  var WHITE_COLORS = {
    'Liquid': '#FFF3B0',
    'Silky-set': '#FFA630',
    'Firm': '#FFC94A',
    'Rubbery': '#E8E4DC',
  };

  // Chalky's start (last entry) confirmed against a real 75C/45min sous vide
  // result: fully set, not chalky, at a yolk temp that converges to just
  // under the 75C bath — so the line has to sit above that with a little
  // headroom, not right at the old 73.
  var YOLK_LABELS = ['Runny', 'Jammy', 'Fudgy', 'Fully set', 'Chalky'];
  var YOLK_THRESH = [63, 68, 70, 78];
  var YOLK_COLORS = {
    'Runny': '#FFF3B0',
    'Jammy': '#FFA630',
    'Fudgy': '#FFC94A',
    'Fully set': '#F2C744',
    'Chalky': '#E6D68A',
  };

  var RING_COLOR = '#9BA88C';
  var RING_THRESHOLD = 80;

  var YOLK_BAND_LOW = 63;
  var YOLK_BAND_HIGH = 68;

  // ---------------------------------------------------------------
  // Geometry & grid
  // ---------------------------------------------------------------

  function computeGeometry(massGrams) {
    var massKg = massGrams / 1000;
    var volume = massKg / EGG_DENSITY; // m^3
    var R = Math.cbrt((3 * volume) / (4 * Math.PI));
    var Ryolk = YOLK_RADIUS_FRACTION * R;
    return { R: R, Ryolk: Ryolk };
  }

  // Two piecewise-uniform zones so the yolk/white material boundary lands
  // exactly on the node 11/12 seam (spec 5.7 names those the yolk/white split).
  function buildGrid(R, Ryolk) {
    var nYolk = N_YOLK_NODES;
    var nWhite = N_NODES - N_YOLK_NODES;
    var r = new Float64Array(N_NODES);

    var drYolk = Ryolk / (nYolk - 1);
    var i;
    for (i = 0; i < nYolk; i++) r[i] = i * drYolk;

    // Node 11 already sits exactly at Ryolk, so the white zone's first node
    // (12) must start one interval past it, not on top of it — otherwise
    // the 11/12 face has zero radial gap and its conductance blows up.
    var drWhite = (R - Ryolk) / nWhite;
    for (i = 0; i < nWhite; i++) r[nYolk + i] = Ryolk + (i + 1) * drWhite;

    var material = new Array(N_NODES);
    for (i = 0; i < N_NODES; i++) material[i] = i < nYolk ? 'yolk' : 'white';

    var face = new Float64Array(N_NODES - 1);
    for (i = 0; i < N_NODES - 1; i++) face[i] = (r[i] + r[i + 1]) / 2;

    var vol = new Float64Array(N_NODES);
    vol[0] = (4 / 3) * Math.PI * Math.pow(face[0], 3);
    for (i = 1; i < N_NODES - 1; i++) {
      vol[i] = (4 / 3) * Math.PI * (Math.pow(face[i], 3) - Math.pow(face[i - 1], 3));
    }
    vol[N_NODES - 1] = (4 / 3) * Math.PI * (Math.pow(R, 3) - Math.pow(face[N_NODES - 2], 3));

    var areaFace = new Float64Array(N_NODES - 1);
    for (i = 0; i < N_NODES - 1; i++) areaFace[i] = 4 * Math.PI * face[i] * face[i];
    var areaSurface = 4 * Math.PI * R * R;

    // Conductance per unit area (k_eff / dr) for each internal face; harmonic
    // mean at the yolk/white seam models the two conductivities in series.
    // faceCondLiquid is the same, but using each material's liquid-phase k —
    // runFiniteVolumeSim picks between the two per face per step depending on
    // whether that face's material has gelled yet. The yolk/white seam face
    // always uses the set-phase (harmonic-mean) value in both arrays: it
    // straddles two different materials, so "still liquid" isn't well-defined
    // for it, and it's one face out of nineteen — not worth the ambiguity.
    var faceCond = new Float64Array(N_NODES - 1);
    var faceCondLiquid = new Float64Array(N_NODES - 1);
    for (i = 0; i < N_NODES - 1; i++) {
      var dr = r[i + 1] - r[i];
      var sameMaterial = material[i] === material[i + 1];
      var kA = MATERIALS[material[i]].k;
      var kB = MATERIALS[material[i + 1]].k;
      var kEff = sameMaterial ? kA : (2 * kA * kB) / (kA + kB);
      faceCond[i] = kEff / dr;

      if (sameMaterial) {
        var kLiquid = material[i] === 'yolk' ? YOLK_K_LIQUID : WHITE_K_LIQUID;
        faceCondLiquid[i] = kLiquid / dr;
      } else {
        faceCondLiquid[i] = faceCond[i];
      }
    }

    return { r: r, material: material, face: face, vol: vol, areaFace: areaFace, areaSurface: areaSurface, faceCond: faceCond, faceCondLiquid: faceCondLiquid };
  }

  // ---------------------------------------------------------------
  // Boiling-mode boundary condition (spec 5.4, 5.6)
  // ---------------------------------------------------------------

  // Returns {Twater, h} while still actively cooking (before removal).
  // Simmer/boil hold one h the whole time since the water's continuously
  // agitated by the burner throughout; cold-start's h instead depends on
  // which of its two sub-phases tSec falls in — see H_COLDSTART_RAMP and
  // H_COLDSTART_OFFHEAT above.
  function cookingBoundary(protocol, tSec) {
    if (protocol === 'simmer') return { Twater: 88, h: H_WATER };
    if (protocol === 'boil') return { Twater: 100, h: H_WATER };
    if (protocol === 'coldstart') {
      if (tSec < COLD_START_RAMP_S) {
        var Tramp = COLD_START_T0 + ((100 - COLD_START_T0) / COLD_START_RAMP_S) * tSec;
        return { Twater: Tramp, h: H_COLDSTART_RAMP };
      }
      // Heat's cut the moment it reaches a boil; the covered pot then coasts
      // down toward the asymptote on residual heat, starting its clock at
      // ramp-end.
      var tOffHeat = tSec - COLD_START_RAMP_S;
      var Toff = COLD_START_OFFHEAT_ASYMPTOTE_C + COLD_START_OFFHEAT_SPAN_C * Math.exp(-tOffHeat / COLD_START_OFFHEAT_TAU_S);
      return { Twater: Toff, h: H_COLDSTART_OFFHEAT };
    }
    return { Twater: 100, h: H_WATER };
  }

  // Removal is mandatory (not a toggle) — the egg always leaves the pot at
  // removalTimeS, either into an ice bath or onto the counter. removalMode
  // is 'plunge' or 'room'.
  function boundaryAt(tSec, protocol, removalMode, removalTimeS) {
    if (tSec >= removalTimeS) {
      if (removalMode === 'room') return { Twater: T_AMBIENT, h: H_AIR };
      return { Twater: T_PLUNGE_WATER, h: H_PLUNGE };
    }
    return cookingBoundary(protocol, tSec);
  }

  // ---------------------------------------------------------------
  // Explicit finite-volume stepper (spec 5.2, 5.5, 5.7) — shared by both
  // solve() and solveSousVide() below. The only things that differ between
  // modes are the boundary condition at each step and the total run length,
  // both supplied by the caller; the node-update math itself (center node,
  // interior nodes, convective surface node) is identical physics either
  // way, so it's written once here instead of twice.
  //
  // Stability check (worst case, small egg, liquid-phase conductivity):
  // interior nodes are bounded by dr^2/(2*alpha) ~ 1.6-3.2s; the thin
  // convective surface shell is bounded by ~2*C/G ~ 5-10s even at
  // boiling-mode's h=800 (sous vide's h=300, its h_plunge=500, and
  // room-temperature removal's h=10 are all gentler, so only ever safer — a
  // smaller h can only widen this margin). DT_S = 0.2s carries a >8x margin
  // in every case.
  // ---------------------------------------------------------------

  // Picks set-phase vs. liquid-phase conductance for interior face i,
  // depending on whether either of its two nodes has *ever* crossed that
  // material's gel threshold — checked against runningMax, not the current
  // temperature, because gelling is one-way: a spot that's already set stays
  // set as it cools (an ice-bath plunge doesn't un-cook a done yolk back into
  // a fast-convecting liquid). Same irreversibility the Tmax-based doneness
  // classification already relies on, applied to conductance instead of just
  // the display label. The yolk/white seam face (the one face per grid where
  // grid.material differs across the face) always uses the precomputed
  // set-phase value — see buildGrid's faceCondLiquid comment.
  function faceConductance(grid, i, runningMax) {
    if (grid.material[i] !== grid.material[i + 1]) return grid.faceCond[i];
    var gelC = grid.material[i] === 'yolk' ? YOLK_GEL_C : WHITE_GEL_C;
    var warmestEver = runningMax[i] > runningMax[i + 1] ? runningMax[i] : runningMax[i + 1];
    return warmestEver < gelC ? grid.faceCondLiquid[i] : grid.faceCond[i];
  }

  function runFiniteVolumeSim(grid, startTempC, totalSteps, boundaryFn) {
    var nSamples = totalSteps + 1;
    var T = new Float32Array(N_NODES * nSamples);
    var Tmax = new Float32Array(N_NODES * nSamples);

    var cur = new Float64Array(N_NODES);
    var n;
    for (n = 0; n < N_NODES; n++) cur[n] = startTempC;

    var runningMax = new Float64Array(N_NODES);
    for (n = 0; n < N_NODES; n++) {
      runningMax[n] = cur[n];
      T[n * nSamples] = cur[n];
      Tmax[n * nSamples] = cur[n];
    }

    var next = new Float64Array(N_NODES);
    var lastIdx = N_NODES - 1;

    for (var step = 1; step <= totalSteps; step++) {
      var tSec = step * DT_S;
      var bc = boundaryFn(tSec);

      // center node: symmetric limit of the spherical Laplacian at r=0
      var mat0 = MATERIALS[grid.material[0]];
      var q0 = faceConductance(grid, 0, runningMax) * grid.areaFace[0] * (cur[1] - cur[0]);
      next[0] = cur[0] + (q0 * DT_S) / (mat0.rho * mat0.cp * grid.vol[0]);

      for (var i = 1; i < lastIdx; i++) {
        var mat = MATERIALS[grid.material[i]];
        var qIn = faceConductance(grid, i, runningMax) * grid.areaFace[i] * (cur[i + 1] - cur[i]);
        var qOut = faceConductance(grid, i - 1, runningMax) * grid.areaFace[i - 1] * (cur[i] - cur[i - 1]);
        next[i] = cur[i] + ((qIn - qOut) * DT_S) / (mat.rho * mat.cp * grid.vol[i]);
      }

      // surface node: convective boundary condition (5.4)
      var matS = MATERIALS[grid.material[lastIdx]];
      var qConv = bc.h * grid.areaSurface * (bc.Twater - cur[lastIdx]);
      var qCondIn = faceConductance(grid, lastIdx - 1, runningMax) * grid.areaFace[lastIdx - 1] * (cur[lastIdx] - cur[lastIdx - 1]);
      next[lastIdx] = cur[lastIdx] + ((qConv - qCondIn) * DT_S) / (matS.rho * matS.cp * grid.vol[lastIdx]);

      var tmp = cur;
      cur = next;
      next = tmp;

      for (n = 0; n < N_NODES; n++) {
        if (cur[n] > runningMax[n]) runningMax[n] = cur[n];
        T[n * nSamples + step] = cur[n];
        Tmax[n * nSamples + step] = runningMax[n];
      }
    }

    return { T: T, Tmax: Tmax, nSamples: nSamples };
  }

  // Room-temperature removal cools so slowly (see H_AIR above) that a late
  // removal would otherwise just run off the edge of the default 20-minute
  // window with nothing visible happening after it. When removal would
  // occupy more than AIR_COOL_TARGET_FRACTION of that window, extend the
  // window so removal instead sits at that fraction, guaranteeing a real
  // cooling tail stays visible. (Continuous at the threshold: right at
  // removalTimeS = T_MAX_S * AIR_COOL_TARGET_FRACTION, both branches agree.)
  //
  // Plunge cooling is fast, so it only ever needs a short fixed tail — but
  // the removal event itself still has to fit inside the window in the first
  // place, which the default 20 minutes can't guarantee once the cold-start
  // protocol's covered off-heat stand routinely runs past that (Chef John's
  // recipe: 8 min to a boil + a 17-minute stand = 25 minutes before removal).
  function boilingTotalS(removalMode, removalTimeS) {
    var floor = T_MAX_S;
    if (removalMode === 'room' && removalTimeS > T_MAX_S * AIR_COOL_TARGET_FRACTION) {
      floor = removalTimeS / AIR_COOL_TARGET_FRACTION;
    }
    var minNeeded = removalTimeS + (removalMode === 'room' ? 0 : PLUNGE_TAIL_S);
    return Math.max(floor, minNeeded);
  }

  function solve(params) {
    var massGrams = MASS_BY_SIZE[params.eggSize];
    var geo = computeGeometry(massGrams);
    var grid = buildGrid(geo.R, geo.Ryolk);
    var totalS = boilingTotalS(params.removalMode, params.removalTimeS);
    var totalSteps = Math.round(totalS / DT_S);

    var sim = runFiniteVolumeSim(grid, params.startTempC, totalSteps, function (tSec) {
      return boundaryAt(tSec, params.protocol, params.removalMode, params.removalTimeS);
    });

    return { grid: grid, geo: geo, T: sim.T, Tmax: sim.Tmax, nSamples: sim.nSamples, totalS: totalS, removalTimeS: params.removalTimeS };
  }

  // Sous Vide Mode solve (add-on spec Sections 6, 8). Constant T_set/h for
  // [0, durationS), then a mandatory plunge to (1C, H_PLUNGE) for the extra
  // SV_POST_PLUNGE_S seconds — no plunge toggle in this mode (spec 3, 6.3).
  // Kept as its own function (not solve() with extra params) so the two
  // modes' solve-time state can never intermix, per the add-on spec's
  // independence requirement (Section 8) — but it reuses the exact same
  // stepper as solve() above, since the underlying physics doesn't change
  // between cooking methods.
  function solveSousVide(params) {
    var massGrams = MASS_BY_SIZE[params.eggSize];
    var geo = computeGeometry(massGrams);
    var grid = buildGrid(geo.R, geo.Ryolk);

    var durationS = params.durationS;
    var totalS = durationS + SV_POST_PLUNGE_S;
    var totalSteps = Math.round(totalS / DT_S);

    var sim = runFiniteVolumeSim(grid, params.startTempC, totalSteps, function (tSec) {
      if (tSec < durationS) return { Twater: params.bathTempC, h: H_SOUSVIDE };
      return { Twater: T_PLUNGE_WATER, h: H_PLUNGE };
    });

    return { grid: grid, geo: geo, T: sim.T, Tmax: sim.Tmax, nSamples: sim.nSamples, durationS: durationS, totalS: totalS };
  }

  // ---------------------------------------------------------------
  // Lookup / interpolation (spec Section 6)
  // ---------------------------------------------------------------

  // Clamped to a caller-supplied max time (each result's own res.totalS)
  // rather than a fixed constant, since boiling mode's duration is fixed
  // but sous vide's varies with the Cook Duration slider.
  function sampleNodeRange(arr, nSamples, node, tSec, maxTSec) {
    var clamped = Math.max(0, Math.min(maxTSec, tSec));
    var f = clamped / DT_S;
    var i0 = Math.floor(f);
    var i1 = Math.min(i0 + 1, nSamples - 1);
    var frac = f - i0;
    var base = node * nSamples;
    var v0 = arr[base + i0];
    var v1 = arr[base + i1];
    return v0 + (v1 - v0) * frac;
  }

  // ---------------------------------------------------------------
  // Doneness classification (spec 7.1, 7.2)
  // ---------------------------------------------------------------

  function classify(maxTemp, thresholds, labels) {
    for (var i = 0; i < thresholds.length; i++) {
      if (maxTemp < thresholds[i]) return labels[i];
    }
    return labels[labels.length - 1];
  }

  function classifyWhite(maxTemp) { return classify(maxTemp, WHITE_THRESH, WHITE_LABELS); }
  function classifyYolk(maxTemp) { return classify(maxTemp, YOLK_THRESH, YOLK_LABELS); }

  function colorForNode(nodeIndex, maxTemp) {
    if (nodeIndex < N_YOLK_NODES) return YOLK_COLORS[classifyYolk(maxTemp)];
    return WHITE_COLORS[classifyWhite(maxTemp)];
  }

  // ---------------------------------------------------------------
  // Shared formatting (used by both UI-wiring blocks below)
  // ---------------------------------------------------------------

  function formatTempC(c) {
    return c.toFixed(1) + '°C (' + (c * 9 / 5 + 32).toFixed(1) + '°F)';
  }

  // M:SS normally; H:MM:SS once past an hour, which only sous vide's longer
  // durations ever reach — boiling mode's 20-minute cap never shows hours.
  function formatClock(sec) {
    var totalSec = Math.round(sec);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    if (h > 0) return h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // ---------------------------------------------------------------
  // Shared rendering (used by both UI-wiring blocks below) — identical
  // visuals for both modes (add-on spec 5.1: "identical rendering
  // approach"), operating generically on whichever result/canvas is passed
  // in rather than being duplicated per mode.
  // ---------------------------------------------------------------

  function sizeCanvas(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || canvas.width;
    var h = canvas.clientHeight || canvas.height;
    var targetW = Math.round(w * dpr);
    var targetH = Math.round(h * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  function renderDiagram(canvas, res, t) {
    var setup = sizeCanvas(canvas);
    var ctx = setup.ctx, size = Math.min(setup.w, setup.h);
    ctx.clearRect(0, 0, setup.w, setup.h);

    var cx = setup.w / 2, cy = setup.h / 2;
    var R = res.geo.R;
    var pad = 10;
    var scale = (size / 2 - pad) / R;
    var grid = res.grid, nSamples = res.nSamples;

    for (var i = N_NODES - 1; i >= 0; i--) {
      var outerR = i === N_NODES - 1 ? R : grid.face[i];
      var maxT = sampleNodeRange(res.Tmax, nSamples, i, t, res.totalS);
      ctx.beginPath();
      ctx.arc(cx, cy, outerR * scale, 0, Math.PI * 2);
      ctx.fillStyle = colorForNode(i, maxT);
      ctx.fill();
    }

    // Liquid-white and Runny-yolk share the same fill color (spec 7.3), so
    // early on the whole cross-section reads as one undifferentiated disc —
    // without a boundary line, the yolk looks like it fills the egg and
    // then "shrinks" once the white changes color. Draw the boundary at
    // every frame so the yolk's true size is always visible.
    ctx.beginPath();
    ctx.arc(cx, cy, res.geo.Ryolk * scale, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(44,26,14,0.32)';
    ctx.lineWidth = Math.max(1, size * 0.006);
    ctx.stroke();

    var node11Max = sampleNodeRange(res.Tmax, nSamples, N_YOLK_NODES - 1, t, res.totalS);
    var node12Max = sampleNodeRange(res.Tmax, nSamples, N_YOLK_NODES, t, res.totalS);
    if (node11Max >= RING_THRESHOLD && node12Max >= RING_THRESHOLD) {
      ctx.beginPath();
      ctx.arc(cx, cy, res.geo.Ryolk * scale, 0, Math.PI * 2);
      ctx.strokeStyle = RING_COLOR;
      ctx.lineWidth = Math.max(2, size * 0.012);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, R * scale, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(44,26,14,0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Draws everything the two chart variants share — axes, yolk band,
  // gridlines, the two temperature curves — and returns the drawing
  // context and scale functions so the caller can add its own mode-specific
  // annotations (boiling mode's 80C dot; sous vide's bath line and plunge
  // marker) before finishing with drawChartPlayhead().
  function renderChartFrame(canvas, res, tMax) {
    var setup = sizeCanvas(canvas);
    var ctx = setup.ctx, w = setup.w, h = setup.h;
    ctx.clearRect(0, 0, w, h);

    var padL = 34, padR = 10, padT = 10, padB = 22;
    var plotW = w - padL - padR, plotH = h - padT - padB;
    var yMin = 0, yMax = 100;

    function xFor(sec) { return padL + (sec / tMax) * plotW; }
    function yFor(temp) { return padT + (1 - (temp - yMin) / (yMax - yMin)) * plotH; }

    ctx.strokeStyle = 'rgba(44,26,14,0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(padL, padT, plotW, plotH);

    ctx.fillStyle = 'rgba(139,58,15,0.14)';
    ctx.fillRect(padL, yFor(YOLK_BAND_HIGH), plotW, yFor(YOLK_BAND_LOW) - yFor(YOLK_BAND_HIGH));

    ctx.fillStyle = '#6b4c35';
    ctx.font = '10px "Libre Baskerville", Georgia, serif';
    var stepMin = tMax > 3600 ? 30 : tMax > 1800 ? 10 : 5;
    for (var m = 0; m <= tMax / 60; m += stepMin) {
      var x = xFor(m * 60);
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.strokeStyle = 'rgba(44,26,14,0.08)';
      ctx.stroke();
      ctx.fillText(m + 'm', x - 7, h - 6);
    }
    for (var temp = 0; temp <= 100; temp += 25) {
      ctx.fillText(temp + '°', 2, yFor(temp) + 3);
    }

    var lineStep = Math.max(4, Math.round(tMax / 300));
    function drawLine(node, color) {
      ctx.beginPath();
      for (var sec = 0; sec <= tMax; sec += lineStep) {
        var v = sampleNodeRange(res.T, res.nSamples, node, sec, res.totalS);
        var px = xFor(sec), py = yFor(v);
        if (sec === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    drawLine(0, '#8b3a0f');
    drawLine(WHITE_MID_NODE, '#2c1a0e');

    return { ctx: ctx, xFor: xFor, yFor: yFor, padL: padL, padT: padT, plotW: plotW, plotH: plotH, tMax: tMax };
  }

  // A dashed vertical line marking a single moment in time — the removal
  // moment in boiling mode, the plunge moment in Sous Vide Mode. Skips
  // drawing if that moment falls outside the frame's visible window.
  function drawDashedVLine(frame, sec, color) {
    if (sec > frame.tMax) return;
    frame.ctx.save();
    frame.ctx.setLineDash([4, 3]);
    frame.ctx.beginPath();
    frame.ctx.moveTo(frame.xFor(sec), frame.padT);
    frame.ctx.lineTo(frame.xFor(sec), frame.padT + frame.plotH);
    frame.ctx.strokeStyle = color;
    frame.ctx.lineWidth = 1.25;
    frame.ctx.stroke();
    frame.ctx.restore();
  }

  // Marks the first moment the white's mid-depth crosses into Rubbery (full
  // set) — shared between both modes' charts. Reads the threshold from
  // WHITE_THRESH rather than a hardcoded value so this can never drift out
  // of sync with classifyWhite's own boundary.
  function drawWhiteSetMarker(frame, res) {
    var rubberyC = WHITE_THRESH[WHITE_THRESH.length - 1];
    var crossSec = null;
    for (var s = 0; s <= res.totalS; s += 1) {
      if (sampleNodeRange(res.T, res.nSamples, WHITE_MID_NODE, s, res.totalS) >= rubberyC) { crossSec = s; break; }
    }
    if (crossSec === null) return;
    frame.ctx.beginPath();
    frame.ctx.arc(frame.xFor(crossSec), frame.yFor(rubberyC), 4, 0, Math.PI * 2);
    frame.ctx.fillStyle = '#2c1a0e';
    frame.ctx.fill();
  }

  function drawChartPlayhead(frame, t) {
    var px = frame.xFor(t);
    frame.ctx.beginPath();
    frame.ctx.moveTo(px, frame.padT);
    frame.ctx.lineTo(px, frame.padT + frame.plotH);
    frame.ctx.strokeStyle = '#7a3010';
    frame.ctx.lineWidth = 1.5;
    frame.ctx.stroke();
  }

  // ---------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------

  window.EggSim = {
    N_NODES: N_NODES,
    N_YOLK_NODES: N_YOLK_NODES,
    WHITE_MID_NODE: WHITE_MID_NODE,
    T_MAX_S: T_MAX_S,
    YOLK_BAND_LOW: YOLK_BAND_LOW,
    YOLK_BAND_HIGH: YOLK_BAND_HIGH,
    RING_COLOR: RING_COLOR,
    RING_THRESHOLD: RING_THRESHOLD,
    WHITE_COLORS: WHITE_COLORS,
    YOLK_COLORS: YOLK_COLORS,
    SV_BATH_MIN: SV_BATH_MIN,
    SV_BATH_MAX: SV_BATH_MAX,
    SV_BATH_DEFAULT: SV_BATH_DEFAULT,
    SV_DURATION_MIN_S: SV_DURATION_MIN_S,
    SV_DURATION_MAX_S: SV_DURATION_MAX_S,
    SV_DURATION_DEFAULT_S: SV_DURATION_DEFAULT_S,
    SV_POST_PLUNGE_S: SV_POST_PLUNGE_S,
    solve: solve,
    solveSousVide: solveSousVide,
    sampleNodeRange: sampleNodeRange,
    classifyWhite: classifyWhite,
    classifyYolk: classifyYolk,
    colorForNode: colorForNode,
    formatTempC: formatTempC,
    formatClock: formatClock,
    renderDiagram: renderDiagram,
    renderChartFrame: renderChartFrame,
    drawWhiteSetMarker: drawWhiteSetMarker,
    drawDashedVLine: drawDashedVLine,
    drawChartPlayhead: drawChartPlayhead,
  };
})();

// ---------------------------------------------------------------
// Boiling-mode UI wiring. Self-contained: runs only if the page includes
// the #egg-simulator markup, and is idempotent per root element (via the
// dataset flag below), so this whole file is safe to load more than once
// on the same page — e.g. if this panel and the Sous Vide panel are each
// pasted into the same post, each carries its own copy of this script tag,
// and the file executes twice, but only wires each root element once.
// ---------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  var EggSim = window.EggSim;
  var root = document.getElementById('egg-simulator');
  if (!root || root.dataset.wired) return;
  root.dataset.wired = '1';

  var els = {
    protocol: root.querySelectorAll('input[name="egg-protocol"]'),
    eggSize: root.querySelectorAll('input[name="egg-size"]'),
    startTemp: root.querySelectorAll('input[name="egg-start-temp"]'),
    removalMode: root.querySelectorAll('input[name="egg-removal-mode"]'),
    removalTime: document.getElementById('egg-removal-time'),
    removalTimePrefix: document.getElementById('egg-removal-time-prefix'),
    removalTimeLabel: document.getElementById('egg-removal-time-label'),
    scrubber: document.getElementById('egg-time-scrubber'),
    timeLabel: document.getElementById('egg-time-label'),
    yolkLabel: document.getElementById('egg-yolk-label'),
    whiteLabel: document.getElementById('egg-white-label'),
    yolkTemp: document.getElementById('egg-yolk-temp'),
    whiteTemp: document.getElementById('egg-white-temp'),
    diagramCanvas: document.getElementById('egg-diagram-canvas'),
    chartCanvas: document.getElementById('egg-chart-canvas'),
  };

  var state = { result: null };

  function getRadioValue(list, fallback) {
    for (var i = 0; i < list.length; i++) if (list[i].checked) return list[i].value;
    return fallback;
  }

  function getParams() {
    return {
      protocol: getRadioValue(els.protocol, 'boil'),
      eggSize: getRadioValue(els.eggSize, 'large'),
      startTempC: getRadioValue(els.startTemp, 'fridge') === 'fridge' ? 4 : 20,
      removalMode: getRadioValue(els.removalMode, 'plunge'),
      removalTimeS: parseFloat(els.removalTime.value),
    };
  }

  function currentTimeS() { return parseFloat(els.scrubber.value); }

  function resolveAndRender() {
    state.result = EggSim.solve(getParams());

    // Room-temperature removal can stretch the window past T_MAX_S (see
    // solve()); keep the scrubber's range in sync, same pattern as Sous
    // Vide Mode's Cook Duration slider below.
    var newMax = state.result.totalS;
    els.scrubber.max = newMax;
    if (currentTimeS() > newMax) els.scrubber.value = newMax;

    render();
  }

  function render() {
    var res = state.result;
    if (!res) return;
    var t = currentTimeS();
    var nSamples = res.nSamples;

    var yolkT = EggSim.sampleNodeRange(res.T, nSamples, 0, t, res.totalS);
    var whiteT = EggSim.sampleNodeRange(res.T, nSamples, EggSim.WHITE_MID_NODE, t, res.totalS);
    var yolkMax = EggSim.sampleNodeRange(res.Tmax, nSamples, 0, t, res.totalS);
    var whiteMax = EggSim.sampleNodeRange(res.Tmax, nSamples, EggSim.WHITE_MID_NODE, t, res.totalS);

    els.yolkLabel.textContent = EggSim.classifyYolk(yolkMax);
    els.whiteLabel.textContent = EggSim.classifyWhite(whiteMax);
    els.yolkTemp.textContent = EggSim.formatTempC(yolkT);
    els.whiteTemp.textContent = EggSim.formatTempC(whiteT);
    els.timeLabel.textContent = EggSim.formatClock(t);

    EggSim.renderDiagram(els.diagramCanvas, res, t);
    drawChart(res, t);
  }

  // A dashed line marks the removal moment — most useful for room-temp
  // removal, where the window can stretch well past it and the curve's own
  // inflection there is subtle (that subtlety is the point — see the page
  // text). Everything else here is the shared scaffolding.
  function drawChart(res, t) {
    var frame = EggSim.renderChartFrame(els.chartCanvas, res, res.totalS);
    EggSim.drawDashedVLine(frame, res.removalTimeS, 'rgba(44,26,14,0.45)');
    EggSim.drawWhiteSetMarker(frame, res);
    EggSim.drawChartPlayhead(frame, t);
  }

  function updateRemovalTimePrefix() {
    var mode = getRadioValue(els.removalMode, 'plunge');
    els.removalTimePrefix.textContent = mode === 'room' ? 'Remove' : 'Plunge';
  }

  function onFullChange() { resolveAndRender(); }
  [].forEach.call(els.protocol, function (el) { el.addEventListener('change', onFullChange); });
  [].forEach.call(els.eggSize, function (el) { el.addEventListener('change', onFullChange); });
  [].forEach.call(els.startTemp, function (el) { el.addEventListener('change', onFullChange); });
  [].forEach.call(els.removalMode, function (el) {
    el.addEventListener('change', function () {
      updateRemovalTimePrefix();
      onFullChange();
    });
  });
  els.removalTime.addEventListener('input', function () {
    els.removalTimeLabel.textContent = EggSim.formatClock(parseFloat(els.removalTime.value));
    onFullChange();
  });
  els.scrubber.addEventListener('input', function () {
    els.timeLabel.textContent = EggSim.formatClock(currentTimeS());
    render();
  });
  window.addEventListener('resize', function () { if (state.result) render(); });

  updateRemovalTimePrefix();
  els.removalTimeLabel.textContent = EggSim.formatClock(parseFloat(els.removalTime.value));
  resolveAndRender();
});

// ---------------------------------------------------------------
// Sous Vide Mode UI wiring (add-on spec). Only runs if the page includes
// the #sousvide-simulator markup. Entirely independent of the boiling-mode
// block above: its own element refs, its own state, its own solve/render
// functions — the two share only the stateless engine above (EggSim),
// never any mutable data. Idempotent per root element for the same reason
// as the block above.
// ---------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  var EggSim = window.EggSim;
  var root = document.getElementById('sousvide-simulator');
  if (!root || root.dataset.wired) return;
  root.dataset.wired = '1';

  var els = {
    eggSize: root.querySelectorAll('input[name="sv-egg-size"]'),
    startTemp: root.querySelectorAll('input[name="sv-start-temp"]'),
    bathTemp: document.getElementById('sv-bath-temp'),
    bathTempLabel: document.getElementById('sv-bath-temp-label'),
    duration: document.getElementById('sv-duration'),
    durationLabel: document.getElementById('sv-duration-label'),
    scrubber: document.getElementById('sv-time-scrubber'),
    timeLabel: document.getElementById('sv-time-label'),
    yolkLabel: document.getElementById('sv-yolk-label'),
    whiteLabel: document.getElementById('sv-white-label'),
    yolkTemp: document.getElementById('sv-yolk-temp'),
    whiteTemp: document.getElementById('sv-white-temp'),
    diagramCanvas: document.getElementById('sv-diagram-canvas'),
    chartCanvas: document.getElementById('sv-chart-canvas'),
  };

  var state = { result: null };

  function getRadioValue(list, fallback) {
    for (var i = 0; i < list.length; i++) if (list[i].checked) return list[i].value;
    return fallback;
  }

  function getParams() {
    return {
      eggSize: getRadioValue(els.eggSize, 'large'),
      startTempC: getRadioValue(els.startTemp, 'fridge') === 'fridge' ? 4 : 20,
      bathTempC: parseFloat(els.bathTemp.value),
      durationS: parseFloat(els.duration.value),
    };
  }

  // Duration is set in whole-ish minutes on a 10-180 min slider; hours only
  // shown once >= 60 min, since the range spans up to 3 hours.
  function formatDurationLabel(sec) {
    var totalMin = Math.round(sec / 60);
    var h = Math.floor(totalMin / 60);
    var m = totalMin % 60;
    if (h > 0) return h + 'h ' + (m < 10 ? '0' : '') + m + 'm';
    return totalMin + ' min';
  }

  function currentTimeS() { return parseFloat(els.scrubber.value); }

  function resolveAndRender() {
    var params = getParams();
    state.result = EggSim.solveSousVide(params);

    // Visible scrub range tracks this solve's duration + post-plunge tail
    // (spec 6.3); clamp the current position if it now falls outside it.
    var newMax = state.result.totalS;
    els.scrubber.max = newMax;
    if (currentTimeS() > newMax) els.scrubber.value = newMax;

    render();
  }

  function render() {
    var res = state.result;
    if (!res) return;
    var t = currentTimeS();
    var nSamples = res.nSamples;

    var yolkT = EggSim.sampleNodeRange(res.T, nSamples, 0, t, res.totalS);
    var whiteT = EggSim.sampleNodeRange(res.T, nSamples, EggSim.WHITE_MID_NODE, t, res.totalS);
    var yolkMax = EggSim.sampleNodeRange(res.Tmax, nSamples, 0, t, res.totalS);
    var whiteMax = EggSim.sampleNodeRange(res.Tmax, nSamples, EggSim.WHITE_MID_NODE, t, res.totalS);

    els.yolkLabel.textContent = EggSim.classifyYolk(yolkMax);
    els.whiteLabel.textContent = EggSim.classifyWhite(whiteMax);
    els.yolkTemp.textContent = EggSim.formatTempC(yolkT);
    els.whiteTemp.textContent = EggSim.formatTempC(whiteT);
    els.timeLabel.textContent = EggSim.formatClock(t);

    EggSim.renderDiagram(els.diagramCanvas, res, t);
    drawChart(res, t);
  }

  // Sous-vide-specific annotations: a static bath-temperature reference
  // line (spec 5.6, 6.1) and a dashed line marking the plunge moment at
  // the end of the chosen duration (spec 5.5, 6.3). The white-fully-set
  // dot and everything else about this chart is shared scaffolding from
  // EggSim.renderChartFrame / drawWhiteSetMarker.
  function drawChart(res, t) {
    var tMax = res.totalS;
    var frame = EggSim.renderChartFrame(els.chartCanvas, res, tMax);
    var ctx = frame.ctx;

    var bathTempC = parseFloat(els.bathTemp.value);
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(frame.padL, frame.yFor(bathTempC));
    ctx.lineTo(frame.padL + frame.plotW, frame.yFor(bathTempC));
    ctx.strokeStyle = 'rgba(122,48,16,0.55)';
    ctx.lineWidth = 1.25;
    ctx.stroke();
    ctx.restore();

    EggSim.drawDashedVLine(frame, res.durationS, 'rgba(44,26,14,0.45)');
    EggSim.drawWhiteSetMarker(frame, res);
    EggSim.drawChartPlayhead(frame, t);
  }

  function onFullChange() { resolveAndRender(); }
  [].forEach.call(els.eggSize, function (el) { el.addEventListener('change', onFullChange); });
  [].forEach.call(els.startTemp, function (el) { el.addEventListener('change', onFullChange); });
  els.bathTemp.addEventListener('input', function () {
    els.bathTempLabel.textContent = EggSim.formatTempC(parseFloat(els.bathTemp.value));
    onFullChange();
  });
  els.duration.addEventListener('input', function () {
    els.durationLabel.textContent = formatDurationLabel(parseFloat(els.duration.value));
    onFullChange();
  });
  els.scrubber.addEventListener('input', function () {
    els.timeLabel.textContent = EggSim.formatClock(currentTimeS());
    render();
  });
  window.addEventListener('resize', function () { if (state.result) render(); });

  els.bathTempLabel.textContent = EggSim.formatTempC(parseFloat(els.bathTemp.value));
  els.durationLabel.textContent = formatDurationLabel(parseFloat(els.duration.value));
  resolveAndRender();
});
