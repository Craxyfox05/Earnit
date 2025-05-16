# EarnIt - Mobile Money Earning Platform

EarnIt is a Next.js-based mobile application that allows users to earn money by completing various tasks, watching ads, taking surveys, and referring friends.

## Project Overview

EarnIt is a comprehensive money-earning platform with the following key features:

- **Multiple Earning Methods**:
  - Complete tasks (YouTube subscriptions, Instagram follows)
  - Watch video ads
  - Take surveys
  - Refer friends

- **User Dashboard**:
  - Track current balance
  - View earnings statistics
  - Monitor daily streaks
  - Track task completion

- **Wallet Management**:
  - View transaction history
  - Request withdrawals (minimum threshold ₹200)
  - Multiple payment methods (UPI, Paytm, Bank Transfer)

- **Engagement Features**:
  - Achievement system
  - Daily streaks
  - Real-time activity ticker

## Technology Stack

- **Framework**: Next.js 15.2.0
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form and Zod
- **Authentication**: Phone-based OTP authentication

## Key Pages

- **Home Page**: Introduction to the platform with earning options
- **Dashboard**: User statistics and quick actions
- **Tasks**: Available tasks sorted by category
- **Wallet**: Balance management and withdrawal options
- **Profile**: User information and settings
- **Referral**: Friend referral program

## Getting Started

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

## Project Structure

- `src/app`: Next.js application routes
- `src/components`: Reusable UI components
  - `ui/`: Base UI components (shadcn/ui)
  - `home/`: Homepage-specific components
  - `dashboard/`: Dashboard components
  - `tasks/`: Task-related components
  - `layout/`: Shared layout components (headers, footers)
  - `auth/`: Authentication components
- `src/lib`: Utility functions and shared code
- `src/context`: React context providers

## Development Features

- TypeScript support
- ESLint and Biome for code quality
- Mobile-first responsive design
- Dark mode support via next-themes

## Deployment

The application is configured for deployment on various platforms:
- Vercel (preferred)
- Netlify (configured via netlify.toml)

## License

[MIT](https://choosealicense.com/licenses/mit/)

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBb7gzV_lnLrTszzv7R2Tnk4kwFD2qLntU",
  authDomain: "earnit-186b9.firebaseapp.com",
  projectId: "earnit-186b9",
  storageBucket: "earnit-186b9.firebasestorage.app",
  messagingSenderId: "905185903535",
  appId: "1:905185903535:web:45d4152ef8620b64db255a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);