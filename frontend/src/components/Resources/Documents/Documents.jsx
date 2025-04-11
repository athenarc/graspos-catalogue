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
  // Fetch documents based on the filters

  // Fetch datasets based on the filters
  const filterArray = Object.keys(filters || {}).flatMap((filterKey) => {
    const filterObj = filters[filterKey];

    // Ensure the filterObj is an object before applying filtering logic
    if (typeof filterObj === "object" && filterObj !== null) {
      return Object.keys(filterObj).filter((key) => filterObj[key]);
    }

    return [];
  });
  const documents = useDocuments(filterArray);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  // Update filtered documents whenever documents, filter, or filters change
  useEffect(() => {
    if (documents?.data) {
      // Apply the filter to documents if filter is not empty
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
        : documents?.data; // If no filter, show all documents

      // Update filtered documents state
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
