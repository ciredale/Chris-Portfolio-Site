# Chris Iredale — Portfolio Site

A static portfolio site: plain HTML, CSS, and a little vanilla JavaScript. No build
step, no framework, no dependencies to install. Every page is a file you can open
directly in a browser, which is exactly what makes it a perfect fit for GitHub Pages.

---

## 1. Project structure

```
chris-iredale-portfolio/
├── index.html            # Home (hero, reel, accolades, selected works, contact)
├── game-design.html      # Discipline page 01
├── narrative.html        # Discipline page 02
├── vfx.html              # Discipline page 03
├── level-design.html     # Discipline page 04
├── assets/
│   ├── site.css          # All shared styles (design tokens live at the top)
│   └── site.js           # Scroll-reveal, mobile menu, small interactions
├── image-slot.js         # Custom element for drag-to-fill image placeholders (see §4)
├── .nojekyll             # Tells GitHub Pages to serve files as-is (don't remove)
└── .gitignore
```

Page-specific CSS that only applies to the home page lives in a `<style>` block
inside `index.html`. Everything else is in `assets/site.css`.

### Design tokens
Open `assets/site.css` — the `:root` block at the very top holds the colour, type,
radius, and spacing variables (e.g. `--red`, `--ink`, `--paper`, `--ff-display`).
Change a value there and it updates everywhere.

---

## 2. Run it locally

You don't strictly need a server — double-clicking `index.html` works — but a local
server is recommended so relative paths, fonts, and the image-slot fetch behave
exactly like they will in production.

**Option A — VS Code Live Server (easiest)**
1. Install the "Live Server" extension.
2. Right-click `index.html` → "Open with Live Server".

**Option B — one command, no install** (needs Python, which ships with macOS)
```bash
cd chris-iredale-portfolio
python3 -m http.server 8000
```
Then open http://localhost:8000

---

## 3. Editing with Claude Code

1. Put this folder under version control and open it in VS Code:
   ```bash
   cd chris-iredale-portfolio
   git init
   git add .
   git commit -m "Initial import of portfolio site"
   ```
2. Run `claude` in the project root (or use the Claude Code VS Code extension).
3. Useful starting prompts:
   - "Walk me through how this site is structured."
   - "The colour tokens are in assets/site.css :root — change the red accent to X."
   - "Replace the image-slot placeholders on game-design.html with real <img> tags." (see §4)

Because there's no build step, every change is live on the next browser refresh.

---

## 4. ⚠️ Before you go live: the image placeholders

The discipline pages use a custom `<image-slot>` element (`image-slot.js`). Inside
this design tool you fill those slots by dragging an image in, and they persist to a
sidecar file. **On a plain static host (like GitHub Pages) those slots are read-only
and will show their grey "Drop a …" placeholder instead of an image.**

For the live site you'll want to swap each `<image-slot …></image-slot>` for a normal
image. For example, in `game-design.html`:

```html
<!-- before -->
<image-slot id="gd-qff" shape="rect" fit="cover" placeholder="Drop Quest Friends Forever art"></image-slot>

<!-- after -->
<img src="assets/img/quest-friends.jpg" alt="Quest Friends Forever" style="width:100%;height:100%;object-fit:cover;">
```

Create an `assets/img/` folder, drop your real images in, and point the `src` at them.
Claude Code can do this conversion for you across all four pages in one pass.

The YouTube trailers are real `<iframe>` embeds and work as-is — no change needed.

The contact form on the home page opens the visitor's email client via a `mailto:`
link (no backend required). Update the address in the inline `<script>` at the bottom
of `index.html` (`var TO = 'hello@chrisiredale.com'`) if needed.

---

## 5. Deploy to GitHub Pages

1. Create a new repository on GitHub (public is simplest for Pages on a free account).
2. Push this folder to it:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages**.
4. Under "Build and deployment", set **Source = Deploy from a branch**, **Branch = main**,
   **Folder = / (root)**, then Save.
5. Wait ~1 minute. Your site goes live at
   `https://<your-username>.github.io/<your-repo>/`.

The `.nojekyll` file is already included so GitHub serves your files verbatim instead
of running them through Jekyll. Leave it in place.

> Tip: if you name the repo `<your-username>.github.io`, the site is served from the
> root domain `https://<your-username>.github.io/` with no repo path — cleaner if this
> is your main personal site.

---

## 6. Custom domain via Cloudflare

You'll point your domain (managed in Cloudflare DNS) at GitHub Pages.

### a) Tell GitHub about the domain
1. **Settings → Pages → Custom domain** → enter e.g. `chrisiredale.com` → Save.
2. This creates a `CNAME` file in your repo containing the domain. Don't delete it —
   if you ever re-clone, keep that file (it's how Pages knows your domain).

### b) Add DNS records in Cloudflare
In the Cloudflare dashboard for your domain → **DNS → Records**:

**For an apex/root domain (`chrisiredale.com`)** — add four `A` records pointing at
GitHub's IPs:
```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```
(Optionally also add an `AAAA` set for IPv6: `2606:50c0:8000::153`, `…8001::153`,
`…8002::153`, `…8003::153`.)

**For the `www` subdomain** — add a `CNAME`:
```
CNAME   www   <your-username>.github.io
```

### c) Important Cloudflare settings
- **Proxy status:** start with the orange cloud **OFF (DNS only / grey cloud)** until
  GitHub finishes provisioning its HTTPS certificate. Once GitHub shows the cert as
  issued, you can turn the proxy back on if you want Cloudflare's CDN/caching.
- **SSL/TLS mode:** set to **Full** (not Flexible) to avoid redirect loops, since
  GitHub Pages serves HTTPS.
- Back on **GitHub → Settings → Pages**, tick **Enforce HTTPS** once the certificate
  is ready (can take a few minutes to an hour after DNS resolves).

### d) Verify
After DNS propagates (usually minutes, up to a few hours), visit your domain. If you
see the site over `https://`, you're done.

---

## 7. Day-to-day updates

Any change is just: edit files → commit → push. GitHub Pages redeploys automatically.
```bash
git add .
git commit -m "Update selected works copy"
git push
```

---

### Quick reference
| Thing | Where |
|---|---|
| Colour / type tokens | top of `assets/site.css` (`:root`) |
| Home-only styles | `<style>` block in `index.html` |
| Shared scripts | `assets/site.js` |
| Contact email | inline script at bottom of `index.html` |
| Real images to add | replace `<image-slot>` elements (see §4) |
| Don't delete | `.nojekyll`, and the `CNAME` file GitHub adds |
