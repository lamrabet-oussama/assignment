# Agency & Contact Management System

A modern Next.js application built with TypeScript and Tailwind CSS for managing agencies and contacts. This project demonstrates a clean architecture with robust authentication using Clerk and direct CSV data loading.

## 🚀 Key Features

*   **Next.js App Router**: Modern architecture for routing and rendering.
*   **TypeScript**: Ensures type safety and improves code maintainability.
*   **Tailwind CSS**: For a utility-first, responsive design approach.
*   **Clerk Authentication**: Secure and flexible user authentication and management.
*   **Middleware Protection**: Robust route protection for both pages and API endpoints.
*   **Direct CSV Data Loading**: Data for agencies and contacts is loaded directly from CSV files during server-side rendering.
*   **Fixed Contact Limits**: Implements a daily contact viewing limit for all users.
*   **Dynamic Tables**: Customizable and data-driven tables for displaying information.
*   **Responsive Design**: Optimized for various screen sizes.

## 📁 Project Structure

```
app/
├── (dashboard)/              # Protected dashboard routes group
│   ├── layout.tsx           # Dashboard layout with sidebar
│   ├── agencies/
│   │   ├── page.tsx         # Agencies list page
│   │   └── [id]/
│   │       └── page.tsx     # Individual agency page
│   └── contacts/
│       ├── page.tsx         # Contacts list page
│       └── [id]/
│           └── page.tsx     # Individual contact page
│   └── upgrade/             # Contact limits information page (formerly upgrade)
│       └── page.tsx
├── sign-in/                 # Clerk-managed sign-in page
│   └── [[...sign-in]]/
│       └── page.tsx
├── sign-up/                 # Clerk-managed sign-up page
│   └── [[...sign-up]]/
│       └── page.tsx
├── layout.tsx               # Root layout
├── page.tsx                 # Home page
└── globals.css             # Global styles

components/
├── ui/                      # Reusable UI components (Button, Card, Input)
├── DynamicTable.tsx         # Generic table for dynamic data display (used for agencies)
├── LimitedContactsTable.tsx # Specialized table for contacts with fixed schema
└── auth/                    # Authentication-related components (AuthGuard, ProtectedRoute, LogoutButton)

data/
├── agencies.csv            # Raw CSV data for agencies
├── contacts.csv            # Raw CSV data for contacts
└── types.ts                # TypeScript type definitions (shared interfaces)

hooks/
├── useContactLimits.ts     # Manages client-side contact limit state and API calls
└── index.ts               # Hook exports

lib/
├── constants.ts            # Application-wide constants (e.g., DEFAULT_CONTACT_LIMIT)
├── csv/                    # CSV loading utilities (agencies.ts, contacts.ts)
└── utils.ts                # General utility functions

middleware.ts               # Global Next.js middleware for authentication and routing
```

## 🛠 Tech Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Authentication**: Clerk
*   **Data Parsing**: `csv-parse/sync`
*   **Utilities**: `clsx`, `tailwind-merge`

## 🚦 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd [project-folder]
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root of your project and add your Clerk API keys:
    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_CLERK_PUBLISHABLE_KEY
    CLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET_KEY

    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
    ```
    Replace `pk_test_YOUR_CLERK_PUBLISHABLE_KEY` and `sk_test_YOUR_CLERK_SECRET_KEY` with your actual keys from your Clerk Dashboard.

4.  **Run the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication with Clerk

The application uses Clerk for robust authentication:

*   **Clerk UI**: Sign-in and Sign-up pages are managed by Clerk's pre-built UI components.
*   **Middleware Protection**: The `middleware.ts` file is configured to:
    *   Protect all dashboard routes (`/dashboard(...)`) and API routes (`/api/(...)`).
    *   Redirect unauthenticated users to the `/sign-in` page.
    *   Return `401 Unauthorized` for unauthenticated API requests.
    *   Redirect authenticated users away from `sign-in`/`sign-up` pages to the `/dashboard`.
*   **Session Management**: Clerk handles all session and user management.

## 📋 Data Management (CSV Based)

Data for agencies and contacts is directly loaded from CSV files. There is no external database or seeding process to JSON files for the running application.

*   **Source Data**: `data/agencies.csv` and `data/contacts.csv`
*   **Data Loading**:
    *   `lib/csv/agencies.ts` (for agencies) and `lib/csv/contacts.ts` (for contacts) are responsible for reading, parsing, cleaning, and formatting the CSV data.
    *   These functions are called during server-side rendering of the respective dashboard pages (`app/dashboard/agencies/page.tsx`, `app/dashboard/contacts/page.tsx`).
*   **Column Filtering**: The CSV loaders filter out columns that are specified in a blacklist (e.g., `total_schools`, `mailing_address`) or that contain no data across all rows.

## 📊 Dynamic Tables

*   **Agencies Table**: Uses `components/DynamicTable.tsx` which is a generic component that infers its columns from the `initialData` prop. It displays data with dynamic column headers and filtering.
*   **Contacts Table**: Uses `components/LimitedContactsTable.tsx` which is a specialized component with a fixed, hardcoded column schema. It also integrates with the contact limits display and actions.

## 📈 Contact Limits

The application enforces a fixed daily contact viewing limit for all users.

*   **Default Limit**: Defined in `lib/constants.ts` (`DEFAULT_CONTACT_LIMIT`).
*   **API Endpoint**: `app/api/contact-limits/route.ts` manages the daily count of viewed contacts and returns the current limit and remaining views.
*   **Client-Side Hook**: `hooks/useContactLimits.ts` provides the current limit status to UI components and handles incrementing the view count.
*   **"Upgrade Now" Button**: The button on `/dashboard/upgrade` is currently **inert** and does not perform any action when clicked, as the subscription functionality has been removed.

## 🚀 Deployment on Vercel

This Next.js project is optimized for deployment on Vercel.

1.  **Version Control**: Ensure your project is pushed to a Git repository (e.g., GitHub).
2.  **Vercel Account**: Link your Git repository to a new Vercel project via the Vercel Dashboard.
3.  **Environment Variables**: **Crucially**, add all Clerk-related environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, etc.) directly in Vercel's project settings under "Environment Variables".
4.  **Automatic Deployment**: Vercel will automatically detect your Next.js application and deploy it upon pushes to your configured branch.

---
This `README.md` provides a comprehensive overview of the project's current state, its features, and how to get started.