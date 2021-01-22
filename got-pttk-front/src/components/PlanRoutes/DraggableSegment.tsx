import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Grid,
  IconButton,
  Box,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { Segment } from "../../constant/Segment";
import CloseIcon from "@material-ui/icons/Close";
import { pointsToString } from "../../lib/converter";

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

interface DraggableSegmentProps {
  segment: Segment;
  onDelete?: () => void;
  onCheck?: () => void;
  isWayBack?: boolean;
}

export default function DraggableSegment({
  segment,
  onDelete,
  onCheck,
  isWayBack,
}: DraggableSegmentProps) {
  const classes = useStyles();

  return (
    <Box display="flex" className={classes.root}>
      <Box display="flex" justifyContent="space-between">
        <Grid
          container
          justify="space-between"
          className={classes.gridContainer}
        >
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
              {segment.punktydo + "/" + segment.punktyz + "pkt."}
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
      {onCheck && isWayBack !== undefined && (
        <FormControlLabel
          className={classes.gridContainer}
          control={
            <Checkbox
              checked={isWayBack}
              color="primary"
              onChange={onCheck}
              inputProps={{ "aria-label": "Droga powrotna?" }}
            />
          }
          label="Ustaw jako drogę powrotną."
        />
      )}
    </Box>
  );
}
