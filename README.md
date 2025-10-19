# 🎉 EventHub – Advanced Web Technology Project

**EventHub** is a full-stack web application built using **Next.js (Frontend)**, **NestJS / Node.js (Backend)**, and a database (MongoDB / PostgreSQL).  
It allows **customers** to browse and register for events, and **admins** to manage events, users, and bookings.

---

## 🚀 Project Overview

**EventHub** provides:

- **Customer features:**
  - Browse available events
  - Register/Login
  - Book tickets for events
  - View booking history
  - Update profile and preferences

- **Admin features:**
  - Login as admin
  - Create, update, delete events
  - View all users and their bookings
  - Manage event categories and venues
  - Generate reports (optional)

---

## 🛠 Technologies Used

### Frontend
- **Next.js** – React framework for SSR & SSG  
- **React** – Component-based UI library  
- **Tailwind CSS / CSS Modules** – Styling  
- **Axios / Fetch API** – Communicate with backend  
- **NextAuth.js** – Authentication & role-based access  

### Backend
- **Node.js** – Runtime environment  
- **NestJS** – Backend framework for scalable apps  
- **Express.js** – Optional for APIs  
- **TypeScript** – Strongly typed JS  

### Database
- **MongoDB / PostgreSQL** – Event and user data  
- **Mongoose / TypeORM / Prisma** – ORM/ODM  

### Tools
- **VS Code** – IDE  
- **Postman / Insomnia** – API testing  
- **Git & GitHub** – Version control  
- **Docker** – Containerization (optional)  

---

---

## 🔑 Features & Implementation

### Customer
- **Browse Events:** Dynamic listing of events with filters (category, date, location)  
- **Event Booking:** Customers can book tickets for events  
- **Profile Management:** Update personal info and view booking history  
- **Authentication:** Sign up/Login with JWT or NextAuth.js  

### Admin
- **Event Management:** Create, update, delete events with categories & venues  
- **User Management:** View users and their bookings  
- **Reports:** Track popular events, booking stats, revenue  
- **Role-Based Access:** Admin-only pages protected  

---

## ⚡ Example Workflow

1. **Setup Frontend**
```bash
npx create-next-app frontend
cd frontend
npm install axios tailwindcss next-auth


