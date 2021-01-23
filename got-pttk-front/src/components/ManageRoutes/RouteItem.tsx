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
import { Link } from "react-router-dom";

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
}

export default function RouteItem({ route, onDelete }: RouteItemProps) {
  const classes = useStyles();
  const segmentsData = useSelector((state: RootState) => state.segmentsData);
  const userSegmentsData = useSelector(
    (state: RootState) => state.userSegmentsData
  );
  const allSegments = [
    ...(segmentsData.segments || []),
    ...(userSegmentsData.segments || []),
  ];

  const segmentsToString = (s: Array<RouteSegment>) => {
    const id1 = route.polaczeniatrasy.find((p) => p.kolejnosc === 1)
      ?.polaczenieid;
    const n1 = allSegments?.find((s) => s.id === id1)?.nazwa || "";
    if (s.length === 1) return n1;
    const id2 = route.polaczeniatrasy.find((p) => p.kolejnosc === s.length)
      ?.polaczenieid;
    const n2 = allSegments?.find((s) => s.id === id2)?.nazwa || "";
    return `${n1} - ${n2}`;
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
        <IconButton
          aria-label="edit"
          component={Link}
          to={"/edit-route/" + route.id}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => onDelete(route.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Grid>
    </ListItem>
  );
}
