import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  FormGroup,
  Card,
  CardContent,
  Checkbox,
  Box,
  Tooltip,
  FormControlLabel,
  Autocomplete,
  TextField,
  Grid,
  Button,
  Tabs,
  Tab,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Notification from "../Notification";
import { useForm, Controller } from "react-hook-form";

export default function EditResourceDialog({
  open,
  onClose,
  scopesQuery,
  countriesQuery,
  assessmentsQuery,
  selectedScopes,
  onToggleScope,
  mutation,
  onSave,
}) {
  const { isSuccess, isError, error, reset, isPending } = mutation;
  const { control, watch, setValue, getValues } = useForm({
    defaultValues: {
      geographical_coverage: [],
      assessments: [],
    },
  });

  const assessments = watch("assessments") ?? [];
  const [tabIndex, setTabIndex] = useState(0);

  let message = "";
  if (isSuccess) message = "Scopes updated successfully!";
  if (isError) message = error?.message || "Failed to update scopes.";

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        reset();
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleAssessment = (id) => {
    setValue(
      "assessments",
      assessments.includes(id)
        ? assessments.filter((a) => a !== id)
        : [...assessments, id]
    );
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{ bgcolor: "#20477B", color: "white", textAlign: "center" }}
        >
          Edit Scopes
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 4, py: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={(_, newIndex) => setTabIndex(newIndex)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab label="Scope Stages" />
            <Tab label="Assessment subjects" />
            <Tab label="Geographical coverage" />
          </Tabs>

          {tabIndex === 0 && (
            <FormGroup>
              <Grid container spacing={2}>
                {scopesQuery.data?.data.map((scope) => (
                  <Grid item xs={12} sm={6} md={4} key={scope._id}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderColor: scope.bg_color ?? "#1976d2",
                        height: "100%",
                      }}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between">
                          <Typography fontWeight={600}>{scope.name}</Typography>
                          <Checkbox
                            checked={selectedScopes.includes(scope._id)}
                            onChange={() => onToggleScope(scope._id)}
                            sx={{ color: scope.bg_color ?? "#1976d2" }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {scope.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          )}

          {tabIndex === 1 && (
            <FormGroup row>
              {assessmentsQuery?.data?.data?.map((a) => (
                <Tooltip key={a._id} title={a.description}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={assessments.includes(a._id)}
                        onChange={() => toggleAssessment(a._id)}
                      />
                    }
                    label={a.name}
                  />
                </Tooltip>
              ))}
            </FormGroup>
          )}
          {tabIndex === 2 && (
            <Controller
              name="geographical_coverage"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  options={countriesQuery?.data?.data ?? []}
                  getOptionLabel={(option) => option?.label}
                  value={field?.value ?? []}
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
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: "#f8f9fa",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button onClick={onClose} variant="outlined" disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSave({
                scopes: selectedScopes,
                assessments: getValues("assessments"),
                geographical_coverage: getValues("geographical_coverage").map(
                  (country) => country._id
                ),
              })
            }
            variant="contained"
            endIcon={<SaveIcon />}
            sx={{ backgroundColor: "#20477B" }}
            disabled={isPending}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {(isSuccess || isError) && (
        <Notification
          requestStatus={isSuccess ? "success" : "error"}
          message={message}
        />
      )}
    </>
  );
}
