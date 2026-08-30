---
title: Egg and Shake Update
published: true
last_modified_at: "2026-08-28 08:40:30"
categories:
  - Blog
  - Snacks
tags:
  - food
  - recipes
  - cooking
  - diet
toc: true
toc_label: "Post Contents"
toc_icon: "hand-o-right"
toc_sticky: true
header:
  teaser: https://ik.imagekit.io/scurryday/postimg/Gentle8point5.jpg?tr=w-500,c-at_max,f-auto,q-75
  og_image: https://ik.imagekit.io/scurryday/postimg/Gentle8point5.jpg

---


Logging that I have revisited two earlier posts. I have new info!

# Egg Update: An Easier Way

Sous vide is great for boiling 10 eggs ([see my last post on this](/blog/snacks/almost-perfect-hard-boiled-eggs/)) because it is less susceptible to the fact that the eggs will lower the temperature of the water when they're added. That's because it's a longer cooking method, and there's a lot of wiggle room when you're cooking an egg for 45 minutes plus cooldown time. But the Instant Pot is an imperfect sous vide vehicle and I don't want to set up the circulator for every time I want a bunch of boiled eggs.

I was also curious if my simulator did a good job predicting how an egg would turn out. At least, in my ideal range of donenesses. So, I fiddled with the controls, and settled on this set of settings:

## Simulation: Gentle Boiling Water Method at 8:30


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
  <input type="range" id="egg-time-scrubber" min="0" max="1800" step="any" value="750">
  <span id="egg-time-label" class="egg-sim__time-label">12:30</span>
</div>
</div>

<div class="egg-sim__panel egg-sim__controls">

<fieldset class="egg-sim__field">
  <legend>Heating protocol</legend>
  <label><input type="radio" name="egg-protocol" value="coldstart"> Cold start, then off-heat, covered</label>
  <label><input type="radio" name="egg-protocol" value="simmer" checked> Gentle simmer</label>
  <label><input type="radio" name="egg-protocol" value="boil"> Rolling boil</label>
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
    <span><span id="egg-removal-time-prefix">Plunge</span> at <span id="egg-removal-time-label">8:30</span></span>
    <input type="range" id="egg-removal-time" min="0" max="1800" step="any" value="510">
  </label>
</fieldset>
</div>

</div>
<script defer src="{{ '/assets/js/egg-simulator.js' | relative_url }}"></script>

It describes bringing some water to a boil, gently lowering the eggs into the water, but then backing off ot a gentle simmer. I found that my water, at a gentle simmer, appeared to be at 205F. At eight minutes and 30 seconds I removed the eggs and put them into ice water. FOur minute later I peeled one. This was the result:

{% include figure image_path="https://ik.imagekit.io/scurryday/postimg/Gentle8point5.jpg?tr=w-500,c-at_max,f-auto,q-75" alt="A boiled egg cut in half revealing the cross section with yolk." caption="Your eggcelently perfect jammy egg with a solidly set white." %}

You can see that I wasted no time in salting the thing, and would have eaten it immediately if I hadn't remembered to snap a photo.

The center is on the fudgy side of jammy, and a notable difference from the sous vide egg is that the white is more structurally solid, making peeling easier and making this egg one that can travel well. To be completely honest, the silky-set whites can be a bit delicate. I like the texture for eating, but they can be tough to get out of the shell and they don't lend structural integrity to the egg. I dropped a container of sous vide eggs in the fridge, and they all kind of smooshed. Granted, that was from a batch (the 5th time I had made them) that all seemed to come out with slightly softer whites. But the experience sent me back to the simulator because I want to take these eggs with me for lunches.

The simulator really was created for display purposes, not for prediction. SO I didn't expect much, except that I knew it coincided with known recipes. However, I usually fast-boil my water when I make eggs. From the simulation it was clear that simmering is superior because it create less of a cooking differential between the yolk and white. So, I set the simulator to what appeared to be the ideal finishing state, and then let 'er rip. The result is that I will likely use this easier method for eggs I'm taking with me anywhere.

# Shake Update: Just The Solids

[After the last shake post](/snacks/The-Naked-Pea-Made-Palatable/), I realized that pea protein shakes would be easier if I could make a custom blend and take that dry mix with me places. So I eliminated all the wet ingredients other than milk, scaled up the recipe, and mixed a half gallon (dry). I tested it and the chocolate-cinnamon combo overwhelms the milk flavor anyway, so water and ice are fine. Here is the recipe for one single shake:

## Spicy Chocolate Protein Shake

### Ingredients

*   **16 oz** Water
*   **2 scoops (37g)** Naked Pea Vanilla protein powder
*   **2 tsp** Unsweetened cocoa powder
*   **1 tsp** Ground cinnamon
*   **½ tsp** Ground cayenne pepper
*   **2 packets** Sucralose 

### Instructions

1. **Prep the base:** Add a third to a half of the water to a shaker bottle or blender first to prevent powders from sticking to the bottom. 
2. **Combine:** Add the protein powder, cocoa powder, cinnamon, cayenne, and sucralose.
3. **Paste:** Stir the thick paste and allow a minute or so to hydrate
4. **Complete and Mix:** Add remaining water, then shake vigorously or blend until completely smooth. 
5. **Serve:** Enjoy chilled or pour over ice. Alternately, use ice before shaking.

<iframe title="CRONOMETER.com" width="320" height="540" src="https://cronometer.com/facts.html?share=4f12a68d178e4b1d905352c9a277c7d6&food=&measure=294398017&labelType=AMERICAN_2016" frameborder="0"></iframe>

I believe it wouldn't be much different if you used the plain Naked Pea mix. The vanilla flavoring is not prominent, so I doubt it would be missed.

*AI Disclosure: I used an LLM to quickly fix the markup on my recipe. The writing is mine. There's probably even typos.*