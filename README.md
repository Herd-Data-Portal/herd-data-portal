# HERD International — Research Data Portal

A public, searchable catalogue of HERD International's research datasets, tools, and resources (2014–2026). Built as a lightweight, free, always-on static website hosted on GitHub Pages.

**Live site:** `https://<your-username>.github.io/<repo-name>/`

## Purpose

- Increase visibility of HERD International's research work
- Let colleagues and partners browse datasets by year, project, topic, and format
- Provide public downloads for approved files
- Route private dataset requests through a controlled review process

## How it works

```
Visitor
  → browses the portal (GitHub Pages)
  → clicks "Download"  → gets an approved public file
  → clicks "Request access" → fills the Microsoft Form
      → HERD reviews → shares data directly (OneDrive)
```

| Layer | Technology | Cost | Availability |
|---|---|---|---|
| Website | Static HTML/CSS/JS on GitHub Pages | Free | 24/7 |
| Public files | GitHub `files/` folder (< 1 GB) | Free | 24/7 |
| Private files | HERD OneDrive (never uploaded to GitHub) | Internal | On request |
| Requests | Microsoft Forms → email to HERD | Free | — |

## Site structure

```
herd-data-portal-site/
├── index.html     — page structure
├── styles.css     — colours, layout, fonts (HERD theme)
├── app.js         — filtering, search, card rendering
├── catalog.js     — ALL project/dataset records (edit this)
├── logo.svg       — HERD logo
└── files/         — approved public files, organised by project
    └── PROJECT_NAME/
        └── file.pdf
```

## Adding / editing content

### Add a project

Edit `catalog.js`, inside `projects: []`:

```js
{
  year: 2025,
  title: "Project Name",
  folderName: "ProjectName_2025",
  description: "Short public description of the project and its data.",
  types: [{ name: ".pdf", count: 1 }, { name: ".csv", count: 2 }],
  groups: [{ name: "Report", count: 1 }, { name: "Datasets", count: 2 }],
  files: [
    {
      name: "Project Report.pdf",
      group: "Report",
      type: ".pdf",
      access: "public",
      publicUrl: "./files/ProjectName_2025/report.pdf"
    },
    {
      name: "Household Survey Data",
      group: "Datasets",
      type: ".csv",
      access: "request",
      publicUrl: ""
    }
  ]
}
```

### Add a public file

1. Create folder `files/PROJECT_NAME/` on GitHub (create file `.gitkeep`)
2. Upload the approved file into that folder
3. In `catalog.js` set:
   - `access: "public"`
   - `publicUrl: "./files/PROJECT_NAME/filename.ext"`

### Add a private (request-only) file

- Keep it **only in HERD OneDrive**
- In `catalog.js` set `access: "request"` and `publicUrl: ""`
- The visitor will see a **Request access** button opening the request form

### Change colours / theme

Edit `styles.css`, top block `:root{...}` — change hex values (see HERD brand colours: blue `#0275c8`, dark blue `#004f87`, orange `#f2864a`).

### Access request form

Set in `catalog.js`:

```js
requestFormUrl: "https://forms.cloud.microsoft/r/YOURID",
```

Form settings must be: **Anyone can respond** + **email notification** enabled.

## Approval workflow for data requests

1. Colleague fills the Microsoft Form
2. HERD receives an email with their details
3. Project owner reviews the purpose
4. If approved → share from OneDrive ("Specific people", one-time link, block download if needed)
5. If declined → reply politely; keep the form record for audit

## Publishing (deploy)

1. Commit changes to the repo
2. **Settings → Pages → Deploy from a branch → main → /(root)**
3. Wait a few minutes → refresh the live link

Remember: private files and unapproved records **must never** be committed to this public repository. GitHub history keeps previous versions — use them to recover, and to roll back.

## Limitations & future options

| Item | Limit now |
|---|---|
| Total site size | ~1 GB (GitHub Pages) |
| Max single file | 25 MB (web upload) / 100 MB (git) |
| Large datasets later | Host on OneDrive/Zenodo/Supabase and link from `catalog.js` |
| Database needs later | Consider Supabase (hosted Postgres) — static site can't query SQLite |

## Contact

HERD International · info@herdint.com · +977-01-5914875

© 2026 HERD International
