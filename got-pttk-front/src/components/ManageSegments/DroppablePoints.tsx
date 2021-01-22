import { makeStyles } from "@material-ui/core";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { SegmentPoint } from "../../constant/SegmentPoint";
import PointItem from "./PointItem";

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
}));

interface DroppablePointsProps {
  list: Array<SegmentPoint>;
  droppableId: string;
  onDelete: (id: number) => void;
}

export default function DroppablePoints({
  list,
  droppableId,
  onDelete,
}: DroppablePointsProps) {
  const classes = useStyles();

  return (
    <div className={classes.listBox}>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={classes.draggeble}
          >
            {provided.placeholder}
            {list.map((element: SegmentPoint, index: number) => (
              <Draggable
                draggableId={droppableId + index.toString()}
                index={index}
                key={index}
              >
                {(provided) => (
                  <React.Fragment>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <PointItem
                        point={element.punkttrasy}
                        onDelete={() => onDelete(index)}
                      />
                    </div>
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
