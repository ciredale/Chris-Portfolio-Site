# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Run locally

No build step, no install. Open any HTML file directly in a browser, or use a local server for correct font and fetch behaviour:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

VS Code Live Server extension also works: right-click `index.html` → "Open with Live Server".

## Architecture

Plain HTML + CSS + vanilla JS. Every page is a self-contained HTML file; there are no components, templates, or frameworks.

**CSS split:** All shared styles live in `assets/site.css`. Page-specific styles that only apply to `index.html` (hero, accolades, selected-works, get-in-touch, about, disciplines grid) sit in a `<style>` block inside `index.html` itself. Discipline pages (`game-design.html`, `narrative.html`, `vfx.html`, `level-design.html`) link only `assets/site.css`.

**Design tokens:** The `:root` block at the top of `assets/site.css` holds all colour, type, radius, and spacing variables (`--red`, `--ink`, `--paper`, `--ff-display`, `--ff-mono`, `--gut`, `--r-*`, etc.). Change a value there to update the whole site.

**`assets/site.js`:** Shared interactions — mobile menu toggle, scroll-reveal (`.rise` → `.in` via `IntersectionObserver`), blueprint cursor crosshair, mouse parallax (`data-parallax` attribute), magnetic tilt on `.plate` cards, scroll progress bar. All motion features are gated on `prefers-reduced-motion` and `pointer:fine`.

**`image-slot.js`:** A custom element (`<image-slot>`) used as draggable image placeholders on the discipline pages. It only works inside the omelette design tool (where `window.omelette.writeFile` exists). **On GitHub Pages these slots render as grey "Drop a …" placeholders.** Before going live, replace each `<image-slot>` with a plain `<img>` tag. Example conversion:

```html
<!-- before -->
<image-slot id="gd-qff" shape="rect" fit="cover" placeholder="Drop art here"></image-slot>

<!-- after -->
<img src="assets/img/filename.jpg" alt="Description" style="width:100%;height:100%;object-fit:cover;">
```

## Content conventions

**Nav active state:** The current page's tab needs `aria-current="page"` on its `<a class="tab">`. Discipline pages link About/Contact back to `index.html#about` and `index.html#contact`; the home page uses bare fragment hrefs (`#about`, `#contact`).

**Scroll reveal:** Add `class="rise"` to any block that should fade+slide in on scroll. The JS handles the rest.

**Project modules (`.mod`):** Alternating media-left / text-right layout. Add `.mod--flip` to reverse the order (media right). The `.frame` component renders a dark-backed media box with a red offset plate behind it; `.frame--halftone` adds a dot texture to that plate.

**Contact email:** The `mailto:` address is set in a small inline `<script>` at the bottom of `index.html` — `var TO='hello@chrisiredale.com'`. Update it there.

## Deploy

Push to GitHub, then: **Settings → Pages → Source = Deploy from branch → main / root → Save**. The `.nojekyll` file must stay in the repo so GitHub serves files verbatim.
