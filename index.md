---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: single
title: "This is where I write things"
header:
   overlay_image: /assets/images/mapbanner2.png
author_profile: true
---
# Recent Posts


{% for post in site.posts limit:2 %}
<article class="post">
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <p>{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
  </article>
{% endfor %}

[Check out the main Blog page](/blog/index.html){: .btn .btn--primary .btn--large}
