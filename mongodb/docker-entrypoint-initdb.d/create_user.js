db = db.getSiblingDB("graspos");

db.User.insertOne({
  email: "super_user@gmail.com",
  first_name: "Super",
  last_name: "User",
  super_user: true,
  username: "super_user",
  organization: "Athena RC",
  disabled: false,
  password: "$2b$12$fxtS0sm0h2K28sWEG9L5reMayaw.G0woS4h/EgkJz1V1SFK5pvmde",
  email_confirmed_at: "2025-03-24T08:39:41.589+00:00",
  orcid: "",
});
