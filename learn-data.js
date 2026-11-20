window.HERD_LEARN_DATA = {
  pillars: [
    {
      number: "01",
      level: "Foundation",
      title: "Data Engineering & Reproducible Workflows",
      summary: "Turn raw field exports into clean, versioned, analysis-ready datasets.",
      topics: [
        "Missing codes (-99/999) & household roster merges",
        "DuckDB SQL queries on large CSV & Parquet files",
        "Git, GitHub & Zenodo DOI archiving",
        "Quarto & Jupyter reproducible notebooks"
      ]
    },
    {
      number: "02",
      level: "Core Statistics",
      title: "Survey Analytics & Dimensionality Reduction",
      summary: "Apply rigorous statistical methods built for clustered and household survey data.",
      topics: [
        "PCA for household Wealth / Asset Index",
        "Complex survey weights & cluster adjustments",
        "Logistic, Poisson & mixed-effects models",
        "Confidence intervals & subgroup comparisons"
      ]
    },
    {
      number: "03",
      level: "Machine Learning",
      title: "Predictive ML & Explainable AI (XAI)",
      summary: "Train reliable tabular ML models and explain predictions for policy decisions.",
      topics: [
        "Random Forests, XGBoost & LightGBM",
        "Stratified cross-validation & leakage checks",
        "Imbalanced metrics (PR-AUC, F1, calibration)",
        "SHAP values for transparent feature importance"
      ]
    },
    {
      number: "04",
      level: "Spatial Tech",
      title: "Geospatial Data Science & GIS",
      summary: "Map health indicators across wards and municipalities while protecting GPS privacy.",
      topics: [
        "GeoPandas (Python) & sf (R) shapefiles",
        "Nepal local-level (Palika & Ward) mapping",
        "Spatial joins & distance-to-facility metrics",
        "GPS geomasking & k-anonymity privacy rules"
      ]
    },
    {
      number: "05",
      level: "Applied AI & NLP",
      title: "NLP, Topic Modeling & Private Local RAG",
      summary: "Analyze qualitative text and query policy PDFs privately without cloud leaks.",
      topics: [
        "Text cleaning & TF-IDF / topic modeling",
        "Sentence embeddings & semantic document search",
        "Offline RAG over PDFs using Ollama + Chroma/DuckDB",
        "Prompt engineering for code review & documentation"
      ]
    },
    {
      number: "06",
      level: "Ethics & Open Tech",
      title: "Responsible AI, De-identification & Apps",
      summary: "Share insights safely through interactive dashboards and ethical data governance.",
      topics: [
        "PII removal & statistical disclosure control",
        "Fairness & subgroup bias auditing in ML",
        "Interactive dashboards with Streamlit & Shiny",
        "FAIR data principles & codebook standards"
      ]
    }
  ],

  labs: [
    {
      id: "pca",
      badge: "Statistics · Dimensionality Reduction",
      title: "Principal Component Analysis (PCA) — Wealth / Asset Index",
      summary: "Reduce correlated household asset variables (electricity, water source, flooring, appliances) into a single continuous index (PC1) and divide households into wealth quintiles.",
      when: "Use PCA when multiple correlated indicators measure one underlying concept (like household socioeconomic status or climate vulnerability) and you want an objective weighting.",
      pitfall: "Always standardize variables (mean 0, variance 1) before PCA—otherwise variables with larger numeric scales (like income) dominate PC1. Never run PCA on uncleaned missing codes like -99.",
      code: {
        stata: {
          filename: "01_pca_wealth_index.do",
          snippet: `* PCA Wealth / Asset Index in Stata
* 1. Check summary & ensure missing codes (-99) are recoded to (.)
summarize has_electricity piped_water flush_toilet owns_tv owns_bike

* 2. Run PCA using the correlation matrix (automatically standardizes variables)
pca has_electricity piped_water flush_toilet owns_tv owns_bike

* 3. Inspect eigenvalues (Kaiser criterion > 1) & Scree plot
screeplot, yline(1)

* 4. Extract Component 1 (PC1) as the wealth score
predict wealth_score, score

* 5. Create 5 equal Wealth Quintiles (1 = Poorest, 5 = Richest)
xtile wealth_quintile = wealth_score, nq(5)
tab wealth_quintile`
        },
        r: {
          filename: "01_pca_wealth_index.R",
          snippet: `# PCA Wealth / Asset Index in R
library(dplyr)
library(ggplot2)

assets <- df |>
  select(has_electricity, piped_water, flush_toilet, owns_tv, owns_bike) |>
  na.omit()

# 1. Run PCA with scale. = TRUE (essential to standardize variables)
pca_fit <- prcomp(assets, center = TRUE, scale. = TRUE)

# 2. Check variance explained by each component
summary(pca_fit)

# 3. Extract PC1 score & split into 5 wealth quintiles
df_scored <- df |>
  filter(complete.cases(pick(all_of(names(assets))))) |>
  mutate(
    wealth_score = pca_fit$x[, 1],
    wealth_quintile = ntile(wealth_score, 5)
  )

table(df_scored$wealth_quintile)`
        },
        python: {
          filename: "01_pca_wealth_index.py",
          snippet: `# PCA Wealth / Asset Index in Python (scikit-learn)
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

asset_cols = ["has_electricity", "piped_water", "flush_toilet", "owns_tv", "owns_bike"]
df_clean = df.dropna(subset=asset_cols).copy()

# 1. Standardize features (mean=0, std=1) before PCA
X_scaled = StandardScaler().fit_transform(df_clean[asset_cols])

# 2. Fit PCA and inspect variance explained
pca = PCA(n_components=3)
components = pca.fit_transform(X_scaled)
print("Explained variance ratio:", pca.explained_variance_ratio_)

# 3. Extract PC1 score and create 5 wealth quintiles (1 to 5)
df_clean["wealth_score"] = components[:, 0]
df_clean["wealth_quintile"] = pd.qcut(df_clean["wealth_score"], q=5, labels=[1, 2, 3, 4, 5])`
        }
      }
    },
    {
      id: "ml-shap",
      badge: "Machine Learning · Explainable AI",
      title: "Tabular Classification & SHAP Feature Explainability",
      summary: "Predict a binary health outcome using cross-validated tree models / logistic regression and explain which community or household features drove the predictions.",
      when: "Use gradient-boosted trees or Random Forests when relationships are non-linear, and pair them with SHAP values so domain researchers can interpret the drivers.",
      pitfall: "Never fit scalers, imputers, or SMOTE before splitting train/test data—that causes data leakage and produces artificially high accuracy that fails on new districts.",
      code: {
        python: {
          filename: "02_ml_xgboost_shap.py",
          snippet: `# Train/Test Split + Pipeline + SHAP Explainability in Python
import shap
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score, classification_report

X = df[["age", "wealth_score", "distance_km", "education_yrs"]]
y = df["attended_anc4"]  # Binary outcome (0/1)

# 1. Stratified split BEFORE any preprocessing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# 2. Train model
model = RandomForestClassifier(n_estimators=300, class_weight="balanced", random_state=42)
model.fit(X_train, y_train)

# 3. Evaluate with ROC-AUC (better than raw accuracy for imbalanced outcomes)
probs = model.predict_proba(X_test)[:, 1]
print(f"Test ROC-AUC: {roc_auc_score(y_test, probs):.3f}")
print(classification_report(y_test, model.predict(X_test)))

# 4. Explain predictions with SHAP
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)`
        },
        r: {
          filename: "02_ml_tidymodels.R",
          snippet: `# Stratified Split + Random Forest in R (tidymodels)
library(tidymodels)

set.seed(42)
split <- initial_split(df, prop = 0.8, strata = attended_anc4)
train_data <- training(split)
test_data  <- testing(split)

rf_spec <- rand_forest(trees = 300) |>
  set_engine("ranger", importance = "permutation") |>
  set_mode("classification")

rf_fit <- rf_spec |>
  fit(factor(attended_anc4) ~ age + wealth_score + distance_km + education_yrs, data = train_data)

preds <- predict(rf_fit, test_data, type = "prob") |>
  bind_cols(test_data)

roc_auc(preds, truth = factor(attended_anc4), .pred_1)`
        },
        stata: {
          filename: "02_logistic_baseline.do",
          snippet: `* Interpretable Baseline Classification & ROC-AUC in Stata
* Always compare complex ML models against a clean logistic baseline!
logit attended_anc4 c.age c.wealth_score c.distance_km c.education_yrs, or

* Inspect ROC curve & AUC
lroc

* Compute predicted probabilities & marginal effects
margins, dydx(*)`
        }
      }
    },
    {
      id: "gis",
      badge: "Spatial Data Science · GIS",
      title: "Ward / Municipality Mapping & Spatial Aggregation",
      summary: "Aggregate individual or household survey observations to administrative boundaries (Ward or Palika level) and plot an interpretable choropleth map without exposing raw GPS points.",
      when: "Use spatial aggregation whenever visualizing survey coverage, service access gaps, or climate indicators on a public website or report.",
      pitfall: "Never publish exact household latitude/longitude coordinates on public portals. Always aggregate to Ward/Municipality polygons or apply random spatial jitter (geomasking).",
      code: {
        python: {
          filename: "03_spatial_mapping.py",
          snippet: `# Aggregate Survey Points to Ward Polygons Safely (GeoPandas)
import geopandas as gpd
import pandas as pd

# 1. Load Ward/Municipality boundary shapefile or GeoJSON
wards = gpd.read_file("nepal_wards.geojson")  # CRS: EPSG:4326

# 2. Convert household survey CSV (with lat/lon) into a GeoDataFrame
pts = gpd.GeoDataFrame(
    df,
    geometry=gpd.points_from_xy(df["longitude"], df["latitude"]),
    crs="EPSG:4326"
)

# 3. Spatial join: match each household to its Ward polygon
joined = gpd.sjoin(pts, wards, how="inner", predicate="within")

# 4. Aggregate safely (never export raw lat/lon!)
ward_summary = (
    joined.groupby("ward_id", as_index=False)
    .agg(households=("hh_id", "count"), coverage_pct=("vaccinated", "mean"))
)

# 5. Merge back to boundaries & plot choropleth
map_df = wards.merge(ward_summary, on="ward_id", how="left")
ax = map_df.plot(column="coverage_pct", legend=True, cmap="Blues", edgecolor="#333")`
        },
        r: {
          filename: "03_spatial_mapping.R",
          snippet: `# Aggregate Survey Points to Ward Polygons Safely (sf + ggplot2)
library(sf)
library(dplyr)
library(ggplot2)

wards <- st_read("nepal_wards.geojson")
pts   <- st_as_sf(df, coords = c("longitude", "latitude"), crs = 4326)

# Spatial join & aggregate to ward level (protects household GPS privacy)
ward_summary <- st_join(pts, wards, join = st_within) |>
  st_drop_geometry() |>
  group_by(ward_id) |>
  summarise(households = n(), coverage_pct = mean(vaccinated, na.rm = TRUE))

map_df <- left_join(wards, ward_summary, by = "ward_id")

ggplot(map_df) +
  geom_sf(aes(fill = coverage_pct), color = "white", linewidth = 0.25) +
  scale_fill_viridis_c(labels = scales::percent) +
  theme_minimal()`
        },
        stata: {
          filename: "03_spatial_mapping.do",
          snippet: `* Choropleth Mapping in Stata (spmap / geoplot)
* First convert shapefile using: spshape2dta nepal_wards.shp, saving(wards)

use ward_summary.dta, clear
merge 1:1 ward_id using wards.dta

* Plot aggregated ward coverage (no raw household coordinates exposed)
spmap coverage_pct using wards_shp.dta, id(_ID) ///
    fcolor(Blues) clnumber(5) ///
    title("Survey Coverage by Ward")`
        }
      }
    },
    {
      id: "ai-rag",
      badge: "Applied AI · Privacy-First LLMs",
      title: "Private Local AI / RAG & Fast DuckDB Analytics",
      summary: "Run instant SQL analytics over large survey CSVs with DuckDB, or query research manuals locally with an offline LLM (Ollama) so sensitive text never leaves your laptop.",
      when: "Use DuckDB when Excel/pandas slows down on multi-million-row CSVs, and use local LLMs (Ollama) when summarizing internal field manuals or qualitative notes.",
      pitfall: "Public LLM web apps may log prompts or retain data. Treat any external API call just like publishing data unless an enterprise zero-retention agreement is active.",
      code: {
        python: {
          filename: "04_duckdb_and_local_ai.py",
          snippet: `# Fast Local SQL with DuckDB + Private Local LLM Query (Ollama)
import duckdb
import requests

# 1. Query large CSV/Parquet files directly using SQL (zero database setup)
summary = duckdb.sql("""
    SELECT ward_no,
           COUNT(*) AS total_hh,
           ROUND(AVG(household_size), 2) AS avg_hh_size
    FROM 'survey_final.csv'
    GROUP BY ward_no
    ORDER BY ward_no
""").df()
print(summary)

# 2. Query a local offline LLM via Ollama (100% private on your own machine)
# Requires Ollama running locally: ollama run llama3.2
resp = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "llama3.2",
        "prompt": f"Summarize key patterns from this ward aggregate table:\\n{summary.to_string()}",
        "stream": False
    }
)
print(resp.json()["response"])`
        },
        r: {
          filename: "04_duckdb_analytics.R",
          snippet: `# Fast In-Process SQL Analytics with DuckDB in R
library(duckdb)
library(DBI)

con <- dbConnect(duckdb())

# Query a large CSV directly without loading the entire file into RAM
summary_df <- dbGetQuery(con, "
  SELECT ward_no,
         COUNT(*) AS total_hh,
         ROUND(AVG(household_size), 2) AS avg_hh_size
  FROM read_csv_auto('survey_final.csv')
  GROUP BY ward_no
  ORDER BY ward_no
")

print(summary_df)
dbDisconnect(con, shutdown = TRUE)`
        },
        stata: {
          filename: "04_reproducible_summary.do",
          snippet: `* Fast Reproducible Summary Table Export in Stata
import delimited "survey_final.csv", clear

* Collapse to safe aggregated ward-level indicators before sharing
collapse (count) total_hh=hh_id (mean) avg_hh_size=household_size, by(ward_no)

export delimited using "ward_aggregate_safe.csv", replace`
        }
      }
    }
  ],

  tools: [
    {
      name: "R & CRAN",
      category: "R",
      type: "Core Language",
      description: "Statistical computing language widely used in public health, epidemiology, and survey analysis.",
      url: "https://cran.r-project.org/",
      label: "Download R"
    },
    {
      name: "RStudio Desktop (Posit)",
      category: "R",
      type: "IDE",
      description: "Standard workspace for writing R scripts, inspecting datasets, and knitting Quarto/RMarkdown reports.",
      url: "https://posit.co/download/rstudio-desktop/",
      label: "Download RStudio"
    },
    {
      name: "Python (Official)",
      category: "Python",
      type: "Core Language",
      description: "General-purpose language powering modern Machine Learning, AI, NLP, automation, and web APIs.",
      url: "https://www.python.org/downloads/",
      label: "Download Python"
    },
    {
      name: "Miniforge (Conda-Forge)",
      category: "Python",
      type: "Environment Manager",
      description: "Lightweight, open-source Python & R package manager ideal for geospatial (GeoPandas) and ML environments.",
      url: "https://github.com/conda-forge/miniforge",
      label: "GitHub Releases"
    },
    {
      name: "VS Code",
      category: "Tech & Git",
      type: "Code Editor",
      description: "Universal editor for Python, Jupyter Notebooks (.ipynb), Stata, HTML/JS, and GitHub workflows.",
      url: "https://code.visualstudio.com/",
      label: "Download VS Code"
    },
    {
      name: "Quarto",
      category: "Tech & Git",
      type: "Publishing",
      description: "Open-source scientific publishing tool that turns R, Python, and Julia code into PDFs, HTML reports, and slides.",
      url: "https://quarto.org/docs/get-started/",
      label: "Get Quarto"
    },
    {
      name: "Git",
      category: "Tech & Git",
      type: "Version Control",
      description: "Track code versions cleanly, collaborate safely, and publish reproducible repositories to GitHub & Zenodo.",
      url: "https://git-scm.com/downloads",
      label: "Download Git"
    },
    {
      name: "DuckDB",
      category: "Tech & Git",
      type: "Analytics Engine",
      description: "Blazing-fast in-process SQL engine for querying gigabyte-scale CSV and Parquet files inside R or Python.",
      url: "https://duckdb.org/",
      label: "Explore DuckDB"
    },
    {
      name: "scikit-learn & SHAP",
      category: "ML & AI",
      type: "Python Packages",
      description: "Gold-standard Python library for tabular ML pipelines paired with SHAP for transparent model explanations.",
      url: "https://scikit-learn.org/stable/",
      label: "Docs & Guides"
    },
    {
      name: "Ollama (Local LLMs)",
      category: "ML & AI",
      type: "Private AI",
      description: "Run open-weights LLMs offline on your own computer so sensitive research documents never leave your machine.",
      url: "https://ollama.com/",
      label: "Download Ollama"
    },
    {
      name: "Hugging Face Hub",
      category: "ML & AI",
      type: "AI Models & Datasets",
      description: "Open repository for pre-trained NLP, vision, and embedding models used in modern AI research.",
      url: "https://huggingface.co/",
      label: "Browse Models"
    },
    {
      name: "Posit & R Cheatsheets",
      category: "R",
      type: "Learning Resource",
      description: "One-page visual guides for tidyverse, ggplot2, sf (spatial), tidymodels, and Quarto.",
      url: "https://posit.co/resources/cheatsheets/",
      label: "View Cheatsheets"
    },
    {
      name: "UCLA OARC Stata & R Guides",
      category: "Stata",
      type: "Learning Resource",
      description: "Trusted university tutorials for Stata regression, PCA, survey weighting, and reproducible syntax.",
      url: "https://stats.oarc.ucla.edu/stata/",
      label: "Open Guides"
    },
    {
      name: "Streamlit",
      category: "Python",
      type: "Data Apps",
      description: "Build interactive Python data exploration and ML prototype web apps in pure Python scripts.",
      url: "https://streamlit.io/",
      label: "Explore Streamlit"
    }
  ]
};
