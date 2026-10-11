---
name: tela
description: Render HTML files to social-media-ready images (png/jpeg) using the tela CLI with system Chromium. Use when asked to create post graphics, previews, or screenshots from HTML.
---

## Workflow

1. Write a self-contained HTML file (inline CSS; external Google Fonts/images are OK, no JS needed).
2. Pick a target resolution from the table below and size the HTML to fill that exact viewport.
3. Run: `tela -i poster.html -r 1080x1350 -o out.png`
4. Verify the output file exists before reporting success.

## CLI reference

- `-i, --input <file.html>` — required HTML file.
- `-r, --resolution <WxH>` — strict `^\d+x\d+$`, default `390x844`.
- `-o, --output <file>` — default `out.png`; extension must be `png`, `jpeg` or `jpg` (jpeg uses quality 90).
- Any violation: error message to stderr + exit code 1.
- Load waits for `networkidle` (30s timeout), so remote fonts/images are awaited; screenshot captures the viewport only (NOT fullPage).
- Requires Chromium at `/usr/bin/chromium` (override via env `CHROMIUM_PATH`).

## Recommended dimensions

| Purpose | Resolution |
| --- | --- |
| Instagram post (square) | 1080x1080 |
| Instagram portrait | 1080x1350 |
| Instagram Story / Reel / TikTok | 1080x1920 |
| X (Twitter) post | 1200x675 |
| Facebook post | 1200x630 |
| Open Graph / web preview | 1200x630 |
| LinkedIn post | 1200x627 |
| YouTube thumbnail | 1280x720 |
| Phone mockup / mobile-first design | 390x844 |
| Desktop web | 1920x1080 |

## HTML design rules

- `html, body { margin: 0; height: 100vh; height: 100dvh; overflow: hidden; }` — content must fill the viewport exactly.
- Design at the target resolution's aspect ratio and avoid scroll — everything visible must fit the viewport.
- Use `clamp()`/`vmin` units so type and spacing scale with the viewport.
- Fonts via Google Fonts `<link>` and images from real remote URLs are fine — networkidle waits for them.
- No JavaScript needed; static HTML renders correctly.

## Example

```bash
cat > poster.html <<'EOF'
<!doctype html><html><head><style>html,body{margin:0;height:100dvh;overflow:hidden;background:#111;color:#fff;display:grid;place-items:center;font:700 clamp(2rem,8vmin,6rem)/1 sans-serif}</style></head><body>Hello</body></html>
EOF
tela -i poster.html -r 1080x1350 -o instagram.png
```

## Troubleshooting

- "Chromium not found": install system chromium or set `CHROMIUM_PATH` to the binary.
- Blank/slow image: remote resources failed to load; inline critical CSS and fonts.
- Cropped design: viewport mismatch; check `-r` matches the HTML layout dimensions.
