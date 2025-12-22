import { useEffect, useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useScopes } from "@queries/scope.js";
import CheckboxArrayField from "@helpers/CheckboxArrayField";

export default function ScopeStages({ form, resource = null }) {
  const scopesQuery = useScopes();
  const [selectedScopes, setSelectedScopes] = useState([]);

  useEffect(() => {
    if (resource?.scopes) {
      const ids = resource.scopes.map((s) => s.id);
      setSelectedScopes(ids);
      form?.setValue("scopes", ids);
    }
  }, [resource, form]);

  const handleSelectedScopesChange = (newSelected) => {
    setSelectedScopes(newSelected);
    form?.setValue("scopes", newSelected);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Scope Methodology Stages</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CheckboxArrayField
          items={scopesQuery?.data?.data}
          selectedItems={selectedScopes}
          setSelectedItems={handleSelectedScopesChange}
          icons={false}
          colors={true}
        />
      </AccordionDetails>
    </Accordion>
  );
}
