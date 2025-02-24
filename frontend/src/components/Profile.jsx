import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUpdateUser, useUserInformation } from "../queries/data";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import Notification from "./Notification";

export default function Profile() {
  const { user } = useOutletContext();

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

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  return (
    <>
      <Card
        component="form"
        noValidate
        id="user-update-form"
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
          title={"Profile"}
          sx={{
            backgroundColor: "#338BCB",
            color: "white",
            textAlign: "center",
          }}
        ></CardHeader>
        <CardContent sx={{ display: "flex", p: 4 }}>
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
        <CardContent sx={{ display: "flex", p: 4, pt: 0 }}>
          <TextField
            {...register("first_name", {
              value: user?.first_name,
            })}
            label="First Name"
            sx={{ width: "100%", mr: 3 }}
          />
          <TextField
            {...register("last_name", { value: user?.email })}
            label="Last Name"
            sx={{ width: "100%" }}
          />
        </CardContent>

        <CardContent sx={{ p: 4, pt: 0 }}>
          <TextField
            {...register("organization", {
              value: user?.organization,
            })}
            label="Organization"
            sx={{ width: "100%" }}
          />
        </CardContent>
        <CardContent sx={{ p: 4, pt: 0, textAlign: "center" }}>
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
      {updateUser.isSuccess || updateUser.isError ? (
        <Notification requestStatus={updateUser?.status} message={message} />
      ) : (
        ""
      )}
    </>
  );
}
