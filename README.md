# TaskFlow

TaskFlow is a modern project and task management dashboard built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Supabase**. It allows users to create projects, manage tasks across workflow stages, collaborate with team members, and track project progress through a clean dark-mode interface.

**Live Demo:** https://taskflow-kappa-six.vercel.app/

---

## Overview

TaskFlow was built as a full-stack productivity application designed to help users organize projects and manage tasks more efficiently.

Users can create an account, sign in securely, create projects, add tasks, update task statuses, and collaborate by inviting other users to shared projects.

The project focuses on clean UI design, secure authentication, protected routes, relational database access, and real-world CRUD functionality.

---

## Features

### Authentication

- User sign-up and login
- Protected dashboard routes
- Session handling with Supabase Auth
- Secure server-side authentication using Supabase SSR
- Auth-based route protection with Next.js proxy

### Project Management

- Create new projects
- View all owned and shared projects
- Edit project details
- Delete projects with confirmation
- Display project status, priority, and due date
- Separate owner and collaborator permissions

### Task Management

- Add tasks inside a project
- Assign task status:
  - To Do
  - In Progress
  - Done
- Set task priority:
  - Low
  - Medium
  - High
- Add task descriptions and due dates
- View tasks organized by project workflow columns
- Refresh project board after task creation

### Collaboration

- Invite collaborators by email
- Shared projects appear for invited users
- Team section displays:
  - Project owner
  - Collaborators
  - Names and emails when available
- Owner-only project actions
- Collaborators can view shared projects without owner-level controls

### User Settings

- View account information
- Update full name
- Persist profile data through Supabase
- Display profile name and email
- Disabled future features:
  - Email notifications
  - Delete account

### UI/UX

- Modern dark-mode dashboard
- Responsive landing page
- SaaS-style hero section and mockup
- Custom TaskFlow favicon/app icon
- Modal system with blurred background overlay
- Clean footer with GitHub, LinkedIn, and email links
- Mobile-friendly layout

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React Icons

### Backend / Database

- Supabase
- Supabase Auth
- PostgreSQL
- Row Level Security policies

### Deployment

- Vercel

### Tooling

- Git
- GitHub
- VS Code
- npm

---

## Project Structure

```txt
taskflow/
├── public/
│   └── taskflow-icon.svg
│
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── icon.svg
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── layout/
│   │   ├── projects/
│   │   ├── settings/
│   │   ├── tasks/
│   │   └── ui/
│   │
│   ├── hooks/
│   │   └── useToast.ts
│   │
│   ├── lib/
│   │   ├── config/
│   │   │   └── env.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── server.ts
│   │
│   ├── types/
│   │   ├── project.ts
│   │   ├── project-member.ts
│   │   └── task.ts
│   │
│   └── proxy.ts
│
├── .env.local
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```
