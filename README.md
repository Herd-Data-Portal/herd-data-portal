# HERD data portal — publishable shell only

This folder is a **GitHub Pages-ready static website**. It intentionally contains **no real project names, file names, dataset files, or private paths**. The separate sibling `herd-data-portal-review/` contains the local-only inventory and must **never** be uploaded to a public repository.

## Local preview

- Open `index.html` in a browser to see the empty public shell.
- Open `../herd-data-portal-review/preview.html` to see the real **internal review-only** inventory. That preview is not approved for publication and offers no downloads.
- The year shown in the preview is the **folder year**, not a verified data-collection year. Empty folders mean no files were found locally, not that a project has no datasets elsewhere.

## Publishing after approval

1. Ask HERD/project owners to approve public project titles and descriptions, release of each file, and any request-only metadata. Use the CSVs in the review directory internally.
2. Copy **only explicitly approved, manually curated metadata** into `catalog.js`. Never copy the entire internal draft. For files, set `access` to `public` with a reviewed `publicUrl`, or `request` with no file URL. Set `requestFormUrl` to an organisation-approved form before exposing request buttons.
3. Put only **approved public files** on the website or a suitable public file host. Never upload the original OneDrive folder or private data.
4. Once records are approved and the site is ready to be indexed by search engines, remove the `noindex, nofollow` robots tag in `index.html` if HERD wants it searchable. `noindex` is **not** access control.
5. Create a HERD-owned **public** GitHub repository. Upload the contents of **this site folder only**. In the repository, go to **Settings → Pages → Deploy from a branch → main → /(root)**. GitHub provides the public `github.io` link. A custom subdomain can be added later by HERD's domain administrator.

No database or continuously running computer is required. GitHub Pages hosts HTML/CSS/JavaScript; any request form is a separate HERD-managed service.
