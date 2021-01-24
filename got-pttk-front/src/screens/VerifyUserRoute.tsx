import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { uniqBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../app/store";
import CustomButton from "../components/CustomButton";
import Layout from "../components/MainLayout/Layout";
import DraggableSegment from "../components/PlanRoutes/DraggableSegment";
import MountainGroupItem from "../components/VerifyRoute/MountainGroupItem";
import ScrollableList from "../components/VerifyRoute/ScrollableList";
import { Route } from "../constant/Route";
import { RouteSegment, RouteSegmentData } from "../constant/RouteSegment";
import { Segment } from "../constant/Segment";
import { VerificationMountainGroup } from "../constant/Verifications";
import { calculatePoints } from "../lib/utils";
import axios from "axios";
import { VERIFIED_MOUNTAIN_GROUPS_URL, VERIFY_URL } from "../constant/Api";
import { invalidateRoutesToVerify } from "../app/routesToVerifySlice";
import CustomInfoDialog from "../components/CustomInfoDialog";

const useStyles = makeStyles((theme) => ({
  spacingY: {
    margin: theme.spacing(2, 0),
  },
  spacingX: {
    margin: theme.spacing(0, 2),
  },
  smallerBox: {
    width: "80%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
}));

export default function VerifyUserRoute() {
  const classes = useStyles();
  const [present, setPresent] = useState<boolean>(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
  const [verifiedGroups, setVerifiedGroups] = useState<string[]>([]);

  const routesToVerifyData = useSelector(
    (state: RootState) => state.routesToVerifyData
  );
  const segmentsData = useSelector((state: RootState) => state.segmentsData);
  const authData = useSelector((state: RootState) => state.authData);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const route = routesToVerifyData.routes?.find(
    (e: Route) => e.id === parseInt(id)
  )!;
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

  const sendVerifyRequest = async () => {
    const verification = {
      czyprzodownikuczestniczyl: present ? 1 : 0,
      trasa: parseInt(id),
    };

    try {
      const result = await axios.post(VERIFY_URL, verification, {
        headers: {
          Authorization: "Bearer " + authData.token,
        },
      });
      if (result.status === 201) {
        dispatch(invalidateRoutesToVerify());
        getVerifiedGroups();
        setOpenSuccessModal(true);
      }
    } catch (error) {
      console.warn(error);
      setOpenErrorModal(true);
    }
  };

  const getVerifiedGroups = async () => {
    try {
      const result = await axios.get(
        VERIFIED_MOUNTAIN_GROUPS_URL(parseInt(id)),
        {
          headers: {
            Authorization: "Bearer " + authData.token,
          },
        }
      );
      if (result.status === 200) {
        const groups: string[] = result.data.map(
          ({ nazwa }: { nazwa: string }) => nazwa
        );
        setVerifiedGroups(groups);
      }
    } catch (error) {
      console.warn(error);
    }
  };
  useEffect(() => {
    getVerifiedGroups();
  }, []);

  const getGroupsFromRoute = (route: Route): VerificationMountainGroup[] => {
    const mountainGroups = uniqBy(
      route.polaczeniatrasy
        .map(routeSegmentTodata)
        .map((segment) => segment.polaczenie),
      "grupagorska"
    ).map((segment) => segment.grupagorska);

    return mountainGroups.map((group) => ({
      nazwa: group,
      czyzweryfikowana: verifiedGroups.includes(group),
    }));
  };

  return (
    <Layout>
      <CustomInfoDialog
        open={openSuccessModal}
        onCancel={() => setOpenSuccessModal(false)}
        content={"Pomyślnie zweryfikowano trasę."}
      />
      <CustomInfoDialog
        open={openErrorModal}
        onCancel={() => setOpenErrorModal(false)}
        content={"Wystąpił błąd przy weryfikacji."}
      />
      <Grid container justify="space-between" spacing={10} alignItems="center">
        <Grid item xs={6}>
          <Typography className={classes.spacingY}>{route.nazwa}</Typography>
          <ScrollableList
            itemsJSX={route.polaczeniatrasy
              .map(routeSegmentTodata)
              .map((segm) => (
                <DraggableSegment
                  segment={segm.polaczenie}
                  key={segm.kolejnosc}
                />
              ))}
          />
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
            flexDirection="column"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={present}
                  color="primary"
                  onChange={() => setPresent(!present)}
                  inputProps={{
                    "aria-label": "Potwierdzam uczestnictwo w wycieczce.",
                  }}
                />
              }
              label="Potwierdzam uczestnictwo w wycieczce."
            />
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Typography color="textPrimary" className={classes.spacingX}>
                {calculatePoints(
                  route.polaczeniatrasy,
                  segmentsData.segments || []
                ) + "pkt."}
              </Typography>
              <CustomButton
                color="action"
                size="large"
                className={classes.spacingY}
                onClick={sendVerifyRequest}
              >
                Zweryfikuj
              </CustomButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box className={classes.smallerBox}>
            <CustomButton
              color="secondary"
              variant="contained"
              size="large"
              className={classes.spacingY}
            >
              Dokumentacja
            </CustomButton>
            <ScrollableList
              itemsJSX={getGroupsFromRoute(route).map((group) => (
                <MountainGroupItem
                  group={group.nazwa}
                  isVerified={group.czyzweryfikowana}
                  key={group.nazwa}
                />
              ))}
            />
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
}
