# Modern Blog Website

A full-stack blog platform built with Next.js 14, MongoDB, and Tailwind CSS. Features include user authentication, rich text editing, comments, search, and dark mode.

## 🚀 Features

### Core Features
- ✅ **Complete Blog CRUD**: Create, edit, delete, and view blogs
- ✅ **User Authentication**: NextAuth.js with email/password authentication
- ✅ **Role-based Access**: Admin and User roles with different permissions
- ✅ **Rich Text Editor**: React Quill for writing blog posts
- ✅ **Comments System**: Nested comments with likes and replies
- ✅ **Search & Filter**: Search by keyword, filter by category/tag, sort options
- ✅ **Categories & Tags**: Organize content with categories and tags
- ✅ **Blog Metadata**: Track views, likes, read time, and publish dates
- ✅ **Image Upload**: Support for featured images (placeholder implementation)
- ✅ **Light/Dark Mode**: Theme toggle with system preference detection
- ✅ **SEO Optimization**: Dynamic meta tags and OpenGraph support
- ✅ **Responsive Design**: Mobile-first design with Tailwind CSS

### Technical Features
- **Next.js 14** with App Router
- **MongoDB** with Mongoose ODM
- **NextAuth.js** for authentication
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **React Quill** for rich text editing
- **Lucide React** for icons
- **Date-fns** for date formatting

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
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://anmoldongriya123:anmol123@cluster0.vgjzswo.mongodb.net/blogpostweb?retryWrites=true&w=majority&appName=Cluster0

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production

   # Cloudinary Configuration (optional)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Email Configuration (optional)
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_FROM=noreply@yourdomain.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin panel
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility libraries
├── models/                # MongoDB models
└── utils/                 # Helper functions
```

## 🔧 Configuration

### Database Setup
The application uses MongoDB with the following collections:
- `users` - User accounts and authentication
- `blogs` - Blog posts with metadata
- `comments` - Comments and replies

### Authentication
- Email/password authentication via NextAuth.js
- Session-based authentication
- Role-based access control (admin/user)

### Image Upload
Currently uses placeholder images. To implement real image upload:
1. Set up Cloudinary account
2. Update environment variables
3. Modify `/api/upload/route.ts` to use Cloudinary SDK

## 🎯 Usage

### For Users
1. **Sign up** for an account
2. **Create blog posts** using the rich text editor
3. **Publish or save as draft**
4. **View and manage** your posts in the dashboard
5. **Comment and interact** with other posts

### For Admins
1. **Access admin panel** at `/admin`
2. **View all posts and users**
3. **Monitor platform statistics**
4. **Manage content and users**

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Similar to Vercel deployment
- **Railway**: Good for full-stack apps
- **DigitalOcean App Platform**: Scalable deployment

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based sessions
- Input validation and sanitization
- Role-based access control
- CSRF protection via NextAuth.js

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.ts`
- Customize components in `src/components/`

### Features
- Add new blog fields in `src/models/Blog.ts`
- Extend authentication in `src/lib/auth.ts`
- Create new API routes in `src/app/api/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure MongoDB connection is working
4. Check NextAuth.js configuration

## 🔮 Future Enhancements

- [ ] Real image upload with Cloudinary
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Newsletter subscription
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] PWA features
- [ ] API rate limiting
- [ ] Caching layer
- [ ] Search with Elasticsearch

---

Built with ❤️ using Next.js, MongoDB, and Tailwind CSS
