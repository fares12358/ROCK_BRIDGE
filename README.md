# Rock Bridge Frontend

A modern, responsive web application built with **Next.js**, providing a seamless user experience for browsing services, requesting quotes, and managing a personal dashboard.

## 🌐 Live Demo

**Visit the live demo**: [https://rock-bridge.vercel.app/](https://rock-bridge.vercel.app/)

## 🚀 Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: JavaScript/JSX
- **Routing**: Next.js App Router for optimized server-side and client-side navigation
- **Deployment**: Optimized for Vercel

---

## 📁 Project Structure
```text
src/
└── app/
    ├── layout.jsx        # Root layout (providers, fonts, global styles)
    ├── page.jsx          # Landing page (Home)
    ├── dashboard/        # Admin/User dashboard for managing content
    ├── get-offer/        # Quote request / "Get an Offer" page
    ├── resetpassword/    # Password recovery and reset flow
    ├── components/       # Reusable UI components
    ├── context/          # Global state management (Auth/UI context)
    ├── lib/              # Utility functions and API client configurations
    └── providers/        # Wrapper components for context providers
```

---

## 🗺️ Routing Map

| Route | Page | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | Home | Landing page showcasing services and value proposition | 🌍 Public |
| `/get-offer` | Get an Offer | Request a quote/offer form | 🌍 Public |
| `/resetpassword` | Reset Password | Password recovery page via OTP/Token | 🌍 Public |
| `/dashboard` | Dashboard | Protected area for managing services, media, and quotes | 🔐 Authenticated |

---

## ⚙️ Installation & Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **View the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Development Notes
- **Global Styles**: Located in `app/globals.css`.
- **API Integration**: The frontend communicates with the Rock Bridge Backend API. Ensure the backend is running and the base URL is correctly configured in the `lib/` configuration files.
- **Optimization**: Uses `next/font` for automatic font optimization and Next.js Image component for optimized asset loading.