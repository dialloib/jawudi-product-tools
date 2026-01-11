# Jawudi Field Agent Tool

Mobile-first data collection tool for field agents to catalog land properties and building materials supplier networks.

## Features

- **Land Catalog Form**: Comprehensive land/property data collection with 40+ fields including African context (traditional authority, land disputes, local languages, etc.)
- **Product Collection Form**: Building materials supplier network with dynamic specifications, vendor info, and pricing
- **Mobile-First Design**: Optimized for phone, tablet, and desktop with Jawudi brand design system
- **Offline Ready**: Forms work without internet (backend integration coming next)

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Icons**: Lucide React
- **Styling**: Mobile-first responsive design with custom breakpoints
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
jawudi-product-tools/
├── app/                    # Next.js App Router pages
│   ├── collect/
│   │   ├── land/          # Land catalog form page
│   │   └── product/       # Product collection form page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   └── forms/             # Form components
│       ├── LandCatalogForm.tsx
│       └── ProductCollectionForm.tsx
└── lib/
    └── utils.ts           # Utility functions
```

## Next Steps

- [ ] Integrate Supabase for backend (auth, database, storage)
- [ ] Add Google OAuth authentication
- [ ] Implement photo upload with camera integration
- [ ] Add offline sync queue
- [ ] Build admin review dashboard
- [ ] Add PWA support

## Deployment

Deploying to Vercel:

```bash
# Deploy to Vercel
vercel

# Or connect GitHub repo for continuous deployment
```

## License

Proprietary - Jawudi

## Contact

For questions or support, contact the Jawudi team.
