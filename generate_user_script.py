import os
import bcrypt
from dotenv import load_dotenv, set_key
from datetime import datetime

ENV_FILE = ".env"
load_dotenv(ENV_FILE)

username = os.getenv("MONGO_SUPER_USER", "super_user")
password_plain = os.getenv("MONGO_SUPER_USER_PASSWORD", "super_user")
salt_rounds = int(os.getenv("BCRYPT_SALT_ROUNDS", 12))

if not username or not password_plain:
    raise ValueError("MONGO_SUPER_USER or MONGO_SUPER_USER_PASSWORD are not defined in .env")

salt = bcrypt.gensalt(rounds=salt_rounds)
hashed_password = bcrypt.hashpw(password_plain.encode("utf-8"), salt).decode("utf-8")

now_str = datetime.now().isoformat()

scope_insert = """
db.scope.insertMany([
  {
    name: "Start",
    description: "Begin evaluation by stating your organization's values, mission, and goals. Avoid relying solely on what is easy to measure (e.g., citations or rankings) and be mindful of the 'Streetlight Effect'. Align assessment criteria with institutional purpose, societal impact, and academic freedom.",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Context",
    description: "Account for the diversity of disciplines, career stages, institutional missions, and regional contexts. Assessment must be adapted to reflect the environment in which research is conducted, acknowledging systemic inequities and variations in resources and opportunities.",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Openness",
    description: "Be open to reviewing and improving assessment practices. Regularly evaluate the fairness, relevance, and impact of evaluation methods. Welcome stakeholder feedback and update processes in response to emerging needs and responsible metrics initiatives.",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Proportionality",
    description: "Use metrics and indicators in a proportionate and balanced manner. Avoid over-reliance on any single measure. Ensure that evaluation processes are not overly burdensome and that they match the importance of the decision being made.",
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    name: "Expertise",
    description: "Ensure assessments are conducted by individuals with appropriate disciplinary, methodological, and contextual knowledge. Promote diverse and trained evaluator panels. Recognize the importance of peer review, qualitative judgement, and lived experience.",
    created_at: new Date(),
    modified_at: new Date()
  }
]);
"""

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
  email_confirmed_at: "{now_str}",
  orcid: ""
}});

{scope_insert.strip()}
"""

output_js_path = "./mongodb/docker-entrypoint-initdb.d/create_user.generated.js"
os.makedirs(os.path.dirname(output_js_path), exist_ok=True)
with open(output_js_path, "w") as f:
    f.write(js_script.strip())

print(f"Mongo initialization script ready: {output_js_path}")

salt_str = salt.decode("utf-8")
set_key(ENV_FILE, "SALT", salt_str)
print(f"Added salt in .env as SALT")
