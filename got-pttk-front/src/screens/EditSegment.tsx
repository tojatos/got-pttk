import { Grid } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../app/store";
import CustomButton from "../components/CustomButton";
import CustomSelect from "../components/CustomSelect";
import CustomTextField from "../components/CustomTextField";
import Layout from "../components/MainLayout/Layout";
import DroppablePoints from "../components/ManageSegments/DroppablePoints";
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
  let { id } = useParams<{ id: string }>();
  const segmentsData = useSelector(
    (state: RootState) => state.userSegmentsData
  );

  const pointsData = useSelector((state: RootState) => state.pointsData);

  const initSegment = segmentsData.segments?.find(
    (e: Segment) => e.id === parseInt(id)
  );

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

  const handleDeletePoint = (id: number) => {
    const pointsClone = Array.from(userSegment.punktypolaczenia);
    pointsClone.splice(id, 1);
    setUserSegment({ ...userSegment, punktypolaczenia: pointsClone });
  };

  const handleAddPoint = () => {};

  return (
    <Layout>
      <Grid container justify="space-between" spacing={4} alignItems="center">
        <Grid item xs={6}>
          <form>
            <CustomTextField
              label="Nazwa połączenia"
              name="segmentName"
              fullWidth
            />
            <CustomSelect
              label="Grupa górska"
              value={userSegment.grupagorska}
              handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserSegment({ ...userSegment, grupagorska: e.target.value })
              }
              name="group"
              options={["Tatry wysokie", "Tatry zachodnie"]}
            />
            <CustomTextField
              label="Punkty do"
              name="segmentName"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              fullWidth
            />
            <CustomTextField
              label="Punkty z"
              name="segmentName"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
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
          </form>
        </Grid>
        <Grid item xs={6}>
          <form onSubmit={handleAddPoint}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={10}>
                <Autocomplete
                  id="newPoint"
                  options={pointsData.points || []}
                  getOptionLabel={(option) => option.nazwa}
                  renderInput={(params) => (
                    <CustomTextField {...params} label="" />
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomButton
                  variant="contained"
                  color="action"
                  size="large"
                  type="submit"
                >
                  Dodaj
                </CustomButton>
              </Grid>
            </Grid>
          </form>
          <DragDropContext onDragEnd={onDragEnd}>
            <DroppablePoints
              droppableId="points"
              list={userSegment?.punktypolaczenia}
              onDelete={handleDeletePoint}
            />
          </DragDropContext>
        </Grid>
      </Grid>
    </Layout>
  );
}
