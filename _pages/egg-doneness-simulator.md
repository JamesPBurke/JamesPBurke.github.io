---
title: "Egg Doneness Simulator"
permalink: /egg-doneness-simulator/
excerpt: "A heat-conduction simulator that predicts white and yolk doneness through a boiling egg, minute by minute."
author_profile: false
published: true
---

When you boil an egg, the heat has to travel in from the shell before it ever reaches the yolk — so the white and the yolk are never quite done at the same moment. Whatever second you pull the egg out is a compromise between the two. This simulator lets you watch that compromise happen instead of just trusting a stopwatch: choose how you're cooking the egg below, then drag the time slider to see exactly how done the white and yolk are, second by second.

Change the heating method, egg size, starting temperature, or how you cool it afterward, and the simulation updates instantly to match.

<!-- ============================================================
     COPY-PASTE UNIT — Boiling-Mode Egg Simulator
     To reuse this simulator on another page or post, copy everything
     from here down through the matching END comment and paste it as-is.
     Nothing else needs to come with it: the script tag below pulls in
     the whole engine, and the visual styling (.egg-sim*) already lives
     in the site's global stylesheet, loaded on every page.
     ============================================================ -->
<div id="egg-simulator" class="egg-sim">

  <div class="egg-sim__panel egg-sim__outputs">

    <div class="egg-sim__readouts">
      <canvas id="egg-diagram-canvas" class="egg-sim__diagram" width="320" height="320"></canvas>
      <div class="egg-sim__labels">
        <div class="egg-sim__label-block">
          <span class="egg-sim__label-name">Yolk</span>
          <span id="egg-yolk-label" class="egg-sim__label-value">Runny</span>
          <span id="egg-yolk-temp" class="egg-sim__label-temp">4.0°C (39.2°F)</span>
        </div>
        <div class="egg-sim__label-block">
          <span class="egg-sim__label-name">White</span>
          <span id="egg-white-label" class="egg-sim__label-value">Liquid</span>
          <span id="egg-white-temp" class="egg-sim__label-temp">4.0°C (39.2°F)</span>
        </div>
      </div>
    </div>

    <canvas id="egg-chart-canvas" class="egg-sim__chart" width="900" height="260"></canvas>

    <div class="egg-sim__scrub-row">
      <input type="range" id="egg-time-scrubber" min="0" max="1800" step="any" value="0">
      <span id="egg-time-label" class="egg-sim__time-label">0:00</span>
    </div>

  </div>

  <div class="egg-sim__panel egg-sim__controls">

    <fieldset class="egg-sim__field">
      <legend>Heating protocol</legend>
      <label><input type="radio" name="egg-protocol" value="coldstart"> Cold start, then off-heat, covered</label>
      <label><input type="radio" name="egg-protocol" value="simmer"> Gentle simmer</label>
      <label><input type="radio" name="egg-protocol" value="boil" checked> Rolling boil</label>
    </fieldset>

    <fieldset class="egg-sim__field">
      <legend>Egg size</legend>
      <label><input type="radio" name="egg-size" value="small"> Small (53 g)</label>
      <label><input type="radio" name="egg-size" value="medium"> Medium (58 g)</label>
      <label><input type="radio" name="egg-size" value="large" checked> Large (64 g)</label>
      <label><input type="radio" name="egg-size" value="jumbo"> Jumbo (71 g)</label>
    </fieldset>

    <fieldset class="egg-sim__field">
      <legend>Starting temperature</legend>
      <label><input type="radio" name="egg-start-temp" value="fridge" checked> Refrigerator (4°C / 39°F)</label>
      <label><input type="radio" name="egg-start-temp" value="room"> Room temperature (20°C / 68°F)</label>
    </fieldset>

    <fieldset class="egg-sim__field">
      <legend>After cooking</legend>
      <label><input type="radio" name="egg-removal-mode" value="plunge" checked> Cold-water plunge</label>
      <label><input type="radio" name="egg-removal-mode" value="room"> Remove to room temperature</label>
      <label class="egg-sim__slider-row">
        <span><span id="egg-removal-time-prefix">Plunge</span> at <span id="egg-removal-time-label">10:00</span></span>
        <input type="range" id="egg-removal-time" min="0" max="1800" step="any" value="600">
      </label>
    </fieldset>

  </div>

</div>
<script defer src="{{ '/assets/js/egg-simulator.js' | relative_url }}"></script>
<!-- END COPY-PASTE UNIT — Boiling-Mode Egg Simulator -->

## Choosing a heating protocol

**Rolling boil** puts the egg into water that's already at a full boil and keeps it there for the whole cook. It's the fastest and most aggressive of the three, and the one most stovetop timers you'll find online assume by default.

**Gentle simmer** starts the same way but backs the heat off to a low simmer once the egg goes in, rather than holding a full boil. It's gentler and a little more forgiving of an extra minute or two, and it's how a lot of "boiled egg" recipes actually cook the egg despite the name.

**Cold start, then off-heat, covered** works differently from the other two, not just at a lower heat: the egg goes into the pot *with* the water while both are still cold, and they come up to a boil together. The instant it reaches a boil, the burner goes off and the pot stays covered — the egg finishes cooking on residual heat already stored in the water and the pot, coasting downward instead of being driven by continuous direct heat. Some cooks prefer starting an egg in cold water because it reduces cracking, and the slow coast at the end tends to make the shell easier to peel.

## Reading the diagram

The circle is a slice through the middle of the egg. Each ring is one of 20 simulated points along the radius — 12 through the yolk, 8 through the white — colored by the *hottest that spot has ever gotten*, not its current temperature, since a protein that's set doesn't un-set just because the egg cools down afterward. That's also why the numbers below the labels can drop while the labels themselves stay put: the temperature is falling, but the doneness is permanent.

A thin gray-green ring can appear right at the yolk/white boundary once both sides have spent a while over 80°C (176°F). That's the same reaction responsible for the unappetizing gray-green ring on a real overcooked egg — sulfur from the white reacting with iron in the yolk. It's harmless, just a sign the egg spent too long hot.

The "After cooking" control chooses what happens once the egg leaves the heat: an ice-water plunge, or just setting it on the counter. They are not equivalent. A plunge is dramatic and fast — still air is a famously poor conductor of heat by comparison, so an egg left on the counter keeps climbing in temperature for a long time afterward, coasting on heat already stored inside it. Choose room-temperature removal late in the cook and you'll notice the chart's time window stretches out on its own, so you have room to watch that slow climb actually play out instead of it running off the edge of the graph.

## Color key

Both the diagram and the chart below it use this same scale, running from raw to overcooked:

| Color | Meaning |
|---|---|
| Pale yellow | Liquid / Runny |
| Orange-gel | Silky-set / Jammy |
| Golden yellow | Firm / Fudgy |
| Opaque white-gray | Rubbery (white) |
| Matte yellow | Fully set (yolk) |
| Dull chalky yellow | Chalky (yolk) |

On the chart, the shaded horizontal band marks the jammy yolk range (63–68°C / 145–154°F) — if that's the texture you're after, that's the window you want the yolk-center line inside when you pull the egg. The dot marks the moment the white's mid-depth first crosses 85°C (185°F) and turns fully, rubbery-set.

## Sous Vide Mode

An immersion circulator solves the same white-versus-yolk compromise a different way. Instead of picking a moment to pull the egg from very hot water, you hold the water at one exact, gentle temperature for as long as you like, then plunge — no ramp-up, no cooling pot to account for, just a bath temperature and a duration. Because the water is so much gentler than a boil, the yolk and the outer white can end up much closer in final temperature than boiling ever allows — that's where sous vide's signature custardy white comes from, barely set rather than firm. Hold the bath around 63–68°C (145–154°F) long enough and you'll see the two temperature lines on the chart below converge, instead of staying far apart the way they do above.

This is a separate simulator with its own controls below — it won't respond to anything you changed above, and the diagram and color key explained above apply here too.

<!-- ============================================================
     COPY-PASTE UNIT — Sous Vide Egg Simulator
     Same deal as the boiling-mode unit above: copy everything from here
     through the matching END comment to reuse this panel elsewhere. It
     shares the same script and stylesheet as the boiling-mode unit, but
     doesn't need it present — this chunk is complete on its own.
     ============================================================ -->
<div id="sousvide-simulator" class="egg-sim">

  <div class="egg-sim__panel egg-sim__outputs">

    <div class="egg-sim__readouts">
      <canvas id="sv-diagram-canvas" class="egg-sim__diagram" width="320" height="320"></canvas>
      <div class="egg-sim__labels">
        <div class="egg-sim__label-block">
          <span class="egg-sim__label-name">Yolk</span>
          <span id="sv-yolk-label" class="egg-sim__label-value">Runny</span>
          <span id="sv-yolk-temp" class="egg-sim__label-temp">4.0°C (39.2°F)</span>
        </div>
        <div class="egg-sim__label-block">
          <span class="egg-sim__label-name">White</span>
          <span id="sv-white-label" class="egg-sim__label-value">Liquid</span>
          <span id="sv-white-temp" class="egg-sim__label-temp">4.0°C (39.2°F)</span>
        </div>
      </div>
    </div>

    <canvas id="sv-chart-canvas" class="egg-sim__chart" width="900" height="260"></canvas>

    <div class="egg-sim__scrub-row">
      <input type="range" id="sv-time-scrubber" min="0" max="3900" step="any" value="0">
      <span id="sv-time-label" class="egg-sim__time-label">0:00</span>
    </div>

  </div>

  <div class="egg-sim__panel egg-sim__controls">

    <fieldset class="egg-sim__field">
      <legend>Water bath temperature</legend>
      <label class="egg-sim__slider-row">
        <span id="sv-bath-temp-label">75.0°C (167.0°F)</span>
        <input type="range" id="sv-bath-temp" min="55" max="95" step="any" value="75">
      </label>
    </fieldset>

    <fieldset class="egg-sim__field">
      <legend>Cook duration</legend>
      <label class="egg-sim__slider-row">
        <span id="sv-duration-label">60 min</span>
        <input type="range" id="sv-duration" min="600" max="10800" step="any" value="3600">
      </label>
    </fieldset>

    <fieldset class="egg-sim__field">
      <legend>Egg size</legend>
      <label><input type="radio" name="sv-egg-size" value="small"> Small (53 g)</label>
      <label><input type="radio" name="sv-egg-size" value="medium"> Medium (58 g)</label>
      <label><input type="radio" name="sv-egg-size" value="large" checked> Large (64 g)</label>
      <label><input type="radio" name="sv-egg-size" value="jumbo"> Jumbo (71 g)</label>
    </fieldset>

    <fieldset class="egg-sim__field">
      <legend>Starting temperature</legend>
      <label><input type="radio" name="sv-start-temp" value="fridge" checked> Refrigerator (4°C / 39°F)</label>
      <label><input type="radio" name="sv-start-temp" value="room"> Room temperature (20°C / 68°F)</label>
    </fieldset>

  </div>

</div>
<script defer src="{{ '/assets/js/egg-simulator.js' | relative_url }}"></script>
<!-- END COPY-PASTE UNIT — Sous Vide Egg Simulator -->

On this chart, the dashed horizontal line is the bath's set temperature, and the dashed vertical line marks the moment the duration elapses and the plunge begins — scrub a little past it to watch the egg cool. The dot, same as above, marks the moment the white's mid-depth first crosses 85°C (185°F); at typical sous vide bath temperatures it often never shows up at all, since the white stays well short of that — which is exactly why sous vide whites read silky rather than rubbery.

## What this model assumes

Turning "an egg cooking" into a handful of numbers means simplifying a lot, and those simplifications are exactly the places your own kitchen result can come out a little different from what's on screen:

- **Egg size is a single number.** Small, medium, large, and jumbo each map to one fixed weight, one idealized spherical shape, and one fixed yolk-to-white ratio. Real eggs within the same size grade vary — a bit more oblong, a slightly bigger or smaller yolk, fresher or older — and none of that shows up here.
- **How fast heat actually reaches the egg is fixed per protocol.** In reality that depends on things the model can't see: how many eggs are crowded into the pot at once, how hard it's actually boiling versus barely simmering, the pot's size and material, and altitude (water boils below 100°C/212°F at elevation — this model always assumes sea level).
- **Cold start, then off-heat, covered is the most sensitive of the three protocols to real conditions**, since it runs on stored heat rather than continuous direct heat. A loose-fitting lid, a heavier or lighter pot, or a colder kitchen changes how fast that stored heat bleeds away — far more than it would for a rolling boil, which stays pinned near 100°C/212°F almost regardless of conditions.
- **The doneness thresholds (Runny, Jammy, Silky-set, and so on) come from published egg-protein science, not a single hard on/off switch.** Real coagulation happens gradually across a range of temperatures, and eggs vary batch to batch with freshness and diet. The lines on this chart are a reasonable approximation of that range, not a guarantee accurate to the exact degree.
- **The yolk is assumed to stay perfectly centered** in the egg. In reality it can drift toward one side, especially in an older egg, which changes how quickly heat reaches it from one direction versus another.

None of that makes the simulator wrong to use — its timing has been checked against real, well-tested recipes, and it lands close. It just means that if your own egg comes out a shade different from what the chart predicted, that's expected, not a sign something's broken. Treat it as a strong starting point for your particular stove, pot, and eggs, not a guarantee down to the second.

***AI Disclosure:*** 
*This simulator's numerical model, page, and code were built with AI assistance from a fully-specified physics document, then verified against hand-computed sanity checks before publishing. It's a simulation for exploring the physics of egg cooking, not a substitute for a kitchen timer. The descriptions were also written by Claude Code from my notes. Initial research on mathematical temperature and doneness functions and notes for the physics model were created with Perplexity.*

***Use and Purpose Disclosure***
*Results of the simulations were run by Perplexity deep research to spot-check well-known online egg-cooking recipes and recommendations against the model, but this model's predictions have not been empirically tested by me. Therefore, this should be taken only as an illustrative aid, even though I believe it is also useful as a starting point to test different cooking combinations. If you're interested in testing your method vs. these simulators, [feel free to contact me](/about/) with findings (i.e. "Hey, the model doesn't match my experience/recipe"). Please make sure you understand what the sliders mean before contacting me. Parts of the egg do continue to cook/set, regardless of the time slider, which is just there to control the graph and display. Also, if you cook eggs in a way that isn't represented in the simulation, I'm **not disinterested** in your input, but most feedback will likely not cause me to significantly alter this simulation, as it's just a hobby thing.*
