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
import { useCreateDataset, useCreateDocument } from "../../queries/data.js";
import ResourceForm from "./DocumentForm.jsx";
import DatasetForm from "./DatasetForm.jsx";
import { useState } from "react";
import Notification from "../Notification.jsx";

export default function Form() {
  const [resourceType, setResourceType] = useState();
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, setErr },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();
  const createDataset = useCreateDataset();
  const createDocument = useCreateDocument();

  function handleResourceTypeChange(value) {
    reset();
    setResourceType(value);
  }

  const onSubmit = (data) => {
    if (resourceType == "dataset") {
      createDataset.mutate(
        { data },
        {
          onSuccess: () => {
            setMessage(resourceType + " has been created successfully!");
            setTimeout(() => {
              navigate("..");
            }, 2000);
          },
          onError: (error) => {
            setMessage(error?.response?.data?.detail);
            setError("source", {
              "message": error?.response?.data?.detail,
            });
          },
        }
      );
    } else {
      createDocument.mutate(
        { data },
        {
          onSuccess: () => {
            setMessage(resourceType + " has been created successfully!");
            setTimeout(() => {
              navigate("..");
            }, 2000);
          },
          onError: (error) => {
            setMessage(error?.response?.data?.detail);
            setError("source", {
              "message": error?.response?.data?.detail,
            });
          },
        }
      );
    }
  };
  function handleClose() {
    navigate("..");
  }

  return (
    <>
      <Dialog
        component="form"
        onClose={handleClose}
        open={true}
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
        <DialogContent dividers sx={{ p: 1, minWidth: 300 }}>
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
                        <MenuItem value={"document"}>Document</MenuItem>
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
              {resourceType === "document" && (
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
            disabled={
              createDataset?.isLoading ||
              createDocument?.isLoading ||
              createDataset?.isSuccess ||
              createDocument?.isSuccess ||
              !resourceType
            }
          >
            {createDocument?.isLoading || createDataset?.isLoading ? (
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
      {(createDataset?.isSuccess ||
        createDataset?.isError ||
        createDocument?.isSuccess ||
        createDocument?.isError) && (
        <Notification
          requestStatus={createDataset?.status ?? createDocument?.status}
          message={message}
        />
      )}
    </>
  );
}
