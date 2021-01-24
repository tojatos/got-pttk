import { Box, Grid, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import CustomButton from "../components/CustomButton";
import CustomSearch from "../components/CustomSearchBar";
import CustomTextField from "../components/CustomTextField";
import Layout from "../components/MainLayout/Layout";
import { Segment } from "../constant/Segment";
import { Typography } from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import CustomDroppableList from "../components/PlanRoutes/CustomDroppableList";
import { dataToRouteSegment, RouteSegmentData } from "../constant/RouteSegment";
import {
  calculatePointsFromData,
  checkRouteConsistency,
  filtredSegments,
} from "../lib/utils";
import axios from "axios";
import { ROUTE_URL } from "../constant/Api";
import { Route } from "../constant/Route";
import { invalidateRoutes } from "../app/routesSlice";
import CustomInfoDialog from "../components/CustomInfoDialog";
import CustomConfirmDialog from "../components/CustomConfirmDialog";
import { Routes } from "../constant/Routes";
import { useHistory } from "react-router-dom";

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
  let history = useHistory();
  const authData = useSelector((state: RootState) => state.authData);
  const segmentsData = useSelector((state: RootState) => state.segmentsData);
  const userSegmentsData = useSelector(
    (state: RootState) => state.userSegmentsData
  );
  const allSegments = [
    ...(segmentsData.segments || []),
    ...(userSegmentsData.segments || []),
  ];
  const [filteredSegments, setFilteredSegments] = useState<Segment[]>(
    allSegments
  );
  const [routeSegments, setRouteSegments] = useState<RouteSegmentData[]>([]);
  const [routeName, setRouteName] = useState<string>("");
  const [openSavedModal, setOpenSavedModal] = useState<boolean>(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const [openInconsistencyModal, setOpenInconsistencyModal] = useState<boolean>(
    false
  );

  const dispatch = useDispatch();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === result.destination.droppableId) {
      if (result.source.droppableId === "segments") return;

      const route = reorder(
        routeSegments,
        result.source.index,
        result.destination.index
      );

      setRouteSegments(
        route.map((route, index) => ({
          ...route,
          kolejnosc: index + 1,
        }))
      );
    } else {
      if (result.source.droppableId === "routes") return;

      const sourceClone = Array.from(filteredSegments);
      const destClone = Array.from(routeSegments);
      const [removed] = sourceClone.splice(result.source.index, 1);

      destClone.splice(result.destination.index, 0, {
        polaczenie: removed,
        czypowrotne: false,
        kolejnosc: result.destination.index + 1,
      });
      setRouteSegments(
        destClone.map((route, index) => ({
          ...route,
          kolejnosc: index + 1,
        }))
      );
    }
  };

  const handleDeleteSegment = (id: number) => {
    const routeClone = Array.from(routeSegments);
    routeClone.splice(id, 1);
    setRouteSegments(routeClone);
  };

  const handleCheckAsWayBack = (id: number) => {
    const routeClone = Array.from(routeSegments);
    routeClone[id].czypowrotne = !routeClone[id].czypowrotne;
    setRouteSegments(routeClone);
  };

  const saveRouteButtonClick = () => {
    if (!checkRouteConsistency(routeSegments)) {
      setOpenInconsistencyModal(true);
    } else {
      saveRoute();
    }
  };

  const saveRoute = async () => {
    const s = routeSegments.map(dataToRouteSegment);
    const route = {
      id: 0,
      nazwa: routeName,
      datarozpoczecia: null,
      datazakonczenia: null,
      polaczeniatrasy: s,
    } as Route;
    try {
      const result = await axios.post(ROUTE_URL, route, {
        headers: {
          Authorization: "Bearer " + authData.token,
        },
      });
      if (result.status === 201) {
        dispatch(invalidateRoutes());
        setOpenSavedModal(true);
      }
    } catch (error) {
      console.warn(error);
      setOpenErrorModal(true);
    }
  };

  return (
    <Layout>
      <CustomInfoDialog
        open={openSavedModal}
        onCancel={() => {
          setOpenSavedModal(false);
          history.push(Routes.MANAGE_ROUTES);
        }}
        content={"Pomyślnie zapisano trasę."}
      />
      <CustomInfoDialog
        open={openErrorModal}
        onCancel={() => setOpenErrorModal(false)}
        content={"Nastąpił błąd przy zapisywaniu."}
      />
      <CustomConfirmDialog
        open={openInconsistencyModal}
        onCancel={() => setOpenInconsistencyModal(false)}
        onConfirm={() => {
          setOpenInconsistencyModal(false);
          saveRoute();
        }}
        content={
          "Trasa zawiera niespójne połączenia. Czy mimo to zapisać trasę?"
        }
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container justify="space-between" spacing={3}>
          <Grid item xs={6}>
            <CustomTextField
              label="Nazwa trasy"
              name="routeName"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              fullWidth
            />
            <CustomDroppableList
              droppableId="route"
              list={routeSegments}
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
                  checkRouteConsistency(routeSegments) ? classes.hide : ""
                }
              >
                <WarningIcon className={classes.warningIcon} fontSize="small" />
                Nieprawidłowe połączenie w trasie
              </Typography>
              <Typography>
                {calculatePointsFromData(routeSegments)} pkt.
              </Typography>
              <CustomButton
                variant="contained"
                color="action"
                size="large"
                disabled={!authData.login}
                onClick={saveRouteButtonClick}
              >
                Zapisz
              </CustomButton>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <CustomSearch
              className={classes.searchbar}
              onChange={(e) =>
                setFilteredSegments(
                  filtredSegments(e.target.value, allSegments)
                )
              }
            />
            <CustomDroppableList
              droppableId="segments"
              list={filteredSegments}
              type="source"
            />
          </Grid>
        </Grid>
      </DragDropContext>
    </Layout>
  );
}
