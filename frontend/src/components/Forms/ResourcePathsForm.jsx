import {
  Stack,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Divider,
  Typography,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Tooltip,
  TextField,
  Autocomplete,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Controller } from "react-hook-form";
import DatasetFormFields from "./DatasetFormFields.jsx";
import DocumentFormFields from "./DocumentsFormFields.jsx";
import ToolFormFields from "./ToolFormFields.jsx";
import ServiceFormFields from "./ServiceFormFields.jsx";
import { useState, useEffect } from "react";
import { useScopes } from "@queries/scope.js";
import { useCountries } from "@queries/countries.js";
import { useAssessments } from "@queries/assessment.js";

export default function ResourcePathsForm({
  data,
  control,
  setValue,
  resourceType,
  resourceTypesList,
  setResourceType,
  register,
  errors,
}) {
  const scopesQuery = useScopes();
  const countries = useCountries();
  const assessmentData = useAssessments();

  const [selectedScopes, setSelectedScopes] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState([]);

  useEffect(() => {
    setValue("scopes", selectedScopes);
  }, [selectedScopes, setValue]);

  useEffect(() => {
    setValue("assessments", selectedAssessments);
  }, [selectedAssessments, setValue]);

  const handleToggleScope = (scopeId) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((id) => id !== scopeId)
        : [...prev, scopeId]
    );
  };

  const handleToggleAssessment = (assessmentId) => {
    setSelectedAssessments((prev) =>
      prev.includes(assessmentId)
        ? prev.filter((id) => id !== assessmentId)
        : [...prev, assessmentId]
    );
  };
  return (
    data && (
      <>
        <Divider orientation="vertical" flexItem />
        <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" sx={{ mr: 0.5 }}>
              Resource Scope
            </Typography>
            <Tooltip title="SCOPE Framework for Research Evaluation">
              <InfoIcon fontSize="small" />
            </Tooltip>
          </Stack>

          <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
            <FormGroup row>
              {scopesQuery?.data?.data?.map((scope) => (
                <Tooltip key={scope._id} title={scope?.description}>
                  <FormControlLabel
                    key={scope._id}
                    control={
                      <Checkbox
                        checked={selectedScopes.includes(scope._id)}
                        onChange={() => handleToggleScope(scope._id)}
                        sx={{ color: scope.bg_color ?? "#1976d2" }}
                      />
                    }
                    label={scope.name}
                  />
                </Tooltip>
              ))}
            </FormGroup>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Typography variant="h6" sx={{ mr: 0.5 }}>
              Geographical Coverage
            </Typography>
            <Tooltip title="Select applicable countries or regions.">
              <InfoIcon fontSize="small" />
            </Tooltip>
          </Stack>
          {/* Geographical Coverage */}
          <Controller
            name="geographical_coverage"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={countries?.data?.data}
                getOptionLabel={(option) => option.label}
                value={field.value ?? []}
                onChange={(_, value) => field.onChange(value)}
                renderOption={(props, option) => {
                  const { key, ...rest } = props;
                  return (
                    <li key={key} {...rest}>
                      <img
                        loading="lazy"
                        width="20"
                        src={option.flag}
                        alt=""
                        style={{ marginRight: 10 }}
                      />
                      {option.label} ({option.code})
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select countries"
                    placeholder="Start typing..."
                  />
                )}
              />
            )}
          />
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" sx={{ mr: 0.5 }}>
              Assessment Stages
            </Typography>
            <Tooltip title="">
              <InfoIcon fontSize="small" />
            </Tooltip>
          </Stack>
          <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
            <FormGroup row>
              {assessmentData?.data?.data?.map((assessment) => (
                <Tooltip key={assessment._id} title={assessment?.description}>
                  <FormControlLabel
                    key={assessment._id}
                    control={
                      <Checkbox
                        checked={selectedAssessments.includes(assessment._id)}
                        onChange={() => handleToggleAssessment(assessment._id)}
                      />
                    }
                    label={assessment.name}
                  />
                </Tooltip>
              ))}
            </FormGroup>
          </Stack>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Resource Details
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Resource type</InputLabel>
            <Select
              disabled={!data}
              value={resourceType}
              labelId="resource-type-select-label"
              label="Resource type"
              onChange={(e) => setResourceType(e.target.value)}
            >
              {resourceTypesList.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {resourceType === "dataset" && (
            <DatasetFormFields
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
          {resourceType === "document" && (
            <DocumentFormFields register={register} errors={errors} />
          )}
          {resourceType === "tool" && (
            <ToolFormFields register={register} errors={errors} />
          )}
          {resourceType === "service" && (
            <ServiceFormFields register={register} errors={errors} />
          )}
        </Stack>
      </>
    )
  );
}
