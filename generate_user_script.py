import os
import bcrypt
from dotenv import load_dotenv, set_key
from datetime import datetime
from iso3166 import countries

ENV_FILE = ".env"
load_dotenv(ENV_FILE)

username = os.getenv("MONGO_SUPER_USER", "super_user")
password_plain = os.getenv("MONGO_SUPER_USER_PASSWORD", "super_user")
salt_rounds = int(os.getenv("BCRYPT_SALT_ROUNDS", 12))

if not username or not password_plain:
    raise ValueError(
        "MONGO_SUPER_USER or MONGO_SUPER_USER_PASSWORD are not defined in .env"
    )

salt = bcrypt.gensalt(rounds=salt_rounds)
hashed_password = bcrypt.hashpw(password_plain.encode("utf-8"),
                                salt).decode("utf-8")
now_str = datetime.now().isoformat()

# Scope insert
scope_insert = """db.scope.insertMany([
  {
    name: "Start",
    description: "Begin evaluation by stating your organization's values, mission, and goals. Avoid relying solely on what is easy to measure (e.g., citations or rankings) and be mindful of the 'Streetlight Effect'. Align assessment criteria with institutional purpose, societal impact, and academic freedom.",
    bg_color: "#EB611F",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Context",
    description: "Account for the diversity of disciplines, career stages, institutional missions, and regional contexts. Assessment must be adapted to reflect the environment in which research is conducted, acknowledging systemic inequities and variations in resources and opportunities.",
    bg_color: "#77AEA5",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Openness",
    description: "Be open to reviewing and improving assessment practices. Regularly evaluate the fairness, relevance, and impact of evaluation methods. Welcome stakeholder feedback and update processes in response to emerging needs and responsible metrics initiatives.",
    bg_color: "#7C9497",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Proportionality",
    description: "Use metrics and indicators in a proportionate and balanced manner. Avoid over-reliance on any single measure. Ensure that evaluation processes are not overly burdensome and that they match the importance of the decision being made.",
    bg_color: "#9B907E",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Expertise",
    description: "Ensure assessments are conducted by individuals with appropriate disciplinary, methodological, and contextual knowledge. Promote diverse and trained evaluator panels. Recognize the importance of peer review, qualitative judgement, and lived experience.",
    bg_color: "#A7AD64",
    created_at: new Date(),
    modified_at: new Date()
  }
]);"""

import json

# Load centroid data
with open("country_centroids.json", encoding="utf-8") as f:
    centroid_map = json.load(f)

# Geographical coverage insert
geo_items = []
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

    js_obj = "{\n" + ",\n".join(f'  {k}: {v}' if isinstance(v, (
        int, float)) or v == "new Date()" else f'  {k}: "{v}"'
                                for k, v in item.items()) + "\n}"
    geo_items.append(js_obj)

geo_insert = "db.geographical_coverage.insertMany([\n" + ",\n".join(
    geo_items) + "\n]);"

# Final script
js_script = f"""
db = db.getSiblingDB("graspos");

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

{scope_insert}

{geo_insert}
"""

# Write to file
output_js_path = "./mongodb/docker-entrypoint-initdb.d/create_user.generated_centroids.js"
os.makedirs(os.path.dirname(output_js_path), exist_ok=True)
with open(output_js_path, "w", encoding="utf-8") as f:
    f.write(js_script.strip())

# Store salt
set_key(ENV_FILE, "SALT", salt.decode("utf-8"))
print("✅ Mongo init script created with geo coverage and scopes.")
