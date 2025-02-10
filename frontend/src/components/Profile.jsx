import {
  Box,
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
import Notification from "./Alert";

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
        p={2}
        sx={{
          height: "auto",
          margin: "auto",
          marginTop: "10vh",
          maxWidth: "30vw",
          borderRadius: "10px",
        }}
      >
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CardHeader
            title="My profile"
            sx={{ backgroundColor: "#338BCB", color: "white" }}
          >
            Login
          </CardHeader>
          <CardContent sx={{ mt: 4 }}>
            <TextField
              {...register("first_name", { value: user?.first_name })}
              label="First Name"
            />
            <TextField
              {...register("last_name", {
                value: user?.last_name,
              })}
              label="Last Name"
            />
          </CardContent>

          <CardContent>
            <TextField
              {...register("email", {
                value: user?.email,
                required: "Field can not be empty",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Invalid email address",
                },
              })}
              label="Email"
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />
            <TextField
              {...register("organization", { value: user?.organization })}
              label="Organization"
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
        </Box>
      </Card>
      {updateUser.isSuccess ? (
        <Notification message={"User information was updated successfully"} />
      ) : (
        ""
      )}
    </>
  );
}
