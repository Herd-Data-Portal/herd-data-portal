// Public catalogue — safe to publish.
// Add records only after HERD approves each public title, description, access status and URL.
// Private files: access "request" + publicUrl "" (never a OneDrive or local path).
window.HERD_CATALOG = {
  mode: "public",
  years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
  requestFormUrl: "https://forms.cloud.microsoft/r/sdQecHfi3H",
  projects: [
    {
      year: 2020,
      title: "CHORUS",
      folderName: "CHORUS_2020",
      themes: ["Digital Solution"],
      folders: [
        { name: "Data Collection Tools" },
        { name: "Datasets" },
        { name: "Field Manual" },
        { name: "Others" },
        { name: "Publications" },
        { name: "Report" }
      ],
      description: "CHORUS is a community health research project conducted in Budhanilkantha Ward 4 & 7. It includes household census data, family health records, GPS mapping data, and analysis code. Report and summary outputs are available; full datasets are available on request.",
      types: [{ name: ".pdf", count: 1 }, { name: ".csv", count: 1 }, { name: ".xlsx", count: 1 }],
      groups: [{ name: "Report", count: 1 }, { name: "Datasets", count: 3 }, { name: "Tools", count: 2 }],
      files: [
        {
          name: "CHORUS Report.pdf",
          group: "Report",
          type: ".pdf",
          access: "public",
          publicUrl: "./files/CHORUS_2020/Report/chorus-report.pdf"
        },
        {
          name: "Survey Questionnaire",
          group: "Tools",
          type: ".docx",
          access: "request",
          publicUrl: ""
        },
        {
          name: "Household Survey Data",
          group: "Datasets",
          type: ".csv",
          access: "request",
          publicUrl: ""
        }
      ]
    },
    {
      year: 2024,
      title: "REACT",
      folderName: "REACT_2024",
      themes: ["Climate Change and Health", "Health Systems Strengthening"],
      folders: [
        { name: "Data Collection Tools" },
        { name: "Datasets" },
        { name: "Field Manual" },
        { name: "Others" },
        { name: "Publications" },
        { name: "Report" }
      ],
      description: "REACT (Resilient and Equitable Health Workforce to Address Climate Threats) is a four-year research initiative (2025-2028) led by the Liverpool School of Tropical Medicine with CeSHHAR Zimbabwe and HERD International Nepal. In Nepal, HERD works in Chandannath Municipality and Ghorahi Sub-metropolitan City to strengthen health-system climate preparedness, co-design gender-equitable local solutions, and support evidence-based policy uptake.",
      types: [{ name: ".pdf", count: 1 }, { name: ".xlsx", count: 1 }],
      groups: [{ name: "Report", count: 1 }, { name: "Datasets", count: 1 }],
      files: [
        {
          name: "REACT Project Report.pdf",
          group: "Report",
          type: ".pdf",
          access: "request",
          publicUrl: ""
        },
        {
          name: "REACT Research Data",
          group: "Datasets",
          type: ".xlsx",
          access: "request",
          publicUrl: ""
        }
      ]
    },
    {
      year: 2020,
      title: "AMR AHRC",
      folderName: "AMR_AHRC_2020",
      themes: ["Antimicrobial Resistance (AMR)", "Health Systems Strengthening"],
      description: "AMR AHRC is HERD's antimicrobial resistance research programme, covering qualitative and quantitative data collection instruments, field implementation materials, and project datasets.",
      folders: [
        { name: "Data Collection Tools" },
        { name: "Datasets" },
        { name: "Field Manual" },
        { name: "Others" },
        { name: "Publications" },
        { name: "Report" }
      ],
      types: [],
      groups: [],
      files: []
    }
  ]
};