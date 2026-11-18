// Public catalogue — safe to publish.
// Add records only after HERD approves each public title, description, access status and URL.
// Private files: access "request" + publicUrl "" (never a OneDrive or local path).

(() => {
  // 1. Master folder & subfolder template (edit spelling ONLY here)
  const STANDARD_FOLDERS = [
    {
      name: "Data Collection Tools",
      groupKey: "Tools", // matches existing file.group: "Tools"
      subfolders: [
        { name: "Qualitative Tools" },
        { name: "Quantitative Tools" }
      ]
    },
    {
      name: "Datasets",
      groupKey: "Datasets",
      subfolders: [
        { name: "Final datasets" },
        { name: "GPS data" },
        { name: "Qualitative data" },
        { name: "Raw datasets" },
        { name: "Syntax" },
        { name: "Urban Health Equity Data" }
      ]
    },
    { name: "Field Manual", groupKey: "Field Manual", subfolders: [] },
    { name: "Others", groupKey: "Others", subfolders: [] },
    { name: "Publications", groupKey: "Publications", subfolders: [] },
    { name: "Report", groupKey: "Report", subfolders: [] }
  ];

  // Deep-clone helper so each project gets its own clean folder structure
  const createFolders = () => JSON.parse(JSON.stringify(STANDARD_FOLDERS));

  // Auto-calculate file type counts & group counts from files[]
  const buildCounts = (files, key) => {
    const map = new Map();
    for (const file of files) {
      const value = file[key];
      if (!value) continue;
      map.set(value, (map.get(value) || 0) + 1);
    }
    return Array.from(map, ([name, count]) => ({ name, count }));
  };

  // Helper to construct each project cleanly
  const createProject = ({ year, title, folderName, themes, description, files = [] }) => ({
    year,
    title,
    folderName,
    themes,
    folders: createFolders(),
    description,
    types: buildCounts(files, "type"),
    groups: buildCounts(files, "group"),
    files
  });

  // 2. Project Catalogue Data
  const catalog = {
    mode: "public",
    years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
    requestFormUrl: "https://forms.cloud.microsoft/r/sdQecHfi3H",
    projects: [
      createProject({
        year: 2020,
        title: "CHORUS II",
        folderName: "CHORUS_2020",
        themes: ["Digital Solution"],
        description:
          "CHORUS is a community health research project conducted in Budhanilkantha Ward 4 & 7. It includes household census data, family health records, GPS mapping data, and analysis code. Report and summary outputs are available; full datasets are available on request.",
        files: [
          {
            name: "CHORUS Report",
            group: "Report",
            subfolder: "",
            type: ".pdf",
            access: "public",
            publicUrl: "https://zenodo.org/records/24332463/files/chorus-report.pdf?download=1"
          },
          {
            name: "Survey Questionnaire",
            group: "Tools",
            subfolder: "Quantitative Tools",
            type: ".docx",
            access: "request",
            publicUrl: ""
          },
          {
            name: "Qualitative Interview Guide",
            group: "Tools",
            subfolder: "Qualitative Tools",
            type: ".docx",
            access: "request",
            publicUrl: ""
          },
          {
            name: "Household Survey Data",
            group: "Datasets",
            subfolder: "Final datasets",
            type: ".csv",
            access: "request",
            publicUrl: ""
          },
          {
            name: "CHORUS Analysis Syntax",
            group: "Datasets",
            subfolder: "Syntax",
            type: ".do",
            access: "public",
            publicUrl: "" // TODO: Add Zenodo URL when uploaded
          }
        ]
      }),

      // R4R_2020 
      createProject({
        year: 2020,
        title: "R4R",
        folderName: "R4R_2020",
        themes: ["Climate Change and Health", "Health Systems Strengthening", 'Livelihoods and Health'],
        description:
          "ReBUILD for Resilience is an international research consortium funded by the UK government, dedicated to strengthening resilience and building stronger systems for health across multiple levels and sectors in fragile and shock-prone settings, namely Lebanon, Myanmar, Nepal and Sierra Leone. These settings face significant challenges due to fragility, violence, conflict and other shocks, eroding efforts to build healthy, equitable and prosperous societies. Innovative, timely and contextually tailored evidence generated in partnership with key local and national stakeholders is critical to developing and sustaining resilient health systems, which are currently lacking in these regions. Through this consortium, we aim to generate high quality, practical, multidisciplinary, operationally-relevant and scalable health system research in these settings.",
        files: [
          {
            name: "R4R Report",
            group: "Report",
            subfolder: "",
            type: ".pdf",
            access: "public",
            publicUrl: "https://zenodo.org/records/24332463/files/chorus-report.pdf?download=1"
          },
          {
            name: "Survey Questionnaire",
            group: "Tools",
            subfolder: "Quantitative Tools",
            type: ".docx",
            access: "request",
            publicUrl: ""
          },
          {
            name: "Qualitative Interview Guide",
            group: "Tools",
            subfolder: "Qualitative Tools",
            type: ".docx",
            access: "request",
            publicUrl: ""
          },
          {
            name: "Household Survey Data",
            group: "Datasets",
            subfolder: "Final datasets",
            type: ".csv",
            access: "request",
            publicUrl: ""
          },
          {
            name: "CHORUS Analysis Syntax",
            group: "Datasets",
            subfolder: "Syntax",
            type: ".do",
            access: "public",
            publicUrl: "" // TODO: Add Zenodo URL when uploaded
          }
        ]
      }),

      createProject({
        year: 2020,
        title: "AMR AHRC",
        folderName: "AMR_AHRC_2020",
        themes: ["Antimicrobial Resistance (AMR)", "Health Systems Strengthening"],
        description:
          "AMR AHRC is HERD's antimicrobial resistance research programme, covering qualitative and quantitative data collection instruments, field implementation materials, and project datasets.",
        files: []
      })
    ]
  };

  // 3. Automatic Naming Convention Validator (check Browser Console F12)
  const validGroups = new Map(
    STANDARD_FOLDERS.map((f) => [f.groupKey, new Set(f.subfolders.map((s) => s.name))])
  );

  for (const project of catalog.projects) {
    if (!/^[A-Z0-9_]+_\d{4}$/.test(project.folderName)) {
      console.warn(`[HERD Catalog] "${project.folderName}" should follow PROJECTCODE_YEAR (e.g. CHORUS_2020).`);
    }

    for (const file of project.files) {
      if (!validGroups.has(file.group)) {
        console.warn(`[HERD Catalog] Invalid group "${file.group}" on "${file.name}" in ${project.title}.`);
      } else {
        const allowedSubs = validGroups.get(file.group);
        if (file.subfolder && !allowedSubs.has(file.subfolder)) {
          console.warn(
            `[HERD Catalog] Invalid subfolder "${file.subfolder}" under "${file.group}" on "${file.name}". Allowed: ${[...allowedSubs].join(", ") || "none"}`
          );
        }
      }

      if (!file.type.startsWith(".")) {
        console.warn(`[HERD Catalog] File type "${file.type}" on "${file.name}" should start with a dot (e.g. ".pdf").`);
      }

      if (file.access === "public" && !file.publicUrl) {
        console.warn(`[HERD Catalog] Public file "${file.name}" in ${project.title} is missing a Zenodo publicUrl.`);
      }

      if (file.access === "request" && file.publicUrl) {
        console.warn(`[HERD Catalog] Request-only file "${file.name}" in ${project.title} must have an empty publicUrl.`);
      }
    }
  }

  window.HERD_CATALOG = catalog;
})();
