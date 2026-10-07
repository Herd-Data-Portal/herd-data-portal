(() => {
  "use strict";

  const catalog = window.HERD_CATALOG || { mode: "public", years: [], projects: [] };
  const isReview = catalog.mode === "review";
  const projects = Array.isArray(catalog.projects) ? catalog.projects : [];
  const search = document.getElementById("search");
  const year = document.getElementById("year");
  const includeEmpty = document.getElementById("include-empty");
  const list = document.getElementById("project-list");
  const emptyState = document.getElementById("empty-state");

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

  function renderProject(project) {
    const card = element("article", "project-card");
    const top = element("div", "card-top");
    const files = Array.isArray(project.files) ? project.files : [];
    top.append(element("span", "year-pill", project.year));
    top.append(element("span", "file-total", `${files.length} file${files.length === 1 ? "" : "s"} found`));
    card.append(top);
    card.append(element("h3", "", project.title || project.folderName || "Untitled project"));
    if (project.description && !isReview) {
      card.append(element("p", "project-desc", project.description));
    } else {
      card.append(element("p", "folder-label", isReview ? "Folder label — project title and year not yet verified" : "HERD International project"));
    }
    const groupText = (project.groups || []).map((group) => `${group.name}: ${group.count}`).join(" · ");
    card.append(element("p", `resource-line${files.length ? "" : " muted"}`, files.length ? groupText || "Files available for review" : "No files found in this local folder; this does not prove that the project has no data."));

    if (project.types && project.types.length) {
      const types = element("div", "type-list");
      for (const type of project.types) types.append(element("span", "type-tag", `${type.name.toUpperCase()} ${type.count}`));
      card.append(types);
    }

    const foot = element("div", "card-foot");
    foot.append(element("span", "", isReview ? "All access decisions pending HERD review" : "Only approved records and links are published"));
    card.append(foot);

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
    const filtered = projects.filter((project) => {
      if (year.value && String(project.year) !== year.value) return false;
      if (!includeEmpty.checked && !(project.files || []).length) return false;
      if (!query) return true;
      const haystack = [project.title, project.folderName, project.year,
        ...(project.types || []).map((type) => type.name),
        ...(project.groups || []).map((group) => group.name),
        ...(project.files || []).map((file) => file.name)
      ].join(" ").toLocaleLowerCase();
      return haystack.includes(query);
    });
    list.replaceChildren(...filtered.map(renderProject));
    emptyState.hidden = filtered.length > 0;
    document.getElementById("result-count").textContent = `${filtered.length} of ${projects.length} project folders`;
  }

  for (const control of [search, year, includeEmpty]) {
    control.addEventListener(control === search ? "input" : "change", render);
  }
  render();
})();
