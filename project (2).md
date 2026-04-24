# OIM3690 AI-Powered Web Development - Final Project (Spring 2026)

## Overview

The Final Project is your opportunity to create a complete, functional web application that showcases your semester-long learning. Build something that solves a real problem or provides genuine value to users.

This project is worth **25%** of your final grade.

## Project Philosophy

### Think Harder, Build Smarter

The Final Project is your chance to **push beyond the basics**. Don't just build something that works. Build something that matters.

- **Solve a real problem**: Who will use this? What pain point does it address? Can you test it with real users?
- **Challenge yourself**: Use technologies we didn't cover in class. Learn something new. Surprise yourself.
- **Quality over quantity**: A polished, focused product beats a feature-stuffed mess.

### AI-First, Understanding-Required

You are expected to use AI tools (GitHub Copilot, v0.dev, bolt.new, ChatGPT, Claude, etc.) throughout your project. However, **you must understand every line of code you submit**. The Quizzes verify your understanding, and you may be asked to explain any part of your implementation.

Remember: AI helps you build faster, but understanding helps you build better.

## Timeline

| Milestone | Date | Details |
| --- | --- | --- |
| **Project Intro** | 4/14 (Session 22) | In-class: requirements, topic selection |
| **Proposal** | 4/19 (Sun) | Submit `proposal.md` to your project repo |
| **Demo Day** | 4/28 (Session 26) | Gallery Walk + voting |
| **Final Submission** | 5/1 (Thu) | Code, README, all finalized |

## Repository Setup

Create a **separate public repository** for your Final Project (not inside your `webdev` repo).

**Naming convention**: Use a descriptive name for your project, e.g.:

- `habit-tracker`
- `recipe-finder`
- `travel-planner`

**Repository structure**:

```text
[project-name]/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   └── images/
└── README.md
```

**Important**: Add a link to your Final Project on your `projects.html` portfolio page (`username.github.io/projects.html`).

## Proposal

- Due: **4/19**
- Create a file named `proposal.md` in your project repo.

Your proposal should include:

1. **What are you building? Who is it for?** One or two sentences describing your project and the target user.
2. **Why?** What motivates you to build this? What problem does it solve?
3. **MVP vs. Stretch Goals**: What is the minimum working version? What would you add if you have time?
4. **What technologies do you plan to use?** APIs, libraries, frameworks, etc.

Keep it short and focused.

## Project Requirements

### Functional Requirements

Your project must include:

1. **Multiple pages or views** (at least 3 distinct sections/pages)
2. **Responsive design** that works on mobile and desktop
3. **Meaningful interactivity** using JavaScript (at least 3 from below):
   - DOM manipulation (dynamic content updates)
   - Event handling (user interactions)
   - Form with validation and feedback
   - API integration (fetch data from external API)
   - Local storage (save user preferences or data)
   - Dynamic filtering/sorting of content
   - Theme toggle or visual customization
4. **Navigation** that allows users to move between sections/pages
5. **Deployment** with a working public URL

### Deployment

**GitHub Pages** is the default deployment platform for this course. However, if your project requires backend functionality, server-side processing, or features that GitHub Pages cannot handle, you may deploy to alternative platforms:

- **Vercel** (recommended for Next.js or serverless functions)
- **Netlify** (good for static sites with serverless functions)
- **Render** (supports backend services)
- **Railway** or **Fly.io** (for full-stack applications)

If you're unsure which platform to use or need help with deployment, ask the instructor during office hours.

### Technical Requirements

- **HTML**: Semantic structure, proper use of tags, accessibility attributes
- **CSS**: External stylesheet, responsive layout (Flexbox/Grid), media queries
- **JavaScript**: Clean code, no console errors, documented with comments
- **Performance**: Lighthouse scores above 80 for Performance, Accessibility, and SEO

### Documentation

Your `README.md` must include:

1. **Project title and description** (what it does and who it's for)
2. **Live demo URL** (GitHub Pages link)
3. **Features list** (what users can do)
4. **Technologies used**
5. **AI tools used** and how they helped
6. **Challenges faced** and how you solved them
7. **Future improvements** (what you would add with more time)

## Project Ideas

Choose a project that solves a real problem or provides genuine value. Ask yourself: **Who would actually use this? Why?**

### Finding Your Idea

The best projects come from real needs:

- **Your own frustrations**: What tool do you wish existed? What repetitive task could be automated?
- **Help someone you know**: Interview a friend, family member, or student org. What do they struggle with?
- **Improve something existing**: What app or website annoys you? Can you build a better version of one feature?
- **Explore your interests**: Passionate about music, sports, cooking, gaming? Build something for that community.

### Example Categories

**Personal Productivity**

- Habit tracker with streaks, statistics, and reminders
- Budget tracker with spending categories and visualizations
- Study planner with pomodoro timer and progress tracking
- Goal setter with milestones and accountability features

**Information & Discovery**

- Recipe finder with ingredient-based search and meal planning
- Local event aggregator for your campus or city
- Course/professor review platform
- Reading list manager with progress tracking and notes

**Interactive Tools**

- Quiz game with categories, difficulty levels, and leaderboards
- Flashcard app with spaced repetition algorithm
- Decision maker (random picker, pros/cons analyzer)
- Collaborative playlist builder

**Utility & Productivity**

- Meeting scheduler with availability comparison
- Expense splitter for group activities
- Resume/cover letter generator with templates
- Browser start page with customizable widgets

### Going Beyond the Basics

Want to stand out? Consider incorporating technologies we didn't cover in class:

- **Data visualization**: Chart.js, D3.js for graphs and charts
- **Maps**: Leaflet or Google Maps API for location-based features
- **Real-time features**: WebSockets for live updates
- **Authentication**: Firebase Auth for user accounts
- **Database**: Firebase Firestore or Supabase for persistent data
- **PWA**: Make your app installable on mobile devices
- **Animation libraries**: GSAP, Framer Motion for polished interactions
- **AI integration**: OpenAI API for smart features

These are optional, but exploring new technologies demonstrates initiative and will be recognized.

**Not allowed**: Static personal websites or digital resumes (these were covered in earlier exercises).

## Grading Criteria

| Criteria | Weight | Description |
|----------|--------|-------------|
| Functionality | 40% | Features work correctly, no major bugs |
| Code Quality | 25% | Clean, organized, well-commented code |
| Design & UX | 25% | Responsive, accessible, user-friendly |
| Documentation | 10% | Complete README, clear explanations |

## Demo Day (Session 26)

- Date: **4/28**

On Demo Day, you'll set up your project on your laptop. The class will walk around, try each other's projects, and ask questions.

**Prepare:**

- Have your site deployed and ready to demo
- Be ready to explain: what it does, how it works, what you learned
- Try your classmates' projects and ask them questions

After browsing, everyone votes for their favorite projects (you cannot vote for yourself). Top-voted projects receive bonus points.

Details on the voting format will be announced before Demo Day.

## AI Tool Usage

You are encouraged to use AI tools throughout development:

- **Prototyping**: v0.dev, bolt.new for initial design
- **Coding**: GitHub Copilot, ChatGPT, Claude for implementation
- **Debugging**: AI assistants for troubleshooting
- **Learning**: Ask AI to explain concepts you don't understand

**Requirements**:

1. Document significant AI contributions in code comments
2. Note AI tools used in your README
3. Be prepared to explain any code in your project

## Submission Checklist

Before 5/1, make sure:

- [ ] Repository is public on GitHub
- [ ] `proposal.md` in repo (from 4/19)
- [ ] Site is deployed and working (GitHub Pages or alternative)
- [ ] README.md is complete with all required sections
- [ ] Code has no console errors
- [ ] Site is responsive (test on mobile)
- [ ] Link added to your `projects.html` portfolio page

## Getting Help

- **Office hours**: Discuss project ideas, get feedback on progress
- **Peer buddy**: Test each other's projects, share tips
- **GitHub Issues**: Document questions and decisions
- **AI tools**: Use for debugging and learning

---

*Updated: 2026/04/08*
