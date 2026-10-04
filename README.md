# Linkits – A Curated Developer Tools Directory

Linkits is a full-stack directory where developers can discover 600+ tools, AI tools, and design resources — filterable by category, platform, and signup requirement, with personal bookmark collections.

### Live Demo: [linkits.site](https://linkits.site)

---

## Preview

![Linkits Preview](https://res.cloudinary.com/dhhhr2skx/image/upload/v1791132809/directory-page_kc4ogh.png)

---

## Features

- 600+ tools across 27 categories (tools + resources), with per-category counts
- Search, sort (newest / most saved / A–Z), and quick filters: no-signup tools, platform (iOS, Android, macOS, Windows, Linux, CLI…), content type
- Google OAuth (NextAuth); bookmark tools into personal collections from the dashboard
- Tool suggestions via a 3-field form → Telegram notification for manual review (nothing writes to the DB unreviewed)
- ISR-cached directory (5 min), lazy-loaded images, manual "show more" loading to stay light on bandwidth
- PostHog analytics (pageviews + explicit tool click/save/search events only)
- Responsive UI with dark mode

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Next Themes
- tsParticles
- Sonner
- posthog-js

### Backend
- Next.js App Router APIs
- MongoDB
- Mongoose
- NextAuth
- MongoDB Adapter
- Telegram Bot API (suggestion notifications)

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

NEXTAUTH_URL=https://linkits.site
NEXTAUTH_SECRET=your_random_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_LOGO_DEV_KEY=your_logo_dev_public_key
NEXT_PUBLIC_APP_URL=https://linkits.site

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
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
- When to use the raw MongoDB driver vs. Mongoose in the same app (adapter/auth queries vs. modeled domain data)
- ISR + edge caching strategy: what to cache (public pages, 5-min revalidation), what to never cache (personal saved-tools data), and why caching can't fix render cost - only fewer mounted DOM nodes can
- Image delivery economics: why proxying hundreds of external images through Vercel Image Optimization burns quota, and when `unoptimized` + browser/CDN caching is the right call
- Improving API design to reduce bulk scraping while accepting that publicly displayed data can't be completely protected.
- PostHog Analytics to track useful actions like clicks, saves, and searches instead of collecting everything by default
- Keeping a growing client page manageable by extracting hooks and presentational modules into separate files

---

## Author
**Piyush Yadav**

- Twitter/X: [@piyush9436](https://x.com/Piyush9436)
- LinkedIn: [@piyushyadav](https://www.linkedin.com/in/piyushyadav0011/)
