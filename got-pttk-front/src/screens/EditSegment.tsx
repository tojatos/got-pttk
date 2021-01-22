import classes from "*.module.css";
import { Box, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../app/store";
import CustomButton from "../components/CustomButton";
import CustomTextField from "../components/CustomTextField";
import Layout from "../components/MainLayout/Layout";
import DroppablePoints from "../components/ManageSegments/DroppablePoints";
import CustomDroppableList from "../components/PlanRoutes/CustomDroppableList";
import { Segment, SegmentData } from "../constant/Segment";
import { SegmentPoint } from "../constant/SegmentPoint";

const startSegmentData = {
  nazwa: "",
  punktyz: 0,
  punktydo: 0,
  grupagorska: "",
  punktypolaczenia: [],
};

const reorder = (
  list: Iterable<SegmentPoint>,
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result.map((e, index) => {
    return {
      kolejnosc: index,
      punkttrasy: e.punkttrasy,
    };
  });
};

export default function EditSegment() {
  let { id } = useParams();
  const segmentsData = useSelector(
    (state: RootState) => state.userSegmentsData
  );
  const initSegment = segmentsData.segments?.find((e: Segment) => e.id === id);

  const [userSegment, setUserSegment] = useState<SegmentData>(
    initSegment || startSegmentData
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const segmentPoints = reorder(
      userSegment.punktypolaczenia,
      result.source.index,
      result.destination.index
    );

    setUserSegment({ ...userSegment, punktypolaczenia: segmentPoints });
  };

  const handleDeleteSegment = (id: number) => {
    const pointsClone = Array.from(userSegment.punktypolaczenia);
    pointsClone.splice(id, 1);
    setUserSegment({ ...userSegment, punktypolaczenia: pointsClone });
  };

  return (
    <Layout>
      <Grid container justify="space-between" spacing={3}>
        <Grid item xs={6}>
          <CustomTextField
            label="Nazwa połączenia"
            name="segmentName"
            fullWidth
          />
          <CustomButton
            variant="contained"
            color="action"
            size="large"
            onClick={() => console.log("zapisz")}
          >
            Zakończ
          </CustomButton>
        </Grid>
        <Grid item xs={6}>
          <CustomTextField />
          <CustomButton variant="contained" color="action" size="large">
            Dodaj
          </CustomButton>
          <DragDropContext onDragEnd={onDragEnd}>
            <DroppablePoints
              droppableId="points"
              list={userSegment?.punktypolaczenia}
              onDelete={handleDeleteSegment}
            />
          </DragDropContext>
        </Grid>
      </Grid>
    </Layout>
  );
}
