# IB English A: Literature – Individual Oral (IO) Visual Timer

A responsive visual timer and structural planner designed for the International Baccalaureate (IB) Diploma Programme Language A: Literature Individual Oral (IO) 10-minute presentation.

Based directly on primary instructional frameworks used by IB Literature educators worldwide:
1. **The 4-Quadrant Balance Model**: Separates the oral into balanced 2-minute quadrants (Text A Whole Literary Work, Text A Extract, Text B Whole Work in Translation, Text B Extract) flanked by a 1-minute Introduction and 1-minute Conclusion.
2. **Philpot Education Outline Method 1**: Features the classic 1-4-4-1 chevron sequence with dedicated analysis of the literary work in original language and the work studied in translation.

---

## Key Literature Features

- **Two Literary Works (Original Language + Work in Translation)**:
  - Text A: Literary work originally written in the language studied (e.g. English).
  - Text B: Literary work studied in translation (e.g. German, French, Russian, etc.).
- **Prescribed Reading List (PRL) Verification**:
  - Reminds students that at least **ONE** of the two works must be from the IB Prescribed Reading List (PRL).
  - Visual badges and verification flags in the Master Plan and Quadrant views.
- **IB DP Literature Assessment Rubric**:
  - Full official criteria breakdown for Language A: Literature:
    - **Criterion A: Knowledge, Understanding & Interpretation** (10 marks)
    - **Criterion B: Analysis & Evaluation** (10 marks - literary devices, authorial craft & technique)
    - **Criterion C: Focus & Organisation** (10 marks - 50/50 balance between texts & between extracts/whole works)
    - **Criterion D: Language** (10 marks - academic register & accurate literary terminology)
- **Strict 10-Minute Timing Enforcement**:
  - Live segment and total oral timers with color-coded warning states (Amber at 9:00, Crimson at 10:00).
  - Optional 5-minute Teacher Discussion (Q&A) period.
- **Global Issue Check-in Alerts**:
  - Reminds students at configurable intervals to anchor every literary choice back to their Global Issue.
  - Enforces the crucial IB requirement: **no direct comparison between extracts**; both must relate independently to the Global Issue.
- **Official 10-Bullet Outline Form**:
  - Editable, word-counted, printable cheat sheet adhering strictly to the maximum 10-bullet IB regulation.
  - Real-time two-way synchronization between the form and all timer rehearsal views.

---

## Deploying to GitHub Pages

### Why was it not visible on GitHub Pages previously?
Vite/React applications cannot be run directly from the raw `main` branch root because browsers cannot interpret `.tsx` files directly. GitHub Pages needs the compiled production output (`dist/` folder).

We have configured **two ready-to-use methods** to deploy this app seamlessly:

---

### Option 1: Automatic Deployment with GitHub Actions (Recommended — Zero setup!)

A GitHub Actions workflow is now included at `.github/workflows/deploy.yml`.

1. Commit and push your code to your GitHub repository (including the new `.github/` folder).
2. Go to your repository on GitHub.
3. Click on **Settings** (tab at the top right of your repo).
4. In the left sidebar, click **Pages**.
5. Under **Build and deployment** > **Source**, change the dropdown from **"Deploy from a branch"** to **"GitHub Actions"**.
6. That's it! GitHub Actions will automatically build the site and deploy it. You can watch the deployment under the **Actions** tab. Your website URL will appear on the Pages settings screen.

---

### Option 2: 1-Command CLI Deployment (`gh-pages`)

If you prefer deploying directly from your computer terminal:

1. In your project directory, run:
   ```bash
   npm run deploy
   ```
   *(This automatically runs `npm run build` and publishes the `dist` folder to a `gh-pages` branch on your GitHub repository).*
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Source**, ensure **"Deploy from a branch"** is selected, with branch **`gh-pages`** and folder **`/ (root)`**.
4. Click **Save**.

---

## License

Apache-2.0
