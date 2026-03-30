import { Box, Container, Typography, Link as MuiLink } from "@mui/material";

export default function ResourceInclusionPolicy() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Resource Inclusion Policy
        </Typography>

        <Typography variant="body1" paragraph sx={{ mt: 3 }}>
          The first version of the GraspOS infrastructure was established in
          2025 using resources provided by the project partners. However,
          GraspOS is designed to function as an open and continuously evolving
          ecosystem. As such, the set of resources currently included in the
          infrastructure is subject to ongoing updates, primarily through the
          addition of new resources.
        </Typography>

        <Typography variant="body1" paragraph>
          For example, resource creators are encouraged to contribute additional
          resources over time. To support this, the following resource inclusion
          policy has been defined:
        </Typography>

        <Typography
          variant="h6"
          component="h2"
          sx={{ mt: 4, mb: 2, fontWeight: 600 }}
        >
          All resources to be included must:
        </Typography>

        <Box component="ul" sx={{ pl: 3 }}>
          <Box component="li" sx={{ mb: 2 }}>
            <Typography variant="body1">
              Be relevant to the research assessment domain
            </Typography>
          </Box>

          <Box component="li" sx={{ mb: 2 }}>
            <Typography variant="body1">
              Provide the required metadata to enable inclusion (see the GraspOS
              Resource Metadata Schema{" "}
              <MuiLink
                target="_blank"
                href="https://zenodo.org/records/17240299"
                color="primary"
              >
                here
              </MuiLink>
              )
            </Typography>
          </Box>

          <Box component="li" sx={{ mb: 2 }}>
            <Typography variant="body1">
              Offer API endpoints compliant with GraspOS specifications, where
              applicable (see the GraspOS API specification{" "}
              <MuiLink
                href="https://graspos-infra.athenarc.gr/api-spec/"
                target="_blank"
                color="primary"
              >
                here
              </MuiLink>
              )
            </Typography>
          </Box>

          <Box component="li" sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Meet the minimum Quality of Service (QoS) requirements defined by
              the GraspOS infrastructure administrators (only for services):
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>Availability:</strong> The service must maintain a
                  minimum uptime of ≥ 95% monthly availability, excluding
                  scheduled maintenance periods.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>Performance:</strong> API endpoints should respond
                  within an acceptable time threshold (e.g., average response
                  time below 10 seconds under normal load).
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>Reliability:</strong> The service should ensure stable
                  operation with a low error rate (e.g., failed requests below
                  5%).
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>Monitoring and Logging:</strong> Providers must
                  implement basic monitoring and logging mechanisms to detect
                  failures and support troubleshooting.
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>Maintenance and Support:</strong> Service providers
                  should communicate planned downtime in advance and ensure
                  timely resolution of critical issues.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box component="li" sx={{ mb: 2 }}>
            <Typography variant="body1">
              Follow the recommendations of the OSAF framework, where applicable
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" paragraph sx={{ mt: 3 }}>
          Any interested individual may create a new resource by signing up and
          logging into the GraspOS platform (more details in the user guide{" "}
          <MuiLink
            href="https://doi.org/10.5281/zenodo.17339364"
            target="_blank"
            color="primary"
          >
            here
          </MuiLink>
          ). After accessing the registered users' area, they can follow the
          provided instructions to submit their resource.
        </Typography>

        <Typography variant="body1" paragraph>
          Once submitted, the resource remains hidden until it has been reviewed
          by the GraspOS infrastructure support team. After successful
          validation, the resource is approved and made publicly available.
        </Typography>

        <Typography variant="body1" paragraph>
          Changes to existing resources are subject to the same rules, and a
          similar procedure is followed (for details see the user guide{" "}
          <MuiLink
            href="https://doi.org/10.5281/zenodo.17339364"
            target="_blank"
            color="primary"
          >
            here
          </MuiLink>
          ).
        </Typography>
      </Box>
    </Container>
  );
}
