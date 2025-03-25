---
title: "Deploying MakeCode"
last_modified_at: 2025-03-25T00:54:23-05:00
published: true
categories:
  - Blog
tags:
  - programming
  - makecode
---
It took me a bit of time to figure out what was going wrong with my deployed MakeCode Arcade games that were being hosted by GitHub pages here on my website (see [the playables tag entries]({% link _pages/tag-archive.md %}#playables) for Silly Shark Game and Sinistar)

Basically, I was completely ignoring that I had to pay attention to MakeCode's own release process. You see, when you deploy a MakeCode Arcade game on GitHub pages, MCA compiles your TypeScript code into a javascript file called `binary.js`. You can create as many releases you want in Github and commit as many changes as you like, and none of them will show up until you go back to the MCA project's management interface (by clicking on the little github icon in the editor) and then creating a new release. That will set the compilation process in motion.

AI both hindered and helped me find this. First it hindered me when it led me to believe that the problem with my release was some errors that keep popping up when MakeCode Arcade tries to install its runtime (or whatever it is) on GitHub. But that error (which showed up in the GitHub actions) didn't fix the problem when the bug was corrected.

Another AI helped me find the problem when I asked it to walk me through all the things I could check. When I saw that `binary.js` hadn't changed from the first time I sent the files to GitHub, I knew I was close to the problem's source.

I should have known it was something like this. Last week I was messing with MakeCode Microbit (which uses essentially the same interface. And I learned how MC-M allows you to update the repository all you like and not release the working code until you're ready.
