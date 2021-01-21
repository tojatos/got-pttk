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
import CustomDroppableList from "../components/CustomDroppableList";

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
  },
}));

const reorder = (
  list: Iterable<Segment> | ArrayLike<Segment>,
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
    route: Segment[];
  }>({
    segments: segmentsData.segments?.slice(0, 3) || [],
    route: [],
  });
  //TODO: Add segments of current user
  const dispatch = useDispatch();

  useEffect(() => {
    if (!segmentsData.segmentsInitialized) {
      dispatch(initSegments());
    } else {
      console.log(segmentsData.segments);
    }
  }, [dispatch, segmentsData.segments, segmentsData.segmentsInitialized]);

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

      destClone.splice(result.destination.index, 0, removed);
      setLists({
        route: destClone,
        segments: lists.segments,
      });
    }
  };

  const pointsForroute = 15;

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
            />
            <Box
              display="flex"
              flexDirection="columns"
              justifyContent="space-between"
            >
              <Typography variant="caption">
                <WarningIcon className={classes.warningIcon} fontSize="small" />
                Nieprawidłowe połączenie w trasie
              </Typography>
              <Typography>{pointsForroute} pkt.</Typography>
              <CustomButton
                variant="contained"
                color="action"
                size="large"
                disabled={!authData.login}
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
