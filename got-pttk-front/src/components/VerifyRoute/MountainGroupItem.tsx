import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    flexWrap: "wrap",
    margin: theme.spacing(1.2, 0),
    padding: theme.spacing(1.2, 0),
  },
  nameSpacing: {
    margin: "auto",
    marginLeft: theme.spacing(1),
  },
  notverified: {
    border: `1px solid ${theme.palette.error.main}`,
  },
  verified: {
    border: `1px solid ${theme.palette.success.main}`,
  },
}));

interface MountainGroupItemProps {
  group: String;
  isVerified: boolean;
}

export default function MountainGroupItem({
  group,
  isVerified,
}: MountainGroupItemProps) {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      className={
        classes.root +
        " " +
        (isVerified ? classes.verified : classes.notverified)
      }
    >
      <Typography
        variant="body1"
        color="textPrimary"
        className={classes.nameSpacing}
      >
        {group}
      </Typography>
    </Box>
  );
}
