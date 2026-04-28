---
title: "Advancing Beyond Chatbots: Insights from the Westborough Agentic AI Professional Development"
date: 2026-04-28
tags: [Agentic AI, PLTW, Professional Development, LLM, Education]
author: "Dr. James Patrick Burke"
excerpt: "A comprehensive report on the transition from generative chatbots to autonomous AI agents in the classroom, based on the recent professional development session in Westborough, MA."
permalink: "/tr/2026-04-27/"
---

## 1. Event Context and Strategic Objectives
On April 27, in Westborough, MA, a critical professional development session convened to address the next frontier of educational technology: the transition from basic chatbot interactions to the deployment of **"Agentic AI."** Within the Project Lead The Way (PLTW) curriculum framework, this shift represents a strategic evolution from teaching students how to prompt for text to teaching them how to architect autonomous systems. As we move beyond simple generative AI, our objective is to integrate tools that do not merely respond to queries but actively execute complex, multi-step projects.

Key stakeholders and presenters at the session included:

* **Nikolai:** Lead presenter, MIT faculty member, and entrepreneur behind several AI startups.
* **The Massachusetts Technology Connection:** The facilitating organization leading the regional AI curriculum effort.
* **PLTW Educators:** Faculty currently implementing AI curricula who are seeking to leverage advanced tools for both classroom instruction and administrative efficiency.

The primary objective of the session was to move beyond the paradigm of AI as a text generator and toward an understanding of AI as an agent capable of autonomous task completion. This involves systems that can decompose a high-level goal into actionable sub-problems and solve them independently.

## 2. Conceptual Framework: Large Language Models vs. AI Agents
To effectively integrate these tools into school environments, educators must distinguish between standard Large Language Models (LLMs) and Agentic AI. Standard LLMs are reactive; they require constant human prompting to progress. Agentic AI, however, functions as an autonomous subordinate, capable of making decisions and interacting with external environments without requiring permission for every incremental step.

### Workflows vs. Agents
The session established a sharp distinction between predetermined processes and autonomous action:

* **Workflows:** These are known tasks with specific, sequential steps and low autonomy. The path from input to output is a straight line, and the AI follows a set procedure.
* **Agents:** An agent is essentially an LLM running "in a loop." It takes a user’s task, breaks it into sub-problems, and prompts itself to solve those parts. Crucially, an agent evaluates its own solutions, iterating through problems until it is satisfied with the result it reports back to the user.

### The Anatomy of an Agent
The presentation categorized an agent's capabilities into three distinct areas:

1.  **Memory Files:** These provide persistence between sessions. They include "soul" and "identity" files (defining the agent’s persona) and "user" files (storing context about the teacher or student it serves).
2.  **Skills:** These are established workflows—specific, reliable procedures—that the AI has been "taught" to execute perfectly every time.
3.  **Tools:** These are the "hands" of the agent. Through software access, agents utilize tools like web search, physical sensors, email clients, document stores, and code versioning systems to interact with the world.

## 3. The Agentic Toolkit: Platforms for Implementation
For an agent to function, it requires a "harness"—a software framework that provides the secure environment and connectivity needed for the agent to access its tools and memory.

| Tool Name | Core Function | Educational/Professional Utility |
| :--- | :--- | :--- |
| **Maritime** | Cloud hosting for AI agents (OpenClaw harness). | Provides a safe hosting environment for school agents without the need for a VPN. |
| **Egbe** | Platform for autonomous companies/entrepreneurship. | Used to explore business logic; allows users to "Redeem & start" a business (Promo Code: IIA). |
| **Theona** | Agent builder for team-based tasks. | A high-level agentic tool that creates its own specialized agents to handle specific team roles. |

**Maritime** is of particular strategic value to school districts. By providing a hosted version of OpenClaw, it allows faculty to experiment with agentic capabilities without the security risks of opening local networks or the technical overhead of manual server configuration.

## 4. Workshop Experience: Practical Application and Technical Realities
The workshop phase was characterized by a spirit of innovation, though the experience was notably "bumpy"—a reminder that agentic AI remains an emerging technology.

### The "Teacher Evidence Agent"
A primary example developed was designed as a background process to monitor a teacher’s Google Drive, Gmail, and Google Classroom. Once or twice a day, it would identify evidence of teaching efficacy—such as specific student feedback or curriculum updates—and automatically compile this into a Google Doc to support yearly professional reviews. This transforms a significant administrative burden into a passive, automated stream of data.

### Technical Limitations Observed:
* **Credit and Access Issues:** The startup phase on Maritime was hindered for many by usage credits failing to activate.
* **Rate Limits and Task Complexity:** Agents frequently hit API rate limits when attempting to build comprehensive resource repositories.
* **Rendering Friction:** Hurdles occurred when attempting to display markdown files as web pages, leading to agents reaching operational limits before finalization.

## 5. Economic and Operational Considerations for Schools
The transition to agents necessitates a shift in how schools view digital resources, specifically accounting for the **"cost of agency."**

### Tokens as Fuel
Nikolai presented a pragmatic view: while token costs might be negligible for businesses, for a school district, if an agent is not actively saving a teacher time or providing a measurable output, the "fuel" cost represents a net loss. Usage must be directed toward high-value tasks.

### Trust and Agency
There is a direct trade-off between trust and utility:
* **High Trust:** Giving the agent "the reins" (email, Drive, calendars) allows for true autonomous completion of work.
* **Low Trust:** Restricting access forces the teacher to act as a **"manual data shuttle,"** manually moving information between the LLM and their files, negating the primary benefit.

## 6. Final Assessment and Recommendations
Agents are unnecessary for tasks that chatbots already handle well. Their true value lies in saving time through autonomous data retrieval, evaluation, and task execution.

### Next Step Recommendations:
1.  **Identify "Agency-Worthy" Tasks:** Prioritize tasks that require cross-referencing multiple data sources.
2.  **Strategic Access Pilots:** Begin small-scale testing of agents with "reins" to specific, non-sensitive folders to move away from the manual data shuttle model.
3.  **Manage ROI on Token Usage:** Evaluate tools based on time saved.

The future of AI in our schools lies in moving beyond the chat box and toward systems that can truly act on behalf of the educator.

***
