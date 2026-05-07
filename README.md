# LLM Tokenization Simulator

Interactive demo that visualizes how different tokenization strategies (BPE, word-level, character-level) split text into tokens. This repository is designed to be hosted as a static site (GitHub Pages).

## Files

- `index.html` — single-page demo
- `css/styles.css` — styling
- `js/main.js` — interactive logic

## Run locally

Open `index.html` in a browser. For a local server (recommended):

```
# Python 3
python -m http.server 8000

# then open http://localhost:8000
```

## Optional analytics

The site includes an optional Cloudflare Web Analytics loader in `index.html`. It is disabled by default.

To enable it, replace `PASTE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` in `index.html` with your Cloudflare token.

## License

This project is released under the MIT License. See `LICENSE`.
