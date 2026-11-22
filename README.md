# 🍕 PizzaHub — Pizza Ordering & Delivery Platform

PizzaHub is a modern full-stack pizza ordering and delivery platform where customers can explore pizzas, place orders, and track their purchases. Vendors can manage their restaurants and menu items, while administrators have complete control over users, menu approvals, and platform activities.

The platform includes secure authentication, role-based authorization, Stripe payment integration, and a responsive user interface.

## 🌐 Live Website

**Live Demo:** https://pizzahub-client-ten.vercel.app

## ✨ Key Features

### 👤 Customer
- Browse all available pizza items.
- Search, filter, and sort menu items.
- View detailed information about each pizza.
- Add pizzas to favorites.
- Place orders securely.
- Complete payments using Stripe.
- Track order status.
- Cancel pending orders.
- Manage personal account information.

### 🏪 Vendor
- Create and manage restaurant profiles.
- Add new pizza items with images.
- Update and delete menu items.
- Manage menu item availability.
- Submit menu items for admin approval.
- Accept or reject customer orders.
- Manage restaurant orders.
- Upgrade to a Premium subscription.
- Enjoy unlimited menu items with Premium access.

### 🛡️ Admin
- View and manage registered users.
- Update user roles.
- Manage customer and vendor accounts.
- Review and approve or reject menu items.
- Manage platform menu items.
- Monitor transactions.
- Control platform activities.

### ⚡ Additional Features
- Secure authentication with Better Auth.
- Google OAuth login.
- JWT-based API authentication.
- Role-based access control.
- Stripe payment integration.
- Image upload using ImgBB.
- Responsive design for mobile, tablet, and desktop.
- Modern animations and interactive UI.
- Premium vendor subscription system.

## 🛠️ Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Better Auth
- JWT

### Authentication & Payment
- Better Auth
- Google OAuth
- Stripe

### Other Tools
- ImgBB
- Vercel
- Git & GitHub

## 📦 Installation & Setup

Follow these steps to run PizzaHub locally.

### 1. Clone the Repositories

Clone the frontend and backend repositories separately.

**Frontend:**
```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

**Backend:**
```bash
git clone YOUR_SERVER_REPOSITORY_URL
```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd pizzahub-client
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the frontend root directory and configure the required environment variables.

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=

MONGODB_URI=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_IMGBB_API_KEY=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

NEXT_PUBLIC_API_URL=
```

Start the frontend development server:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:3000
```

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd pizzahub-server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend root directory.

```env
MONGODB_URI=
BETTER_AUTH_URL=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CLIENT_URL=
```

Start the backend server using the available development script:

```bash
npm run dev
```

If your backend does not have a `dev` script, use its configured start command.

Backend will run at:

```text
http://localhost:5000
```

> **Note:** Environment variable names must match the actual names used in the frontend and backend source code. Never commit `.env` or `.env.local` files to GitHub.

## 🔐 Security

- Authentication is handled using Better Auth.
- Protected API routes require valid JWT authentication.
- Role-based authorization protects Customer, Vendor, and Admin routes.
- Vendors can manage only their own restaurant items.
- Admin-only operations are protected by backend authorization.
- Stripe payments are processed through secure server-side integration.

## 📁 Project Structure

```text
PizzaHub/
│
├── pizzahub-client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── pizzahub-server/
│   ├── index.js
│   ├── package.json
│   └── ...
│
└── README.md
```

## 🔗 Project Links

- **Live Website:** https://pizzahub-client-ten.vercel.app
- **Frontend Repository:** YOUR_CLIENT_REPOSITORY_URL
- **Backend Repository:** YOUR_SERVER_REPOSITORY_URL

## 👨‍💻 Author

**Shahariar Hossen Akib**

Full Stack Developer

- GitHub: https://github.com/akib511
- LinkedIn: https://linkedin.com/in/shahariar-hossen-akib

---

<p align="center">
  Made with ❤️ by Shahariar Hossen Akib
</p>
