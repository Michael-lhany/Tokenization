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

## Publish on GitHub Pages
1. Create a repository on GitHub and push this folder as the repository root.
2. On GitHub, go to Settings → Pages and select `main` branch `/ (root)` as the source, or keep the default from the web UI.
3. Alternatively, the included GitHub Actions workflow will automatically publish the site when you push to `main`.

## License
This project is released under the MIT License. See `LICENSE`.
