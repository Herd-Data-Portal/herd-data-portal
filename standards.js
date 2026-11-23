(() => {
  "use strict";

  const data = window.HERD_STANDARDS_DATA || {};
  const sourceFilters = document.getElementById("source-filters");
  const sourceGrid = document.getElementById("source-grid");
  const sourceCount = document.getElementById("source-count");
  const standardsGrid = document.getElementById("standards-grid");
  const citationSample = document.getElementById("citation-sample");
  const copyCitationBtn = document.getElementById("copy-citation-btn");
  const downloadCodebookBtn = document.getElementById("download-codebook-btn");
  const sandboxGrid = document.getElementById("sandbox-grid");
  const teamGrid = document.getElementById("team-grid");
  const pathwaySteps = document.getElementById("pathway-steps");

  let activeScope = "All";

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map((row) =>
      row.map((cell) => {
        const s = String(cell ?? "");
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(",")
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Seeded PRNG so synthetic datasets are 100% reproducible
  function mulberry32(seed) {
    let a = seed;
    return () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildHouseholdRows(count = 500) {
    const rand = mulberry32(202611);
    const header = [
      "hh_id", "ward_no", "household_size",
      "has_electricity", "piped_water", "flush_toilet", "owns_tv", "owns_bike"
    ];
    const rows = [header];
    for (let i = 1; i <= count; i++) {
      const ward = Math.floor(rand() * 4) + 1;
      const ses = rand() + (ward === 1 || ward === 4 ? 0.15 : -0.1);
      const hhSize = Math.max(1, Math.min(10, Math.round(3 + rand() * 4 - ses * 0.6)));
      const elec = rand() < (0.72 + ses * 0.2) ? 1 : 0;
      const water = rand() < (0.55 + ses * 0.3) ? 1 : 0;
      const toilet = rand() < (0.60 + ses * 0.25) ? 1 : 0;
      const tv = rand() < (0.45 + ses * 0.35) ? 1 : 0;
      const bike = rand() < (0.35 + ses * 0.3) ? 1 : 0;
      rows.push([`SYN_HH_${String(i).padStart(4, "0")}`, ward, hhSize, elec, water, toilet, tv, bike]);
    }
    return rows;
  }

  function buildMaternalRows(count = 400) {
    const rand = mulberry32(202622);
    const header = ["id", "ward_id", "age", "wealth_score", "distance_km", "education_yrs", "attended_anc4"];
    const rows = [header];
    for (let i = 1; i <= count; i++) {
      const ward = `W0${Math.floor(rand() * 5) + 1}`;
      const age = Math.floor(18 + rand() * 24);
      const wealth = Number(((rand() - 0.5) * 3.2).toFixed(2));
      const dist = Number((0.4 + rand() * 8.5).toFixed(1));
      const edu = Math.max(0, Math.min(16, Math.round(5 + rand() * 8 + wealth * 1.4)));
      const logit = -0.3 + 0.55 * wealth - 0.22 * dist + 0.12 * edu;
      const prob = 1 / (1 + Math.exp(-logit));
      const anc4 = rand() < prob ? 1 : 0;
      rows.push([`SYN_MOT_${String(i).padStart(4, "0")}`, ward, age, wealth, dist, edu, anc4]);
    }
    return rows;
  }

  function getSandboxRows(id) {
    return id === "household-pca" ? buildHouseholdRows(500) : buildMaternalRows(400);
  }

  // 1. Render Open Health Data Sources
  const scopes = ["All", ...new Set((data.sources || []).map((s) => s.scope))];

  function renderSources() {
    sourceFilters.replaceChildren();
    for (const scope of scopes) {
      const btn = el("button", `tag${scope === activeScope ? " active" : ""}`, scope);
      btn.type = "button";
      btn.addEventListener("click", () => {
        activeScope = scope;
        renderSources();
      });
      sourceFilters.append(btn);
    }

    const visible = activeScope === "All"
      ? (data.sources || [])
      : (data.sources || []).filter((s) => s.scope === activeScope);

    sourceCount.textContent = `${visible.length} of ${(data.sources || []).length} sources`;
    sourceGrid.replaceChildren();

    for (const src of visible) {
      const card = el("article", "project-card tool-card");
      const top = el("div", "card-top");
      top.append(el("span", "year-pill", src.scope));
      top.append(el("span", "file-total", src.type));
      card.append(top);
      card.append(el("h3", "", src.name));
      card.append(el("p", "project-desc", src.description));
      const link = el("a", "btn-link tool-link", src.label);
      link.href = src.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.append(link);
      sourceGrid.append(card);
    }
  }

  // 2. Render Data Standards + Citation + Codebook Template
  for (const item of data.standards || []) {
    const card = el("article", "project-card pillar-card");
    const top = el("div", "card-top");
    top.append(el("span", "year-pill", item.badge));
    top.append(el("span", "file-total", item.tag));
    card.append(top);
    card.append(el("h3", "", item.title));
    card.append(el("p", "project-desc", item.summary));
    const ul = el("ul", "pillar-topics");
    for (const pt of item.points) ul.append(el("li", "", pt));
    card.append(ul);
    standardsGrid.append(card);
  }

  citationSample.textContent = data.citationSample || "";

  copyCitationBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(data.citationSample || "");
      copyCitationBtn.textContent = "Copied citation!";
      setTimeout(() => { copyCitationBtn.textContent = "Copy citation"; }, 1800);
    } catch {
      copyCitationBtn.textContent = "Copy manually";
    }
  });

  downloadCodebookBtn.addEventListener("click", () => {
    const templateRows = [
      ["variable_name", "label", "data_type", "allowed_values_or_range", "missing_codes", "privacy_level", "notes"],
      ["hh_id", "Unique anonymized household ID", "string", "SYN_HH_0001...", "None", "De-identified", "Never use national ID or phone"],
      ["ward_no", "Administrative ward number", "integer", "1-32", "-99", "Public aggregate", "Safe for ward-level mapping"],
      ["interview_date", "Date of household interview", "date", "YYYY-MM-DD", "-99", "De-identified", "ISO-8601 format"],
      ["has_electricity", "Household has electricity access", "binary", "0=No; 1=Yes", "-99=Refused; -88=DK", "Public", "Used in PCA wealth index"]
    ];
    downloadCsv("herd_codebook_template.csv", templateRows);
  });

  // 3. Render Synthetic Practice Sandbox
  for (const item of data.sandbox || []) {
    const card = el("article", "project-card");
    const top = el("div", "card-top");
    top.append(el("span", "year-pill", item.badge));
    top.append(el("span", "file-total", ".csv"));
    card.append(top);
    card.append(el("h3", "", item.title));
    card.append(el("p", "project-desc", item.description));

    const ul = el("ul", "pillar-topics");
    for (const task of item.tasks) ul.append(el("li", "", task));
    card.append(ul);

    const actions = el("div", "sandbox-actions");
    const dlBtn = el("button", "btn-link sandbox-btn", "Download practice CSV");
    dlBtn.type = "button";
    dlBtn.addEventListener("click", () => downloadCsv(item.filename, getSandboxRows(item.id)));

    const previewBtn = el("button", "btn-link sandbox-btn", "Preview 6 rows");
    previewBtn.type = "button";

    const labLink = el("a", "tree-file-link", "Open matching code →");
    labLink.href = item.labLink;

    actions.append(dlBtn, previewBtn, labLink);
    card.append(actions);

    const previewWrap = el("div", "sandbox-preview");
    previewWrap.hidden = true;

    previewBtn.addEventListener("click", () => {
      if (!previewWrap.hidden) {
        previewWrap.hidden = true;
        previewBtn.textContent = "Preview 6 rows";
        return;
      }
      const rows = getSandboxRows(item.id).slice(0, 7);
      const table = el("table", "preview-table");
      const thead = el("thead");
      const hr = el("tr");
      for (const h of rows[0]) hr.append(el("th", "", h));
      thead.append(hr);
      const tbody = el("tbody");
      for (const r of rows.slice(1)) {
        const tr = el("tr");
        for (const c of r) tr.append(el("td", "", c));
        tbody.append(tr);
      }
      table.append(thead, tbody);
      previewWrap.replaceChildren(table);
      previewWrap.hidden = false;
      previewBtn.textContent = "Hide preview";
    });

    card.append(previewWrap);
    sandboxGrid.append(card);
  }

  // 4. Render Team & Collaboration Pathway
  for (const member of data.team || []) {
    const card = el("article", "project-card tool-card");
    const top = el("div", "card-top");
    top.append(el("span", "year-pill", member.role));
    top.append(el("span", "file-total", member.type));
    card.append(top);
    card.append(el("h3", "", member.name));
    card.append(el("p", "project-desc", member.bio));
    const link = el("a", "btn-link tool-link", member.linkLabel);
    link.href = member.link;
    if (/^https?:/.test(member.link)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    card.append(link);
    teamGrid.append(card);
  }

  for (const step of data.pathway || []) {
    const box = el("div", "pathway-step");
    box.append(el("span", "year-pill", `Step ${step.step}`));
    box.append(el("strong", "", step.title));
    box.append(el("p", "", step.text));
    pathwaySteps.append(box);
  }

  renderSources();
})();
