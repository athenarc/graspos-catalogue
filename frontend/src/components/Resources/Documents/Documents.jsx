import { useEffect, useState } from "react";
import { useDocuments, useDocument } from "../../../queries/document";
import { RectangularVariants } from "../../Skeleton";
import ResourceGridItem from "../ResourceGridItem";
import { Button, Grid2 as Grid, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import {
  ResourceAuthors,
  ResourceBasicInformation,
  ResourceLicense,
  ResourceTags,
} from "../ResourceDetails";

export default function Documents({ user, filter }) {
  const documents = useDocuments();
  const [filteredDocuments, setFilteredDocuments] = useState(
    documents?.data?.data ?? []
  );
  useEffect(() => {
    if (filter !== "") {
      setFilteredDocuments(
        documents?.data?.data?.filter((document) =>
          document?.zenodo?.metadata?.title
            ?.toLowerCase()
            .includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredDocuments(documents?.data?.data);
    }
  }, [documents?.data?.data, filter]);

  return (
    <>
      {documents?.isLoading && <RectangularVariants count={3} />}
      {documents?.isFetched &&
        filteredDocuments?.map((document) => (
          <ResourceGridItem
            key={document._id}
            resource={document}
            type={"Document"}
            user={user}
          />
        ))}
      {user && (
        <Button
          color="primary"
          variant="outlined"
          component={Link}
          to="/document/add"
          sx={{
            position: "absolute",
            right: "24px",
            bottom: "24px",
            backgroundColor: "#fff",
          }}
        >
          Add Document
        </Button>
      )}
    </>
  );
}

export function Document({ resourceId }) {
  const document = useDocument(resourceId);
  return (
    <>
      <Grid size={8}>
        <ResourceBasicInformation resource={document} />
      </Grid>
      <Grid size={4}>
        <Stack direction="column" spacing={2}>
          <ResourceAuthors resource={document} />
          <ResourceTags resource={document} />
          <ResourceLicense resource={document} />
        </Stack>
      </Grid>
    </>
  );
}
