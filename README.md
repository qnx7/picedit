# PicEdit — Instagram Preset Editor

A modern web app to apply AI-powered Instagram-style photo presets to your images.

## Features

- Upload one or multiple images (drag & drop supported)
- 10 built-in style presets: Dark Aesthetic, Clean Minimal, Luxury Beige, Film Grain, Streetwear Editorial, Soft Glow, Moody Night, High Contrast, Vintage Warm, Instagram Model Look
- AI image editing via OpenAI DALL-E 2
- Before/after comparison view
- Batch download of edited images
- Mobile-responsive, premium SaaS design

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-...your-key-here...
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Adding the AI image editing API key

The app uses [OpenAI's DALL-E 2 image edit endpoint](https://platform.openai.com/docs/api-reference/images/createEdit).

1. Create an account at [https://platform.openai.com](https://platform.openai.com)
2. Generate an API key under **API Keys**
3. Add it to `.env.local`:

```env
OPENAI_API_KEY=sk-...
```

**Without a key:** The app still runs fully — you'll see a banner explaining that AI editing isn't configured yet, but all other UI (upload, style selection, previews) works normally.

---

## Deploying to Vercel

1. Push this repository to GitHub
2. Import the project at [https://vercel.com/new](https://vercel.com/new)
3. In the Vercel dashboard, go to **Settings → Environment Variables**
4. Add `OPENAI_API_KEY` with your key
5. Deploy

Vercel will automatically detect Next.js and configure everything.

---

## Project Structure

```
picedit/
├── app/
│   ├── api/edit-image/route.ts   # API route — POST /api/edit-image
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Entry point (hero → editor)
├── components/
│   ├── editor/
│   │   ├── EditingFlow.tsx       # Main editing wizard (upload → style → results)
│   │   └── ResultPreview.tsx     # Result cards with download + compare
│   ├── landing/
│   │   └── Hero.tsx              # Landing page hero section
│   ├── styles/
│   │   └── StyleSelector.tsx     # Preset style grid
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── progress.tsx
│   └── upload/
│       └── ImageUpload.tsx       # Drag-and-drop uploader with previews
├── lib/
│   ├── image-editing.ts          # AI provider logic (swap in your provider here)
│   ├── styles.ts                 # All 10 preset style definitions + prompts
│   └── utils.ts                  # cn(), formatFileSize(), validation helpers
├── .env.example
└── README.md
```

---

## What still needs to be connected for real AI editing

| Task | Status |
|---|---|
| OpenAI API key added to `.env.local` | Add `OPENAI_API_KEY` |
| DALL-E 2 requires PNG with alpha channel | Images are sent as-is; convert if needed |
| Custom provider | Replace `editWithOpenAI()` in `lib/image-editing.ts` |
| Rate limiting | Not implemented — add if exposing publicly |
| Auth / usage limits | Not implemented — add before production launch |

To swap in a different AI provider (e.g. Stability AI, Replicate, fal.ai), update `lib/image-editing.ts` — the `editImage()` function is the only integration point.
