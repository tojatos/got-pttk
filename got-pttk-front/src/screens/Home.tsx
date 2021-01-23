import React from "react";
import LoginForm from "../components/Home/LoginForm";
import Layout from "../components/MainLayout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { NavConfig } from "../constant/NavConfig";
import { Link as RouterLink } from "react-router-dom";

export default function Home() {
  const authData = useSelector((state: RootState) => state.authData);
  return (
    <Layout>
      {authData.login ? (
        <>
          <Grid>
            <Typography>Witaj, {authData.login}</Typography>
            <Paper>
              <List>
                {NavConfig.find((e) => e.user === authData.role)?.routes.map(
                  (route, i) => (
                    <ListItem
                      key={i}
                      button
                      component={RouterLink}
                      to={route.path}
                    >
                      <ListItemText primary={route.label} />
                    </ListItem>
                  )
                )}
              </List>
            </Paper>
          </Grid>
        </>
      ) : (
        <LoginForm />
      )}
    </Layout>
  );
}
