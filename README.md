📝 CloneBlog – A Modern Full-Stack Blog Platform

CloneBlog is a feature-rich, full-stack blogging platform built with the latest web technologies. It offers secure authentication, post management, commenting, search, and a responsive UI — making it perfect for developers, writers, and teams who want a modern publishing experience.

✨ Features

🔐 Authentication & Authorization

Secure login & registration with NextAuth.js

Session handling & protected routes

Role-based access (user / admin)

📰 Blog Management

Create, edit, delete, and publish posts

Drafts & published states

Rich-text editing with TipTap

💬 Community Features

Comments & likes on posts

User profiles & avatars

🔎 Search & Filtering

Full-text search across posts

Filter by categories & tags

Sorting (date, popularity, relevance)

🎨 UI/UX

Responsive design (mobile-first)

Dark/Light mode toggle

Optimized images with next/image

📊 Admin Dashboard

Manage users & roles

Moderate posts & comments

Analytics overview

🛠️ Tech Stack

Frontend: Next.js 15, React 18, TypeScript, Tailwind CSS
Backend: Next.js API Routes, MongoDB with Mongoose
Authentication: NextAuth.js (JWT, cookies)
Editor: TipTap Rich Text Editor
Deployment: Vercel (CI/CD integrated)
Image Hosting: Cloudinary + Next.js Image Optimization

🚀 Getting Started
1. Clone Repository
git clone <repository-url>
cd cloneblog

2. Install Dependencies
npm install

3. Environment Variables

Create .env.local in the root folder:

MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

4. Run Development Server
npm run dev


Now open 👉 http://localhost:3000

🌐 Deployment on Vercel

Push your project to GitHub:

git add .
git commit -m "Deploy ready"
git push origin main


Go to Vercel
 → New Project

Import your GitHub repo

Add Environment Variables in Project Settings

MONGODB_URI=...

NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...


Click Deploy 🚀

📂 Project Structure
src/
├── app/              # Next.js App Router
│   ├── api/          # API routes (auth, blog, comments, users)
│   ├── auth/         # Auth pages (login/signup)
│   ├── blog/         # Blog-related pages
│   ├── dashboard/    # User dashboard
│   └── admin/        # Admin dashboard
├── components/       # Reusable UI components
├── lib/              # Configs (auth, db, cloudinary)
├── models/           # MongoDB schemas
└── utils/            # Helpers & utilities

🔧 Scripts

npm run dev → Start dev server

npm run build → Build for production

npm run start → Start production server

npm run lint → Run lint checks

📊 Features in Detail
🛡 Authentication

NextAuth.js with JWT & cookies

Protected routes & API endpoints

Role-based permissions

✍️ Blog System

TipTap editor with formatting tools

Image uploads via Cloudinary

Draft & publish modes

View count tracking

👤 User Dashboard

Manage personal posts

Track views & engagement

Edit or delete posts anytime

🛠 Admin Tools

Manage users & assign roles

Moderate posts & comments

Analytics overview

🐞 Troubleshooting

Build Errors

Check env variables & MongoDB connection

Verify NextAuth setup

Image Issues

Ensure Cloudinary env vars are set

Whitelist Cloudinary in next.config.js

Auth Issues

Ensure NEXTAUTH_SECRET is set

NEXTAUTH_URL must match deployed URL

📖 License

Open source under MIT License
.

🤝 Contributing

Fork repository

Create feature branch

Commit changes

Submit PR

📬 Support

Open an issue in GitHub if you find bugs or want features

Or contact me directly
