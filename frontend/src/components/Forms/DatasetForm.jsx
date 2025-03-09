import { TextField } from "@mui/material";
import { useCreateDataset } from "../../queries/dataset";

export default function DatasetForm({ register, errors, query }) {
  const createDataset = useCreateDataset();
  query = createDataset;
  return (
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
      label="Zenodo source"
      error={!!errors?.source}
      helperText={errors?.source?.message ?? " "}
      fullWidth
    />
  );
}
