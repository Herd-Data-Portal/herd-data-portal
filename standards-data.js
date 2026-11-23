window.HERD_STANDARDS_DATA = {
  citationSample:
    "HERD International. (2020). CHORUS (2020) — Approved Research Outputs [Dataset/Report] (Version v1.0). Zenodo. https://doi.org/10.5281/zenodo.24332463",

  sources: [
    {
      name: "National Population & Housing Census 2021 (NSO)",
      scope: "Nepal National",
      type: "Official Statistics",
      description: "Official demographic, household, education, disability, and local-level population tables published by Nepal's National Statistics Office.",
      url: "https://censusresults.nsonepal.gov.np/",
      label: "Open NSO Census"
    },
    {
      name: "Nepal Demographic & Health Survey (DHS Program)",
      scope: "Nepal National",
      type: "Household Survey",
      description: "Nationally representative indicators and microdata (upon registration) on maternal/child health, nutrition, fertility, and health equity.",
      url: "https://dhsprogram.com/",
      label: "Visit DHS Program"
    },
    {
      name: "Department of Health Services (DoHS / HMIS Nepal)",
      scope: "Nepal National",
      type: "Routine Health Data",
      description: "Annual Health Reports and national HMIS service-utilization statistics across Nepal's provinces and municipalities.",
      url: "https://dohs.gov.np/",
      label: "Visit DoHS Nepal"
    },
    {
      name: "Nepal Health Research Council (NHRC & IRERP)",
      scope: "Ethics & Policy",
      type: "Ethical Review",
      description: "National health research ethics guidelines and the Integrated Research Ethics Review Platform (IRERP) for proposal clearance.",
      url: "https://irerp.nhrc.gov.np/",
      label: "Open IRERP Portal"
    },
    {
      name: "HDX Nepal — GIS Boundaries & Open Datasets",
      scope: "GIS & Boundaries",
      type: "Spatial & P-Codes",
      description: "Open Nepal administrative boundaries, settlement P-codes, health facilities, and humanitarian datasets for spatial mapping.",
      url: "https://data.humdata.org/group/npl",
      label: "Browse HDX Nepal"
    },
    {
      name: "WHO Global Health Observatory (GHO)",
      scope: "Global Health",
      type: "Global Indicators",
      description: "Over 1,000 standardized global health, AMR, climate-health, and SDG indicators across 194 WHO Member States with API access.",
      url: "https://www.who.int/data/gho",
      label: "Explore WHO GHO"
    }
  ],

  standards: [
    {
      badge: "01 · Structure",
      tag: "Codebooks",
      title: "Variable Naming & Missing-Value Rules",
      summary: "Keep survey exports clean and machine-readable across Stata, R, and Python.",
      points: [
        "Use lowercase snake_case variable names (e.g., hh_size, ward_no)",
        "Use ISO-8601 dates (YYYY-MM-DD) for all interview timestamps",
        "Standardize missing codes (-99 Refused, -88 Don't know) and document in codebook",
        "Keep a matching variable dictionary (.csv/.xlsx) alongside every dataset"
      ]
    },
    {
      badge: "02 · Privacy",
      tag: "De-identification",
      title: "Participant Privacy & GPS Protection",
      summary: "Raw identifiable records stay in private institutional storage and are never published.",
      points: [
        "Strip direct identifiers (names, phone numbers, citizenship IDs, addresses)",
        "Aggregate small subgroups so no individual household can be re-identified",
        "Never share exact household GPS coordinates publicly—aggregate to Ward/Palika",
        "Inspect .ipynb notebook cell outputs before archiving code to Zenodo"
      ]
    },
    {
      badge: "03 · Reproducibility",
      tag: "FAIR Principles",
      title: "Versioning, READMEs & DOI Archiving",
      summary: "Ensure published findings remain verifiable, reusable, and properly credited.",
      points: [
        "Follow project_year_category_title_v1.0.ext naming on Zenodo",
        "Include a 00_README.md explaining software versions and script order",
        "Never overwrite old versions—increment to v1.1 or v2.0 with a changelog",
        "Separate publication metadata from restricted microdata access decisions"
      ]
    }
  ],

  sandbox: [
    {
      id: "household-pca",
      badge: "Synthetic · 500 Households",
      title: "Community Household Assets & Size Survey",
      filename: "synthetic_household_wealth_500.csv",
      description: "Simulated ward-level household asset dataset built specifically to run the PCA Wealth Index and DuckDB SQL examples from the DS & AI Hub.",
      tasks: [
        "Run PCA on the 5 asset columns and extract Wealth Quintiles (1–5)",
        "Aggregate total households & mean household_size by ward_no using DuckDB"
      ],
      labLink: "./learn.html#codelab"
    },
    {
      id: "maternal-ml",
      badge: "Synthetic · 400 Records",
      title: "Maternal Health & ANC-4 Utilization Sample",
      filename: "synthetic_anc_health_400.csv",
      description: "Simulated tabular health dataset for practicing stratified train/test splits, Logistic Regression, Random Forests, SHAP explainability, and Ward aggregation.",
      tasks: [
        "Predict attended_anc4 using age, wealth_score, distance_km, and education_yrs",
        "Compute ROC-AUC and check how distance_km affects predicted probability"
      ],
      labLink: "./learn.html#codelab"
    }
  ],

  team: [
    {
      role: "Research & Analytics",
      type: "Centre for Data Science",
      name: "HERD Data Science & Analytics Team",
      bio: "Manages study data pipelines, statistical modeling, geospatial analysis, and ethical data curation across HERD's health and climate programmes.",
      link: "./index.html",
      linkLabel: "Explore Team Projects"
    },
    {
      role: "Collaboration",
      type: "Open Science & Partnerships",
      name: "Academic & NGO Collaborators",
      bio: "Joint research initiatives with international universities, local municipalities, and public health institutions across Nepal and South Asia.",
      link: "https://herdint.com/partner/",
      linkLabel: "View HERD Partners"
    },
    {
      role: "Capacity Building",
      type: "Young Researchers",
      name: "MPH, MSc & Data Science Fellows",
      bio: "Opportunities for students and early-career analysts to learn reproducible Stata/R/Python workflows and apply for mentored secondary analyses.",
      link: "./learn.html",
      linkLabel: "Visit DS & AI Hub"
    }
  ],

  pathway: [
    { step: "1", title: "Browse Catalogue", text: "Find a project and check whether the dataset is Request-only." },
    { step: "2", title: "Review Standards", text: "Prepare a brief research question and check NHRC/ethics requirements." },
    { step: "3", title: "Submit Request Form", text: "Click Request next to any dataset to send your affiliation and purpose." },
    { step: "4", title: "Analyze & Cite", text: "Upon project-owner approval, use the shared data responsibly and cite the DOI." }
  ]
};
