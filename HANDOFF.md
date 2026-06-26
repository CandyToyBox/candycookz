# Candy Cookz — Handoff Brief for Claude Code

You're picking up a finished static marketing site for **candycookz.com** and taking it the rest of the way: GitHub → Vercel → custom domain → portfolio videos → payments. The owner (Candy) is **non-technical** — explain each step plainly, do the work for her, and never ask her to run commands she doesn't understand. She's a Web3 founder (WaveWarz, on Solana).

## Ground rules (don't break these)
- **Voice is first-person "I."** Never "we"/"our." It's a solo creator brand.
- **No real-food photography.** Only the grill, fire, coals, flames, and graphic skewers/logo. (Food = metaphor, not imagery.)
- **Keep the model intact:** productized "cooks," fixed prices paid upfront, serving levels (Single Serving / Family Style / Keep Cooking), **Reserved Seating** retainer, limited seats, restock-only price increases.
- **Never commit secrets.** All API keys go in Vercel environment variables, never in the repo. `.env` is already gitignored.

## The stack
Pure static site — HTML, one CSS file, images, and a small inline WebGL fire shader on the homepage. **No build step, no framework.** Vercel serves it directly. `vercel.json` enables clean URLs (`/menu` instead of `/menu.html`).

---

## TASK A — GitHub
1. `git init` in this `candycookz_site/` folder.
2. Commit everything: `git add . && git commit -m "Initial Candy Cookz site"`.
3. Create a GitHub repo (e.g. `candycookz`) and push. The 4 videos in `assets/video/` total ~73 MB and are fine to commit. Do **not** add the large source videos from the parent folder.
4. Walk Candy through connecting her GitHub account if it isn't already.

## TASK B — Vercel deploy
1. Import the GitHub repo in Vercel. Framework preset: **Other** (static). No build command. Output directory: project root.
2. It should deploy on push. Confirm the live `*.vercel.app` URL renders the animated hero.
3. **Custom domain:** add `candycookz.com` (she already owns it). Set the DNS records Vercel shows at her registrar. Confirm HTTPS.
4. From here, every `git push` auto-deploys.

## TASK C — Portfolio videos
- The 4 clips in `assets/video/` already work (ZAO-CHELLA, ZAO-PALOOZA, Press Release deck, WaveWarz).
- **Two cards are placeholders** marked `▶ Add hosted video` (search `portfolio.html` for `TODO (Claude Code)`): the Nate Lavine MV and the ElevenLabs piece. These source files are 170–335 MB — too big for GitHub/Vercel. Host them on **Vimeo, YouTube, or Cloudflare Stream** and replace each placeholder `<div>` with the embed.
- **Adding a new portfolio item** later: copy one `<div class="work">…</div>` block in `portfolio.html`, point the `<video>`/embed at the new file, and edit the title, description, and `chip` tags. Keep clips under ~50 MB if committing to the repo; otherwise host externally.

## TASK D — Payments (the real work)
The order form (`cook.html`) and Agent Menu (`api.html`) are **UI only** right now. The three payment rails Candy wants:

### 1. Card — Stripe
Simplest path for a non-coder, in order of effort:
- **Stripe Payment Links** (no code): one link per cook, paste into each order button. Fast to launch, but no custom intake.
- **Stripe Checkout via a Vercel Serverless Function** (recommended): a `/api/checkout` function creates a Checkout Session from the selected cook + serving size, redirects to Stripe, and returns to a success page. Store the price catalog server-side (see `docs/candy-cookz-concept.md` for cooks/prices). This keeps the branded intake form.
- The intake form fields (brand, contact, brief, assets, turnaround) should be captured **with** the order — POST to the same function, or to a form backend (Formspree/Basin) that emails Candy. File uploads → Vercel Blob, S3, or just ask for links.

### 2. Crypto wallet
She's Solana-native. Options:
- **Solana Pay** (USDC on Solana) for a QR/wallet flow, or
- **Coinbase Commerce** for multi-chain stablecoin checkout (lowest lift).
Add as a second button on the order form; same intake capture.

### 3. x402 (agentic payments) — the differentiator
Expose the **deterministic** cooks (Image, Logo, Theme, Social) plus the human-in-the-loop cooks (Human Feedback, Web3 Brain) as machine-payable endpoints using Coinbase's **x402** protocol (HTTP 402 + stablecoin settlement, typically USDC on Base). Pattern:
- An agent `GET`s a cook endpoint → server replies `402 Payment Required` with price headers.
- Agent settles over x402 → `POST`s the brief → receives deliverables (deterministic) or a ticket (human-in-loop).
- Use the current x402 libraries/facilitator; keep each cook's "you get exactly X" promise machine-readable. `api.html` already documents the intended flow — mirror it.
- Start with the **Image Cook** as the first live x402 endpoint, then expand.

**Architecture note:** Stripe Checkout, crypto, and x402 all need serverless functions. On Vercel, add an `/api` folder (Node/TypeScript). Keep the static front-end as-is; the functions are additive. All keys → Vercel env vars.

---

## Reference
- `docs/candy-cookz-concept.md` — full concept: every cook, prices, serving levels, edit policy, Reserved Seating, x402 plan, pricing philosophy.
- `docs/contra-rate-card.md` — pricing rationale and income math.
- `README.md` — structure and local-run notes.

## Suggested order of work
1. GitHub + Vercel + domain (get it live).
2. Host the 2 large videos.
3. Stripe Checkout for cards (first real payments).
4. Crypto (Solana Pay or Coinbase Commerce).
5. x402 Image Cook endpoint, then expand the Agent Menu.
