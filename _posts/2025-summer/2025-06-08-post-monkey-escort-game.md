---
title: ":monkey: Escort Mission Game :guardsman:"
published: true
header: 
   #image: https://ik.imagekit.io/scurryday/thumb/kibbeh.jpg?tr=w-640
   teaser: https://ik.imagekit.io/scurryday/thumb/escort_gameplay.gif
   og_image: https://ik.imagekit.io/scurryday/thumb/escort_gameplay.gif
categories:
- Blog
tags:
- programming
- playables
- makecode
---
![Gameplay from Monkey Escort Mission](https://ik.imagekit.io/scurryday/thumb/escort_gameplay.gif?tr=w-640)

I teach a game creation class at the high school, and one of the platforms we use is [Microsoft MakeCode Arcade](https://arcade.makecode.com/). I've [written about it before]({{ site.baseurl }}/tags/#makecode). Students have really enjoyed this platform, especially this year. I actually diverted away from other projects to give kids more time on MakeCode because of the enthusiasm they had for it. Next year I plan to feature it earlier and more prominently in the curriculum.

As a result, I've returned to it to flesh out a game that can be used as an example for several projects next year, covering a number of the features of the platform. The result of my recent work is Monkey Escort Mission. [You can play it here](https://jamespburke.com/monkey-escort-mission).

At various points in projects, my students are directed to create their games with things like:

* A story
* Characters
* Interesting game mechanics
* Goals and win conditions
* Obstacles to overcome before a goal can be reached
* Assets
  * Sprites (the artwork for characters, enemies, etc. )
  * Sounds
  * Music
* Multiplayer support
* Progressive difficulty increases
* Cooperative play
* Instructions

I've built the instructions into my game, so you can play it to read those.

This game started as a test to answer my student's question about what to do in multiplayer games when all players share the same screen. Kids are used to multiplayer games where everyone has their own screen (e.g. first person shooter games) or split screen games (e.g. Mario Party), but not games with only one screen. MakeCode allows four players to be on different devices, but they still see the same screen. Because there is a built-in MakeCode feature for having the camera follow one sprite, we run into the issue of keeping track as sprites cross the screen edge. 

To demonstrate a possible solution, I made a program with a slow, artificial second player. The camera is pointed at the average of their positions. Players would be forced to stay on the screen while others "caught up."

It worked, and looked pretty natural. Kind of like an escort mission. The student expanded that idea to four players. While my students worked at creating their multiplayer games, I considered what this would need in order to be a playable game. 

It evolved as I considered: 

* The monkey needed to move with you, but needed to be imperfect. So random changes are made to the monkey's movement, and then it gets scaled depending on the distance to the player. It appears to try to catch up, but meanders when the monkey is close. The motion updated every 600 ms.
* There needed to be a maze. That was straightforward. 
* Enemies needed to make this a challenge. They needed several features. 
  * I gave them similar movement to the monkey's, but they aim themselves at the monkey.
  * They didn't change velocity until they hit a wall. Sometimes they bounce off and sometimes they go after the monkey directly. 
  * On collision with the monkey, both players teleport back to the beginning.  This became the main idea of the game: your win condition is escape, but the ghosts send you back. There were some complications with the camera; I turn off the "stay on screen" restriction temporarily because you have to move one sprite at a time and the camera is updating when that happens.
  * I decided to make a ghost turn red if it's successfully sent you back, just for fun, so you could go after it when you encountered it again in the maze. 
  * I have the ghosts Spawn points so that they would appear at predictable places. but this also allows me to control where they show up. I wanted them to show up dynamically but not all over the map. So they only show up when the player gets close to a spawn point. this introduces a tactic. Namely, you have some control over enemy spawning because you can be careful around spawn points.
* I added a projectile for the hero to shoot. I fiddled a lot with the code that creates the shooting mechanic because I needed the projectiles to be able to go in the direction that the player was moving or in their direction the player had last moved. That's not built-in to MakeCode Arcade. 
  * 2D shooting like this wasn't all that difficult, but was a little more challenging than I expected. Sometimes when I write these games, the point is to discover how complex certain mechanics will be before my students encounter the problems themselves. It helps me give them guidance on how big a challenge they're taking on when they describe their game ideas to me.
  * When the game seemed way too difficult, I decided to add the ability to bounce projectiles off of the walls. This gives the player an additional tactic against the ghosts.
  * When that made things too easy, I limited the shots to no more than four and then gave each projectile a life cycle of about 3 seconds.
* I added in the goal region so that we would have a win condition. 
* Sometimes it's just too difficult to shoot the ghosts, so I added the ability to destroy ghosts by running into them. 
  * I didn't want this to be the main way of getting rid of ghosts, so I gave a consequence to the player: it affects the score, and it affects the player's health. So this possible loss condition to the game: running out of health (hearts).
* Sound effects and other small effect touches gave the game more of a feeling of life.
  * The projectiles make a sound, and you hear a different sound when you run out of projectiles. 
  * Running into the ghosts makes a sound, but also shakes the screen.
  * Teleportation makes a sound and also adds a sparkle effect as if there is some residual magic as a result of your teleportation.
* I added music. There are three different pieces that play during this game. 
  * The first is a kind of annoying piece of music that plays during the instruction phase. It sets this phase apart from the gameplay.
  * The second music plays while the game is running. I wanted to create something driving and slightly ominous to reflect the nature of trying to sneak out of a maze. 
  * The final piece of music is the victory music when you reach the goal area. 
  * for all three of these pieces of music I asked ChatGPT to help me work out good combinations for the different voices in the music editor. I'm not a musician, but I do know a tiny bit about what I like. I took some of chat GPTs suggestions, but throughout most of them. And then I reworked what I had until I liked the sound enough. It was more of a process of trial and error than anything else. The MakeCode Arcade music support is capable of a lot, but I don't think there's a way to easily import music from something like a MIDI interface. So you have to do everything through a slightly clunky music editor.
* I decided to create the scheme for the score based on how long it was taking you to get out of the maze combined with whether you had run into any ghosts. You don't have the choice to start a timer, so I had to use the games running time which meant that I had to subtract out the time spent reading the instructions.
* and then there was a bunch of fiddling with little things in order to make the game seem more smooth and playable and adjust the difficulty. 

It's not the most complicated game in the world but you can see that there are a lot of things to consider when you're making a game. Even a little game like this. And you can see that for students learning to program or just learning to problem solve game creation produces opportunities to think about how details will work together to create something greater than those details alone.

Because I often have my students write up a story that is behind their game, I wrote a story for this one:

> You have been tasked as the guardian of the Monkey King's son. Prince Monkleton is very young and prone to wandering. He excels at sneaking off, and also speeding off when he gets it in his mind to wander. On one of his treks, he accidentally crossed over into the Ghost Domain, a region of lawless mercenaries who employ dark magic to plunder and swindle their way to riches.
>
>The Ghosts used magic to imprison Monkleton in their maze. Buy you aren't without your own tricks. You teleported to the side of the prince in order to help him escape. But you can't teleport out unless you get to the golden area of the maze. Once there, you can use an incantation to free yourself and the prince.
>
>Avoid the Ghosts, who will simply teleport you back to your holding area.
>
>Good luck!
{: .notice--info}

You can play the game on a computer, or on a phone or tablet. On a computer the arrow keys (or WASD) will move the player. The space bar is the A key, and fires projectiles. On a phone or tablet there is an on-screen joystick as well as buttons. It's easier on a computer, though. 

Have fun! And let me know what you think. I know it's not a triple-A game, but I only write it with time cobbled together over a couple of days.

[Launch Monkey Escort Mission](https://jamespburke.com/monkey-escort-mission){: .btn .btn--primary .btn--x-large .btn--info}