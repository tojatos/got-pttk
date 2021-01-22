import { Grid, makeStyles, Typography, Container } from "@material-ui/core";
import React, { useState } from "react";
import Layout from "../components/MainLayout/Layout";
import CustomSearchBar from "../components/CustomSearchBar";
import CustomButton from "../components/CustomButton";
import CustomList from "../components/CustomList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import SegmentItem from "../components/ManageSegments/SegmentItem";
import CustomConfirmDialog from "../components/CustomConfirmDialog";
import { Link } from "react-router-dom";
import { Routes } from "../constant/Routes";

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

export default function ManageSegments() {
  const classes = useStyles();
  const [toDeleteId, setToDeleteId] = useState<number | undefined>();
  const dispatch = useDispatch();
  const segmentsData = useSelector(
    (state: RootState) => state.userSegmentsData
  );
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
            <Link to={Routes.ADD_SEGMENT}>
              <CustomButton variant="contained" color="action" size="large">
                Dodaj
              </CustomButton>
            </Link>
          </Grid>
          <Grid item xs={12} className={classes.listBox}>
            {segmentsData.segments && segmentsData.segments.length > 0 ? (
              <CustomList
                itemsJSX={segmentsData.segments.map((segm) => (
                  <SegmentItem
                    segment={segm}
                    key={segm.id}
                    onDelete={setToDeleteId}
                  />
                ))}
              />
            ) : (
              <Typography>Nie posiadasz żadnych własnych połączeń</Typography>
            )}
          </Grid>
        </Grid>
        <CustomConfirmDialog
          open={!!toDeleteId}
          content="Czy na pewno chcesz usunąć to połączenie?"
          onConfirm={handleConfirmDialog}
          onCancel={handleCloseDialog}
        />
      </Container>
    </Layout>
  );
}
