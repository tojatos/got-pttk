import { Box, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { initSegments } from "../app/segmentsSlice";
import { RootState } from "../app/store";
import CustomButton from "../components/CustomButton";
import CustomSearch from "../components/CustomSearchBar";
import CustomTextField from "../components/CustomTextField";
import Layout from "../components/MainLayout/Layout";
import { Segment } from "../constant/Segment";
import { Typography } from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import CustomDroppableList from "../components/PlanRoutes/CustomDroppableList";
import { RouteSegmentData } from "../constant/RouteSegment";
import { calculatePointsFromData, checkRouteConsistency } from "../lib/utils";

const useStyles = makeStyles((theme) => ({
  listBox: {
    width: "100%",
    height: "60vh",
    background: theme.palette.background.paper,
    borderRadius: "17px",
    border: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  draggeble: {
    width: "100%",
    height: "100%",
    overflowY: "scroll",
  },
  searchbar: {
    margin: `37px 0px ${theme.spacing(2)}px 0px`,
  },
  warningIcon: {
    color: theme.palette.warning.main,
    margin: theme.spacing(0, 1, 0, 0),
  },
  hide: {
    visibility: "hidden",
  },
}));

const reorder = (
  list: Iterable<RouteSegmentData>,
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function PlanRoute() {
  const classes = useStyles();
  const authData = useSelector((state: RootState) => state.authData);
  const segmentsData = useSelector((state: RootState) => state.segmentsData);
  const [lists, setLists] = useState<{
    segments: Segment[];
    route: RouteSegmentData[];
  }>({
    segments: segmentsData.segments || [],
    route: [],
  });

  //TODO: Add segments of current user
  const dispatch = useDispatch();

  useEffect(() => {
    if (!segmentsData.segmentsInitialized) {
      dispatch(initSegments());
    }
  }, [dispatch, segmentsData.segmentsInitialized]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === result.destination.droppableId) {
      if (result.source.droppableId === "segments") return;

      const route = reorder(
        lists.route,
        result.source.index,
        result.destination.index
      );

      setLists({ route: route, segments: lists.segments });
    } else {
      if (result.source.droppableId === "routes") return;

      const sourceClone = Array.from(lists.segments);
      const destClone = Array.from(lists.route);
      const [removed] = sourceClone.splice(result.source.index, 1);

      destClone.splice(result.destination.index, 0, {
        polaczenie: removed,
        czypowrotne: false,
        kolejnosc: result.destination.index,
      });
      setLists({
        route: destClone,
        segments: lists.segments,
      });
    }
  };

  const handleDeleteSegment = (id: number) => {
    const routeClone = Array.from(lists.route);
    routeClone.splice(id, 1);
    setLists({
      route: routeClone,
      segments: lists.segments,
    });
  };

  const handleCheckAsWayBack = (id: number) => {
    const routeClone = Array.from(lists.route);
    routeClone[id].czypowrotne = !routeClone[id].czypowrotne;
    setLists({
      route: routeClone,
      segments: lists.segments,
    });
  };

  return (
    <Layout>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container justify="space-between" spacing={3}>
          <Grid item xs={6}>
            <CustomTextField label="Nazwa trasy" name="routeName" fullWidth />
            <CustomDroppableList
              droppableId="route"
              list={lists.route}
              type="destination"
              onDelete={handleDeleteSegment}
              onCheck={handleCheckAsWayBack}
            />
            <Box
              display="flex"
              flexDirection="columns"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="caption"
                className={
                  checkRouteConsistency(lists.route) ? classes.hide : ""
                }
              >
                <WarningIcon className={classes.warningIcon} fontSize="small" />
                Nieprawidłowe połączenie w trasie
              </Typography>
              <Typography>
                {calculatePointsFromData(lists.route)} pkt.
              </Typography>
              <CustomButton
                variant="contained"
                color="action"
                size="large"
                disabled={!authData.login}
                onClick={() => console.log(lists.route)}
              >
                Zapisz
              </CustomButton>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <CustomSearch className={classes.searchbar} />
            <CustomDroppableList
              droppableId="segments"
              list={lists.segments}
              type="source"
            />
          </Grid>
        </Grid>
      </DragDropContext>
    </Layout>
  );
}
