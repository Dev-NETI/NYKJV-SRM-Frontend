import React from "react";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

function OrderListItem({ referenceNumber, requestedBy, createdAt }) {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={requestedBy} src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={referenceNumber}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "text.primary", display: "inline" }}
              >
                {requestedBy}
              </Typography>
              {` — ${createdAt}`}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}

export default OrderListItem;
