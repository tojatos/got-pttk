import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { initSegments } from "../app/segmentsSlice";
import { RootState } from "../app/store";
import Layout from "../components/MainLayout/Layout";
import DraggableSegment from "../components/PlanRoutes/DraggableSegment";
import { Segment } from "../constant/Segment";

const useStyles = makeStyles((theme) => ({
  listBox: {
    width: "100%",
    height: "70vh",
    background: theme.palette.background.paper,
    borderRadius: "17px",
    border: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(3),
  },
  draggeble: {
    width: "100%",
    height: "100%",
    overflowY: "scroll",
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

const moveSegment = (
  source: Segment[],
  destination: Segment[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  return { source: sourceClone, destination: destClone };
};

export default function PlanRoute() {
  const classes = useStyles();
  const segmentsData = useSelector((state: RootState) => state.segmentsData);
  const [lists, setLists] = useState<{
    segments: Segment[];
    route: Segment[];
  }>({
    segments: segmentsData.segments?.slice(0, 20) || [],
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

  const getListById = (id: string) =>
    id === "segments" ? lists.segments : lists.route;

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
      const listAfterDrag = moveSegment(
        getListById(result.source.droppableId),
        getListById(result.destination.droppableId),
        result.source,
        result.destination
      );

      setLists(
        result.source.droppableId === "segments"
          ? { route: listAfterDrag.destination, segments: listAfterDrag.source }
          : { route: listAfterDrag.source, segments: listAfterDrag.destination }
      );
    }
  };

  return (
    <Layout>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container justify="space-between" alignItems="center" spacing={3}>
          <Grid item xs={6} className={classes.listBox}>
            <Droppable droppableId="route">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={classes.draggeble}
                >
                  {lists.route?.map((segment: Segment, index: number) => (
                    <Draggable
                      draggableId={segment.id.toString()}
                      index={index}
                      key={segment.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <DraggableSegment segment={segment} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Grid>
          <Grid item xs={6} className={classes.listBox}>
            <Droppable droppableId="segments">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={classes.draggeble}
                >
                  {lists.segments?.map((segment: Segment, index: number) => (
                    <Draggable
                      draggableId={segment.id.toString()}
                      index={index}
                      key={segment.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <DraggableSegment segment={segment} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Grid>
        </Grid>
      </DragDropContext>
    </Layout>
  );
}
