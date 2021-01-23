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
import axios from "axios";
import { SEGMENTS_URL_ID } from "../constant/Api";
import CustomInfoDialog from "../components/CustomInfoDialog";
import { invalidateUserSegments } from "../app/userSegmentsSlice";

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
  const [openDeletedModal, setOpenDeletedModal] = useState<boolean>(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const dispatch = useDispatch();
  const authData = useSelector((state: RootState) => state.authData);
  const segmentsData = useSelector(
    (state: RootState) => state.userSegmentsData
  );
  const handleCloseDialog = () => {
    setToDeleteId(undefined);
  };

  const handleConfirmDialog = async () => {
    try {
      const result = await axios.delete(SEGMENTS_URL_ID(toDeleteId!), {
        headers: {
          Authorization: "Bearer " + authData.token,
        },
      });
      if (result.status === 204) {
        dispatch(invalidateUserSegments());
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
        content={"Pomyślnie usunięto połączenie."}
      />
      <CustomInfoDialog
        open={openErrorModal}
        onCancel={() => setOpenErrorModal(false)}
        content={"Nastąpił błąd przy usuwaniu połączenia."}
      />
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
