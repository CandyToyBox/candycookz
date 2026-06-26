# Candy Cookz — candycookz.com

Productized creative services for Web3 & AI brands. Order a "cook," drop your ingredients, pay upfront, get it cooked. Fixed prices, no haggling. Includes an **Agent Menu** so AI agents can order, pay over **x402**, and receive content.

This is a static site (HTML + CSS + images + a small WebGL fire animation). No build step, no framework — it deploys to Vercel as-is.

## Pages
| File | Page |
|------|------|
| `index.html` | Homepage — animated fire hero, the cook loop, featured cooks |
| `menu.html` | The Menu — all cooks with prices, seats, serving levels |
| `portfolio.html` | Past Cookz — portfolio videos |
| `cook.html` | Order a Cook — intake form (reads `?cook=` from the menu links) |
| `api.html` | For Agents — the x402 Agent Menu |

## Structure
```
candycookz_site/
├── index.html  menu.html  portfolio.html  cook.html  api.html
├── style.css                 # the whole design system
├── vercel.json               # clean URLs config
├── assets/                   # logo, grate, badges, patterns, button graphics
│   └── video/                # 4 portfolio clips (the big ones are hosted externally)
└── docs/                     # concept brief + rate card (context, not shipped pages)
```

## Run locally
Open `index.html` in a browser. (The fire animation and logo glow only move in a real browser, not in a static screenshot.)

For clean local URLs you can also run any static server, e.g. `npx serve`.

## Deploy
Push to GitHub, import the repo in Vercel, set the domain to `candycookz.com`. Full step-by-step (plus how to add portfolio videos and turn on payments) is in **HANDOFF.md**.

## What's NOT done yet (see HANDOFF.md)
- **Payments** — the order form and Agent Menu are UI only. Stripe, crypto, and x402 still need a backend.
- **Two large portfolio videos** — placeholders marked "▶ Add hosted video" need a hosted embed.
