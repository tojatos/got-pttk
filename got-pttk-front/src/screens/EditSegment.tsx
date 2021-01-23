import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { RootState } from "../app/store";
import CustomButton from "../components/CustomButton";
import CustomConfirmDialog from "../components/CustomConfirmDialog";
import CustomInfoDialog from "../components/CustomInfoDialog";
import CustomSelect from "../components/CustomSelect";
import CustomTextField from "../components/CustomTextField";
import Layout from "../components/MainLayout/Layout";
import DroppablePoints from "../components/ManageSegments/DroppablePoints";
import { Segment, SegmentData } from "../constant/Segment";
import { SegmentPoint } from "../constant/SegmentPoint";
import axios from "axios";
import { SEGMENTS_URL, SEGMENTS_URL_ID } from "../constant/Api";
import { invalidateUserSegments } from "../app/userSegmentsSlice";
import { Routes } from "../constant/Routes";

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    borderColor: theme.palette.primary.main,
    borderRadius: "17px",
    background: theme.palette.background.paper,
  },
}));

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
  let history = useHistory();
  const classes = useStyles();
  const segmentsData = useSelector(
    (state: RootState) => state.userSegmentsData
  );
  const mountainGroupsData = useSelector(
    (state: RootState) => state.mountainGroupsData
  );
  const authData = useSelector((state: RootState) => state.authData);

  const pointsData = useSelector((state: RootState) => state.pointsData);

  const initSegment = segmentsData.segments?.find(
    (e: Segment) => e.id === parseInt(id)
  );

  const [userSegment, setUserSegment] = useState<SegmentData>(
    initSegment || startSegmentData
  );

  const {
    register: registerSegment,
    handleSubmit: handleSubmitSegment,
    errors: errorsSegment,
  } = useForm();
  const dispatch = useDispatch();

  const [newPoint, setNewPoint] = useState<string>();
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);
  const [grupaGorska, setGrupaGorska] = useState<string>(
    userSegment.grupagorska || mountainGroupsData.groups[0]
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

  const handleAddPoint = () => {
    if (!newPoint) return;
    const segmentPoints = Array.from(userSegment.punktypolaczenia);
    segmentPoints.push({
      kolejnosc: userSegment.punktypolaczenia.length,
      punkttrasy: {
        nazwa: newPoint,
      },
    });
    setUserSegment({ ...userSegment, punktypolaczenia: segmentPoints });
  };

  const onConfirm = (data: Segment) => {
    data.grupagorska = grupaGorska; //TODO: this is a workaround
    setUserSegment({ ...userSegment, ...data });
    setOpenSaveModal(true);
  };

  const onSave = async () => {
    //TODO: walidacja
    setOpenSaveModal(false);
    if (userSegment.punktypolaczenia.length < 2) {
      setOpenErrorModal(true);
      return;
    } else {
      try {
        let result;
        if (id === undefined) {
          result = await axios.post(SEGMENTS_URL, userSegment, {
            headers: {
              Authorization: "Bearer " + authData.token,
            },
          });
        } else {
          result = await axios.put(SEGMENTS_URL_ID(parseInt(id)), userSegment, {
            headers: {
              Authorization: "Bearer " + authData.token,
            },
          });
        }
        if ([200, 201].includes(result.status)) {
          dispatch(invalidateUserSegments());
          history.push(Routes.MANAGE_SEGMENTS);
        }
      } catch (error) {
        console.warn(error);
        setOpenErrorModal(true);
      }
    }
  };

  return (
    <Layout>
      <CustomInfoDialog
        open={openErrorModal}
        onCancel={() => setOpenErrorModal(false)}
        content={"Niepoprawne dane."}
      />
      <CustomConfirmDialog
        open={openSaveModal}
        onCancel={() => setOpenSaveModal(false)}
        onConfirm={() => onSave()}
        content={"Czy chcesz zapisać?"}
      />
      <Grid container justify="space-between" spacing={4} alignItems="center">
        <Grid item xs={6}>
          <form onSubmit={handleSubmitSegment(onConfirm)}>
            <CustomTextField
              label="Nazwa połączenia"
              name="nazwa"
              defaultValue={userSegment.nazwa}
              fullWidth
              inputRef={registerSegment({ required: true })}
              helperText={errorsSegment.nazwa && "Podaj nazwę połączenia"}
              error={!!errorsSegment.nazwa}
            />
            <CustomSelect
              label="Grupa górska"
              name="grupagorska"
              value={grupaGorska}
              // defaultValue={
              //   userSegment.grupagorska || mountainGroupsData.groups[0]
              // }
              // inputRef={registerSegment({ required: true })}
              onChange={(e) => setGrupaGorska(e.target.value)}
              options={mountainGroupsData.groups}
              // helperText={errorsSegment.grupagorska && "Podaj grupę górską"}
              // error={!!errorsSegment.grupagorska}
            />
            <CustomTextField
              label="Punkty do"
              name="punktydo"
              type="number"
              defaultValue={userSegment.punktydo}
              InputProps={{ inputProps: { min: 0 } }}
              inputRef={registerSegment({ required: true })}
              helperText={
                errorsSegment.punktydo && "Podaj punkty za połączenie"
              }
              error={!!errorsSegment.punktydo}
              fullWidth
            />
            <CustomTextField
              label="Punkty z"
              name="punktyz"
              type="number"
              defaultValue={userSegment.punktyz}
              InputProps={{ inputProps: { min: 0 } }}
              inputRef={registerSegment({ required: true })}
              helperText={errorsSegment.punktyz && "Podaj punkty za połączenie"}
              error={!!errorsSegment.punktyz}
              fullWidth
            />
            <CustomButton
              variant="contained"
              color="action"
              size="large"
              type="submit"
            >
              Zakończ
            </CustomButton>
          </form>
        </Grid>
        <Grid item xs={6}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={8} lg={10}>
              <Autocomplete
                id="newPoint"
                options={pointsData.points?.map((p) => p.nazwa) || []}
                onInputChange={(e, value) => setNewPoint(value || "")}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <CustomTextField {...params} label="" />
                )}
                classes={{ inputRoot: classes.autocomplete }}
                clearOnBlur={false}
              />
            </Grid>
            <Grid item xs={4} lg={2}>
              <CustomButton
                variant="contained"
                color="action"
                size="large"
                onClick={handleAddPoint}
              >
                Dodaj
              </CustomButton>
            </Grid>
          </Grid>
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
