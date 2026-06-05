# PicEdit — Instagram Preset Editor

A modern web app to apply AI-powered Instagram-style photo presets to your images.

## 🌐 Live site

Deployed automatically to GitHub Pages on every push:

**https://qnx7.github.io/picedit/**

No setup needed to browse — upload, style selection, previews and downloads all
work. The AI editing step shows a "not configured" notice until an API key is
added (see below).

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

## Deployment (GitHub Pages — automatic)

This repo ships with a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that builds the static site and publishes it to GitHub Pages on every push to
the default branch. **No tokens or external accounts are required** — it uses
the built-in `GITHUB_TOKEN` and auto-enables Pages.

The site builds as a fully static export (`output: 'export'`) served from
`https://qnx7.github.io/picedit/`.

### Enabling real AI editing on the live site (optional)

Because GitHub Pages has no server, editing runs in the browser. To turn it on:

1. Go to your repo → **Settings → Secrets and variables → Actions**
2. Add a secret named `NEXT_PUBLIC_OPENAI_API_KEY` with your OpenAI key
3. Re-run the **Deploy to GitHub Pages** workflow

> ⚠️ A `NEXT_PUBLIC_` key is embedded in the static bundle and visible to anyone
> using the site. Only use a key with a strict spending cap, or prefer the Vercel
> option below for a hidden server-side key.

## Alternative: Deploy on Vercel (hidden server-side key)

For production with a private key, deploy on Vercel instead:

1. Import the project at [https://vercel.com/new](https://vercel.com/new)
2. Add `NEXT_PUBLIC_OPENAI_API_KEY` (or restore a server API route and use
   `OPENAI_API_KEY`) under **Settings → Environment Variables**
3. Deploy

Vercel auto-detects Next.js. To keep the key fully server-side, re-add an API
route (see `lib/image-editing.ts`, which already contains the server logic) and
point the client at it instead of calling OpenAI directly.

---

## Project Structure

```
picedit/
├── .github/workflows/deploy.yml  # Auto-deploy to GitHub Pages
├── app/
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
│   ├── client-edit.ts            # Browser-side editing call (used by static site)
│   ├── image-editing.ts          # Server-side AI provider logic + shared types
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
