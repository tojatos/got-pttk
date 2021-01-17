import { Grid, makeStyles, Typography, Container } from "@material-ui/core";
import React from "react";
import Layout from "../components/MainLayout/Layout";
import CustomSearchBar from "../components/CustomSearchBar";
import CustomButton from "../components/CustomButton";
import CustomList from "../components/CustomList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEffect } from "react";
import { initSegments } from "../app/segmentsSlice";
import SegmentItem from "../components/ManageSegments/SegmentItem";

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
  //TODO: Replace with segments of current user
  const dispatch = useDispatch();
  const segmentsData = useSelector((state: RootState) => state.segmentsData);

  useEffect(() => {
    if (!segmentsData.segmentsInitialized) {
      dispatch(initSegments());
    } else {
      console.log(segmentsData.segments);
    }
  }, [dispatch, segmentsData.segments, segmentsData.segmentsInitialized]);

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
            <CustomButton variant="contained" color="action">
              Dodaj
            </CustomButton>
          </Grid>
          <Grid item xs={12} className={classes.listBox}>
            {segmentsData.segments && segmentsData.segments.length > 0 ? (
              <CustomList
                itemsJSX={segmentsData.segments.map((segm) => (
                  <SegmentItem segment={segm} key={segm.id} />
                ))}
              />
            ) : (
              <Typography>Nie posiadasz żadnych własnych połączeń</Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
