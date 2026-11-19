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
          "ReBUILD for Resilience is an international research consortium funded by the UK government, dedicated to strengthening resilience and building stronger systems for health across multiple levels and sectors in fragile and shock-prone settings, namely Lebanon, Myanmar, Nepal and Sierra Leone.",
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
            name: "Community Mapping Questionnaire",
            group: "Tools",
            subfolder: "Quantitative Tools",
            type: ".docx",
            access: "public",
            publicUrl: "https://zenodo.org/records/24365313/files/Community%20Mapping%20Questionnaire.pdf?download=1"
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

 // A4A_2024 
      createProject({
        year: 2024,
        title: "A4A",
        folderName: "A4A_2020",
        themes: ["Health Systems Strengthening", "Digital Solution"],
        description:
          "Analysis for Action is a five-year project (2023 to 2028), funded by Wellcome, which aims to equip National Statistical Offices (NSOs) with skills and tools to support evidence-based preparedness and response to health emergencies.",
        files: [
          {
            name: "A4A Report",
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
            access: "public",
            publicUrl: "https://zenodo.org/records/24365495/files/Questionnaire_English.docx?download=1"
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

       // PVS_2023 
      createProject({
        year: 2023,
        title: "PVS",
        folderName: "PVS_2023",
        themes: ["Health Systems Strengthening", "Livelihoods and Health"],
        description:
          "Healthcare accessibility is increasing worldwide as nations strive for Universal Health Coverage (UHC). However, access alone does not always translate to better health outcomes. Each year, five million people die from treatable conditions despite seeking medical care, highlighting critical gaps in the quality of care. This issue highlights the need for comprehensive assessments of health system performance that encompass both access and quality of care.",
        files: [
          {
            name: "PVS Report",
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

       // USAID_HL_2024
      createProject({
        year: 2024,
        title: "USAID Health Learning",
        folderName: "USAID_HL_2024",
        themes: ["Health Systems Strengthening", "Livelihoods and Health"],
        description:
          "USAID/Nepal awarded the five-year USAID Health Learning to HERD International in August 2024. USAID Health Learning assists USAID/Nepal’s Health Office and its implementing partners to adopt uniform and systematic Monitoring, Evaluation, Research and Learning (MERL) approaches and advance broader organizational learning and development objectives.",
        files: [
          {
            name: "USAID HL Report",
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
