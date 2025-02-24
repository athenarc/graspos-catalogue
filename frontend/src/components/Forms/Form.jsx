import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Table,
  TableRow,
  TableCell,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableHead,
  TableContainer,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateDataset, useCreateResource } from "../../queries/data.js";
import ResourceForm from "./ResourceForm.jsx";
import DatasetForm from "./DatasetForm.jsx";
import { useState } from "react";

export default function Form() {
  const [resourceType, setResourceType] = useState();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();
  const createDataset = useCreateDataset();
  const createResource = useCreateResource();
  let query = null;

  function handleResourceTypeChange(value) {
    reset();
    setResourceType(value);
  }
  const onSubmit = (data) => {
    if (data.type === "dataset") {
      query = createDataset;
    } else {
      query = createResource;
    }
    query.mutate(
      { data },
      {
        onSuccess: (data) => {
          navigate("..");
        },
      }
    );
  };
  function handleClose() {
    navigate("..");
  }

  return (
    <>
      <Dialog
        component="form"
        onClose={handleClose}
        open={open}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#338BCB",
            color: "white",
            textAlign: "center",
          }}
        >
          Create Resource
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
        <DialogContent dividers sx={{ p: 1 }}>
          <TableContainer
            sx={{
              maxHeight: 500,
            }}
          >
            <Table
              stickyHeader
              sx={{
                "& td, th": {
                  borderBottom: "none !important;",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        defaultValue={""}
                        label="Type"
                        fullWidth
                        onChange={(event) =>
                          handleResourceTypeChange(event?.target?.value)
                        }
                      >
                        <MenuItem value={"dataset"}>Dataset</MenuItem>
                        <MenuItem value={"resource"}>Resource</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              </TableHead>

              {resourceType === "dataset" && (
                <DatasetForm
                  register={register}
                  errors={errors}
                  control={control}
                />
              )}
              {resourceType === "resource" && (
                <ResourceForm
                  register={register}
                  errors={errors}
                  control={control}
                />
              )}
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={createDataset.isLoading || !resourceType}
          >
            {createDataset.isLoading ? (
              <>
                Creating Dataset
                <CircularProgress size="13px" sx={{ ml: 1 }} />
              </>
            ) : (
              <>
                Create
                <AddIcon sx={{ ml: 1 }} />
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {createDataset.isSuccess ? (
        <Notification
          requestStatus={createDataset?.status}
          message={"Dataset created successfully"}
        />
      ) : (
        ""
      )}
    </>
  );
}
