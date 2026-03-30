import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function ResourceInclusionPolicy() {
  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "calc(100vh - 164px)", py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Resource Inclusion Policy
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 400 }}>
            Guidelines for contributing to the GraspOS ecosystem
          </Typography>
        </Paper>

        {/* Introduction Section */}
        <Paper elevation={1} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}
          >
            <InfoOutlinedIcon
              sx={{ color: "primary.main", fontSize: 28, mt: 0.5 }}
            />
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                About the GraspOS Infrastructure
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ lineHeight: 1.8, color: "text.secondary" }}
              >
                The first version of the GraspOS infrastructure was established
                in 2025 using resources provided by the project partners.
                However, GraspOS is designed to function as an open and
                continuously evolving ecosystem. As such, the set of resources
                currently included in the infrastructure is subject to ongoing
                updates, primarily through the addition of new resources.
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "text.secondary" }}
              >
                Resource creators are encouraged to contribute additional
                resources over time. To support this, the following resource
                inclusion policy has been defined:
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Requirements Section */}
        <Paper elevation={1} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 600, color: "primary.main", mb: 3 }}
          >
            Resource Requirements
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            All resources to be included must meet the following criteria:
          </Typography>

          <List sx={{ p: 0 }}>
            {/* Requirement 1 */}
            <ListItem
              sx={{
                alignItems: "flex-start",
                mb: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                p: 2,
              }}
            >
              <ListItemIcon sx={{ mt: 0.5, minWidth: 40 }}>
                <CheckCircleOutlineIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Relevance to research assessment domain
                  </Typography>
                }
              />
            </ListItem>

            {/* Requirement 2 */}
            <ListItem
              sx={{
                alignItems: "flex-start",
                mb: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                p: 2,
              }}
            >
              <ListItemIcon sx={{ mt: 0.5, minWidth: 40 }}>
                <CheckCircleOutlineIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Required metadata provision
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: "text.secondary" }}
                  >
                    See the GraspOS Resource Metadata Schema{" "}
                    <MuiLink
                      target="_blank"
                      href="https://zenodo.org/records/17240299"
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    >
                      here
                    </MuiLink>
                  </Typography>
                }
              />
            </ListItem>

            {/* Requirement 3 */}
            <ListItem
              sx={{
                alignItems: "flex-start",
                mb: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                p: 2,
              }}
            >
              <ListItemIcon sx={{ mt: 0.5, minWidth: 40 }}>
                <CheckCircleOutlineIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    API compliance (where applicable)
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: "text.secondary" }}
                  >
                    API endpoints must be compliant with GraspOS specifications.
                    See the specification{" "}
                    <MuiLink
                      href="https://graspos-infra.athenarc.gr/api-spec/"
                      target="_blank"
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    >
                      here
                    </MuiLink>
                  </Typography>
                }
              />
            </ListItem>

            {/* Requirement 4 - QoS */}
            <ListItem
              sx={{
                alignItems: "flex-start",
                mb: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                p: 2,
              }}
            >
              <ListItemIcon sx={{ mt: 0.5, minWidth: 40 }}>
                <CheckCircleOutlineIcon color="success" />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  Quality of Service (QoS) requirements
                  <Chip
                    label="Services only"
                    size="small"
                    color="primary"
                    sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                  />
                </Typography>

                <Box sx={{ pl: 2, borderLeft: "3px solid #e0e0e0" }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "primary.dark" }}
                    >
                      Availability
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Minimum uptime of ≥ 95% monthly availability, excluding
                      scheduled maintenance
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "primary.dark" }}
                    >
                      Performance
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Average response time below 10 seconds under normal load
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "primary.dark" }}
                    >
                      Reliability
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Low error rate with failed requests below 5%
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "primary.dark" }}
                    >
                      Monitoring and Logging
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Basic monitoring and logging mechanisms for failure
                      detection and troubleshooting
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "primary.dark" }}
                    >
                      Maintenance and Support
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Planned downtime communication and timely resolution of
                      critical issues
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </ListItem>

            {/* Requirement 5 */}
            <ListItem
              sx={{
                alignItems: "flex-start",
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                p: 2,
              }}
            >
              <ListItemIcon sx={{ mt: 0.5, minWidth: 40 }}>
                <CheckCircleOutlineIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    OSAF framework compliance
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: "text.secondary" }}
                  >
                    Follow the recommendations of the OSAF framework, where
                    applicable
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Paper>

        {/* Submission Process Section */}
        <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 600, color: "primary.main", mb: 3 }}
          >
            Submission Process
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  mr: 2,
                }}
              >
                1
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Create Your Resource
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ ml: 6, color: "text.secondary", lineHeight: 1.8 }}
            >
              Any interested individual may create a new resource by signing up
              and logging into the GraspOS platform. More details can be found
              in the user guide{" "}
              <MuiLink
                href="https://doi.org/10.5281/zenodo.17339364"
                target="_blank"
                color="primary"
                sx={{ fontWeight: 500 }}
              >
                here
              </MuiLink>
              . After accessing the registered users' area, follow the provided
              instructions to submit your resource.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  mr: 2,
                }}
              >
                2
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Review Process
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ ml: 6, color: "text.secondary", lineHeight: 1.8 }}
            >
              Once submitted, the resource remains hidden until it has been
              reviewed by the GraspOS infrastructure support team. After
              successful validation, the resource is approved and made publicly
              available.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  mr: 2,
                }}
              >
                3
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Updates and Changes
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ ml: 6, color: "text.secondary", lineHeight: 1.8 }}
            >
              Changes to existing resources are subject to the same rules, and a
              similar procedure is followed. For details, see the user guide{" "}
              <MuiLink
                href="https://doi.org/10.5281/zenodo.17339364"
                target="_blank"
                color="primary"
                sx={{ fontWeight: 500 }}
              >
                here
              </MuiLink>
              .
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
