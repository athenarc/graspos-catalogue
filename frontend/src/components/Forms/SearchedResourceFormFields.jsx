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
import DynamicFieldGroup from "@helpers/DynamicFieldGroup";
import AlertHelperText from "@helpers/AlertHelperText";

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
      helperText={form?.formState?.errors?.description?.message ?? " "}
      fullWidth
      multiline
      rows={4}
      label="Description"
      disabled={disabled}
      value={searchedResource?.metadata?.description || ""}
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
    <>
      <TextField
        {...form?.register(name, { required })}
        error={!!form?.formState?.errors?.searched_resource}
        helperText=" "
        label={name.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        fullWidth={fullWidth}
        disabled={disabled}
        value={value || ""}
        sx={{ flex: 1 }}
      />
      {form?.formState?.errors?.searched_resource && (
        <AlertHelperText error={form?.formState?.errors?.searched_resource} />
      )}
    </>
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
      sx={{ flex: 1 }}
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
    references: {},
    contributors: { name: "", affiliation: "", orcid: "" },
    grants: { code: "", internal_id: "", acronym: "", program: "", url: "" },
  };
  const allTabs = resourceType === "service" ? openAireTabs : zenodoTabs;

  const visibleTabs = allTabs.filter((tabName) => {
    const value = searchedResource?.metadata?.[tabName.toLowerCase()] || {};
    return value && (Array.isArray(value) ? value.length > 0 : true);
  });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const title = searchedResource?.metadata?.title || "";
  const name = searchedResource?.metadata?.name || "";
  const publicationDate = searchedResource?.metadata?.publication_date;

  return (
    searchedResource && (
      <Stack
        spacing={2}
        sx={{ flex: 1, p: 2, border: "1px solid #ccc", borderRadius: 1 }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Searched Resource Information
        </Typography>

        <Stack direction="row" spacing={2}>
          <SearchedResourceTextField
            name={resourceType === "service" ? "name" : "title"}
            value={resourceType === "service" ? name : title}
            form={form}
            disabled={disabled}
            fullWidth
            required
          />
          {resourceType !== "service" && (
            <SearchedResourceTextField
              name="doi"
              value={searchedResource?.metadata?.doi}
              form={form}
              disabled={disabled}
              fullWidth={false}
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

        <Stack
          direction="row"
          spacing={2}
          sx={{ marginTop: "0px !important;" }}
        >
          <DescriptionTextArea
            searchedResource={searchedResource}
            form={form}
            disabled={disabled}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{ marginTop: "0px !important;" }}
        >
          <SearchedResourceTextField
            name="language"
            value={searchedResource?.metadata?.language}
            form={form}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{ marginTop: "0px !important;" }}
        >
          <AccessRightsSelect
            searchedResource={searchedResource}
            form={form}
            disabled={disabled}
            fullWidth={false}
          />

          <SearchedResourceTextField
            value={searchedResource?.metadata?.license?.id}
            name="license"
            form={form}
            fullWidth={false}
          />

          <SearchedResourceTextField
            value={searchedResource?.metadata?.version}
            name="version"
            form={form}
            fullWidth={false}
          />
        </Stack>

        <Stack
          direction="column"
          spacing={1}
          sx={{ marginTop: "0px !important;" }}
        >
          <Tabs value={tabIndex} onChange={handleTabChange}>
            {allTabs.map((tabName, index) => (
              <Tab
                key={tabName}
                label={
                  tabName !== "grants"
                    ? tabName.charAt(0).toUpperCase() + tabName.slice(1)
                    : "Funding"
                }
              />
            ))}
          </Tabs>

          <Box sx={{ p: 2 }}>
            {visibleTabs?.map((tabName, index) => (
              <Box
                key={tabName}
                sx={{ display: tabIndex === index ? "block" : "none" }}
              >
                <DynamicFieldGroup
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
