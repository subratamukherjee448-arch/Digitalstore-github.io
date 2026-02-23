# College Digital Store

A polished, full-stack e-commerce website for selling digital products (ebooks & audiobooks), built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Integrated with **Razorpay** for payments and secure file delivery.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm**
- Razorpay test keys (get from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys))

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up your environment variables
#    Edit .env.local and add your Razorpay test keys
#    RAZORPAY_KEY_ID="rzp_test_YOUR_KEY"
#    RAZORPAY_KEY_SECRET="YOUR_SECRET"

# 3. Initialize the database and seed sample data
npx prisma db push
npm run db:seed

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Demo Accounts

| Role  | Email             | Password  |
|-------|-------------------|-----------|
| Admin | admin@store.com   | admin123  |
| Buyer | buyer@demo.com    | buyer123  |

## 📦 Sample Products (Seeded)

- **Data Structures for Interviews** — ₹299 (Ebook)
- **The Art of Digital Marketing** — ₹199 (Ebook)
- **Machine Learning Fundamentals** — ₹399 (Ebook)
- **Mindful Productivity** — ₹149 (Audiobook)
- **Startup Stories India** — ₹249 (Audiobook)

**Coupon Codes:** `WELCOME10` (10% off), `STUDENT20` (20% off)

## 🏗️ Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | Next.js 14, React 18, TypeScript          |
| Styling    | Tailwind CSS 3.4                          |
| Animations | Framer Motion 11                          |
| Database   | SQLite via Prisma ORM                     |
| Auth       | NextAuth.js (Credentials)                 |
| Payments   | Razorpay Checkout + Webhook Verification  |
| Email      | Nodemailer (configurable SMTP)            |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home (Hero + Featured)
│   ├── shop/               # Product listing with filters
│   ├── product/[id]/       # Product detail (SSR)
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Razorpay checkout + success/failure
│   ├── login/              # Login & registration
│   ├── account/            # Order history & downloads
│   ├── admin/              # Admin dashboard, products, orders, coupons
│   ├── legal/              # Terms, Privacy, Refund policies
│   ├── contact/            # Contact form
│   └── api/                # API routes
│       ├── create-order/   # POST: create Razorpay order
│       ├── verify-payment/ # POST: verify HMAC signature
│       ├── download/       # GET: secure file download
│       ├── validate-coupon/# GET: coupon validation
│       ├── register/       # POST: user registration
│       └── admin/          # Admin CRUD endpoints
├── components/             # Header, Footer, ProductCard, etc.
├── context/                # CartContext (localStorage persisted)
├── lib/                    # DB, auth, razorpay, email utilities
└── types/                  # TypeScript type definitions
```

## 🔒 Payment Flow

1. User adds items to cart → Proceeds to checkout
2. **POST /api/create-order** — Creates order in DB + Razorpay order
3. Razorpay Checkout opens in-browser
4. On success: **POST /api/verify-payment** — HMAC signature verification
5. On verification: order marked PAID, download tokens generated (24hr expiry, max 3 downloads)
6. Email receipt sent (or logged to console if SMTP not configured)
7. **GET /api/download?token=** — Validates token, streams file

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite path (default: `file:./dev.db`) |
| `NEXTAUTH_SECRET` | Yes | JWT signing secret |
| `NEXTAUTH_URL` | Yes | App URL (`http://localhost:3000`) |
| `RAZORPAY_KEY_ID` | Yes | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay key secret |
| `SMTP_HOST/USER/PASS` | No | Email sending (console fallback) |
| `DOWNLOAD_EXPIRY_HOURS` | No | Default: 24 |
| `DOWNLOAD_MAX_COUNT` | No | Default: 3 |

## 🔧 Operations Guide

### Switch to Razorpay Production Keys
1. Get live keys from Razorpay Dashboard
2. Update `.env.local`: replace `rzp_test_...` with `rzp_live_...`
3. Restart the server

### Change Download Expiry
Update `DOWNLOAD_EXPIRY_HOURS` and `DOWNLOAD_MAX_COUNT` in `.env.local`

### Process a Refund
1. Login as admin → Orders → Click "Refund" on the order
2. In Razorpay Dashboard, process the actual refund

### Add S3 File Storage (Production)
1. Store files in S3 bucket instead of `./storage/`
2. Update `/api/download/route.ts` to generate S3 presigned URLs
3. Set bucket CORS and lifecycle policies

## 📋 Commands Reference

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Push schema to DB
npm run db:seed      # Seed sample data
npm run db:reset     # Reset and reseed DB
npm test             # Run tests
npm run lint         # Run ESLint
```

## 📄 License

Built for a college assignment. All rights reserved.
