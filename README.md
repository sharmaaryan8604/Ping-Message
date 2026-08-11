# 💬 Ping Message

A modern real-time chat application built with the MERN stack, featuring instant messaging, media sharing, and a fully customizable chat experience.

🔗 **Live Demo:** [ping-message.onrender.com](https://ping-message.onrender.com)

---

## ✨ Features

- 🔐 **Authentication** — Secure sign-in via Clerk with backend user sync
- ⚡ **Real-time Messaging** — Instant message delivery using Socket.IO
- 🟢 **Online Presence** — See who's online in real time
- 🖼️ **Media Sharing** — Send images and videos in chat
- 📁 **Media Delivery** — Optimized via ImageKit CDN
- 🎨 **Customization** — Custom wallpapers and theme presets
- 📱 **Responsive UI** — Works seamlessly on all screen sizes
- 🔒 **Protected Routes** — Secure access control throughout the app

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS + HeroUI
- Zustand (state management)

**Backend**
- Node.js + Express.js
- Socket.IO
- MongoDB

**Services**
- Clerk (authentication)
- ImageKit (media storage & delivery)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB
- Clerk account
- ImageKit account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sharmaaryan8604/ping-message.git
   cd ping-message
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   CLERK_SECRET_KEY=your_clerk_secret_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

   Create a `.env` file in the `client` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_SERVER_URL=http://localhost:5000
   ```

4. **Run the app**
   ```bash
   # Backend
   cd server
   npm run dev

   # Frontend
   cd ../client
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
ping-message/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── store/        # Zustand state
│   │   └── lib/          # Utilities & helpers
├── server/               # Node.js backend
│   ├── controllers/      # Route handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   └── socket/           # Socket.IO logic
```

---

## 👤 Author

**Aryan Sharma**
- GitHub: [@sharmaaryan8604](https://github.com/sharmaaryan8604)
- LinkedIn: [aryan-sharma-08062004-sde](https://www.linkedin.com/in/aryan-sharma-08062004-sde/)
