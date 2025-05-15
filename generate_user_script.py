import os
import bcrypt
from dotenv import load_dotenv, set_key

ENV_FILE = ".env"
load_dotenv(ENV_FILE)

username = os.getenv("MONGO_SUPER_USER", "super_user")
password_plain = os.getenv("MONGO_SUPER_USER_PASSWORD", "super_user")
salt_rounds = int(os.getenv("BCRYPT_SALT_ROUNDS", 12))

if not username or not password_plain:
    raise ValueError("MONGO_SUPER_USER or MONGO_SUPER_USER_PASSWORD are not defined in .env")

salt = bcrypt.gensalt(rounds=salt_rounds)
hashed_password = bcrypt.hashpw(password_plain.encode("utf-8"), salt).decode("utf-8")

js_script = f"""
db = db.getSiblingDB("graspos");

db.User.insertOne({{
  email: "",
  first_name: "",
  last_name: "",
  super_user: true,
  username: "{username}",
  organization: "",
  disabled: false,
  password: "{hashed_password}",
  email_confirmed_at: "",
  orcid: "",
}});
"""

output_js_path = "./mongodb/docker-entrypoint-initdb.d/create_user.generated.js"
os.makedirs(os.path.dirname(output_js_path), exist_ok=True)
with open(output_js_path, "w") as f:
    f.write(js_script.strip())
print(f"Mongo initilization script ready: {output_js_path}")

salt_str = salt.decode("utf-8")
set_key(ENV_FILE, "SALT", salt_str)
print(f"Added salt in .env as SALT")
