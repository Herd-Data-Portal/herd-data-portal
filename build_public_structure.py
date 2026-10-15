"""Build the public files/ structure and optionally publish it.

Creates, for every HERD project, a folder under files/<PROJECT>/ with the six
standard HERD categories. Never moves, deletes or modifies HERD source data.

    python build_public_structure.py --root "<All Project Data (2014-2026)>"

Safe by default: creates empty folders only (with .gitkeep so GitHub keeps them).
Document files are copied only when you pass --copy, and data/code files are
never copied - they stay in OneDrive and are shared on request.

    python build_public_structure.py --root "<path>" --copy --push
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

CATEGORIES = [
    "Data Collection Tools",
    "Datasets",
    "Field Manual",
    "Others",
    "Publications",
    "Report",
]

# Files that must never be copied to the public repository.
PRIVATE_SUFFIXES = {".csv", ".xlsx", ".xls", ".dta", ".sav", ".rds", ".parquet",
                    ".shp", ".dbf", ".gpx", ".kml", ".ipynb", ".r", ".rmd", ".do",
                    ".py", ".sql", ".json"}

PUBLISHABLE_SUFFIXES = {".pdf", ".docx", ".doc", ".odt", ".pptx", ".png", ".jpg", ".jpeg"}


def target_category(path: Path) -> str:
    """Map a source file to one of the six public categories."""
    name = path.name.lower()
    if path.suffix.lower() in {".pptx"} or "publication" in name or "brief" in name or "factsheet" in name:
        return "Publications"
    if "manual" in name:
        return "Field Manual"
    if any(key in name for key in ("questionnaire", "tool", "guide", "instrument", "checklist", "form")):
        return "Data Collection Tools"
    if "report" in name or path.suffix.lower() == ".pdf":
        return "Report"
    if path.suffix.lower() in {".png", ".jpg", ".jpeg"}:
        return "Others"
    return "Others"


def git(*args, cwd: Path) -> None:
    subprocess.run(["git", *args], cwd=str(cwd), check=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="Create the public files/ folder structure.")
    parser.add_argument("--root", required=True, help="HERD data root, e.g. the 'All Project Data (2014-2026)' folder")
    parser.add_argument("--site", default=Path(__file__).resolve().parent, help="Folder containing files/ (default: this script's folder)")
    parser.add_argument("--projects", nargs="*", default=None, help="Only these project folder names (default: all found)")
    parser.add_argument("--copy", action="store_true", help="Also copy approved document files (PDF/DOCX/images). Data and code are never copied.")
    parser.add_argument("--max-mb", type=float, default=25.0, help="Skip files larger than this (default 25)")
    parser.add_argument("--push", action="store_true", help="Run git add/commit/push after building")
    args = parser.parse_args()

    root = Path(args.root)
    site = Path(args.site).resolve()
    public_root = site / "files"

    if not root.is_dir():
        print(f"Data root not found: {root}")
        return 1
    if not site.is_dir():
        print(f"Site folder not found: {site}")
        return 1
    if (public_root / ".git").exists():
        print("files/ must be a plain folder inside the site, not a separate repository.")
        return 1

    wanted = {name.casefold() for name in args.projects} if args.projects else None
    projects = sorted(
        {entry.name for entry in root.glob("*/*") if entry.is_dir()},
        key=str.casefold,
    )
    if wanted:
        projects = [name for name in projects if name.casefold() in wanted]
    if not projects:
        print("No project folders found. Check --root.")
        return 1

    created = copied = skipped_private = skipped_large = 0
    copied_paths = []

    for project in projects:
        for category in CATEGORIES:
            folder = public_root / project / category
            folder.mkdir(parents=True, exist_ok=True)
            keep = folder / ".gitkeep"
            if not keep.exists() and not any(folder.iterdir()):
                keep.touch()
                created += 1

        if not args.copy:
            continue

        source_project = next((root / year / project for year in sorted(p.name for p in root.iterdir() if p.is_dir())
                               if (root / year / project).is_dir()), None)
        if source_project is None:
            continue
        for item in source_project.rglob("*"):
            if not item.is_file() or item.name.startswith("."):
                continue
            suffix = item.suffix.lower()
            if suffix in PRIVATE_SUFFIXES:
                skipped_private += 1
                continue
            if suffix not in PUBLISHABLE_SUFFIXES:
                continue
            if item.stat().st_size > args.max_mb * 1024 * 1024:
                skipped_large += 1
                print(f"  skip (too large): {project}/{item.name}")
                continue
            destination = public_root / project / target_category(item) / item.name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, destination)
            copied += 1
            copied_paths.append(destination)

    print(f"Projects processed : {len(projects)}")
    print(f"Folders/placeholders created : {created}")
    if args.copy:
        print(f"Documents copied   : {copied}")
        print(f"Private files kept out : {skipped_private}")
        print(f"Skipped (over {args.max_mb} MB)  : {skipped_large}")
        print()
        print("Copied files - review each one, then add it to catalog.js as access: \"public\":")
        for path in copied_paths:
            print(f"  {path.relative_to(public_root)}")

    if args.push:
        git("add", "files", cwd=site)
        git("commit", "-m", "Build standard six-folder structure for public files", cwd=site)
        git("push", "origin", "main", cwd=site)
        print("Pushed to GitHub.")
    else:
        print()
        print("Review the result, then publish with:")
        print("  git add . ; git commit -m \"Build standard folder structure\" ; git push origin main")
    return 0


if __name__ == "__main__":
    sys.exit(main())