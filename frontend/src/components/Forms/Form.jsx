import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Table,
  TableRow,
  TableCell,
  CircularProgress,
  TableBody,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  TableHead,
  TableContainer,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useOutletContext } from "react-router-dom";
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
          id="customized-dialog-title"
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
        <DialogContent dividers sx={{ p: 2 }}>
          <TableContainer
            sx={{
              maxHeight: 500,
            }}
          >
            <Table
              stickyHeader
              sx={{
                minWidth: 400,
                "& td": {
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
