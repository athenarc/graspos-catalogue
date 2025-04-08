import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  TextField,
  Stack,
  FormControlLabel,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useUpdateUser,
  useUserResetPassword,
  useUsers,
} from "../../queries/data";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Notification from "../Notification";
import { useAuth } from "../AuthContext";

function UserForm({ user }) {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const passwordReset = useUserResetPassword();
  
  function handlePasswordReset(data) {
    passwordReset.mutate(
      { data },
      {
        onSuccess: () => {
          setMessage("User password reset successfully!");
        },
        onError: (error) => {
          setMessage(error?.response?.data?.detail);
        },
      }
    );
  }
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
    <Card component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <CardContent
        component={Stack}
        direction="column"
        spacing={2}
        sx={{ pb: 2 }}
      >
        <Stack direction="row" justifyContent="space-between" sx={{ pb: 2 }}>
          <Typography variant="h5">{user?.username}</Typography>

          <Stack direction="row" justifyContent="end" spacing={2}>
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
            <FormControlLabel
              label="Disabled"
              control={
                <input
                  {...register("disabled", {
                    value: user?.disabled ? true : false,
                  })}
                  type="checkbox"
                />
              }
            />
            <input
              hidden={true}
              {...register("id", {
                value: user?.id,
              })}
              label="Id"
            />

            {(updateUser?.isSuccess || updateUser?.isError) && (
              <Notification
                requestStatus={updateUser?.status}
                message={message}
              />
            )}
          </Stack>
        </Stack>

        <Stack direction={"row"} justifyContent="start" spacing={2}>
          <TextField
            {...register("username", {
              value: user?.username,
            })}
            label="Username"
            disabled
            fullWidth
          />
          <TextField
            {...register("email", {
              value: user?.email,
            })}
            label="Email"
            fullWidth
          />
        </Stack>
        <Stack direction="row" justifyContent="start" spacing={2}>
          <TextField
            {...register("first_name", {
              value: user?.first_name,
            })}
            label="First Name"
            fullWidth
          />
          <TextField
            {...register("last_name", {
              value: user?.last_name,
            })}
            label="Last Name"
            fullWidth
          />
        </Stack>
      </CardContent>
      <CardActions sx={{ p: 2, justifyContent: "end" }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handlePasswordReset({
                email: user?.email,
                password: "12345",
              });
            }}
            endIcon={<RestartAltIcon />}
          >
            Reset Password
          </Button>
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
            disabled={updateUser.isPending}
            loading={updateUser.isPending}
            endIcon={<SaveIcon />}
            loadingPosition="end"
            sx={{ backgroundColor: "#20477B" }}
          >
            Save
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}

export default function UsersPanelForm() {
  const { user } = useAuth();
  const users = useUsers();

  const navigate = useNavigate();

  function handleClose() {
    navigate(-1);
  }

  return (
    user && (
      <Dialog onClose={handleClose} open={true} maxWidth="md" fullWidth>
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
