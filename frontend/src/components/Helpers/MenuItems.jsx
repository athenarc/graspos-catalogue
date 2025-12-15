import FlagIcon from "@mui/icons-material/Flag";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

const renderIcon = (name) => {
  switch (name) {
    case "Researcher":
      return <PersonIcon fontSize="inherit" />;
    case "Researcher Team/Group":
      return <GroupIcon fontSize="inherit" />;
    case "Research Organization":
      return <AccountBalanceIcon fontSize="inherit" />;
    case "Country":
      return <FlagIcon fontSize="inherit" />;
    case "Research Product":
      return <ProductionQuantityLimitsIcon fontSize="inherit" />;
    case "Project":
      return <AccountTreeIcon fontSize="inherit" />;
    default:
      return <FlagIcon fontSize="inherit" color="text.primary" />;
  }
};

const evidenceTypesMenuItems = [
  { value: "indicators", label: "Indicators" },
  { value: "narratives", label: "Narratives" },
  { value: "list_of_contributions", label: "List of Contributions" },
  { value: "badges", label: "Badges" },
  { value: "other", label: "Other" },
];

const assessmentFunctionalityMenuItems = [
  {
    value: "scholarly_data_enrichment_missing_attributes",
    label: "Scholarly data enrichment: Missing attributes",
  },
  {
    value: "scholarly_data_enrichment_indicators",
    label: "Scholarly data enrichment: Indicators",
  },
  {
    value: "scholarly_data_enrichment_semantics",
    label: "Scholarly data enrichment: Missing links & semantics",
  },
  {
    value: "open_science_monitoring_researchers",
    label: "Open Science monitoring: Researchers",
  },
  {
    value: "open_science_monitoring_institutions",
    label: "Open Science monitoring: Institutions",
  },
  {
    value: "open_science_monitoring_countries",
    label: "Open Science monitoring: Countries",
  },
  {
    value: "open_science_monitoring_general",
    label: "Open Science monitoring: General",
  },
  {
    value: "data",
    label: "Data",
  },
  {
    value: "other",
    label: "Other",
  },
];

const coveredResearchProductsMenuItems = [
  { value: "dataset", label: "Dataset" },
  { value: "dataset_dataset", label: "Dataset: Dataset", synonym: "0021" },
  {
    value: "dataset_collection",
    label: "Dataset: Collection",
    synonym: "0022",
  },
  {
    value: "dataset_clinical_trial",
    label: "Dataset: Clinical Trial",
    synonym: "0037",
  },
  {
    value: "dataset_other_dataset_type",
    label: "Dataset: Other dataset type",
    synonym: "0039",
  },
  {
    value: "dataset_bioentity",
    label: "Dataset: Bioentity",
    synonym: "0046",
  },
  { value: "dataset_protein", label: "Dataset: Protein", synonym: "0047" },
  { value: "other", label: "Other", synonym: "0000" },
  { value: "other_lecture", label: "Other: Lecture", synonym: "0010" },
  { value: "other_annotation", label: "Other: Annotation", synonym: "0018" },
  {
    value: "other_other_orp_type",
    label: "Other: Other ORP type",
    synonym: "0020",
  },
  { value: "other_event", label: "Other: Event", synonym: "0023" },
  { value: "other_film", label: "Other: Film", synonym: "0024" },
  { value: "other_image", label: "Other: Image", synonym: "0025" },
  {
    value: "other_interactive_resource",
    label: "Other: InteractiveResource",
    synonym: "0026",
  },
  { value: "other_model", label: "Other: Model", synonym: "0027" },
  {
    value: "other_physical_object",
    label: "Other: PhysicalObject",
    synonym: "0028",
  },
  { value: "other_sound", label: "Other: Sound", synonym: "0030" },
  {
    value: "other_audiovisual",
    label: "Other: Audiovisual",
    synonym: "0033",
  },
  {
    value: "other_virtual_appliance",
    label: "Other: Virtual Appliance",
    synonym: "0042",
  },
  {
    value: "other_research_object",
    label: "Other: Research Object",
    synonym: "0048",
  },
  {
    value: "other_research_activity",
    label: "Other: Research Activity",
    synonym: "0049",
  },

  { value: "publication", label: "Publication" },
  {
    value: "publication_article",
    label: "Publication: Article",
    synonym: "0001",
  },
  { value: "publication_book", label: "Publication: Book", synonym: "0002" },
  {
    value: "publication_conference_object",
    label: "Publication: Conference Object",
    synonym: "0004",
  },
  {
    value: "publication_contribution_for_newspaper_or_weekly_magazine",
    label: "Publication: Contribution for newspaper or weekly magazine",
    synonym: "0005",
  },
  {
    value: "publication_doctoral_thesis",
    label: "Publication: Doctoral Thesis",
    synonym: "0006",
  },
  {
    value: "publication_master_thesis",
    label: "Publication: Master Thesis",
    synonym: "0007",
  },
  {
    value: "publication_bachelor_thesis",
    label: "Publication: Bachelor Thesis",
    synonym: "0008",
  },
  {
    value: "publication_external_research_report",
    label: "Publication: External Research Report",
    synonym: "0009",
  },
  {
    value: "publication_internal_report",
    label: "Publication: Internal Report",
    synonym: "0011",
  },
  {
    value: "publication_newsletter",
    label: "Publication: Newsletter",
    synonym: "0012",
  },
  {
    value: "publication_part_of_book_or_chapter_of_book",
    label: "Publication: Part of Book or Chapter of Book",
    synonym: "0013",
  },
  {
    value: "publication_research",
    label: "Publication: Research",
    synonym: "0014",
  },
  {
    value: "publication_review",
    label: "Publication: Review",
    synonym: "0015",
  },
  {
    value: "publication_preprint",
    label: "Publication: Preprint",
    synonym: "0016",
  },
  {
    value: "publication_report",
    label: "Publication: Report",
    synonym: "0017",
  },
  {
    value: "publication_patent",
    label: "Publication: Patent",
    synonym: "0019",
  },
  {
    value: "publication_data_paper",
    label: "Publication: Data Paper",
    synonym: "0031",
  },
  {
    value: "publication_software_paper",
    label: "Publication: Software Paper",
    synonym: "0032",
  },
  {
    value: "publication_project_deliverable",
    label: "Publication: Project Deliverable",
    synonym: "0034",
  },
  {
    value: "publication_project_milestone",
    label: "Publication: Project Milestone",
    synonym: "0035",
  },
  {
    value: "publication_project_proposal",
    label: "Publication: Project Proposal",
    synonym: "0036",
  },
  {
    value: "publication_other_literature_type",
    label: "Publication: Other Literature Type",
    synonym: "0038",
  },
  {
    value: "publication_journal",
    label: "Publication: Journal",
    synonym: "0043",
  },
  {
    value: "publication_thesis",
    label: "Publication: Thesis",
    synonym: "0044",
  },
  {
    value: "publication_data_management_plan",
    label: "Publication: Data Management Plan",
    synonym: "0045",
  },
  {
    value: "publication_presentation",
    label: "Publication: Presentation",
    synonym: "0050",
  },
  {
    value: "software",
    label: "Software",
  },
  {
    value: "software_software",
    label: "Software: Software",
    synonym: "0029",
  },
  {
    value: "software_other_software_type",
    label: "Software: Other software type",
    synonym: "0040",
  },
];

const coveredFieldsMenuItems = [
  { value: "natural_sciences", label: "Natural Sciences" },
  {
    value: "natural_sciences_mathematics",
    label: "Natural Sciences: Mathematics",
  },
  {
    value: "natural_sciences_computer_and_information_sciences",
    label: "Natural Sciences: Computer and Information Sciences",
  },
  {
    value: "natural_sciences_physical_sciences",
    label: "Natural Sciences: Physical Sciences",
  },
  {
    value: "natural_sciences_chemical_sciences",
    label: "Natural Sciences: Chemical Sciences",
  },
  {
    value: "natural_sciences_earth_and_related_environmental_sciences",
    label: "Natural Sciences: Earth and Related Environmental Sciences",
  },
  {
    value: "natural_sciences_biological_sciences",
    label: "Natural Sciences: Biological Sciences",
  },
  {
    value: "natural_sciences_other_natural_sciences",
    label: "Natural Sciences: Other Natural Sciences",
  },

  {
    value: "engineering_and_technology",
    label: "Engineering and Technology",
  },
  {
    value: "engineering_and_technology_civil_engineering",
    label: "Engineering and Technology: Civil Engineering",
  },
  {
    value:
      "engineering_and_technology_electrical_engineering_electronic_engineering_information_engineering",
    label:
      "Engineering and Technology: Electrical Engineering, Electronic Engineering, Information Engineering",
  },
  {
    value: "engineering_and_technology_mechanical_engineering",
    label: "Engineering and Technology: Mechanical Engineering",
  },
  {
    value: "engineering_and_technology_chemical_engineering",
    label: "Engineering and Technology: Chemical Engineering",
  },
  {
    value: "engineering_and_technology_materials_engineering",
    label: "Engineering and Technology: Materials Engineering",
  },
  {
    value: "engineering_and_technology_medical_engineering",
    label: "Engineering and Technology: Medical Engineering",
  },
  {
    value: "engineering_and_technology_environmental_engineering",
    label: "Engineering and Technology: Environmental Engineering",
  },
  {
    value: "engineering_and_technology_environmental_biotechnology",
    label: "Engineering and Technology: Environmental Biotechnology",
  },
  {
    value: "engineering_and_technology_industrial_biotechnology",
    label: "Engineering and Technology: Industrial Biotechnology",
  },
  {
    value: "engineering_and_technology_nano_technology",
    label: "Engineering and Technology: Nano Technology",
  },
  {
    value: "engineering_and_technology_other_engineering_and_technologies",
    label: "Engineering and Technology: Other Engineering and Technologies",
  },

  {
    value: "medical_and_health_sciences",

    label: "Medical and Health Sciences",
  },
  {
    value: "medical_and_health_sciences_basic_medicine",
    label: "Medical and Health Sciences: Basic Medicine",
  },
  {
    value: "medical_and_health_sciences_clinical_medicine",
    label: "Medical and Health Sciences: Clinical Medicine",
  },
  {
    value: "medical_and_health_sciences_health_sciences",
    label: "Medical and Health Sciences: Health Sciences",
  },
  {
    value: "medical_and_health_sciences_health_biotechnology",
    label: "Medical and Health Sciences: Health Biotechnology",
  },
  {
    value: "medical_and_health_sciences_other_medical_sciences",
    label: "Medical and Health Sciences: Other Medical Sciences",
  },
  { value: "agricultural_sciences", label: "Agricultural Sciences" },
  {
    value: "agricultural_sciences_agriculture_forestry_and_fisheries",
    label: "Agricultural Sciences: Agriculture, Forestry, and Fisheries",
  },
  {
    value: "agricultural_sciences_animal_and_dairy_science",
    label: "Agricultural Sciences: Animal and Dairy Science",
  },
  {
    value: "agricultural_sciences_veterinary_science",
    label: "Agricultural Sciences: Veterinary Science",
  },
  {
    value: "agricultural_sciences_agricultural_biotechnology",
    label: "Agricultural Sciences: Agricultural Biotechnology",
  },
  {
    value: "agricultural_sciences_other_agricultural_sciences",
    label: "Agricultural Sciences: Other Agricultural Sciences",
  },

  { value: "social_science", label: "Social Science" },
  { value: "social_science_psychology", label: "Social Science: Psychology" },
  {
    value: "social_science_economics_and_business",
    label: "Social Science: Economics and Business",
  },
  {
    value: "social_science_educational_sciences",
    label: "Social Science: Educational Sciences",
  },
  { value: "social_science_sociology", label: "Social Science: Sociology" },
  { value: "social_science_law", label: "Social Science: Law" },
  {
    value: "social_science_political_science",
    label: "Social Science: Political Science",
  },
  {
    value: "social_science_social_and_economic_geography",
    label: "Social Science: Social and Economic Geography",
  },
  {
    value: "social_science_media_and_communications",
    label: "Social Science: Media and Communications",
  },
  {
    value: "social_science_other_social_sciences",
    label: "Social Science: Other Social Sciences",
  },

  { value: "humanities", label: "Humanities" },
  {
    value: "humanities_history_and_archaeology",
    label: "Humanities: History and Archaeology",
  },
  {
    value: "humanities_languages_and_literature",
    label: "Humanities: Languages and Literature",
  },
  {
    value: "humanities_philosophy_ethics_and_religion",
    label: "Humanities: Philosophy, Ethics and Religion",
  },
  {
    value: "humanities_arts_arts_history_of_arts_performing_arts_music",
    label: "Humanities: Arts (Arts, History of Arts, Performing Arts, Music)",
  },
  {
    value: "humanities_other_humanities",
    label: "Humanities: Other Humanities",
  },
  {
    value: "field_agnostic",
    label: "Field Agnostic",
  },
];

const functionalityLabelMap = Object.fromEntries(
  assessmentFunctionalityMenuItems?.map((i) => [i.value, i.label])
);

function getLabelForAssessmentFunctionality(value) {
  const item = assessmentFunctionalityMenuItems.find((i) => i.value === value);
  return item ? item.label : value;
}

function getLabelForCoveredResearchProducts(value) {
  const item = coveredResearchProductsMenuItems.find((i) => i.value === value);
  return item ? item.label : value;
}

function getLabelForCoveredFields(value) {
  const item = coveredFieldsMenuItems.find((i) => i.value === value);
  return item ? item.label : value;
}

function getLabelForEvidenceType(value) {
  const item = evidenceTypesMenuItems.find((i) => i.value === value);
  return item ? item.label : value;
}
 
export {
  evidenceTypesMenuItems,
  assessmentFunctionalityMenuItems,
  coveredResearchProductsMenuItems,
  coveredFieldsMenuItems,
  functionalityLabelMap,
  getLabelForAssessmentFunctionality,
  getLabelForEvidenceType,
  getLabelForCoveredResearchProducts,
  getLabelForCoveredFields,
  renderIcon,
};
