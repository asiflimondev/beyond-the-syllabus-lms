# 📚 Beyond the Syllabus - Learning Management System

 A comprehensive Learning Management System designed for a English Training Center.

##  Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v6** - Navigation
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **Node.js** with TypeScript
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - File storage

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting

## Project Structure
beyond-the-syllabus-lms/
├── backend/
│ ├── src/
│ │ ├── config/ # Configuration files
│ │ ├── controllers/ # Route controllers
│ │ ├── middlewares/ # Custom middlewares
│ │ ├── models/ # Database models
│ │ ├── routes/ # API routes
│ │ ├── services/ # Business logic
│ │ ├── utils/ # Utility functions
│ │ └── index.ts # Entry point
│ ├── .env.example
│ ├── package.json
│ └── tsconfig.json
├── frontend/
│ ├── src/
│ │ ├── api/ # API calls
│ │ ├── assets/ # Static assets
│ │ ├── components/ # Reusable components
│ │ ├── context/ # React Context
│ │ ├── hooks/ # Custom hooks
│ │ ├── layouts/ # Page layouts
│ │ ├── pages/ # Page components
│ │ ├── routes/ # Route configuration
│ │ ├── services/ # Business logic
│ │ ├── utils/ # Utility functions
│ │ ├── App.tsx
│ │ └── main.tsx
│ ├── .env.example
│ ├── package.json
│ ├── tailwind.config.js
│ ├── postcss.config.js
│ ├── vite.config.ts
│ ├── index.html
│ └── tsconfig.json
├── docs/
├── .gitignore
├── README.md
└── package.json

text

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas Account (free tier)
- Cloudinary Account (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/beyond-the-syllabus-lms.git

# Install all dependencies
npm run install:all

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development servers
npm run dev