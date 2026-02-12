# MedCare Hospital Management System

A modern, full-stack hospital management web application built with Next.js, Convex, and Clerk authentication.

## Features

- **Patient Portal**
  - Browse doctors by department
  - Book appointments with preferred doctors
  - View appointment history and status
  - AI-powered chat assistant for medical queries

- **Admin Dashboard**
  - Manage all appointments (confirm, cancel, complete)
  - Add and manage doctors
  - View patient information
  - Real-time updates

- **Email Notifications**
  - Automatic confirmation emails when appointments are approved
  - Cancellation notifications
  - Powered by Resend

- **Authentication & Authorization**
  - Secure user authentication with Clerk
  - Role-based access control (admin/guest)
  - Protected admin routes

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Backend**: Convex (real-time database & serverless functions)
- **Authentication**: Clerk
- **Email**: Resend
- **AI**: OpenAI GPT-3.5
- **UI Components**: Radix UI, Lucide Icons, Framer Motion

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Convex account
- Clerk account
- Resend API key
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/hiruy72/Hospital-Managment-Web-app.git
cd Hospital-Managment-Web-app/HospitalManagementENG
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file:
```env
# Convex
CONVEX_DEPLOYMENT=your-deployment
NEXT_PUBLIC_CONVEX_URL=your-convex-url

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-clerk-secret
CLERK_JWT_ISSUER_DOMAIN=your-clerk-domain

# Resend (for emails)
RESEND_API_KEY=your-resend-key

# OpenAI (for AI chat)
OPENAI_API_KEY=your-openai-key
```

4. Set up Convex environment variables

Go to [Convex Dashboard](https://dashboard.convex.dev) → Settings → Environment Variables and add:
- `RESEND_API_KEY`
- `OPENAI_API_KEY`

5. Run the development server
```bash
npm run dev
```

6. In a separate terminal, run Convex
```bash
npx convex dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── appointments/       # User appointments page
│   ├── all-doctors/        # Browse doctors page
│   └── _components/        # Shared components
├── convex/
│   ├── appointments.ts     # Appointment queries & mutations
│   ├── doctors.ts          # Doctor management
│   ├── patients.ts         # Patient/user management
│   ├── actions.ts          # Email & AI actions
│   └── schema.ts           # Database schema
├── components/ui/          # Reusable UI components
└── lib/                    # Utilities
```

## Usage

### For Patients

1. Sign up/Login using Clerk authentication
2. Browse doctors by department
3. Book an appointment by selecting a doctor and date
4. View your appointments at `/appointments`
5. Chat with AI assistant for medical information

### For Admins

1. Sign in and make yourself admin:
   - Visit `/make-admin` to upgrade your role
   - Or manually update in Convex dashboard

2. Access admin dashboard at `/admin/appointments`
3. Confirm, cancel, or complete appointments
4. Add new doctors at `/admin/doctors/add`

## Configuration

### Adding Image Domains

To allow external images (like doctor photos), add domains to `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'your-domain.com' }
  ]
}
```

### Database Schema

The app uses Convex with these main tables:
- `patients` - User accounts with roles
- `doctors` - Doctor profiles and specializations
- `appointments` - Appointment bookings and status
- `categories` - Medical departments

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy Convex

```bash
npx convex deploy
```

Update your production environment variables in Convex dashboard.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
