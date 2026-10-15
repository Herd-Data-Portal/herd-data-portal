(() => {
  "use strict";

  const catalog = window.HERD_CATALOG || { mode: "public", years: [], projects: [] };
  const isReview = catalog.mode === "review";
  const projects = Array.isArray(catalog.projects) ? catalog.projects : [];
  const search = document.getElementById("search");
  const year = document.getElementById("year");
  const typeSelect = document.getElementById("type");
  const includeEmpty = document.getElementById("include-empty");
  const list = document.getElementById("project-list");
  const emptyState = document.getElementById("empty-state");
  const themeTags = document.getElementById("theme-tags");
  let activeTheme = "";

  document.getElementById("review-notice").hidden = !isReview;
  document.querySelectorAll(".review-only").forEach((element) => { element.hidden = !isReview; });
  document.getElementById("year-count").textContent = String((catalog.years || []).length);
  document.getElementById("project-count").textContent = String(projects.length);
  document.getElementById("file-count").textContent = String(projects.reduce((sum, project) => sum + (project.files || []).length, 0));

  for (const value of catalog.years || []) {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = String(value);
    year.append(option);
  }

  const CODE_EXTENSIONS = [".r", ".rmd", ".do", ".py", ".ipynb", ".sql"];
  const CATEGORY_RULES = [
    { value: "datasets", label: "Datasets", test: /dataset|raw|final|household|census|survey data|urban health|data\b/i },
    { value: "tools", label: "Tools & questionnaires", test: /tool|manual|questionnaire|guide|instrument/i },
    { value: "reports", label: "Reports & publications", test: /report|publication|brief|factsheet|policy|output/i },
    { value: "code", label: "Code & scripts", test: /syntax|code|script|analysis/i }
  ];

  function categoryFor(file) {
    const code = CODE_EXTENSIONS.includes(String(file.type || "").toLowerCase());
    const haystack = `${file.group || ""} ${file.name || ""}`;
    const rule = CATEGORY_RULES.find((entry) => entry.test.test(haystack));
    if (rule) return rule.value;
    if (code) return "code";
    return "datasets";
  }

  function categoriesFor(project) {
    const found = new Set((project.files || []).map(categoryFor));
    return [...found];
  }

  const availableCategories = [...new Set(projects.flatMap(categoriesFor))];
  for (const value of availableCategories.sort()) {
    const label = (CATEGORY_RULES.find((entry) => entry.value === value) || { label: value }).label;
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    typeSelect.append(option);
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function safeUrl(url) {
    if (!url || typeof url !== "string") return null;
    try {
      const parsed = new URL(url, document.baseURI);
      return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : null;
    } catch {
      return null;
    }
  }

  function renderFile(file) {
    const item = element("li");
    const status = file.access === "public" ? "Approved public download" : file.access === "request" ? "Request-only" : "Unreviewed; not downloadable";
    item.append(element("strong", "", file.name));
    item.append(element("small", "", `${file.group || "Project root"} · ${file.type || "File"} · ${status}`));
    if (!isReview && file.access === "public") {
      const target = safeUrl(file.publicUrl);
      if (target) {
        const link = element("a", "", "Download approved file");
        link.href = target;
        link.rel = "noopener noreferrer";
        item.append(link);
      }
    }
    if (!isReview && file.access === "request") {
      const target = safeUrl(catalog.requestFormUrl);
      if (target) {
        const link = element("a", "", "Request access");
        link.href = target;
        link.rel = "noopener noreferrer";
        item.append(link);
      }
    }
    return item;
  }

  function renderTree(nodes) {
    const list = element("ul", "tree");
    for (const node of nodes || []) {
      const item = element("li");
      item.append(element("span", "tree-label", node.name));
      if (node.count) item.append(element("span", "tree-count", `${node.count} item${node.count === 1 ? "" : "s"}`));
      if (node.subfolders && node.subfolders.length) item.append(renderTree(node.subfolders));
      list.append(item);
    }
    return list;
  }

  function contentsFor(project) {
    const files = Array.isArray(project.files) ? project.files : [];
    if (files.length) {
      const counts = new Map();
      for (const file of files) {
        const name = file.group || "Project root";
        counts.set(name, (counts.get(name) || 0) + 1);
      }
      return [...counts].map(([name, count]) => ({ name, count, listed: true }));
    }
    return (project.folders || []).map((folder) => ({ name: folder.name, count: 0, listed: false }));
  }

  function renderProject(project) {
    const card = element("article", "project-card");
    const top = element("div", "card-top");
    const files = Array.isArray(project.files) ? project.files : [];
    top.append(element("span", "year-pill", project.year));
    top.append(element("span", "file-total", `${files.length} file${files.length === 1 ? "" : "s"} found`));
    card.append(top);
    if (project.themes && project.themes.length && !isReview) {
      const themeRow = element("div", "theme-chips");
      for (const theme of project.themes) themeRow.append(element("span", "theme-chip", theme));
      card.append(themeRow);
    }
    card.append(element("h3", "", project.title || project.folderName || "Untitled project"));
    if (project.description && !isReview) {
      card.append(element("p", "project-desc", project.description));
    } else {
      card.append(element("p", "folder-label", isReview ? "Folder label — project title and year not yet verified" : "HERD International project"));
    }
    const contents = contentsFor(project);
    if (contents.length) {
      const row = element("div", "contents");
      row.append(element("span", "contents-label", "Contains"));
      for (const item of contents) {
        row.append(element("span", `contents-chip${item.listed ? "" : " muted"}`,
          item.listed ? `${item.name} (${item.count})` : item.name));
      }
      card.append(row);
    }

    if (project.types && project.types.length) {
      const types = element("div", "type-list");
      for (const type of project.types) types.append(element("span", "type-tag", `${type.name.toUpperCase()} ${type.count}`));
      card.append(types);
    }

    const publicCount = files.filter((file) => file.access === "public").length;
    const requestCount = files.filter((file) => file.access === "request").length;
    if (!isReview && files.length) {
      const badges = element("div", "access-badges");
      badges.append(element("span", "badge public", `${publicCount} public download${publicCount === 1 ? "" : "s"}`));
      badges.append(element("span", "badge request", `${requestCount} available on request`));
      card.append(badges);
    }

    const foot = element("div", "card-foot");
    foot.append(element("span", "", isReview ? "All access decisions pending HERD review" : "Only approved records and links are published"));
    card.append(foot);

    if (project.folders && project.folders.length && !isReview) {
      const structure = element("details", "file-section");
      structure.append(element("summary", "", "Project folder structure"));
      structure.append(renderTree(project.folders));
      card.append(structure);
    }

    if (files.length) {
      const details = element("details", "file-section");
      details.append(element("summary", "", isReview ? "View internal file inventory" : "View listed resources"));
      const fileList = element("ul", "file-list");
      for (const file of files) fileList.append(renderFile(file));
      details.append(fileList);
      card.append(details);
    }
    return card;
  }

  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    const selectedType = typeSelect.value;
    const filtered = projects.filter((project) => {
      if (year.value && String(project.year) !== year.value) return false;
      if (activeTheme && !(project.themes || []).includes(activeTheme)) return false;
      if (!includeEmpty.checked && !(project.files || []).length) return false;
      if (selectedType && !categoriesFor(project).includes(selectedType)) return false;
      if (!query) return true;
      const haystack = [project.title, project.folderName, project.year, project.description,
        ...(project.themes || []),
        ...(project.types || []).map((type) => type.name),
        ...(project.groups || []).map((group) => group.name),
        ...(project.files || []).map((file) => file.name)
      ].filter(Boolean).join(" ").toLocaleLowerCase();
      return haystack.includes(query);
    });
    list.replaceChildren(...filtered.map(renderProject));
    emptyState.hidden = filtered.length > 0;
    document.getElementById("result-count").textContent = `${filtered.length} of ${projects.length} project folders`;
  }

  for (const control of [search, year, typeSelect, includeEmpty]) {
    control.addEventListener(control === search ? "input" : "change", render);
  }
  if (themeTags) {
    themeTags.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-theme]");
      if (!button) return;
      activeTheme = activeTheme === button.dataset.theme ? "" : button.dataset.theme;
      for (const tag of themeTags.querySelectorAll("button[data-theme]")) {
        tag.classList.toggle("active", tag.dataset.theme === activeTheme);
      }
      document.getElementById("browse-title").scrollIntoView({ behavior: "smooth", block: "start" });
      render();
    });
  }
  render();
})();