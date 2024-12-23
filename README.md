This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Core Values Application

A web application to help individuals discover and prioritise their personal values through an interactive card sorting exercise.

## Features

- Interactive drag-and-drop interface for sorting values
- Multiple rounds of refinement 
- Progress saving using IndexedDB
- History view of previous sessions
- Printable results
- Responsive design
## Getting Started

First, run the development server:

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
git clone https://github.com/digitalanalogue9/digitalanalogue9.github.io.git
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### ENV
GA_MEASUREMENT_ID
NEXT_PUBLIC_VERSION
NEXT_PUBLIC_DEPLOYMENT_TARGET
LASTMOD_DATE
CACHE_VERSION
CARDS_IN_GAME
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

