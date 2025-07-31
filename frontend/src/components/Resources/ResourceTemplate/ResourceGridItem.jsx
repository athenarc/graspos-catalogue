import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Box,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Grid2,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  AvatarGroup,
} from "@mui/material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { useDeleteDataset, useUpdateDataset } from "../../../queries/dataset";
import {
  useDeleteDocument,
  useUpdateDocument,
} from "../../../queries/document";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDeleteTool, useUpdateTool } from "../../../queries/tool";

import VerifiedIcon from "@mui/icons-material/Verified";

import { useUpdateZenodo } from "../../../queries/zenodo";

import HistoryIcon from "@mui/icons-material/History";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import { useScopes } from "../../../queries/scope";

import EditResourceDialog from "../../Forms/EditResourceDialog";
import DeleteConfirmationDialog from "../../Forms/DeleteConfirmationDialog";
import { useDeleteService, useUpdateService } from "../../../queries/service";
import { useCountries } from "../../../queries/countries";
import { useAssessments } from "../../../queries/assessment";
import { formatDate, stripHtml } from "../../utils";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FlagIcon from "@mui/icons-material/Flag";
import ResourceItemHeader from "./ResourceComponents/ResourceItemHeader";
import ResourceItemContent from "./ResourceComponents/ResourceItemContent";
import ResourceItemFooter from "./ResourceComponents/ResourceItemFooter";

export default function ResourceGridItem({ resource, type, user }) {
  const typeColors = {
    data: { bg: "#B3E5FC", color: "#01579B" },
    monitoring: { bg: "#C8E6C9", color: "#1B5E20" },
    enrichment: { bg: "#F8BBD0", color: "#880E4F" },
  };

  const { bg, color } = typeColors[resource?.service_type] || {
    bg: "#E0E0E0",
    color: "#424242",
  };
  return (
    <Grid key={resource?._id} size={{ xs: 12 }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          borderRadius: "5px",
          border: "1px solid",
          borderColor: !resource?.approved ? "#FFD700" : "#e0dfdf",
          backgroundColor: !resource?.approved ? "#FFFDE7" : "#f8faff",
          boxShadow: 0,
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: 4,
          },
          color: "#555",
        }}
      >
        {type === "service" && (
          <Box
            sx={{
              width: "30px",
              minWidth: "30px",
              backgroundColor: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              writingMode: "sideways-lr",
              textOrientation: "mixed",
              fontSize: 18,
              fontWeight: "bold",
              borderTopLeftRadius: "5px",
              borderBottomLeftRadius: "5px",
            }}
          >
            {resource?.service_type?.toUpperCase()}
          </Box>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <CardContent sx={{ pb: 0 }}>
            <ResourceItemHeader resource={resource} type={type} user={user} />
            <ResourceItemContent resource={resource} />
          </CardContent>
          <CardContent
            sx={{
              paddingBottom: "8px !important",
              paddingTop: "0 !important",
              mt: "auto",
            }}
          >
            <ResourceItemFooter resource={resource} type={type} />
          </CardContent>
        </Box>
      </Card>
    </Grid>
  );
}
