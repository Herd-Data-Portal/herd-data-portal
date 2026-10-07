window.HERD_CATALOG = {
  mode: "public",
  years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
  requestFormUrl: "https://forms.office.com/YOUR-FORM-LINK",
  projects: [
    {
      year: 2020,
      title: "CHORUS",
      folderName: "CHORUS_2020",
      types: [{ name: ".pdf", count: 1 }],
      groups: [{ name: "Report", count: 1 }],
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
