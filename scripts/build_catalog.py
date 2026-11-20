import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SETTINGS_FILE = ROOT / "data" / "settings.json"
PROJECTS_DIR = ROOT / "data" / "projects"
OUTPUT_FILE = ROOT / "catalog.js"

STANDARD_FOLDERS = [
    {
        "name": "Data Collection Tools",
        "groupKey": "Tools",
        "subfolders": [
            {"name": "Qualitative Tools"},
            {"name": "Quantitative Tools"},
        ],
    },
    {
        "name": "Datasets",
        "groupKey": "Datasets",
        "subfolders": [
            {"name": "Final datasets"},
            {"name": "GPS data"},
            {"name": "Qualitative data"},
            {"name": "Raw datasets"},
            {"name": "Syntax"},
            {"name": "Urban Health Equity Data"},
        ],
    },
    {"name": "Field Manual", "groupKey": "Field Manual", "subfolders": []},
    {"name": "Others", "groupKey": "Others", "subfolders": []},
    {"name": "Publications", "groupKey": "Publications", "subfolders": []},
    {"name": "Report", "groupKey": "Report", "subfolders": []},
]


def build_counts(files: list[dict], key: str) -> list[dict]:
    counts = Counter(f.get(key) for f in files if f.get(key))
    return [{"name": k, "count": v} for k, v in counts.items()]


def main() -> None:
    settings = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
    projects = []

    for json_file in sorted(PROJECTS_DIR.glob("*.json")):
        raw = json.loads(json_file.read_text(encoding="utf-8"))
        files = raw.get("files") or []

        # Ensure clean defaults if optional fields were omitted in CMS
        cleaned_files = []
        for f in files:
            cleaned_files.append({
                "name": f.get("name", ""),
                "group": f.get("group", "Others"),
                "subfolder": f.get("subfolder") or "",
                "type": f.get("type", ""),
                "access": f.get("access", "request"),
                "publicUrl": (f.get("publicUrl") or "") if f.get("access") == "public" else "",
            })

        projects.append({
            "year": int(raw["year"]),
            "title": raw.get("title", raw.get("folderName", "Untitled")),
            "folderName": raw.get("folderName", json_file.stem),
            "themes": raw.get("themes") or [],
            "folders": STANDARD_FOLDERS,
            "description": raw.get("description", ""),
            "types": build_counts(cleaned_files, "type"),
            "groups": build_counts(cleaned_files, "group"),
            "files": cleaned_files,
        })

    # Sort newest year first, then alphabetically by title
    projects.sort(key=lambda p: (-p["year"], p["title"].lower()))

    catalog = {
        "mode": settings.get("mode", "public"),
        "years": settings.get("years", []),
        "requestFormUrl": settings.get("requestFormUrl", ""),
        "projects": projects,
    }

    js_output = (
        "// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY.\n"
        "// Edit entries via Pages CMS or data/projects/*.json.\n"
        f"window.HERD_CATALOG = {json.dumps(catalog, indent=2, ensure_ascii=False)};\n"
    )
    OUTPUT_FILE.write_text(js_output, encoding="utf-8")
    print(f"Built {OUTPUT_FILE.name} with {len(projects)} projects.")


if __name__ == "__main__":
    main()
