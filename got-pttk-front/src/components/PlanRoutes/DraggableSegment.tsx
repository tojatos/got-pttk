import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid } from "@material-ui/core";
import { Segment } from "../../constant/Segment";
import { SegmentPoint } from "../../constant/SegmentPoint";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.primary.main}`,
    margin: theme.spacing(1.2, 0),
  },
  grid: {
    margin: "auto",
  },
}));

interface SegmentItemProps {
  segment: Segment;
}

const pointsToString = (points: Array<SegmentPoint>) =>
  (points.find((p) => p.kolejnosc === 1)?.punkttrasy.nazwa || "") +
  " - " +
  points.find((p) => p.kolejnosc === points.length)?.punkttrasy.nazwa;

export default function DraggableSegment({ segment }: SegmentItemProps) {
  const classes = useStyles();

  return (
    <Grid
      container
      spacing={2}
      justify="space-between"
      className={classes.root}
    >
      <Grid item xs={12} md={6}>
        <Typography variant="body1" color="textPrimary">
          {segment.nazwa}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {pointsToString(segment.punktypolaczenia)}
        </Typography>
      </Grid>
      <Grid item xs={6} md={2} className={classes.grid}>
        <Typography>{segment.grupagorska}</Typography>
      </Grid>
      <Grid item className={classes.grid}>
        <Typography>
          {segment.punktyz + "/" + segment.punktydo + "pkt."}
        </Typography>
      </Grid>
    </Grid>
  );
}
