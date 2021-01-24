import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import CustomList from "../components/CustomList";
import Layout from "../components/MainLayout/Layout";
import RouteItem from "../components/VerifyRoute/RouteItem";

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

export default function VerifyRoute() {
  const classes = useStyles();
  const routesData = useSelector((state: RootState) => state.routesData);

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
          <Grid item xs={12} className={classes.listBox}>
            {routesData.routes && routesData.routes.length > 0 ? (
              <CustomList
                itemsJSX={routesData.routes.map((r) => (
                  <RouteItem route={r} key={r.id} />
                ))}
              />
            ) : (
              <Typography>Nie ma tras do weryfikacji</Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
