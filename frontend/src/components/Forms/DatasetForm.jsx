import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  IconButton,
  DialogContent,
  TextField,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Notification from "../Notification.jsx";
import { useCreateDataset } from "../../queries/dataset.js";
import ZenodoForm from "./ZenodoForm.jsx";

export default function DatasetForm() {
  const [message, setMessage] = useState("");
  const [zenodoData, setZenodoData] = useState();
  const { user } = useOutletContext();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, setErr },
  } = useForm({ mode: "onBlur" });
  const navigate = useNavigate();
  const createDataset = useCreateDataset();

  useEffect(() => {
    setValue("source", zenodoData?.source);
  }, [zenodoData]);

  const onSubmit = (data) => {
    createDataset.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage("Dataset has been created successfully!");
          setTimeout(() => {
            navigate("..");
          }, 1000);
        },
        onError: (error) => {
          reset();
          setMessage(error?.response?.detail);
          setError("source", {
            message: error?.response?.detail,
          });
        },
      }
    );
  };
  function handleClose() {
    navigate("..");
  }

  return (
    user && (
      <>
        <Dialog
          component="form"
          onClose={handleClose}
          open={true}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          fullWidth
          maxWidth="md"
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
          <Stack direction="column" spacing={2}>
            <ZenodoForm
              zenodoData={zenodoData}
              setZenodoData={setZenodoData}
              setMessage={setMessage}
            />
            {zenodoData && (
              <DialogContent sx={{ p: 2, mt: "0 !important;" }}>
                <Stack direction="row" useFlexGap spacing={1}>
                  <TextField
                    {...register("organization")}
                    label="Organization"
                    error={!!errors?.organization}
                    helperText={errors?.organization?.message ?? " "}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Visibility</InputLabel>
                    <Select
                      {...register("visibility")}
                      label="Visiblity"
                      fullWidth
                      value="public"
                    >
                      <MenuItem value={"private"}>Private</MenuItem>
                      <MenuItem value={"public"}>Public</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction="row" useFlexGap spacing={2}>
                  <TextField
                    {...register("contact_person")}
                    label="Contact Person"
                    error={!!errors?.contact_person}
                    helperText={errors?.contact_person?.message ?? " "}
                    fullWidth
                  />
                  <TextField
                    {...register("contact_person_email")}
                    label="Contact Person Email"
                    error={!!errors?.contact_person_email}
                    helperText={errors?.contact_person_email?.message ?? " "}
                    fullWidth
                  />
                </Stack>
                <Stack direction="row" useFlexGap spacing={2}>
                  <TextField
                    {...register("documentation_url")}
                    label="Documentation Url"
                    error={!!errors?.documentation_url}
                    helperText={errors?.documentation_url?.message ?? " "}
                    fullWidth
                  />
                  <TextField
                    {...register("api_url")}
                    label="Api Url"
                    error={!!errors?.api_url}
                    helperText={errors?.api_url?.message ?? " "}
                    fullWidth
                  />
                </Stack>
                <Stack direction="row" useFlexGap spacing={2}>
                  <FormControl fullWidth>
                    <TextareaAutosize
                      {...register("api_url_instructions")}
                      label="Api Url Instructions"
                      maxRows="6"
                      minRows="6"
                      placeholder="Api Url Instructions"
                    />
                  </FormControl>
                </Stack>
              </DialogContent>
            )}
          </Stack>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!zenodoData}
              loading={createDataset?.isPending}
              endIcon={<AddIcon />}
              loadingPosition="end"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
        {(createDataset?.isSuccess || createDataset?.isError) && (
          <Notification
            requestStatus={createDataset?.status}
            message={message}
          />
        )}
      </>
    )
  );
}
