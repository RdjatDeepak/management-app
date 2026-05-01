# TeamTask Management Platform

A collaborative task management system (Mini Trello/Asana) built for structured teamwork.

## 🚀 The 4 Pillars
- **Pillar A: Identity & Security** - JWT-based Auth with Admin/Member roles.
- **Pillar B: Project Containers** - Structured workspaces with member invitation logic.
- **Pillar C: Task Lifecycle** - Full CRUD for tasks with status tracking (To Do -> Done).
- **Pillar D: Management Dashboard** - Real-time analytics on productivity and deadlines.

## 🛠️ Tech Stack
- **Backend:** Java 17, Spring Boot, Spring Security, PostgreSQL.
- **Frontend:** React (Vite), Tailwind CSS, Axios, Lucide Icons.

## ⚙️ Setup
1. **Backend:** Configure `application.properties` with your PostgreSQL credentials and run `ManagementAppApplication.java`.
2. **Frontend:** Navigate to `/frontend`, run `npm install`, then `npm run dev`.
3. # TeamTask: Collaborative Workspace Platform

**TeamTask** is a structured collaboration tool (Mini-Trello) designed to bridge the gap between project planning and execution. Built with a high-performance Java/Spring Boot backend and a responsive React frontend.




----> If u directly register as the member that is not possible u can only Signup as the admin and then admin create the members and there passwords to login 
---> Members after loge in sees there assigned tasks only 






## 🏗️ The 4 Pillars of Architecture

### Pillar A: Identity & Security (The "Who")
- **Authentication:** JWT-based stateless security.
- **RBAC:** Role-Based Access Control distinguishing **Admins** (Creators) and **Members** (Executors).

### Pillar B: Project Containers (The "Where")
- **Scoped Collaboration:** Projects act as isolated environments.
- **Invitation Logic:** Integrated system to link users to specific projects via email.

### Pillar C: Task Lifecycle (The "What")
- **State Management:** Tracking flow from `To Do` → `In Progress` → `Done`.
- **Assignment Logic:** Foreign key relationships ensuring tasks are owned by specific project members.

### Pillar D: Management Dashboard (The "Overview")
- **Aggregated Analytics:** Automated logic calculating:
    - Task completion rates.
    - Overdue task identification (Current Date > Due Date).
    - Individual workload distributions.

---

## 🛠️ Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA.
- **Database:** PostgreSQL (Relational mapping for complex collaboration).
- **Frontend:** React, Vite, Tailwind CSS (for rapid, professional UI).
- **Testing:** Postman (API Documentation & Functional Testing).

---

## 🧪 API Documentation & Testing
To ensure a robust backend, all endpoints were rigorously tested via **Postman**.

### Key Endpoints Tested:
- `POST /api/auth/signup` - User registration and hashing.
- `POST /api/projects` - Admin-only project creation.
- `PATCH /api/tasks/{id}/status` - Real-time state updates.

> **Testing Proof:** You can find our [Postman Collection Export here](./postman/collection.json) or view the [API Screenshot Gallery](.).

---
