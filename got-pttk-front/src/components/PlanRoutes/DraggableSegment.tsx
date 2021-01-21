import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, IconButton, Box } from "@material-ui/core";
import { Segment } from "../../constant/Segment";
import { SegmentPoint } from "../../constant/SegmentPoint";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.primary.main}`,
    margin: theme.spacing(1.2, 0),
  },
  gridContainer: {
    margin: theme.spacing(1.2),
  },
  spacing: {
    margin: "auto",
  },
}));

interface SegmentItemProps {
  segment: Segment;
  onDelete?: () => void;
}

const pointsToString = (points: Array<SegmentPoint>) =>
  (points.find((p) => p.kolejnosc === 1)?.punkttrasy.nazwa || "") +
  " - " +
  points.find((p) => p.kolejnosc === points.length)?.punkttrasy.nazwa;

export default function DraggableSegment({
  segment,
  onDelete,
}: SegmentItemProps) {
  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="space-between" className={classes.root}>
      <Grid container justify="space-between" className={classes.gridContainer}>
        <Grid item xs={12} md={7}>
          <Typography variant="body1" color="textPrimary">
            {segment.nazwa}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {pointsToString(segment.punktypolaczenia)}
          </Typography>
        </Grid>
        <Grid item xs={3} className={classes.spacing}>
          <Typography>{segment.grupagorska}</Typography>
        </Grid>
        <Grid item className={classes.spacing} xs={2}>
          <Typography>
            {segment.punktyz + "/" + segment.punktydo + "pkt."}
          </Typography>
        </Grid>
      </Grid>
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
