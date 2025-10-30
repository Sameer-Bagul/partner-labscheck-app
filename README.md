# LabsCheckPartner 🏥

Modern, responsive dashboard for laboratory partners powered by Next.js 14+, featuring a beautiful purple gradient design system.

---

## 🎨 Recent UI Revamp

The project has undergone a complete UI transformation inspired by modern design principles:

### ✨ New Features
- **Purple Gradient Design System** - Professional brand identity
- **Glassmorphism Effects** - Modern frosted glass UI elements
- **130+ Utility Classes** - Comprehensive component library
- **Smooth Animations** - Engaging microinteractions
- **Dark Mode Ready** - Complete dark theme support
- **Fully Responsive** - Mobile-first approach

### 📚 Documentation
- [**UI Revamp Summary**](./UI-REVAMP-SUMMARY.md) - Complete overview
- [**Color Palette Reference**](./COLOR-PALETTE-REFERENCE.md) - Color usage guide
- [**Utility Classes Reference**](./UTILITY-CLASSES-REFERENCE.md) - All available classes
- [**Theme Implementation Guide**](./THEME-IMPLEMENTATION-GUIDE.md) - Quick start
- [**UI Revamp Plan**](./UI-REVAMP-PLAN.md) - Implementation roadmap

---

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---

## 🎨 Design System Quick Start

### Color Palette

```jsx
// Use brand colors
<div className="bg-brand-500 text-white">
<h1 className="text-brand-900">

// Use semantic colors
<span className="text-success">Active</span>
<span className="text-danger">Error</span>
```

### Common Components

```jsx
// Cards
<div className="card-elevated hover-lift p-6">Content</div>

// Buttons
<button className="btn-primary hover-lift">Click Me</button>

// Forms
<input className="input-field" placeholder="Enter text" />

// Badges
<span className="badge badge-success">Active</span>
```

### Animations

```jsx
// Entrance animation
<div className="fade-in">Content appears smoothly</div>

// Staggered list
{items.map((item, i) => (
  <div 
    className="slide-in-left" 
    style={{ animationDelay: `${i * 100}ms` }}
  >
    {item.content}
  </div>
))}
```

---

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js)

### Design System Documentation
- [UI Revamp Summary](./UI-REVAMP-SUMMARY.md) - Complete overview
- [Theme Implementation Guide](./THEME-IMPLEMENTATION-GUIDE.md) - Quick patterns
- [Utility Classes Reference](./UTILITY-CLASSES-REFERENCE.md) - All classes

---

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🎉 What's New

### Version 2.0.0 - UI Revamp
- ✨ Complete design system overhaul
- 🎨 Purple gradient brand colors
- ✨ 130+ utility classes
- 🌙 Dark mode support
- 📱 Mobile-first responsive design
- 📚 Comprehensive documentation

**Get started:** Read the [Theme Implementation Guide](./THEME-IMPLEMENTATION-GUIDE.md)

