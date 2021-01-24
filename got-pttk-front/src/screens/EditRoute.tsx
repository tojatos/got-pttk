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
import {
  dataToRouteSegment,
  RouteSegment,
  RouteSegmentData,
} from "../constant/RouteSegment";
import { calculatePointsFromData, checkRouteConsistency } from "../lib/utils";
import axios from "axios";
import { ROUTE_URL_ID } from "../constant/Api";
import { Route } from "../constant/Route";
import { invalidateRoutes } from "../app/routesSlice";
import CustomInfoDialog from "../components/CustomInfoDialog";
import CustomConfirmDialog from "../components/CustomConfirmDialog";
import { Routes } from "../constant/Routes";
import { useHistory, useParams } from "react-router-dom";
import CustomDatePicker from "../components/CustomDatePicker";
import PublishIcon from "@material-ui/icons/Publish";

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

export default function EditRoute() {
  const classes = useStyles();
  let history = useHistory();
  const authData = useSelector((state: RootState) => state.authData);
  const segmentsData = useSelector((state: RootState) => state.segmentsData);
  const routesData = useSelector((state: RootState) => state.routesData);
  const userSegmentsData = useSelector(
    (state: RootState) => state.userSegmentsData
  );

  const allSegments = [
    ...(segmentsData.segments || []),
    ...(userSegmentsData.segments || []),
  ];

  const routeSegmentTodata = (rs: RouteSegment): RouteSegmentData => ({
    polaczenie: allSegments.find((s: Segment) => s.id === rs.polaczenieid)!,
    czypowrotne: rs.czypowrotne,
    kolejnosc: rs.kolejnosc,
  });

  const { id } = useParams<{ id: string }>();
  const initRoute = routesData.routes?.find(
    (e: Route) => e.id === parseInt(id)
  )!;

  const [filteredSegments] = useState<Segment[]>(allSegments);
  const [routeSegments, setRouteSegments] = useState<RouteSegmentData[]>(
    initRoute.polaczeniatrasy.map(routeSegmentTodata)
  );
  const [routeName, setRouteName] = useState<string>(initRoute.nazwa);
  const [startData, setStartData] = useState<string>(
    initRoute.datarozpoczecia || ""
  );
  const [endData, setEndData] = useState<string>(
    initRoute.datazakonczenia || ""
  );

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

      setRouteSegments(route);
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
      setRouteSegments(destClone);
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
      id: parseInt(id),
      nazwa: routeName,
      datarozpoczecia: startData,
      datazakonczenia: endData,
      polaczeniatrasy: s,
    } as Route;
    try {
      const result = await axios.put(ROUTE_URL_ID(parseInt(id)), route, {
        headers: {
          Authorization: "Bearer " + authData.token,
        },
      });
      if (result.status === 200) {
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
            <Grid container justify="space-between" xs={12} spacing={2}>
              <Grid item xs={6}>
                <CustomDatePicker
                  label="Data rozpoczęcia"
                  name="startDate"
                  value={startData}
                  onChange={(e) => setStartData(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <CustomDatePicker
                  label="Data zakończenia"
                  name="endDate"
                  value={endData}
                  onChange={(e) => setEndData(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
            <CustomDroppableList
              droppableId="route"
              list={routeSegments}
              height="45vh"
              type="destination"
              onDelete={handleDeleteSegment}
              onCheck={handleCheckAsWayBack}
            />
            <Box display="flex" justifyContent="flex-end" marginY={2}>
              <CustomButton
                variant="contained"
                color="secondary"
                size="large"
                disabled={!authData.login}
                onClick={saveRouteButtonClick}
              >
                <PublishIcon />
                Załącz dokumentację
              </CustomButton>
            </Box>
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
            <CustomSearch className={classes.searchbar} />
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
