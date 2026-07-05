# Treasure Hunt Checklist

A fun browser-based treasure hunt for kids with 10 missions. When all missions are complete, a secret QR code is revealed!

## Live demo

Deploy to Vercel (see below) to get a shareable link for phones and tablets.

## Quick start (local)

1. Open `index.html` in your browser (double-click the file, or run a local server).
2. Let the kids check off each mission as they complete it.
3. When all 10 are done, the treasure section unlocks with a QR code to scan.

### Run with a local server (recommended for camera scanner)

```bash
python3 -m http.server 8080
```

Then visit: http://localhost:8080

## Customize

Edit `app.js`:

- **`TASKS`** — Change the 10 mission descriptions to match your hunt.
- **`TREASURE_QR_CONTENT`** — Set the URL or text encoded in the final QR code (e.g. a Google Maps link to where the prize is hidden, a video message, or a note).

Progress is saved automatically in the browser (localStorage), so refreshing the page won't lose completed tasks.

## Deploy to GitHub

```bash
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/treasure-hunt.git
git push -u origin main
```

## Deploy to Vercel

**Option A — Connect GitHub (recommended)**

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository.
4. Leave settings as default (static site, no build command).
5. Deploy.

**Option B — Vercel CLI**

```bash
npx vercel
npx vercel --prod
```

No build step is required — Vercel serves the static files from the project root.

## Features

- 10 kid-friendly missions with progress bar
- Locked treasure section until all tasks are done
- Generated QR code for the final prize link
- Optional camera QR scanner (expand "Or scan a treasure QR code…") for scanning physical codes
- Colorful, mobile-friendly design
