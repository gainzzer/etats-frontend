# ETATS Frontend

ETATS (Employee Task Assignment & Tracking System) is a role-based web application frontend that allows managers and employees to manage, track, and monitor tasks efficiently through a clean and responsive user interface.

---

## Description

The ETATS frontend provides an interactive interface for two types of users: Managers and Employees. Managers can manage employees, create and assign tasks, monitor task progress, and generate reports. Employees can view their assigned tasks, update task statuses, and track upcoming deadlines. The frontend communicates with the backend API using session-based authentication.

---

## Technologies

- React (Vite)
- JavaScript 
- React Router
- Axios
- Bootstrap
- Custom CSS

---

## User Requirements

### Manager
- Login to the system
- View dashboard overview
- Create, edit, and delete employees
- Create tasks and assign them to employees
- Edit tasks and update assigned employees
- View all tasks in the system
- Generate and save reports
- View saved reports

### Employee

- Login to the system
- View dashboard overview
- View assigned tasks
- Update task status (Assigned / In Progress / Done / Cancelled)
- View upcoming deadlines

---

## Getting Started

### Prerequisites
```
- Node.js 
- npm
- Backend server running on port 5001
```
### Installation

```
npm install
Run the application
npm run dev
```

The frontend will run at:
```
http://localhost:5173

Backend Connection

The frontend communicates with the backend API at:

http://localhost:5001/api
```