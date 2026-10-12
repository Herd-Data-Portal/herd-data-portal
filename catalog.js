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
      description: "CHORUS is a community health research project conducted in Budhanilkantha Ward 4 & 7. It includes household census data, family health records, GPS mapping data, and analysis code. Report and summary outputs are available; full datasets are available on request.",
      types: [{ name: ".pdf", count: 1 }, { name: ".csv", count: 1 }, { name: ".xlsx", count: 1 }],
      groups: [{ name: "Report", count: 1 }, { name: "Datasets", count: 3 }, { name: "Tools", count: 2 }],
      files: [
        {
          name: "CHORUS Report.pdf",
          group: "Report",
          type: ".pdf",
          access: "public",
          publicUrl: "./files/CHORUS_2020/chorus-report.pdf"
        },
        {
          name: "Survey Questionnaire",
          group: "Tools",
          type: ".docx",
          access: "public",
          publicUrl: "./files/CHORUS_2020/questionnaire.docx"
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
      description: "REACT (Resilient and Equitable Health Workforce to Address Climate Threats) is a four-year research initiative (2025-2028) led by the Liverpool School of Tropical Medicine with CeSHHAR Zimbabwe and HERD International Nepal. In Nepal, HERD works in Chandannath Municipality and Ghorahi Sub-metropolitan City to strengthen health-system climate preparedness, co-design gender-equitable local solutions, and support evidence-based policy uptake.",
      types: [{ name: ".pdf", count: 1 }, { name: ".xlsx", count: 1 }],
      groups: [{ name: "Report", count: 1 }, { name: "Datasets", count: 1 }],
      files: [
        {
          name: "REACT Project Report.pdf",
          group: "Report",
          type: ".pdf",
          access: "public",
          publicUrl: "./files/REACT_2024/react-report.pdf"
        },
        {
          name: "REACT Research Data",
          group: "Datasets",
          type: ".xlsx",
          access: "request",
          publicUrl: ""
        }
      ]
    }
  ]
};