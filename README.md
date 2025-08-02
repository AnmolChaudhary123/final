# CloneBlog - Modern Blog Platform

A full-stack blog platform built with Next.js 15, TypeScript, MongoDB, and NextAuth.js. Features include user authentication, blog creation, commenting, and a responsive design.

## 🚀 Features

- **User Authentication** - Sign up, sign in with NextAuth.js
- **Blog Management** - Create, edit, and publish blog posts
- **Rich Text Editor** - TipTap-based editor for content creation
- **Comments System** - Users can comment and like posts
- **Search & Filtering** - Search posts and filter by category
- **Responsive Design** - Works on all devices
- **Dark/Light Mode** - Theme switching support
- **Admin Dashboard** - Manage users and posts
- **Image Support** - Featured images with Next.js Image optimization

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Rich Text Editor**: TipTap
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloneblog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment to Vercel

### Prerequisites
- Vercel account
- MongoDB database (MongoDB Atlas recommended)
- GitHub repository

### Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     NEXTAUTH_SECRET=your_generated_secret
     NEXTAUTH_URL=https://your-domain.vercel.app
     ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Environment Variables for Production

Make sure to set these in your Vercel project settings:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `NEXTAUTH_SECRET`: A random string for NextAuth.js (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   ├── dashboard/         # Dashboard pages
│   └── admin/             # Admin pages
├── components/            # React components
├── lib/                   # Utility libraries
├── models/                # MongoDB models
└── utils/                 # Helper functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Features in Detail

### Authentication
- Email/password registration and login
- Protected routes for dashboard and admin
- Session management with NextAuth.js

### Blog System
- Rich text editor for content creation
- Markdown support
- Image uploads
- Draft and published states
- View tracking

### User Dashboard
- Create and edit blog posts
- View post analytics
- Manage drafts and published posts

### Admin Features
- User management
- Post moderation
- Analytics overview

### Search & Filtering
- Full-text search
- Category filtering
- Sort by date, popularity
- Pagination

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure all environment variables are set
   - Check MongoDB connection string
   - Verify NextAuth.js configuration

2. **Image Loading Issues**
   - Images are automatically optimized with fallbacks
   - Check `next.config.ts` for image domains

3. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain

### Development Tips

- Use `npm run dev` for development
- Check browser console for client-side errors
- Monitor Vercel function logs for server-side issues
- Use MongoDB Atlas for production database

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Blogging! 🚀**
