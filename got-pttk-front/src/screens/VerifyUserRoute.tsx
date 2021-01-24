import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { flatten, uniqBy } from "lodash";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
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
import {
  VerificationMountainGroup,
  VerificationOfRoute,
} from "../constant/Verifications";
import { calculatePoints } from "../lib/utils";

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
  //TODO replace with correct data
  const verificationsOfRoute: VerificationOfRoute[] = [];
  const routesData = useSelector((state: RootState) => state.routesData);
  const segmentsData = useSelector((state: RootState) => state.segmentsData);
  const { id } = useParams<{ id: string }>();
  const route = routesData.routes?.find((e: Route) => e.id === parseInt(id))!;
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

  const getGroupsFromRoute = (
    route: Route,
    verificationsOfThisRoutes: VerificationOfRoute[]
  ): VerificationMountainGroup[] => {
    const mountainGroups = uniqBy(
      route.polaczeniatrasy
        .map(routeSegmentTodata)
        .map((segment) => segment.polaczenie),
      "grupagorska"
    ).map((segment) => segment.grupagorska);
    const someoneWasPresent = verificationsOfThisRoutes.some(
      (verify) => verify.czyPrzodownikUczestniczyl
    );
    const verifiedGroups = flatten(
      verificationsOfThisRoutes.map((verify) => verify.grupygorskiePrzodownika)
    );

    return mountainGroups.map((group) => ({
      nazwa: group,
      czyzweryfikowana:
        someoneWasPresent ||
        verifiedGroups.some((verifiedGroup) => group === verifiedGroup),
    }));
  };

  return (
    <Layout>
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
              Dokumantacja
            </CustomButton>
            <ScrollableList
              itemsJSX={getGroupsFromRoute(route, verificationsOfRoute).map(
                (group) => (
                  <MountainGroupItem
                    group={group.nazwa}
                    isVerified={group.czyzweryfikowana}
                    key={group.nazwa}
                  />
                )
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
}
