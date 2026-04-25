# Linkits – A Curated Developer Resources Platform

Linkits is a full-stack web application where developers can discover useful tools, job platforms, interview preparation resources, AI tools, and free learning platforms in one place.

### Live Demo: [linkits](https://linkits.piyushh.tech/)

---

## Preview

![Linkits Preview](https://res.cloudinary.com/dhhhr2skx/image/upload/v1777062535/Screenshot_from_2026-04-25_01-58-10_sv6y3k.png)

---

## Features

- Categorized directory of useful developer resources
- Google OAuth authentication using NextAuth
- Bookmark tools and access them from personal dashboard
- Trending tools section based on user saves
- Search and category filtering
- Responsive modern UI with dark mode support
- Animated homepage hero section using tsParticles

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Next Themes
- tsParticles
- Sonner

### Backend
- Next.js App Router APIs
- MongoDB
- Mongoose
- NextAuth
- MongoDB Adapter

---

## Setup Instructions

### Prerequisites

- Node.js & npm installed
- MongoDB Atlas account
- Google Cloud Console OAuth credentials


#### 1. Clone the repository

```
git clone https://github.com/Piyush-20045/linkits.git
cd linkits 
```

#### 2. Install dependencies
```
npm install
```

#### 3. Create .env.local file
```
MONGODB_URI=your_mongodb_connection_string

NEXTAUTH_URL=https://linkits.piyushh.tech/
NEXTAUTH_SECRET=your_random_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_LOGO_DEV_KEY=your_logo_dev_public_key
NEXT_PUBLIC_APP_URL=add_the_live_url_of_the_project

```

#### 4. Run the project
```
npm run dev
```

---

## Folder Structure
```
linkits/
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── directory/
│   └── ...
├── components/
├── constants/
├── lib/
├── models/
├── public/
├── types/
├── README.md
└── ...
```
---

## What I Learned
- Implemented Google OAuth authentication using NextAuth
- Understood the difference between Mongoose and MongoDB Adapter
- Built secure API routes using Next.js App Router
- Integrated MongoDB for storing tools and user data
- Implemented bookmark system with user dashboard
- Improved UI/UX with reusable components and responsive design

---

## Author
**Piyush Yadav**

- Twitter/X: [@piyush9436](https://x.com/Piyush9436)
- LinkedIn: [@piyushyadav](https://www.linkedin.com/in/piyushyadav0011/)
