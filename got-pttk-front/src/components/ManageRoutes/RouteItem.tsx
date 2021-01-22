import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ListItem, Typography, Grid, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Route } from "../../constant/Route";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { RouteSegment } from "../../constant/RouteSegment";
import { calculatePoints } from "../../lib/utils";

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

interface RouteItemProps {
  route: Route;
  onDelete: (id: number) => void;
  onEdit?: () => void;
}

export default function RouteItem({ route, onEdit, onDelete }: RouteItemProps) {
  const classes = useStyles();
  const segmentsData = useSelector((state: RootState) => state.segmentsData);

  const segmentsToString = (s: Array<RouteSegment>) => {
    const id1 = route.polaczeniatrasy.find((p) => p.kolejnosc === 1)?.id;
    const id2 = route.polaczeniatrasy.find((p) => p.kolejnosc === s.length)?.id;
    return (
      (segmentsData.segments?.find((s) => s.id === id1)?.nazwa || "") +
      " - " +
      (segmentsData.segments?.find((s) => s.id === id2)?.nazwa || "")
    );
  };

  return (
    <ListItem classes={{ root: classes.root }}>
      <Grid item xs={12} md={10}>
        <Typography variant="body1" color="textPrimary">
          {route.nazwa}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {segmentsToString(route.polaczeniatrasy)}
        </Typography>
      </Grid>
      <Grid item className={classes.grid}>
        <Typography>
          {calculatePoints(route.polaczeniatrasy, segmentsData.segments || []) +
            "pkt."}
        </Typography>
      </Grid>
      <Grid item className={classes.grid}>
        <IconButton aria-label="edit" onClick={onEdit}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => onDelete(route.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Grid>
    </ListItem>
  );
}
