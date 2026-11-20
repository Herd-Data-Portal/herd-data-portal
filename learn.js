(() => {
  "use strict";

  const data = window.HERD_LEARN_DATA || { pillars: [], labs: [], tools: [] };
  const pillarGrid = document.getElementById("pillar-grid");
  const labTopicsEl = document.getElementById("lab-topics");
  const labBadge = document.getElementById("lab-badge");
  const labHeading = document.getElementById("lab-heading");
  const labSummary = document.getElementById("lab-summary");
  const labLangs = document.getElementById("lab-langs");
  const codeFilename = document.getElementById("code-filename");
  const labCode = document.getElementById("lab-code");
  const labWhen = document.getElementById("lab-when");
  const labPitfall = document.getElementById("lab-pitfall");
  const copyBtn = document.getElementById("copy-code-btn");
  const toolFilters = document.getElementById("tool-filters");
  const toolGrid = document.getElementById("tool-grid");
  const toolCount = document.getElementById("tool-count");

  let activeLabId = data.labs[0]?.id || "";
  let activeLang = "stata";
  let activeToolCat = "All";

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  // 1. Render 6 Curriculum Pillars
  for (const pillar of data.pillars) {
    const card = el("article", "project-card pillar-card");
    const top = el("div", "card-top");
    top.append(el("span", "year-pill", `Pillar ${pillar.number}`));
    top.append(el("span", "file-total", pillar.level));
    card.append(top);
    card.append(el("h3", "", pillar.title));
    card.append(el("p", "project-desc", pillar.summary));

    const ul = el("ul", "pillar-topics");
    for (const topic of pillar.topics) {
      ul.append(el("li", "", topic));
    }
    card.append(ul);
    pillarGrid.append(card);
  }

  // 2. Render Interactive Code Lab
  const LANG_LABELS = { stata: "Stata (.do)", r: "R (.R)", python: "Python (.py)" };

  function renderLab() {
    const lab = data.labs.find((item) => item.id === activeLabId) || data.labs[0];
    if (!lab) return;

    labTopicsEl.replaceChildren();
    for (const item of data.labs) {
      const btn = el("button", `tag${item.id === lab.id ? " active" : ""}`, item.title.split("—")[0].trim());
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(item.id === lab.id));
      btn.addEventListener("click", () => {
        activeLabId = item.id;
        if (!item.code[activeLang]) {
          activeLang = Object.keys(item.code)[0];
        }
        renderLab();
      });
      labTopicsEl.append(btn);
    }

    if (!lab.code[activeLang]) activeLang = Object.keys(lab.code)[0];

    labBadge.textContent = lab.badge;
    labHeading.textContent = lab.title;
    labSummary.textContent = lab.summary;
    labWhen.textContent = lab.when;
    labPitfall.textContent = lab.pitfall;

    labLangs.replaceChildren();
    for (const langKey of Object.keys(lab.code)) {
      const btn = el("button", `lang-tab${langKey === activeLang ? " active" : ""}`, LANG_LABELS[langKey] || langKey);
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(langKey === activeLang));
      btn.addEventListener("click", () => {
        activeLang = langKey;
        renderLab();
      });
      labLangs.append(btn);
    }

    const current = lab.code[activeLang];
    codeFilename.textContent = current.filename;
    labCode.textContent = current.snippet;
    copyBtn.textContent = "Copy code";
  }

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(labCode.textContent || "");
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = "Copy code"; }, 1800);
    } catch {
      copyBtn.textContent = "Select & copy";
    }
  });

  // 3. Render Filterable Toolkit
  const categories = ["All", ...new Set(data.tools.map((t) => t.category))];

  function renderTools() {
    toolFilters.replaceChildren();
    for (const cat of categories) {
      const btn = el("button", `tag${cat === activeToolCat ? " active" : ""}`, cat);
      btn.type = "button";
      btn.addEventListener("click", () => {
        activeToolCat = cat;
        renderTools();
      });
      toolFilters.append(btn);
    }

    const visible = activeToolCat === "All"
      ? data.tools
      : data.tools.filter((t) => t.category === activeToolCat);

    toolCount.textContent = `${visible.length} of ${data.tools.length} resources`;
    toolGrid.replaceChildren();

    for (const tool of visible) {
      const card = el("article", "project-card tool-card");
      const top = el("div", "card-top");
      top.append(el("span", "year-pill", tool.category));
      top.append(el("span", "file-total", tool.type));
      card.append(top);
      card.append(el("h3", "", tool.name));
      card.append(el("p", "project-desc", tool.description));

      const link = el("a", "btn-link tool-link", tool.label);
      link.href = tool.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.append(link);

      toolGrid.append(card);
    }
  }

  renderLab();
  renderTools();
})();
