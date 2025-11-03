import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardActionArea,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid2 as Grid,
  Stack,
  Typography,
  Tooltip,
  Divider,
  Card,
  CardHeader,
  CardContent,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import orcidLogo from "../../../../assets/orcid.logo.icon.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import DescriptionIcon from "@mui/icons-material/Description";
import SchoolIcon from "@mui/icons-material/School";
import ForumIcon from "@mui/icons-material/Forum";
import LinkIcon from "@mui/icons-material/Link";
import {
  getLabelForAssessmentFunctionality,
  getLabelForEvidenceType,
} from "@helpers/MenuItems";

const summaryStyles = {
  color: "#fff",
  backgroundColor: "text.secondary",
};

const cardStyles = {
  lineHeight: 1.5,
  flexDirection: "column",
  display: "flex",
  justifyContent: "space-between",
  borderRadius: "5px",
  border: "1px solid #e0dfdf",
  backgroundColor: "#f8faff",
  boxShadow: 0,
  color: "#555",
};

export function FieldRow({ label, fieldArray, mapFn }) {
  const formatFieldArray = (fieldArray) => {
    if (!fieldArray || fieldArray?.length === 0) return "-";
    const formatted = fieldArray?.map((item) => {
      if (mapFn) return mapFn(item);

      if (typeof item === "object" && item !== null) {
        return item?.label || item?.value || item?.name || "";
      }

      return item;
    });

    return formatted?.join(", ");
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: "bold", display: "inline" }}>
        {label}:
      </Typography>{" "}
      <Typography
        sx={{
          display: "inline",
          wordBreak: "break-word",
          whiteSpace: "normal",
        }}
      >
        {formatFieldArray(fieldArray)}
      </Typography>
    </Box>
  );
}
const accordionCardStyles = {
  boxShadow: 2,
  borderRadius: 2,
  "&:before": { display: "none" },
};

export function EquityEthicalCard({ resource }) {
  return (
    <Accordion defaultExpanded={false} sx={accordionCardStyles} disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
        sx={summaryStyles}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Equity & Ethical Considerations
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ textAlign: resource?.isLoading ? "center" : "left", p: 2 }}
      >
        {resource?.isLoading && <CircularProgress size="3rem" />}
        {resource?.isSuccess && (
          <Stack direction="column" spacing={1}>
            <FieldRow
              label="Equity Considerations"
              fieldArray={resource?.data?.data?.equity_considerations}
            />
            <FieldRow
              label="Ethical Considerations"
              fieldArray={resource?.data?.data?.ethical_considerations}
            />
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export function GovernanceSustainabilityFundingCard({ resource }) {
  return (
    <Accordion defaultExpanded={false} sx={accordionCardStyles} disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
        sx={summaryStyles}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Governance, Sustainability & Funding
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ textAlign: resource?.isLoading ? "center" : "left", p: 2 }}
      >
        {resource?.isLoading && <CircularProgress size="3rem" />}
        {resource?.isSuccess && (
          <Stack direction="column" spacing={1}>
            <FieldRow
              label="Governance Model"
              fieldArray={resource?.data?.data?.governance_model}
            />
            <FieldRow
              label="Governance Bodies"
              fieldArray={resource?.data?.data?.governance_model}
            />
            <FieldRow
              label="Sustainability Goals"
              fieldArray={resource?.data?.data?.sustainability_goals}
            />
            <FieldRow
              label="Funds"
              fieldArray={resource?.data?.data?.zenodo?.metadata?.grants?.map(
                (grant) => grant?.acronym
              )}
            />
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export function ContributorsCard({ resource }) {
  const contributors =
    resource?.data?.data?.openaire?.metadata?.resourceOrganisation ||
    resource?.data?.data?.zenodo?.metadata?.contributors ||
    [];

  return (
    <Accordion defaultExpanded={false} sx={accordionCardStyles} disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
        sx={summaryStyles}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Contributors
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ textAlign: resource?.isLoading ? "center" : "left", p: 2 }}
      >
        {resource?.isLoading && <CircularProgress size="3rem" />}
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FieldRow
              label="Contributors"
              fieldArray={
                Array.isArray(contributors) ? contributors : [contributors]
              }
            />
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export function AuthorsCard({ resource, people = [], label = "Authors" }) {
  return (
    <Accordion defaultExpanded={false} sx={accordionCardStyles} disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
        sx={summaryStyles}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ textAlign: resource?.isLoading ? "center" : "left", p: 2 }}
      >
        {resource?.isLoading && <CircularProgress size="3rem" />}
        {resource?.isSuccess && people?.length === 0 && (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontStyle: "italic" }}
          >
            No {label} available
          </Typography>
        )}
        {resource?.isSuccess && people?.length > 0 && (
          <Stack direction="column" spacing={1}>
            {people?.map((person) => (
              <Stack direction="column" key={person?.name} spacing={0.5}>
                <Stack direction="row" alignItems="center">
                  {person?.orcid ? (
                    <a
                      href={`https://orcid.org/${person?.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Stack direction="row" alignItems="center">
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          sx={{
                            color: "text.primary",
                            "&:hover": { color: "primary.main" },
                          }}
                        >
                          {person?.name}
                        </Typography>
                        <Avatar
                          sx={{
                            bgcolor: "#A6CE39",
                            width: 20,
                            height: 20,
                            ml: 1,
                          }}
                          alt="orcid"
                          src={orcidLogo}
                        />
                      </Stack>
                    </a>
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {person?.name}
                    </Typography>
                  )}
                </Stack>
                {person?.affiliation && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.875rem", fontStyle: "italic" }}
                  >
                    {person?.affiliation}
                  </Typography>
                )}
              </Stack>
            ))}
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export function ContactInformationCard({ resource }) {
  const contactPerson = resource?.data?.data?.contact_person;
  const contactPersonEmail = resource?.data?.data?.contact_person_email;
  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">Contact Information</Typography>}
      ></CardHeader>
      <CardContent
        sx={{
          textAlign: [!resource.isLoading ? "center" : "left"],
          pt: 1,
        }}
      >
        <Stack direction="column" spacing={1}>
          {resource.isLoading && <CircularProgress size="3rem" />}
          {resource && contactPerson && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <PersonIcon sx={{ color: "text.secondary" }} />
              <Typography variant="body1">{contactPerson}</Typography>
            </Stack>
          )}
          {resource && contactPersonEmail && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <EmailIcon sx={{ color: "text.secondary" }} />
              <Typography variant="body1">
                <a
                  href={`mailto:${contactPersonEmail}`}
                  style={{ color: "inherit" }}
                >
                  {contactPersonEmail}
                </a>
              </Typography>
            </Stack>
          )}
          {resource && !contactPerson && !contactPersonEmail && (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
              No contact information available
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function ApiUrlInstructionsCard({ resource }) {
  const isLoading = resource?.isLoading;
  const apiUrl = resource?.data?.data?.api_url;
  const apiUrlInstructions = resource?.data?.data?.api_url_instructions;

  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">API</Typography>}
      />
      <CardContent sx={{ pt: 1 }}>
        {isLoading ? (
          <CircularProgress size="3rem" />
        ) : (
          <Stack spacing={2}>
            {apiUrl ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Link
                  to={apiUrl}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <Typography variant="body1" color="primary.main">
                    {apiUrl}
                  </Typography>
                </Link>
              </Stack>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontStyle: "italic" }}
              >
                No API URL available
              </Typography>
            )}

            <Divider />

            {apiUrlInstructions ? (
              <Typography variant="body1">{apiUrlInstructions}</Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontStyle: "italic" }}
              >
                No instructions available for this API.
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export function DocumentationUrlCard({ resource }) {
  const isLoading = resource?.isLoading;
  const documentationUrl = resource?.data?.data?.documentation_url;

  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">Documentation</Typography>}
      />
      <CardContent sx={{ pt: 1 }}>
        {isLoading ? (
          <CircularProgress size="3rem" />
        ) : (
          <Stack spacing={2}>
            {documentationUrl ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Link
                  to={documentationUrl}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <Typography variant="body1" color="primary.main">
                    {documentationUrl}
                  </Typography>
                </Link>
              </Stack>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontStyle: "italic" }}
              >
                No documentation url available
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export function CoverageCard({ resource }) {
  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{
          textAlign: "center",
          color: "#fff",
          backgroundColor: "text.secondary",
          display: "flex",
          flex: "1",
        }}
        title={
          <Typography variant="h5" textAlign="center">
            Coverage
          </Typography>
        }
      ></CardHeader>
      <CardContent
        sx={{
          textAlign: [resource.isLoading ? "center" : "left"],
          paddingBottom: "16px !important",
        }}
      >
        {resource?.isLoading && <CircularProgress size="3rem" />}
        {resource?.isSuccess && (
          <Stack spacing={2}>
            <FieldRow
              label="Subjects"
              fieldArray={resource?.data?.data?.assessments}
            />
            <FieldRow
              label="Products"
              fieldArray={resource?.data?.data?.covered_research_products}
            />

            <FieldRow
              label="Evidence"
              fieldArray={resource?.data?.data?.evidence_types}
              mapFn={getLabelForEvidenceType}
            />

            <FieldRow
              label="Fields"
              fieldArray={resource?.data?.data?.covered_fields}
            />

            <FieldRow
              label="Values"
              fieldArray={resource?.data?.data?.assessment_values}
            />
            <FieldRow
              label="Functionalities"
              fieldArray={resource?.data?.data?.assessment_functionalities}
              mapFn={getLabelForAssessmentFunctionality}
            />
            <FieldRow
              label="Geographical Scope"
              fieldArray={resource?.data?.data?.geographical_coverage}
            />
            <FieldRow
              label="Temporal Coverage"
              fieldArray={[resource?.data?.data?.temporal_coverage]}
            />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const sectionIcons = {
  Documentation: <DescriptionIcon color="primary" />,
  "Training material": <SchoolIcon color="secondary" />,
  "Support channel": <ForumIcon color="info" />,
};

export function SupportCard({ resource }) {
  const data = resource?.data?.data || {};

  const sections = [
    { label: "Documentation", urls: data.documentation_urls },
    { label: "Training material", urls: data.training_material_urls },
    { label: "Support channel", urls: data.support_channels },
  ];

  return (
    <Card sx={cardStyles}>
      <CardHeader
        title={
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Support
          </Typography>
        }
        sx={{
          textAlign: "center",
          color: "#fff",
          backgroundColor: "text.secondary",
          display: "flex",
          flex: "1",
        }}
      />

      <CardContent sx={{ py: 2 }}>
        {resource?.isLoading && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size="3rem" />
          </Box>
        )}

        {resource?.isSuccess && (
          <Stack spacing={2}>
            {sections.map(({ label, urls }) => {
              const urlArray = Array.isArray(urls) ? urls : urls ? [urls] : [];

              return (
                <Accordion
                  key={label}
                  disableGutters
                  sx={{
                    borderRadius: 2,
                    "&:before": { display: "none" },
                    boxShadow: 1,
                    overflow: "hidden",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      bgcolor: "action.hover",
                      "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                        gap: 1.5,
                      },
                    }}
                  >
                    {sectionIcons[label]}
                    <Typography fontWeight="bold">{label}</Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 2 }}>
                    {urlArray.length > 0 ? (
                      <Stack spacing={1}>
                        {urlArray.map((url, idx) => {
                          let displayText = url.replace(/^https?:\/\//, "");
                          if (displayText.length > 60)
                            displayText = displayText.slice(0, 60) + "…";

                          return (
                            <Paper
                              key={idx}
                              variant="outlined"
                              sx={{
                                borderRadius: 2,
                                overflow: "hidden",
                                "&:hover": { boxShadow: 2 },
                              }}
                            >
                              <CardActionArea
                                component="a"
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  px: 2,
                                  py: 1,
                                }}
                              >
                                <Typography fontWeight={500}>
                                  {displayText}
                                </Typography>
                                <OpenInNewIcon fontSize="small" />
                              </CardActionArea>
                            </Paper>
                          );
                        })}
                      </Stack>
                    ) : (
                      <Typography
                        color="text.secondary"
                        sx={{ fontStyle: "italic", py: 1 }}
                      >
                        No URLs available
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        )}

        {resource?.isError && (
          <Typography color="error" textAlign="center">
            Failed to load support data.
          </Typography>
        )}
      </CardContent>

      <Divider />
    </Card>
  );
}

export function TrlCard({ resource }) {
  const trl = resource?.data?.data?.trl || "";
  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">Technology Readiness Level</Typography>}
      ></CardHeader>
      <CardContent
        sx={{
          textAlign: [resource.isLoading ? "center" : "left"],
          pt: 1,
        }}
      >
        {resource.isLoading && <CircularProgress size="3rem" />}
        {trl ? (
          <Typography>
            <Link
              target="_blank"
              to={`https://en.wikipedia.org/wiki/Technology_readiness_level`}
            >
              {trl?.trl_id + " - " + trl?.european_description}
            </Link>
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontStyle: "italic" }}
          >
            No TRL available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export function TagsCard({ resource }) {
  const keywords =
    resource?.data?.data?.zenodo?.metadata?.keywords ||
    resource?.data?.data?.openaire?.metadata?.tags ||
    [];
  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">Tags</Typography>}
      />
      <CardContent
        sx={{
          textAlign: [resource.isLoading ? "center" : "left"],
          pt: 1,
        }}
      >
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource && (
          <Stack direction="column" justifyContent="center">
            {keywords?.length > 0 ? (
              <Grid container spacing={2}>
                {keywords?.map((keyword) => (
                  <Grid key={keyword}>
                    <Chip
                      label={keyword}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontStyle: "italic" }}
              >
                No tags available
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export function LicenseCard({ resource }) {
  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">License</Typography>}
      ></CardHeader>
      <CardContent
        sx={{
          textAlign: [resource.isLoading ? "center" : "left"],
          pt: 1,
        }}
      >
        {resource.isLoading && <CircularProgress size="3rem" />}
        {resource?.data?.data?.zenodo?.metadata?.license?.id ? (
          <Typography>
            {resource?.data?.data?.zenodo?.metadata?.license?.id}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontStyle: "italic" }}
          >
            No license available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export function StatisticsCard({ resource }) {
  const [detailsToggle, setDetailsToggle] = useState(false);
  function handleDetailsToggle() {
    setDetailsToggle(!detailsToggle);
  }
  return (
    <Card sx={cardStyles}>
      <CardContent
        sx={{
          textAlign: [resource?.isLoading ? "center" : "left"],
          paddingBottom: "16px !important",
        }}
      >
        {resource?.isLoading && <CircularProgress size="3rem" />}
        {resource?.isSuccess && (
          <>
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
              sx={{ width: "100%" }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ width: "50%", py: 2 }}
              >
                <Stack alignItems="center" spacing={1}>
                  <Typography
                    variant="h4"
                    fontWeight="500"
                    color="primary.main"
                  >
                    {resource?.data?.data?.zenodo?.stats?.unique_views ?? "N/A"}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VisibilityIcon
                      sx={{ fontSize: "1.1rem", color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      views
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ width: "50%", py: 2 }}
              >
                <Stack alignItems="center" spacing={1}>
                  <Typography
                    variant="h4"
                    fontWeight="500"
                    color="primary.main"
                  >
                    {resource?.data?.data?.zenodo?.stats?.unique_downloads ??
                      "N/A"}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DownloadIcon
                      sx={{ fontSize: "1.1rem", color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      downloads
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              {resource?.data?.data?.resource_type !== "service" && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: "50%", py: 2 }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <Typography
                      variant="h4"
                      fontWeight="500"
                      color="primary.main"
                    >
                      {resource?.data?.data?.zenodo?.indicators?.citationImpact
                        ?.citationCount ?? "N/A"}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FormatQuoteIcon
                        sx={{ fontSize: "1.1rem", color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        citations
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              )}
            </Stack>

            <Stack direction="row" justifyContent={"center"}>
              <Button
                onClick={handleDetailsToggle}
                startIcon={
                  !detailsToggle ? (
                    <KeyboardDoubleArrowDownIcon />
                  ) : (
                    <KeyboardDoubleArrowUpIcon />
                  )
                }
              >
                {!detailsToggle && "Show more"}
                {detailsToggle && "Show less"}
              </Button>
            </Stack>

            {detailsToggle && (
              <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                <TableContainer sx={{ maxWidth: 500 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "primary.text",
                            fontWeight: 600,
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            color: "primary.text",
                            fontWeight: 600,
                          }}
                        >
                          This Version
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "primary.text",
                            fontWeight: 600,
                          }}
                        >
                          All Versions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow hover>
                        <TableCell>
                          <Tooltip title="Views">
                            <VisibilityIcon
                              sx={{ fontSize: 20, color: "text.secondary" }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {resource?.data?.data?.zenodo?.stats
                              ?.version_unique_views ?? "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {resource?.data?.data?.zenodo?.stats
                              ?.unique_views ?? "N/A"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell>
                          <Tooltip title="Downloads">
                            <DownloadIcon
                              sx={{ fontSize: 20, color: "text.secondary" }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {resource?.data?.data?.zenodo?.stats
                              ?.version_unique_downloads ?? "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {resource?.data?.data?.zenodo?.stats
                              ?.unique_downloads ?? "N/A"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function GeographicCoverageCard({ resource }) {
  const [detailsToggle, setDetailsToggle] = useState(false);
  if (resource?.isLoading) {
    return (
      <Card sx={cardStyles}>
        <CardHeader
          sx={{ pb: 1 }}
          title={<Typography variant="h5">Geographical Coverage</Typography>}
        />
        <CardContent sx={{ textAlign: "center", pt: 4 }}>
          <CircularProgress size="3rem" />
        </CardContent>
      </Card>
    );
  }

  if (resource?.data?.data?.geographical_coverage.length === 0) {
    return (
      <Card sx={cardStyles}>
        <CardHeader
          sx={{ pb: 1 }}
          title={<Typography variant="h5">Geographical Coverage</Typography>}
        />
        <CardContent sx={{ pt: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontStyle: "italic" }}
          >
            No geographical coverage data available
          </Typography>
        </CardContent>
      </Card>
    );
  }
  const displayedCoverage = detailsToggle
    ? resource
    : resource?.data?.data?.geographical_coverage;

  return (
    <Card sx={cardStyles}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant="h5">Geographical Coverage</Typography>}
      />
      <CardContent sx={{ pt: 1 }}>
        <Grid container spacing={1} sx={{ pb: 1 }}>
          {displayedCoverage?.map((geo) => (
            <Grid item xs={3} key={geo.id}>
              <Chip
                label={
                  <Typography
                    noWrap
                    sx={{ maxWidth: "100%", display: "block" }}
                    title={geo.label}
                    variant="subtitle2"
                  >
                    {geo.label}
                  </Typography>
                }
                avatar={
                  <Avatar src={geo.flag} alt={geo.label}>
                    <span style={{ color: "white" }}>
                      {geo?.label.toUpperCase()[0]}
                    </span>
                  </Avatar>
                }
                variant="outlined"
                sx={{
                  width: "100%",
                  border: "none !important",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
