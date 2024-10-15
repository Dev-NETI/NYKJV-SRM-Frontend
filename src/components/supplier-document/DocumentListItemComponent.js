import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function DocumentListItemComponent({
  fileName = "fileName",
  modifiedBy = "modifiedBy",
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {fileName}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
          {modifiedBy}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DocumentListItemComponent;
