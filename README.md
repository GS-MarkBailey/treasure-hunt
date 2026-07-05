# Disney Treasure Hunt Checklist

A fun browser-based treasure hunt for kids with 10 missions. When all missions are complete, a secret QR code is revealed!

## Quick start

1. Open `index.html` in your browser (double-click the file, or run a local server).
2. Let the kids check off each mission as they complete it.
3. When all 10 are done, the treasure section unlocks with a QR code to scan.

### Run with a local server (recommended for camera scanner)

```bash
cd /Users/mark.bailey/DISNEY
python3 -m http.server 8080
```

Then visit: http://localhost:8080

## Customize

Edit `app.js`:

- **`TASKS`** — Change the 10 mission descriptions to match your hunt.
- **`TREASURE_QR_CONTENT`** — Set the URL or text encoded in the final QR code (e.g. a Google Maps link to where the prize is hidden, a video message, or a note).

Progress is saved automatically in the browser (localStorage), so refreshing the page won't lose completed tasks.

## Features

- 10 kid-friendly missions with progress bar
- Locked treasure section until all tasks are done
- Generated QR code for the final prize link
- Optional camera QR scanner (expand "Or scan a treasure QR code…") for scanning physical codes
- Disney-inspired colorful design
