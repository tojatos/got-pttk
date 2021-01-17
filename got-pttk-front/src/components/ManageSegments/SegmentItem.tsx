import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ListItem, Typography, Grid, IconButton } from "@material-ui/core";
import { Segment } from "../../constant/Segment";
import { SegmentPoint } from "../../constant/SegmentPoint";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

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
  onDelete: (id: number) => void;
  onEdit?: () => void;
}

const pointsToString = (points: Array<SegmentPoint>) =>
  (points.find((p) => p.kolejnosc === 1)?.punkttrasy.nazwa || "") +
  " - " +
  points.find((p) => p.kolejnosc === points.length)?.punkttrasy.nazwa;

export default function SegmentItem({
  segment,
  onEdit,
  onDelete,
}: SegmentItemProps) {
  const classes = useStyles();

  return (
    <ListItem classes={{ root: classes.root }}>
      <Grid container spacing={2} justify="space-between">
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
            {segment.punktydo + "/" + segment.punktydo + "pkt."}
          </Typography>
        </Grid>
        <Grid item className={classes.grid}>
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => onDelete(segment.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  );
}
