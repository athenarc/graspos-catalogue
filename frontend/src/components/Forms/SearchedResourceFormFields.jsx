import { useState } from "react";
import {
  Box,
  Stack,
  Tabs,
  Tab,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enGB } from "date-fns/locale";
import DynamicFieldGroupSmart from "@helpers/DynamicFieldGroup";
import AlertHelperText from "@helpers/AlertHelperText";
import TrlFormField from "./TrlFormField";
import { sanitizeHtml } from "../../utils/utils";

export function DescriptionTextArea({
  searchedResource,
  form,
  disabled = true,
}) {
  return (
    <TextField
      {...form?.register("description", {
        required: "Description is required",
      })}
      error={!!form?.formState?.errors?.description}
      helperText={form?.formState?.errors?.description?.message ?? ""}
      fullWidth
      multiline
      rows={5}
      label="Description"
      disabled={disabled}
      value={searchedResource?.metadata?.description || ""}
      sx={{
        backgroundColor: "#fafafa",
        borderRadius: 1,
      }}
    />
  );
}

export function PublicationDatePickerField({
  searchedResource,
  form,
  disabled = true,
}) {
  const publicationDate = searchedResource?.metadata?.publication_date
    ? new Date(
        searchedResource.metadata.publication_date.$date ||
          searchedResource.metadata.publication_date
      )
    : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <DatePicker
        label="Publication Date"
        value={publicationDate}
        format="dd/MM/yyyy"
        disabled={disabled}
        slotProps={{
          textField: {
            error: !!form?.formState?.errors?.publication_date,
            helperText:
              form?.formState?.errors?.publication_date?.message ?? "",
          },
        }}
        sx={{
          minWidth: 200,
          flex: 1,
          backgroundColor: "#fafafa",
          "& .MuiOutlinedInput-root": { borderRadius: 1 },
        }}
      />
    </LocalizationProvider>
  );
}

export function SearchedResourceTextField({
  value,
  form,
  name,
  required = false,
  disabled = true,
  fullWidth = true,
}) {
  return (
    <Stack spacing={2} sx={{ minWidth: 200, flex: 1 }}>
      <TextField
        {...form?.register(name, { required })}
        error={!!form?.formState?.errors?.[name]}
        label={name.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        fullWidth={fullWidth}
        disabled={disabled}
        value={value || ""}
        sx={{
          backgroundColor: "#fafafa",
          "& .MuiOutlinedInput-root": { borderRadius: 1 },
        }}
      />
      {form?.formState?.errors?.[name] && (
        <AlertHelperText error={form?.formState?.errors?.[name]} />
      )}
    </Stack>
  );
}

export function AccessRightsSelect({
  searchedResource,
  form,
  disabled = true,
  fullWidth = true,
}) {
  const accessRight = searchedResource?.metadata?.access_right || "";
  return (
    <TextField
      select
      label="Access Rights"
      disabled={disabled}
      value={accessRight}
      fullWidth={fullWidth}
      sx={{
        minWidth: 200,
        flex: 1,
        backgroundColor: "#fafafa",
        borderRadius: 1,
      }}
    >
      <MenuItem value="open">Open Access</MenuItem>
      <MenuItem value="embargoed">Embargoed Access</MenuItem>
      <MenuItem value="restricted">Restricted Access</MenuItem>
      <MenuItem value="closed">Closed Access</MenuItem>
    </TextField>
  );
}

export default function SearchedResourceFormFields({
  form,
  searchedResource,
  disabled = true,
  resourceType,
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const openAireTabs = ["tags"];
  const zenodoTabs = [
    "creators",
    "keywords",
    "references",
    "contributors",
    "grants",
  ];
  const fieldSchemas = {
    creators: { name: "", affiliation: "", orcid: "" },
    contributors: { name: "", affiliation: "", orcid: "" },
    grants: { code: "", internal_id: "", acronym: "", program: "", url: "" },
  };
  const allTabs = resourceType === "service" ? openAireTabs : zenodoTabs;

  const visibleTabs = allTabs.filter((tabName) => {
    const value = searchedResource?.metadata?.[tabName.toLowerCase()] || {};
    return value && (Array.isArray(value) ? value.length > 0 : true);
  });

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const title = searchedResource?.metadata?.title || "";
  const name = searchedResource?.metadata?.name || "";
  const publicationDate = searchedResource?.metadata?.publication_date;

  return (
    searchedResource && (
      <Stack
        spacing={3}
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h6">Searched Resource Information</Typography>

        {/* Top row: title/name, doi, publication date */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          flexWrap="wrap"
        >
          <SearchedResourceTextField
            name={resourceType === "service" ? "name" : "title"}
            value={resourceType === "service" ? name : title}
            form={form}
            disabled={disabled}
            required
          />
          {resourceType !== "service" && (
            <SearchedResourceTextField
              name="doi"
              value={searchedResource?.metadata?.doi}
              form={form}
              disabled={disabled}
            />
          )}
          {publicationDate && (
            <PublicationDatePickerField
              searchedResource={searchedResource}
              form={form}
              disabled={disabled}
            />
          )}
        </Stack>

        {/* Description */}
        <DescriptionTextArea
          searchedResource={searchedResource}
          form={form}
          disabled={disabled}
        />

        {/* Language and TRL */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          flexWrap="wrap"
        >
          <SearchedResourceTextField
            name="language"
            value={searchedResource?.metadata?.language}
            form={form}
          />
          {resourceType === "service" && (
            <TrlFormField
              form={form}
              name="trl"
              label="TRL"
              searchedResource={searchedResource}
            />
          )}
        </Stack>

        {/* Access, license, version */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          flexWrap="wrap"
        >
          <AccessRightsSelect
            searchedResource={searchedResource}
            form={form}
            disabled={disabled}
          />
          <SearchedResourceTextField
            name="license"
            value={searchedResource?.metadata?.license?.id}
            form={form}
          />
          <SearchedResourceTextField
            name="version"
            value={searchedResource?.metadata?.version}
            form={form}
          />
        </Stack>

        {/* Tabs for dynamic fields */}
        <Stack direction="column" spacing={1}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {allTabs.map((tabName) => (
              <Tab
                key={tabName}
                label={
                  tabName === "grants"
                    ? "Funding"
                    : tabName.charAt(0).toUpperCase() + tabName.slice(1)
                }
              />
            ))}
          </Tabs>

          <Box
            sx={{
              p: 2,
              border: "1px solid #eee",
              borderRadius: 2,
              backgroundColor: "#fafafa",
            }}
          >
            {visibleTabs?.map((tabName, index) => (
              <Box
                key={tabName}
                sx={{ display: tabIndex === index ? "block" : "none" }}
              >
                <DynamicFieldGroupSmart
                  key={tabName}
                  form={form}
                  searchedResource={searchedResource}
                  fieldName={tabName.toLowerCase()}
                  fieldSchema={fieldSchemas[tabName.toLowerCase()] || undefined}
                  disabled={disabled}
                />
              </Box>
            ))}
          </Box>
        </Stack>
      </Stack>
    )
  );
}
