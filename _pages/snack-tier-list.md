---
title: "Snack Tier List"
layout: single
permalink: /snack-tier-list/
---

<div class="tier-list">
  {% assign tiers = "S,A,B,C,D" | split: "," %}
  {% assign snacks = site.posts | where_exp: "post", "post.categories contains 'Snacks'" %}

  {% for tier in tiers %}
  <div class="tier-row">
    <div class="tier-label tier-{{ tier }}">{{ tier }}</div>
    <div class="tier-items">
      {% for post in snacks %}
        {% if post.tier == tier %}
          <a href="{{ post.url }}" class="tier-item">{{ post.snack_name }}</a>
        {% endif %}
      {% endfor %}
    </div>
  </div>
  {% endfor %}
</div>

# Notes

This is called a ***Snack Tier List***, but may contain items that fall into several categories and subcategories: 

* Junk food snacks
  * Off-the-shelf junk food
  * Prepared junk food
* Nutrition-focused snacks (aka. nutrition-food)
  * Off-the-shelf products marketed to help meet specific nutrition goals
  * Prepared foods from a website, video, or my own tests that are intended to address a certain nutritional goal
  * ***Note:*** a *nutrition-food* is marketed for some aspect of its nutrition, especially if that marketing is central. That's my made-up definition of a nutrition-food. That's not the same as a *health food*. I do not define the term "health food" for the purposes of this project. 
* Condiments / Spices / Flavorings
* Ingredients that are generally not eaten on their own, but could be

Where an item lands on a tier list is highly influenced by marketing and intention. For instance, if (for the sake of this example) I considered Oreo Cookies completely amazing, they might be listed as S Tier despite their nutritional value (which is abysmal) while a yummy item marketed as a health food might get C-tiered if its nutrition is over-hyped yet underwhelming. The nutrition section of the individual review will tell you whether I consider the food to be a junk food. Bias may not be made explicit in every case, which is why I put this explanation here, although each review should give you a decent understanding of why I tiered a snack where I did.

# Tiers Explained

<div class="tier-list">
  <div class="tier-row">
    <div class="tier-label tier-S">S</div>
    <div class="tier-desc">Transcendent. You'd eat this when you're not even hungry. You've thought about it at work. You have a backup bag.</div>
  </div>
  <div class="tier-row">
    <div class="tier-label tier-A">A</div>
    <div class="tier-desc">Excellent. Reliably reaches for when the occasion calls for it. No complaints, just solid execution of what a snack is supposed to do.</div>
  </div>
  <div class="tier-row">
    <div class="tier-label tier-B">B</div>
    <div class="tier-desc">Good but situational. Better with a sandwich, or when it's the only thing at the party, or when you're in a specific mood. Wouldn't seek it out but wouldn't turn it down.</div>
  </div>
  <div class="tier-row">
    <div class="tier-label tier-C">C</div>
    <div class="tier-desc">Fine. Exists. Scratches the snack itch technically but leaves you vaguely wishing you'd grabbed something else.</div>
  </div>
  <div class="tier-row">
    <div class="tier-label tier-D">D</div>
    <div class="tier-desc">Either actively bad, or a profound disappointment given what it could have been. Reserved for snacks that had potential and blew it, or snacks that taste like a diet.</div>
  </div>
</div>



