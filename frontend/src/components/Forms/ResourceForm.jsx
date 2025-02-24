import {
  TextField,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller } from "react-hook-form";

export default function ResourceForm({ register, errors, control }) {
  return (
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
            helperText={errors?.name?.message ?? " "}
            fullWidth
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={2}>
          <TextField
            required
            {...register("url", {
              required: "Url can not be empty",
              pattern: {
                value:
                  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                message: "Not a valid URL",
              },
            })}
            label="Url"
            error={!!errors?.url}
            helperText={errors?.url?.message ?? " "}
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
            helperText={errors?.description?.message ?? " "}
            fullWidth
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <Controller
                control={control}
                name="created"
                defaultValue={null}
                render={({
                  field: { ref, onBlur, name, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <DatePicker
                    {...field}
                    inputRef={ref}
                    label="Created"
                    onChange={onChange}
                    name={name}
                    slotProps={{
                      textField: {
                        onBlur,
                        name,
                        error: !!error,
                        helperText: error?.message ?? " ",
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
            </DemoContainer>
          </LocalizationProvider>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <Controller
                control={control}
                name="data_last_updated"
                defaultValue={null}
                render={({
                  field: { ref, onBlur, name, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <DatePicker
                    {...field}
                    inputRef={ref}
                    label="Data Last Updated"
                    onChange={onChange}
                    name={name}
                    slotProps={{
                      textField: {
                        onBlur,
                        name,
                        error: !!error,
                        helperText: error?.message ?? " ",
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
            </DemoContainer>
          </LocalizationProvider>
        </TableCell>
        <TableCell>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <Controller
                control={control}
                name="metadata_last_updated"
                defaultValue={null}
                render={({
                  field: { ref, onBlur, name, onChange, ...field },
                  fieldState: { error },
                }) => (
                  <DatePicker
                    {...field}
                    inputRef={ref}
                    label="Metadata Last Updated"
                    onChange={onChange}
                    name={name}
                    slotProps={{
                      textField: {
                        onBlur,
                        name,
                        error: !!error,
                        helperText: error?.message ?? " ",
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
            </DemoContainer>
          </LocalizationProvider>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
