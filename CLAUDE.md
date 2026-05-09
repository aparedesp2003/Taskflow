# CLAUDE.md

# Project Overview

This project is a modern SaaS-style Task Dashboard Manager that allows users to create accounts, log in securely, and manage tasks under different projects. Tasks can be moved between workflow stages ("To Do", "In Progress", "Done") using drag-and-drop functionality. The goal is to build a polished, production-quality application suitable for a professional software engineering portfolio.

---

# Developer Profile

The developer is a software engineer focused primarily on front-end development, with strong interest in building portfolio-quality side projects that improve technical skills and showcase engineering ability.

Primary strengths:

- Front-end architecture
- UI / UX design
- Responsive development
- Component design
- Product thinking
- Clean code practices

Preferred technologies:

- React
- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Framer Motion

When assisting:

- Explain technical concepts clearly
- Teach while building
- Suggest modern best practices
- Prioritize scalable solutions
- Prioritize maintainable code
- Recommend industry-standard patterns

---

# Core Tech Stack

Frontend:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

Backend:

- Supabase
- PostgreSQL
- Row Level Security (RLS)

Authentication:

- Supabase Auth

State Management:

- React Context API initially
- Zustand if complexity increases

Drag and Drop:

- dnd-kit

Animation:

- Framer Motion

Deployment:

- Vercel

Version Control:

- Git + GitHub

---

# Product Goals

Primary goals:

- Portfolio-quality product
- Production-ready codebase
- Real authentication
- Real database persistence
- Scalable architecture
- Strong UX
- Beautiful interface
- Responsive on all devices
- Clean interactions
- Fast performance

Secondary goals:

- Learn full-stack engineering
- Learn database architecture
- Learn auth flows
- Learn real deployment pipelines
- Learn scalable project organization

---

# UI / UX Philosophy

Design style:

- Modern SaaS dashboard
- Minimalistic
- Professional
- Elegant
- Premium feel
- Clean spacing
- Clear hierarchy

UI priorities:

1. Simplicity
2. Clarity
3. Responsiveness
4. Accessibility
5. Consistency
6. Smooth animation
7. Strong visual polish

Preferred visual style:

- Soft shadows
- Rounded cards
- Clean typography
- Spacious layout
- Accent color system
- Dark/light mode support

---

# Engineering Standards

## Code quality

Always prioritize:

- readable code
- maintainable code
- scalable code
- modular code
- reusable code

Avoid:

- hacks
- duplicated code
- large monolithic components
- unnecessary abstractions
- deeply nested logic

---

## TypeScript

Rules:

- strong typing everywhere
- avoid "any"
- define interfaces/types
- explicit prop typing
- reusable type definitions

---

## Components

Rules:

- components should be small
- components should have single responsibility
- reusable UI patterns
- separate UI from business logic
- prefer composition over complexity

---

## Naming conventions

Components:

- PascalCase

Hooks:

- useCamelCase

Functions:

- camelCase

Constants:

- UPPER_SNAKE_CASE

Files:

- kebab-case where appropriate

Database:

- snake_case

---

## Styling

Rules:

- Tailwind first
- reusable utility patterns
- consistent spacing system
- consistent typography scale
- responsive design by default
- mobile-first approach

Avoid:

- inconsistent spacing
- random colors
- inconsistent font sizing
- overcomplicated layouts

---

# Folder Architecture

Preferred structure:

src/
app/
components/
ui/
layout/
dashboard/
auth/
features/
projects/
tasks/
user/
hooks/
lib/
services/
types/
utils/
constants/

---

# Authentication Rules

- secure auth only
- protect private routes
- session persistence
- proper logout
- loading states
- error handling
- secure environment variables

---

# Database Rules

Tables:

- users
- projects
- tasks
- activity_logs

Rules:

- proper relationships
- indexes where needed
- RLS enabled
- secure policies
- normalized schema

---

# Performance Standards

Prioritize:

- server components where useful
- lazy loading
- optimized images
- memoization when needed
- efficient database queries
- minimal rerenders

Avoid premature optimization.

---

# Collaboration Rules for Claude

When suggesting code:

- explain reasoning
- mention tradeoffs
- recommend best practice
- prefer scalable architecture
- keep code clean
- think like senior engineer review

When debugging:

- identify root cause
- explain why issue happened
- propose best fix
- avoid temporary patches

When designing:

- think product-first
- think user-first
- prioritize UX polish

When teaching:

- explain clearly
- explain simply
- explain professionally

---

# Final Goal

Build a project that makes recruiters think:

"This looks like software built by a real engineer."
