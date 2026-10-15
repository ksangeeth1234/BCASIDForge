# BCAS IDForge

**Temporary Student ID Generator & Bulk A4 Printing System**

Official campus administrative tool for BCAS (British College of Applied Studies).

---

## Features

- 🎓 Dynamic academic programme, intake & year configuration
- 🖨 Exact 55×85 mm temporary student pass design
- 📄 Bulk A4 PDF generation: 9 cards per sheet in a 3×3 grid layout
- 🔒 Welcome screen with local app readiness check
- 🖼 Optional partner university logo support (upload or URL)
- ✂️ Corner cutting guides printed on all cards
- 📱 Installable PWA with offline support
- 🔢 Sequential pass numbering with customizable prefix
- 📊 Barcode graphic on each card

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** (via @tailwindcss/vite)
- **jsPDF** — Client-side PDF generation (no server required)
- **Lucide React** — Clean institutional icons
- **Canvas Confetti** — Celebratory completion animation

## Deployment

Deploy to Vercel (zero configuration required):

```bash
npx vercel deploy
```

## A4 Layout Specifications

| Parameter         | Value         |
|-------------------|---------------|
| A4 Page Size      | 210 × 297 mm  |
| Card Size         | 55 × 85 mm    |
| Cards per Page    | 9 (3 × 3)     |
| Left/Right Margin | 15 mm         |
| Top/Bottom Margin | 14 mm         |
| Horizontal Gap    | 7.5 mm        |
| Vertical Gap      | 7.0 mm        |

> **Print at 100% / Actual Size** — never "Fit to Page" or "Shrink to Fit".

## License

Internal use — BCAS Campus Administrative Services.
