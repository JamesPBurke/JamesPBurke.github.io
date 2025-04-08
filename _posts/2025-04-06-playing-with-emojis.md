---
title: ":fist::us::fire: and Spoilers"
published: true
categories:
- Blog
tags:
- Jekyll
- programming
---
I know this post looks political because :fist: :us: :fire: was recently in the news,
but I thought I would look into how to use emojis on this blog, and it turns out that either emojis are
installed in Jekyll by default, or I installed a plugin here and forgot about it.

In any case, I wanted to record here a link to [someone else's cheat sheet of all the emojis that are supported by the Jemoji plugin](https://www.fabriziomusacchio.com/blog/2021-08-16-emojis_for_Jekyll/).

I'm also going to test spoiler capability here:

<details><summary>Spoiler: click to reveal</summary>...to see if it does a decent job of hiding spoiler text. One thing I kind of want to post about
sometime in the near future is about how I feel about the TV and movie media I'm watching. I don't really do reviews... I'm not a practiced
film or TV critic. But I want to get better at thinking about the things I watch, and writing about them is a good way to get
better about thinking.</details><br>


In any case, the "spoiler" above was accomplished with this HTML:
```html
<details>
   <summary>Place summary here</summary>
   Spoiler text here
</details>
```
