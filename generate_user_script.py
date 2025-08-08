import os
import json
import argparse
import bcrypt
from dotenv import load_dotenv, set_key
from datetime import datetime
from iso3166 import countries

# Load env
ENV_FILE = ".env"
load_dotenv(ENV_FILE)

# Args
parser = argparse.ArgumentParser(description="MongoDB Initialization Script Generator")
parser.add_argument("--user", action="store_true", help="Include user creation")
parser.add_argument("--scope", action="store_true", help="Include scopes")
parser.add_argument("--geo", action="store_true", help="Include geographical coverages")
parser.add_argument("--assessment", action="store_true", help="Include assessments")
parser.add_argument("--trl", action="store_true", help="Include TRL levels")
parser.add_argument("--all", action="store_true", help="Include all sections")
args = parser.parse_args()

# Defaults: If no args, do all
include_all = not any(vars(args).values()) or args.all

include_user = include_all or args.user
include_scope = include_all or args.scope
include_geo = include_all or args.geo
include_assessment = include_all or args.assessment
include_trl = include_all or args.trl

username = os.getenv("MONGO_SUPER_USER", "super_user")
password_plain = os.getenv("MONGO_SUPER_USER_PASSWORD", "super_user")
salt_rounds = int(os.getenv("BCRYPT_SALT_ROUNDS", 12))
salt = bcrypt.gensalt(rounds=salt_rounds)
hashed_password = bcrypt.hashpw(password_plain.encode("utf-8"), salt).decode("utf-8")
now_str = datetime.now().isoformat()

user_insert = f"""
db.User.insertOne({{
  email: "test@test.com",
  first_name: "",
  last_name: "",
  super_user: true,
  username: "{username}",
  organization: "",
  disabled: false,
  password: "{hashed_password}",
  email_confirmed_at: new Date("{now_str}"),
  orcid: ""
}});
""" if include_user else ""

scope_insert = """db.scopes.insertMany([
  {
    name: "Start",
    description: "Begin evaluation by stating your organization's values, mission, and goals...",
    bg_color: "#EB611F",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Context",
    description: "Account for the diversity of disciplines, career stages...",
    bg_color: "#77AEA5",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Options",
    description: "Be open to reviewing and improving assessment practices...",
    bg_color: "#7C9497",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Probe",
    description: "Use metrics and indicators in a proportionate and balanced manner...",
    bg_color: "#9B907E",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Evaluate",
    description: "Ensure assessments are conducted by individuals with appropriate...",
    bg_color: "#A7AD64",
    created_at: new Date(),
    modified_at: new Date()
  }
]);""" if include_scope else ""

assessment_subject = """db.assessments.insertMany([
  {
    name: "Researcher",
    description: "Assessment of individual researchers using various values and criteria.",
    bg_color: "#EB611F",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Researcher team/group",
    description: "Assessment of researcher teams or groups...",
    bg_color: "#77AEA5",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Research organization",
    description: "Assessment of research performing organizations...",
    bg_color: "#7C9497",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Country",
    description: "Assessment of the full body of research conducted by researchers from specific countries...",
    bg_color: "#9B907E",
    created_at: new Date(),
    modified_at: new Date()
  }
]);""" if include_assessment else ""

geo_insert = ""
if include_geo:
    with open("country_centroids.json", encoding="utf-8") as f:
        centroid_map = json.load(f)

    geo_items = []
    geo_items.append({
        "code": "WW",
        "label": "Worldwide",
        "flag": "",
        "created_at": "new Date()",
        "modified_at": "new Date()",
        "lat": 0,
        "lng": 0
    })

    for c in countries:
        code = c.alpha2
        coords = centroid_map.get(code)
        lat, lng = coords if coords and len(coords) == 2 else (None, None)
        item = {
            "code": code,
            "label": c.name,
            "flag": f"https://flagcdn.com/{code.lower()}.svg",
            "created_at": "new Date()",
            "modified_at": "new Date()"
        }
        if lat is not None and lng is not None:
            item["lat"] = lat
            item["lng"] = lng

        js_obj = "{\n" + ",\n".join(
            f'  {k}: {v}' if isinstance(v, (int, float)) or v == "new Date()" else f'  {k}: "{v}"'
            for k, v in item.items()
        ) + "\n}"
        geo_items.append(js_obj)

    geo_insert = "db.geographical_coverages.insertMany([\n" + ",\n".join(geo_items) + "\n]);"

trl_insert = ""
if include_trl:
    trl_items = [
        {"trl_id": 1, "nasa_description": "Basic principles observed and reported", "european_description": "Basic principles observed"},
        {"trl_id": 2, "nasa_description": "Technology concept and/or application formulated", "european_description": "Technology concept formulated"},
        {"trl_id": 3, "nasa_description": "Analytical and experimental critical function and/or characteristic proof-of-concept", "european_description": "Experimental proof of concept"},
        {"trl_id": 4, "nasa_description": "Component and/or breadboard validation in laboratory environment", "european_description": "Technology validated in lab"},
        {"trl_id": 5, "nasa_description": "Component and/or breadboard validation in relevant environment", "european_description": "Technology validated in relevant environment"},
        {"trl_id": 6, "nasa_description": "System/subsystem model or prototype demonstration in a relevant environment", "european_description": "Technology demonstrated in relevant environment"},
        {"trl_id": 7, "nasa_description": "System prototype demonstration in a space environment", "european_description": "System prototype demonstration in operational environment"},
        {"trl_id": 8, "nasa_description": "Actual system completed and 'flight qualified' through test and demonstration", "european_description": "System complete and qualified"},
        {"trl_id": 9, "nasa_description": "Actual system 'flight proven' through successful mission operations", "european_description": "System proven in operational environment"}
    ]

    trl_insert = "db.trl.insertMany([\n" + ",\n".join(
        "{\n" + ",\n".join(
            f'  {k}: {v}' if isinstance(v, int) else f'  {k}: "{v}"'
            for k, v in trl.items()) +
        ",\n  created_at: new Date(),\n  modified_at: new Date()\n}"
        for trl in trl_items
    ) + "\n]);"

# Final JS script
final_script = f"""
db = db.getSiblingDB("graspos");

{user_insert}
{scope_insert}
{geo_insert}
{assessment_subject}
{trl_insert}
"""

# Write to file
output_path = "./mongodb/docker-entrypoint-initdb.d/create_user.generated_centroids.js"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    f.write(final_script.strip())

# Store salt
set_key(ENV_FILE, "SALT", salt.decode("utf-8"))
print("✅ Mongo init script created.")
