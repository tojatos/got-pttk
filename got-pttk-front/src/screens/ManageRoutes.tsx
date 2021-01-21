import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useState } from "react";
import Layout from "../components/MainLayout/Layout";
import CustomSearchBar from "../components/CustomSearchBar";
import CustomButton from "../components/CustomButton";
import CustomList from "../components/CustomList";
import CustomConfirmDialog from "../components/CustomConfirmDialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import RouteItem from "../components/ManageRoutes/RouteItem";

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

  const handleCloseDialog = () => {
    console.log("Anulowano");
    setToDeleteId(undefined);
  };

  const handleConfirmDialog = () => {
    console.log("Usunieto połączenie: " + toDeleteId);
    setToDeleteId(undefined);
  };
  return (
    <Layout>
      <Container className={classes.cointainer}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={10}>
            <CustomSearchBar />
          </Grid>
          <Grid item xs={2} className={classes.center}>
            <CustomButton variant="contained" color="action" size="large">
              Dodaj
            </CustomButton>
          </Grid>
          <Grid item xs={12} className={classes.listBox}>
            {routesData.routes && routesData.routes.length > 0 ? (
              <CustomList
                itemsJSX={routesData.routes.map((r) => (
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
