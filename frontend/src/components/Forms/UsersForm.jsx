import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  FormGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateUser, useUsers } from "../../queries/data";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Notification from "../Notification";

function UserForm({ user }) {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const updateUser = useUpdateUser();
  const onSubmit = (data) => {
    updateUser.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage("User information updated successfully!");
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail);
        },
      }
    );
  };

  function handleReset() {
    reset(user);
  }
  return (
    <Stack
      direction={"row"}
      justifyContent="center"
      spacing={2}
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        {...register("username", {
          value: user?.username,
        })}
        label="Username"
      />
      <TextField
        {...register("email", {
          value: user?.email,
        })}
        label="Email"
      />
      <TextField
        {...register("first_name", {
          value: user?.first_name,
        })}
        label="First Name"
      />
      <TextField
        {...register("last_name", {
          value: user?.last_name,
        })}
        label="Last Name"
      />
      <input
        hidden={true}
        {...register("id", {
          value: user?.id,
        })}
        label="Id"
      />
      <FormControlLabel
        label="Admin"
        control={
          <input
            {...register("super_user", {
              value: user?.super_user ? true : false,
            })}
            type="checkbox"
          />
        }
      />
      <Button
        variant="outlined"
        onClick={handleReset}
        endIcon={<RestartAltIcon />}
      >
        Reset
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={updateUser.isLoading}
        sx={{ backgroundColor: "#20477B" }}
      >
        {updateUser.isLoading ? (
          <>
            Saving
            <CircularProgress size="13px" sx={{ ml: 1 }} />
          </>
        ) : (
          <>
            Save
            <SaveIcon sx={{ ml: 1 }} />
          </>
        )}
      </Button>
      {(updateUser?.isSuccess || updateUser?.isError) && (
        <Notification requestStatus={updateUser?.status} message={message} />
      )}
    </Stack>
  );
}

export default function UsersPanelForm() {
  const { user } = useOutletContext();
  const users = useUsers();

  const navigate = useNavigate();

  function handleClose() {
    navigate("..");
  }

  return (
    user && (
      <Dialog onClose={handleClose} open={true} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: "#20477B",
            color: "white",
            textAlign: "center",
          }}
        >
          Users
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
          <Stack direction={"column"} justifyContent="center" spacing={2}>
            {users?.data?.data?.map((user) => (
              <UserForm key={user?.id} user={user} />
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    )
  );
}
