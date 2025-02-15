import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUpdateUser } from "../queries/data";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import Notification from "./Notification";

export default function Profile() {
  const { user } = useOutletContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ mode: "onBlur" });
  const updateUser = useUpdateUser();
  const onSubmit = (data) => {
    updateUser.mutate({ data });
  };

  return (
    <>
      <Card
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        p={2}
        sx={{
          maxWidth: 600,
          margin: "auto",
          mt: "10vh",
          borderRadius: "10px",
        }}
      >
        <CardHeader
          title="My profile"
          sx={{ backgroundColor: "#338BCB", color: "white" }}
        ></CardHeader>
        <CardContent sx={{ display: "flex", p: 3, mt: 3 }}>
          <TextField
            required
            {...register("username", {
              value: user?.username,
              required: "Username can not be empty",
            })}
            label="Username"
            error={!!errors?.username}
            helperText={errors?.username?.message}
            sx={{ mr: 3, width: "100%" }}
          />
          <TextField
            required
            {...register("password", {
              value: user?.password,
              required: "Password can not be empty",
            })}
            label="Password"
            type="password"
            error={!!errors?.password}
            helperText={errors?.password?.message}
            sx={{ width: "100%" }}
          />
        </CardContent>
        <CardContent sx={{ p: 3 }}>
          <TextField
            required
            {...register("email", {
              value: user?.email,
              required: "Email can not be empty",
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Invalid email address",
              },
            })}
            label="Email"
            error={!!errors?.email}
            helperText={errors?.email?.message}
            sx={{ width: "100%" }}
          />
        </CardContent>
        <CardContent sx={{ display: "flex", p: 3 }}>
          <TextField
            {...register("first_name", { value: user?.first_name })}
            label="First Name"
            sx={{ width: "100%", mr: 3 }}
          />
          <TextField
            {...register("last_name", { value: user?.last_name })}
            label="Last Name"
            sx={{ width: "100%" }}
          />
        </CardContent>

        <CardContent sx={{ p: 3 }}>
          <TextField
            {...register("organization", { value: user?.organization })}
            label="Organization"
            sx={{ width: "100%" }}
          />
        </CardContent>
        <CardContent>
          <Button
            type="submit"
            variant="contained"
            disabled={updateUser.isLoading}
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
        </CardContent>
      </Card>
      {updateUser.isSuccess ? (
        <Notification message={"User information was updated successfully"} />
      ) : (
        ""
      )}
    </>
  );
}
