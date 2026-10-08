window.HERD_CATALOG = {
  mode: "public",
  years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
  requestFormUrl: "https://forms.cloud.microsoft/r/sdQecHfi3H",
  projects: [
    {
      year: 2020,
      title: "CHORUS",
      folderName: "CHORUS_2020",
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
      description: "The REACT project which stands for Resilient and Equitable Health Workforce to Address Climate Threats is a four-year research initiative (2025–2028) aimed at strengthening the capacity and responsiveness of the health workforce to withstand climate-related health crises. The project is carried out by an international consortium that includes the Liverpool School of Tropical Medicine (LSTM) in the UK, CeSHHAR in Zimbabwe, and HERD International in Nepal. In Nepal, HERD International focuses its research and interventions in specific local regions namely Chandannath Municipality and Ghorahi Sub-metropolitan City—to evaluate health system climate preparedness, co-design gender-equitable and context-sensitive local solutions, and promote evidence-based policy uptake to build long-term institutional resilience against climate shocks",
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
    }
  ]
};
