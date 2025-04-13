import { useEffect, useState } from "react";
import { useDocuments, useDocument } from "../../../queries/document";
import { RectangularVariants } from "../../Skeleton";
import ResourceGridItem from "../ResourceTemplate/ResourceGridItem";
import { Button, Grid2 as Grid, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import {
  ResourceAuthors,
  ResourceBasicInformation,
  ResourceLicense,
  ResourceTags,
} from "../ResourceTemplate/ResourcePage";

export function Documents({ user, filter, filters }) {
  const documents = useDocuments(filters);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  useEffect(() => {
    if (documents?.data) {
      const filteredData = filter
        ? documents?.data?.filter(
            (document) =>
              document?.zenodo?.metadata?.title
                ?.toLowerCase()
                .includes(filter.toLowerCase()) ||
              document?.zenodo?.metadata?.description
                ?.toLowerCase()
                .includes(filter.toLowerCase())
          )
        : documents?.data;

      setFilteredDocuments(filteredData);
    }
  }, [documents?.data, filter, filters]);

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
      <Grid size={{ xs: 12, lg: 8 }}>
        <ResourceBasicInformation resource={document} />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack direction="column" spacing={2}>
          <ResourceAuthors resource={document} />
          <ResourceTags resource={document} />
          <ResourceLicense resource={document} />
        </Stack>
      </Grid>
    </>
  );
}
