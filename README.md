# 🧠 NeuroSocial AI

![NeuroSocial AI Banner](https://img.shields.io/badge/NeuroSocial-AI-8A2BE2?style=for-the-badge&logo=openai)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

NeuroSocial AI is an advanced, AI-powered social media management and analytics platform. By leveraging Google's cutting-edge Gemini AI, it helps creators, marketers, and businesses predict content performance, analyze sentiment, and grow their audience across YouTube, Facebook, Instagram, and Twitter (X).

---

## 🚀 Features

- **🤖 AI-Powered Content Analysis**: Input your script, caption, or tweet to receive an instant analysis from Google Gemini 2.5 Flash. Get predictions on viral potential, engagement, sentiment, and tailored recommendations.
- **🔗 Real-Time Multi-Platform Sync**: Connect and sync live data from YouTube (Data API v3) and Meta (Facebook Pages & Instagram Professional accounts via Graph API).
- **📈 Global Trends Tracker**: Stay ahead of the curve with real-time global trending topics using the Google Trends API.
- **🗓️ Smart Content Scheduling**: Plan your content calendar effortlessly.
- **🔐 Secure Authentication**: Custom JWT-based authentication system with secure password hashing.
- **💻 Modern, Responsive Dashboard**: Built with Next.js 16, Tailwind CSS, Framer Motion for buttery-smooth animations, and Recharts for interactive analytics.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Hosting**: Vercel

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT, bcryptjs, OAuth2
- **AI Integration**: `@google/generative-ai`
- **APIs**: `googleapis`, `axios`, `google-trends-api`
- **Hosting**: Render

---

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables.

### Backend (`server/.env`)
```env
# Server Config
PORT=5000
JWT_SECRET=your_super_secret_jwt_key

# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# YouTube OAuth
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:5000/api/auth/youtube/callback

# Meta (Facebook/Instagram) OAuth
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
FACEBOOK_REDIRECT_URI=http://localhost:5000/api/auth/facebook/callback
```

### Frontend (`client/.env.local`)
*(No specific env variables required by default as it connects to the backend dynamically)*

---

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/NeuroSocialAI.git
cd NeuroSocialAI
```

### 2. Setup the Backend
```bash
cd server
npm install

# Setup Prisma and Database
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd client
npm install

# Start the Next.js development server
npm run dev
```
Your frontend should now be running on [http://localhost:3000](http://localhost:3000) and your backend on [http://localhost:5000](http://localhost:5000).

---

## ☁️ Deployment

- **Frontend**: The client is configured to be deployed on **Vercel**. Simply link the `client/` folder in your Vercel dashboard.
- **Backend**: The server is configured to be deployed on **Render**. Ensure you set the Build Command to `npm install && npx prisma generate` and the Start Command to `node index.js`. Add all your `.env` variables to Render.
- **Scripts**: Use `node replace_urls.js` to quickly update API endpoints when moving between `localhost` and production URLs.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/your-username/NeuroSocialAI/issues).

## 📄 License

This project is licensed under the ISC License.
