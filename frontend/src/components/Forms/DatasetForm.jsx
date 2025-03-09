import { TextField, TableRow, TableCell, TableBody } from "@mui/material";

export default function DatasetForm({ register, errors }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell>
          <TextField
            required
            {...register("source", {
              required: "Source can not be empty",
              pattern: {
                value:
                  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                message: "Not a valid URL",
              },
            })}
            label="Source"
            error={!!errors?.source}
            helperText={errors?.source?.message ?? " "}
            fullWidth
          />
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
