# CloudZent Incident Management System

A full-stack Incident Management System designed for engineering teams to track, assign, and resolve system incidents securely. Built with Next.js (Frontend) and Node.js/Express (Backend).

## 🚀 Submission Details

1. **Live Deployed URL:**
   - **Frontend:** [Insert Frontend Vercel URL here]
   - **Backend API:** [Insert Backend Vercel URL here]
2. **GitHub Repository:** [https://github.com/AmanJaiSingh/Cloudznet_assignment.git](https://github.com/AmanJaiSingh/Cloudznet_assignment.git)
3. **Database Schema Screenshot:** 
   *(Please replace the image below with your actual MongoDB screenshot)*
   ![Database Schema Screenshot](./schema-screenshot.png)

   *(For reference, the data models are structured as below)*
   ```mermaid
   erDiagram
       USER {
           ObjectId _id
           String name
           String email
           String password
           ObjectId team_id
       }
       TEAM {
           ObjectId _id
           String name
           Date created_at
       }
       INCIDENT {
           ObjectId _id
           String title
           String description
           String severity "low, medium, high"
           String status "open, investigating, resolved"
           ObjectId created_by
           ObjectId assigned_to
           ObjectId team_id
           Date created_at
       }
       ACTIVITYLOG {
           ObjectId _id
           ObjectId incident_id
           ObjectId user_id
           String action "incident_created, incident_assigned, status_changed, incident_resolved"
           Date created_at
       }

       USER }|--|| TEAM : "Belongs to"
       INCIDENT }|--|| TEAM : "Belongs to"
       INCIDENT }|--|| USER : "Created by"
       INCIDENT }|--o| USER : "Assigned to"
       ACTIVITYLOG }|--|| INCIDENT : "Logs"
       ACTIVITYLOG }|--|| USER : "Performed by"
   ```

## 🛠️ Tech Stack

**Frontend**
- Next.js 15 (App Router, Serverless)
- React 19
- Tailwind CSS 4 + Framer Motion (Animations)
- Zustand (Global State)
- Axios (API Client)

**Backend**
- Node.js & Express.js (Vercel Serverless Functions)
- MongoDB & Mongoose
- JSON Web Token (JWT Auth)
- bcryptjs (Password hashing)

## 🏗️ Architecture Overview

The system uses a **Backend-First architecture** with strict **Team Isolation**. 
- **Security:** Users are authenticated via JWT. Every API request requires a Bearer token.
- **Multi-tenant Data Isolation:** When a user registers with a `teamName`, they are assigned a `team_id`. Every incident and database query automatically filters by the user's `team_id`, ensuring completely private dashboards for different teams.
- **Serverless Deployment:** The backend `server.js` exports the Express app to run efficiently on Vercel's Serverless Edge network.
- **Real-Time Emulation:** The frontend utilizes background data polling every 5 seconds to provide real-time updates without heavy WebSocket connections (ideal for Serverless limitations).

## ✨ Setup Steps (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Connection String

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Start backend: `npm run dev`

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Start frontend: `npm run dev`

## 🔑 Example Login Credentials

If you have run the `seed.js` script (or are observing the live DB), here are 6 sample users generated across different isolated teams. **All share the same password.**

**Password for ALL accounts:** `password123`

| Name | Role / Department | Email |
| :--- | :--- | :--- |
| Alice Backend | Backend Engineering | `alice@cloudzent.com` |
| Bob Backend | Backend Engineering | `bob@cloudzent.com` |
| Charlie Frontend | Frontend Engineering | `charlie@cloudzent.com` |
| Diana Frontend | Frontend Engineering | `diana@cloudzent.com` |
| Eve DevOps | DevOps / Infrastructure | `eve@cloudzent.com` |
| Frank DevOps | DevOps / Infrastructure | `frank@cloudzent.com` |

*(Note: Try logging in as Alice and then as Charlie. You will notice their dashboards are completely different, demonstrating the strict Team Isolation architecture!)*
