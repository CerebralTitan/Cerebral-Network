# Future Imperfect - Modern Portfolio & Blog Template

A modern, highly customizable website template featuring a responsive design with blog and portfolio sections, emphasizing minimalist aesthetics and interactive user experience.

## 🌟 Features

### Blog Features
- 📝 Wiki-style linking between posts using [[post-name]] syntax
- 📌 Pin important posts to the top
- 🔍 Full-text search functionality
- 🏷️ Tag-based filtering
- 📱 Responsive card layout
- ✍️ Rich text editor for posts
- 🔗 SEO-friendly URLs with slugs

### Portfolio Features
- 💼 Project showcase with tags
- 📊 Animated skills progress bars
- ⌛ Interactive timeline
- 🔢 Animated statistics
- 🎯 Project filtering by technology
- 🎨 Hover animations and transitions

### Navigation & UI
- 🎯 Active page indicators with animations
- 📱 Responsive mobile menu
- 🌓 Theme toggle with system preference support
- 🔄 Smooth page transitions
- 🎨 Customizable color schemes
- 📊 Progress bar for reading position


## 🛠️ Tech Stack

- **Frontend Framework**: React + Next.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Type Safety**: TypeScript
- **UI Components**: shadcn/ui
- **State Management**: React Query
- **Routing**: Wouter
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React + React Icons

## 📦 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── blog/          # Blog-related components
│   │   ├── layout/        # Layout components
│   │   ├── portfolio/     # Portfolio components
│   │   ├── shared/        # Shared components
│   │   └── ui/            # UI components (shadcn)
│   ├── data/              # Static data
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   └── pages/             # Page components
server/
├── index.ts               # Server entry point
├── routes.ts             # API routes
├── storage.ts            # Storage interface
└── vite.ts              # Vite configuration
shared/
└── schema.ts            # Shared types and schemas
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🎨 Customization Guide

### Theme Customization

1. **Colors**: Edit `theme.json` to change the primary color and theme variant:
   ```json
   {
     "variant": "professional",
     "primary": "hsl(165, 85%, 55%)",
     "appearance": "system",
     "radius": 0.75
   }
   ```

2. **Typography**: Customize fonts in `tailwind.config.ts`:
   ```typescript
   theme: {
     extend: {
       fontFamily: {
         sans: ['Your-Font', 'sans-serif'],
       }
     }
   }
   ```

### Blog Features

#### Wiki-Style Linking
- Use `[[page-name]]` syntax in your posts to create links
- Links are automatically converted to proper URLs
- Missing links show a "Create this page" option

#### Post Management
- Pin important posts using the pin icon
- Pinned posts appear at the top of the list
- Posts are automatically sorted by date
- Each post has a unique URL based on its slug

### Portfolio Customization

1. **Project Cards**: Customize in `components/portfolio/ProjectCard.tsx`:
   - Modify card layout
   - Add new fields
   - Change animations

2. **Skills Section**: Update in `pages/portfolio.tsx`:
   ```typescript
   const skills = [
     { name: "Your Skill", level: 90 },
     // Add more skills
   ];
   ```

3. **Timeline**: Customize your experience:
   ```typescript
   const timeline = [
     {
       year: "2024",
       title: "Your Role",
       company: "Company Name",
       description: "Your description"
     },
     // Add more entries
   ];
   ```

### Animation Customization

1. **Framer Motion**: Add custom animations:
   ```typescript
   <motion.div
     whileHover={{ scale: 1.05 }}
     transition={{ type: "spring", stiffness: 300 }}
   >
   ```

2. **CSS Animations**: Add in `index.css`:
   ```css
   @keyframes customAnimation {
     from { transform: scale(0.9); }
     to { transform: scale(1); }
   }
   ```

## 🔧 Advanced Features

### Blog Post Creation
1. Click "Create Post" button
2. Fill in required fields:
   - Title: Post title (also generates the URL slug)
   - Excerpt: Brief summary
   - Content: Main content (supports wiki-style linking)
   - Tags: Comma-separated list
   - Image URL: Featured image

### Post Linking
1. Use `[[post-name]]` in content
2. Links are automatically converted
3. Clicking links navigates to posts
4. Invalid links show 404 page

### Pinned Posts
1. Click pin icon to toggle
2. Pinned posts show indicator
3. Automatically sorted to top
4. Maintain pin status after edits


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a pull request

## 📝 License

MIT License

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Lucide](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling