# best-household-budget-site-20261126

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/gunawanp-ux/best-household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/gunawanp-ux/best-household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

**DompetKeluarga** — a household budget site for Indonesian families: track income and expenses, set a monthly budget per category, chase savings goals, and read a monthly report. All in Bahasa Indonesia, with rupiah figures, working offline from its own files — no account, no network requests, data saved in the browser (localStorage).

## What it does

- **Dashboard** — income, expenses and balance for the month, a donut chart of spending per category, budgets that are almost used up, recent transactions, savings-goal progress, and a practical tip for the month.
- **Transaksi** — the full transaction list with type/category filters; add, edit and delete transactions (date, description, amount, category).
- **Anggaran** — a monthly spending limit per category with progress bars and over-budget warnings; limits are editable and saved.
- **Tujuan** — savings goals with target, amount saved and progress; add money to a goal or create a new one.
- **Laporan** — month-to-month comparison (income vs expenses bar chart, savings rate) and a per-category breakdown with tips for next month.
- Month navigation (‹ ›) switches between October and November 2026 data; the layout adapts to phones.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — no build step, no dependencies. The site is plain static files under `app/` (Node 22 serves it; any static server works).

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots in `screenshots/` are real renders of the site in headless Chromium (desktop 1280×800 and phone 390×844), as listed in `shots.json`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=y746eyjv&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
