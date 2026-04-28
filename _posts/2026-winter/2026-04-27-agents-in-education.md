---
title: "Educators Meet Agents"
date: 2026-04-24
published: true
categories:
  - Blog
tags:
  - technology
  - artificial intelligence

---

I just got back from an AI-focused PLTW professional development session run by the Massachusetts Technology Collaborative. The topic was moving (our understanding) past basic chatbots into what's being called "Agentic AI." Here’s what stuck with me.

## The Core Distinction: Chatbots vs Agents

The presenter, [Nikolay Viyahhi](https://www.linkedin.com/in/vyahhi/) (MIT educator, AI initiative veteran, and startup founder), broke it down simply: an agent is essentially a large language model running in a loop.

That's the simple explanation, although it's a bit more than looping a chatbot.

A standard chatbot (like the ones we’ve been using to answer basic questions and write stuff) is reactive: you prompt it, it generates a response based on its training, and then it stops. No memory of the interaction, no ability to act on your behalf beyond generating text.

An agent, by contrast, operates in a continuous cycle:

1. It receives a goal or task
2. It breaks that goal into smaller sub-problems
3. It prompts itself to work on each sub-problem
4. It uses tools (web search, code execution, data access, etc.) to gather information and take actions
5. It evaluates the results
6. It repeats until the task is complete
7. Only then does it report back to the user

Nikolay described it more like working with an assistant than constantly querying a bot. This is also how I've thought about it in my first interactions with agents. An agent is acting like a subordinate with some level of control to make decisions... able to explore a problem, come up with a solution, act on the problem, evaluate its solution, and go from there until it is satisfied that it is time to report back to the user.

Last year was a very distracting year for me, work-wise. And this revolution of agents was on the rise while many of us were still trying to figure out how to deal with chat.

## What Makes an Agent Actually Work

It’s not just the looping. Agents need several key components to be useful:

- **Memory:** persistent storage between sessions, so the agent can learn from past interactions.
- **Skills/Tools:** pre-defined workflows for common tasks like searching the web, running code, or accessing databases.
- **Capabilities:** ways for the agent to interact with external systems such as email, document stores, sensors, version control, and more.
- **Harness/Framework:** the software infrastructure that ties everything together. OpenClaw was one example, though Nikolay noted it’s not the only option.

## The Hands-On Part: Building Our Own

We spent time trying to create our own agents using two tools:

1. Maritime: A platform offering a hosted OpenClaw harness (a service meant to let you safely run OpenClaw without managing your own VPS)
2. Theona.ai: An agent platform that creates other agents

Maritime hit rate limits quickly when we asked for anything complex—like building a full curriculum or accumulating substantial resources. This tracks with my own experience: agents can be token-hungry, and without careful design, they burn through resources fast.

## The Entrepreneurial Angle: Agents as Business Tools

One of Nikolay’s more provocative points: agents aren’t just for personal productivity. He described systems where a “parent” agent spawns fleets of sub-agents to run actual businesses. Not simulations, but real operations with marketing, customers, and revenue (even if not wildly profitable yet).

This suggests agents could be powerful tools for entrepreneurs, handling the operational grunt work while humans focus on strategy and creativity. Though he was clear: for home users like us, the token costs can add up fast unless the agent is genuinely saving time or generating value.

I couldn't help but think about how people started saying to me that programmers are obsolete, now that AI can code. I suppose if that's true, entrepreneurs are next on the chopping block. It's easier to see how silly it is to eliminate a role when you're more familiar with what really goes into performing that job. The "elimination of coders" is not the same as "programmers are doing less coding now." There **is** a huge shift in how people can work, but predictions are ill-advised at this point in time.

## My Takeaways (and Where My Mind Is Going)

Sitting here afterward, I’m realizing I haven’t been very imaginative with how I use my own agent. I’ve mostly treated it as a fancy research assistant — great for summarizing articles or drafting emails, but not truly agentic. It does create a daily briefing for me, but beyond that I don't have it doing anything complex. I have used Claude Code and Perplexity Computer for more complex tasks, and that gets expensive once your free credits run out.

A few ideas are percolating:

- **Teaching evidence collector:** an agent that periodically scans my Google Drive, Classroom, and email to compile artifacts for my yearly review (lesson plans, student work samples, PD certificates) without needing me to gather everything manually.

  This would require unheard-of levels of trust in the agent. Today it’s impossible. But the idea of putting student data on a server at all was once crazy talk. We will eventually reach a point where we trust an agent with nearly all of our data, at home and in schools. That is not a hard prediction; it is how information technology has developed.

- **Curriculum builder:** an agent that helps me break down a unit into daily lessons, suggests activities based on standards, and even drafts rubrics — though I’d need to watch closely for the token trap.

- **Resource gatherer:** an agent that constantly searches for and curates online resources to help my students in problem-solving. Instead of sending students to Google to search the web, or asking an AI to do the search for them, the agent curates a repository of vetted information and tools students can use as a reference.

Problem-solving learning involves students taking responsibility for exploration, asking and answering their own questions. Teachers are a resource, but students also need to learn how to rummage through information and combine pieces into a solution. An agent could periodically improve a protected area of teacher-approved materials students can turn to for problem-solving fodder. In an engineering class, for example: techniques on tool use, materials properties, suggestions for experimentation, approved baseline designs as starting points, YouTube videos, podcasts — whatever.

## Conclusion

There's a lot more to be written on how agents can and will eventually mesh with what we teach and how we teach. There is a whole realm of how this can and should be combined with theory on how people learn. Can agents be deployed to work with a student who needs support to keep their learning productive and adding to their development? Can agents keep easily-distracted students engaged? Can agents be teacher-helpers, monitoring student progress and directing teachers to provide help?

These are big questions, right now bumping up against data privacy concerns. But it's time to start thinking in some of these directions.

[You can read the trip report I generated from a braindump on the meeting here.]({{ '/tr/2026-04-27/' | relative_url }})