# Snaply - The Next-Gen Social Media Platform

Snaply is a modern and scalable **social media platform** built with **Next.js, Prisma, and PostgreSQL**. It offers a seamless user experience with real-time updates, a responsive UI, and essential social features such as posts, likes, comments, and follow systems. Designed for scalability, Snaply provides an engaging and interactive social media experience.

---

## 🚀 Features

### 🔹 User & Profile Management
- Secure **JWT-based authentication**
- OAuth integration (Google, GitHub, etc.)
- Customizable user profiles with bio, profile pictures, and cover photos

### 🔹 Social Features
- **Post Creation**: Text, images, and video uploads
- **Likes & Comments**: Engage with content in real-time
- **Follow System**: Follow users and see their updates on the feed

### 🔹 Real-Time Interactions
- Live notifications
- Instant updates for likes, comments, and follows

### 🔹 UI & Accessibility
- Fully **responsive design** (Mobile & Desktop)
- **Light/Dark mode** with theme persistence
- Smooth animations using Framer Motion

### 🔹 Security & Performance
- **Prisma ORM** for efficient database queries
- **Rate limiting** to prevent spam
- Optimized **Next.js server-side rendering (SSR) & static generation (SSG)** for better performance

---

## 🛠️ Tech Stack

### **Frontend:**
- **Next.js (React framework)**
- Tailwind CSS for styling | shadcn for components
- Context API for state management
- Framer Motion for animations

### **Backend:**
- **Next.js API routes**
- PostgreSQL with **Prisma ORM**

### **Deployment & DevOps:**
- **Vercel** for seamless frontend deployment
- **NeonDB** for PostgreSQL hosting
- CI/CD pipeline with GitHub Actions

---

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/snaply.git
   cd snaply
   ```

2. **Install dependencies:**
   ```bash
   npm install  # or yarn install
   ```

3. **Set up environment variables:** (Create a `.env` file and configure your variables)
   ```env
   DATABASE_URL=your_postgresql_url
   NEXTAUTH_SECRET=your_secret_key
   NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_url
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📌 Roadmap

- [ ] Implement video with real-time streaming
- [ ] Improve search and explore features
- [ ] Add push notifications for mobile devices
- [ ] Implement AI-powered content moderation


⚡ Stay connected with **Snaply** and redefine social interactions! 🚀

