import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useState } from "react";
import Layout from "../components/MainLayout/Layout";
import CustomSearchBar from "../components/CustomSearchBar";
import CustomList from "../components/CustomList";
import CustomConfirmDialog from "../components/CustomConfirmDialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import RouteItem from "../components/ManageRoutes/RouteItem";
import axios from "axios";
import { ROUTE_URL_ID } from "../constant/Api";
import { invalidateRoutes } from "../app/routesSlice";
import CustomInfoDialog from "../components/CustomInfoDialog";
import { filtredRoutes } from "../lib/utils";
import { Route } from "../constant/Route";

const useStyles = makeStyles((theme) => ({
  listBox: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  cointainer: {
    [theme.breakpoints.up("md")]: {
      width: "70%",
    },
  },
  center: {
    textAlign: "center",
  },
}));

export default function ManageRoutes() {
  const classes = useStyles();
  const [toDeleteId, setToDeleteId] = useState<number | undefined>();
  const dispatch = useDispatch();
  const routesData = useSelector((state: RootState) => state.routesData);
  const authData = useSelector((state: RootState) => state.authData);
  const [openDeletedModal, setOpenDeletedModal] = useState<boolean>(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);

  const segmentsData = useSelector((state: RootState) => state.segmentsData);
  const userSegmentsData = useSelector(
    (state: RootState) => state.userSegmentsData
  );

  const allSegments = [
    ...(segmentsData.segments || []),
    ...(userSegmentsData.segments || []),
  ];

  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>(
    routesData.routes || []
  );

  const handleCloseDialog = () => {
    setToDeleteId(undefined);
  };

  const handleConfirmDialog = async () => {
    try {
      const result = await axios.delete(ROUTE_URL_ID(toDeleteId!), {
        headers: {
          Authorization: "Bearer " + authData.token,
        },
      });
      if (result.status === 204) {
        dispatch(invalidateRoutes());
        setOpenDeletedModal(true);
      }
    } catch (error) {
      console.warn(error);
      setOpenErrorModal(true);
    }
    setToDeleteId(undefined);
  };
  return (
    <Layout>
      <CustomInfoDialog
        open={openDeletedModal}
        onCancel={() => {
          setOpenDeletedModal(false);
        }}
        content={"Pomyślnie usunięto trasę."}
      />
      <CustomInfoDialog
        open={openErrorModal}
        onCancel={() => setOpenErrorModal(false)}
        content={"Nastąpił błąd przy usuwaniu trasy."}
      />
      <Container className={classes.cointainer}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <CustomSearchBar
              onChange={(e) =>
                setFilteredRoutes(
                  filtredRoutes(
                    e.target.value,
                    routesData.routes || [],
                    allSegments
                  )
                )
              }
            />
          </Grid>
          <Grid item xs={12} className={classes.listBox}>
            {filteredRoutes && filteredRoutes.length > 0 ? (
              <CustomList
                itemsJSX={filteredRoutes.map((r) => (
                  <RouteItem route={r} key={r.id} onDelete={setToDeleteId} />
                ))}
              />
            ) : (
              <Typography>Nie posiadasz żadnych własnych tras</Typography>
            )}
          </Grid>
        </Grid>
        <CustomConfirmDialog
          open={!!toDeleteId}
          content="Czy na pewno chcesz usunąć tą trasę?"
          onConfirm={handleConfirmDialog}
          onCancel={handleCloseDialog}
        />
      </Container>
    </Layout>
  );
}
