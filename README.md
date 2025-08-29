🌿 Wellness Session Platform

A serene, wellness-focused web application that helps users browse, create, and manage guided wellness sessions such as meditation, yoga, mindfulness, and breathing exercises.

🔗 Live Demo: Wellness Session Platform🔗 (https://wellness-session-platform.lovable.app)

📖 Overview

Wellness Session is a full-stack app built with React, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

It allows users to:

Sign up and log in with secure authentication.

Browse public sessions created by the community.

Create, edit, and delete their own wellness sessions.

Favorite sessions and track progress.

Personalize their profile with avatars and display names.
✨ Features

✅ Authentication: Supabase email/password login with persistent sessions.

✅ Profiles: Editable display names, emoji or image avatars.

✅ Sessions: Full CRUD support (create, browse, update, delete).

✅ Favorites & Progress: Mark sessions as completed or save them to favorites.

✅ Dashboard: Quick stats, recent sessions, and shortcuts for logged-in users.

✅ Responsive UI: Mobile-first design with Tailwind and shadcn/ui components.

✅ Security: Supabase RLS policies ensure users can only access their own data.

✅ Modern UX: Toast feedback, hover-lift animations, and dark mode.

🛠 Tech Stack

Frontend: React + Vite + TypeScript

Styling: Tailwind CSS + shadcn/ui + Lucide Icons

Backend: Supabase (Postgres, Auth, RLS)

State Management: React Context + Hooks

Deployment: Lovable (GitHub integration, auto-deploys)


🚀 Running Locally
Clone the repository
git clone https://github.com/Furqesda/wellness-session-platform.git
cd wellness-session-platform

Install dependencies
npm install

Set up environment variables

Add your Supabase project URL and anon/public key in .env

Start the dev server
npm run dev

Open http://localhost:5173
 in your browser.

📦 Deployment

The project is deployed on Lovable.

GitHub is connected for automatic syncing — commits to the main branch trigger rebuilds and redeploys.


📜 License  
This project is provided under the MIT License — free to use, modify, and distribute.  
