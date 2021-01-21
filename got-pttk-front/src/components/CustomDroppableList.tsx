import { makeStyles } from "@material-ui/core";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DraggableSegment from "../components/PlanRoutes/DraggableSegment";
import { Segment } from "../constant/Segment";

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
  clone: {
    "& ~ div": {
      transform: "none!important",
    },
  },
}));

interface CustomDroppableListProps {
  list: Array<Segment>;
  droppableId: string;
  type?: "source" | "destination" | "single";
  onDelete?: (id: number) => void;
}

export default function CustomDroppableList({
  list,
  droppableId,
  type,
  onDelete,
}: CustomDroppableListProps) {
  const classes = useStyles();

  return (
    <div className={classes.listBox}>
      <Droppable droppableId={droppableId} isDropDisabled={type === "source"}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={classes.draggeble}
          >
            {list.map((element: Segment, index: number) => (
              <Draggable
                draggableId={droppableId + index.toString()}
                index={index}
                key={index}
              >
                {(provided, snapshot) => (
                  <React.Fragment>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {type === "source" || !onDelete ? (
                        <DraggableSegment segment={element} />
                      ) : (
                        <DraggableSegment
                          segment={element}
                          onDelete={() => onDelete(index)}
                        />
                      )}
                    </div>
                    {snapshot.isDragging && type === "source" && (
                      <div className={classes.clone}>
                        <DraggableSegment segment={element} />
                      </div>
                    )}
                  </React.Fragment>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </div>
  );
}
