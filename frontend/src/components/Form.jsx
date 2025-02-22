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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateDataset } from "../queries/data.js";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function Form() {
  const { user } = useOutletContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();
  const createDataset = useCreateDataset();

  const onSubmit = (data) => {
    createDataset.mutate(
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
          <Table
            sx={{
              "& td": {
                borderBottom: "none !important;",
              },
            }}
          >
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>
                  <TextField
                    required
                    {...register("name", {
                      required: "Name can not be empty",
                    })}
                    label="Name"
                    error={!!errors?.name}
                    helperText={errors?.name?.message}
                    fullWidth
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{width: "30%"}}>
                  <Select
                    {...register("visibility", {})}
                    label="visibility"
                    defaultValue="public"
                    fullWidth
                  >
                    <MenuItem value={"private"}>Private</MenuItem>
                    <MenuItem value={"public"}>Public</MenuItem>
                  </Select>
                </TableCell>

                <TableCell sx={{width: "70%"}}>
                  <TextField
                    required
                    {...register("source", {
                      required: "Source can not be empty",
                      pattern: {
                        value:
                          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                        message: "Not a valid URL",
                      },
                    })}
                    label="Source"
                    error={!!errors?.source}
                    helperText={errors?.source?.message}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <TextField
                    {...register("description")}
                    label="Description"
                    error={!!errors?.description}
                    helperText={errors?.description?.message}
                    fullWidth
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <TextField
                    {...register("license")}
                    label="Licence"
                    error={!!errors?.license}
                    helperText={errors?.license?.message}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    {...register("version")}
                    label="Version"
                    error={!!errors?.version}
                    helperText={errors?.version?.message}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    {...register("organization")}
                    label="Organization"
                    error={!!errors?.organization}
                    helperText={errors?.organization?.message}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    {...register("tags")}
                    label="Tags"
                    error={!!errors?.tags}
                    helperText={errors?.tags?.message}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
              <TableRow></TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <TextField
                    {...register("authors")}
                    label="Authors"
                    error={!!errors?.authors}
                    helperText={errors?.authors?.message}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    {...register("api_url")}
                    label="API URL"
                    error={!!errors?.api_url}
                    helperText={errors?.api_url?.message}
                    fullWidth
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    {...register("api_url_instructions")}
                    label="API URL Instructions"
                    error={!!errors?.api_url_instructions}
                    helperText={errors?.api_url_instructions?.message}
                    fullWidth
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={2}>
                  <TextField
                    {...register("documentation_url")}
                    label="Documentation URL"
                    error={!!errors?.documentation_url}
                    helperText={errors?.documentation_url?.message}
                    fullWidth
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <TextField
                    {...register("contact_person")}
                    label="Contact Person"
                    error={!!errors?.contact_person}
                    helperText={errors?.contact_person?.message}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    {...register("contact_person_email")}
                    label="Contact person email"
                    error={!!errors?.contact_person_email}
                    helperText={errors?.contact_person_email?.message}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={createDataset.isLoading}
          >
            {createDataset.isLoading ? (
              <>
                Creating Dataset
                <CircularProgress size="13px" sx={{ ml: 1 }} />
              </>
            ) : (
              <>
                Create
                {/* <PlusIcon sx={{ ml: 1 }} /> */}
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
