import { Card, CardContent, CardHeader } from "@mui/material";

export default function Form({title}) {
  return (
    <Card
      p={1}
      sx={{
        height: height,
        background:
          "linear-gradient(65deg, #005A83 20%, #036595 20%, #0571A4 40%, #005A83 40%);",
        borderRadius: "0px",
      }}
    >
      <Card
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        p={2}
        sx={{
          maxWidth: 600,
          margin: "auto",
          mt: "10vh",
          borderRadius: "10px",
        }}
      >
        <CardHeader
          title={title}
          sx={{ backgroundColor: "#338BCB", color: "white" }}
        >
        </CardHeader>
        
      </Card>
    </Card>
  );
}
