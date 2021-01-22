import { Box, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DraggableSegment from "./DraggableSegment";
import { RouteSegmentData } from "../../constant/RouteSegment";
import { Segment } from "../../constant/Segment";
import { isRouteSegmentData } from "../../lib/converter";
import { Pagination } from "@material-ui/lab";

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
    height: "calc(100% - 48px)",
    overflowY: "scroll",
  },
  clone: {
    "& ~ div": {
      transform: "none!important",
    },
  },
  paginator: {
    justifyContent: "center",
    padding: "10px",
  },
}));

type ElementDraggable = Segment | RouteSegmentData;

interface CustomDroppableListProps {
  list: Array<ElementDraggable>;
  droppableId: string;
  type?: "source" | "destination";
  onDelete?: (id: number) => void;
  onCheck?: (id: number) => void;
}

export default function CustomDroppableList({
  list,
  droppableId,
  type,
  onDelete,
  onCheck,
}: CustomDroppableListProps) {
  const classes = useStyles();

  const pageItems = 5;
  const [page, setPage] = useState(1);
  const [pagesNum, setPageNum] = useState(Math.ceil(list.length / pageItems));

  const onChangePage = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    setPageNum(Math.ceil(list.length / pageItems));
  }, [list]);

  return (
    <div className={classes.listBox}>
      <Droppable droppableId={droppableId} isDropDisabled={type === "source"}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={classes.draggeble}
          >
            {provided.placeholder}
            {list
              .slice((page - 1) * pageItems, page * pageItems)
              .map((element: ElementDraggable, index: number) => (
                <Draggable
                  draggableId={
                    droppableId + (index + (page - 1) * pageItems).toString()
                  }
                  index={index + (page - 1) * pageItems}
                  key={index + (page - 1) * pageItems}
                >
                  {(provided, snapshot) => (
                    <React.Fragment>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {type === "source" || !onDelete || !onCheck ? (
                          <DraggableSegment
                            segment={
                              isRouteSegmentData(element)
                                ? (element as RouteSegmentData).polaczenie
                                : (element as Segment)
                            }
                          />
                        ) : (
                          <DraggableSegment
                            segment={
                              isRouteSegmentData(element)
                                ? (element as RouteSegmentData).polaczenie
                                : (element as Segment)
                            }
                            onDelete={() =>
                              onDelete(index + (page - 1) * pageItems)
                            }
                            onCheck={() =>
                              onCheck(index + (page - 1) * pageItems)
                            }
                            isWayBack={
                              isRouteSegmentData(element)
                                ? (element as RouteSegmentData).czypowrotne
                                : undefined
                            }
                          />
                        )}
                      </div>
                      {snapshot.isDragging && type === "source" && (
                        <div className={classes.clone}>
                          <DraggableSegment
                            segment={
                              isRouteSegmentData(element)
                                ? (element as RouteSegmentData).polaczenie
                                : (element as Segment)
                            }
                          />
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </Draggable>
              ))}
          </div>
        )}
      </Droppable>
      <Box component="span">
        <Pagination
          count={pagesNum}
          page={page}
          onChange={onChangePage}
          defaultPage={1}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          classes={{ ul: classes.paginator }}
        />
      </Box>
    </div>
  );
}
