import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, IconButton, Box } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Point } from "../../constant/Point";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.primary.main}`,
    flexWrap: "wrap",
    margin: theme.spacing(1.2, 0),
  },
  gridContainer: {
    margin: theme.spacing(1.2),
  },
  spacing: {
    margin: "auto",
  },
  checkbox: {},
}));

interface PointItemProps {
  point: Point;
  onDelete?: () => void;
}

export default function PointItem({ point, onDelete }: PointItemProps) {
  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="space-between" className={classes.root}>
      <Typography variant="body1" color="textPrimary">
        {point.nazwa}
      </Typography>
      {onDelete && (
        <IconButton
          aria-label="delete"
          onClick={onDelete}
          className={classes.spacing}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
