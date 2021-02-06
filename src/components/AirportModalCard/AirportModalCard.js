import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import styles from "assets/jss/groups/views/dashboardStyle.js";
import OpenSkyServices from "services/openSky";
import { LinearProgress } from "@material-ui/core";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import FlightLandIcon from "@material-ui/icons/FlightLand";

const useStyles = makeStyles(styles);

export default function AirportModalCard({ airport, timeStr, begin, end }) {
  const classes = useStyles();
  const [departures, setDepartures] = useState(-1);
  const [arrivals, setArrivals] = useState(-1);
  const [departureErr, setdepartureErr] = useState(false);
  const [arrivalErr, setarrivalErr] = useState(false);
  useEffect(() => {
    OpenSkyServices.getAirportDepartures(airport.ICAO, begin, end)
      .then((data) => {
        setDepartures(data.length);
        console.log("de", data);
      })
      .catch((error) => {
        setdepartureErr(true);
      });
    OpenSkyServices.getAirportArrivals(airport.ICAO, begin, end)
      .then((data) => {
        setArrivals(data.length);
        console.log("ar", data);
      })
      .catch((error) => {
        setarrivalErr(true);
      });
  }, []);
  return (
    <Card>
      <CardHeader color="primary">
        <h2 className={classes.cardTitleWhite}>{airport.name}</h2>
        <p className={classes.cardTitleWhite}>
          Air traffic in the last {timeStr}
        </p>
      </CardHeader>
      <CardBody>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <FlightTakeoffIcon />
                </CardIcon>
                <p className={classes.cardCategory}>Departures</p>
                <h3 className={classes.cardTitle}>
                  {departures >= 0 ? (
                    departures
                  ) : (
                    <LinearProgress variant="indeterminate" />
                  )}
                </h3>
              </CardHeader>
              <CardFooter stats>
                {departureErr ? (
                  <Danger>
                    <Warning />
                    Failed
                  </Danger>
                ) : (
                  <div className={classes.stats}>
                    <DateRange />
                    Updated for the Last {timeStr}
                  </div>
                )}
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <FlightLandIcon />
                </CardIcon>
                <p className={classes.cardCategory}>Arrivals</p>
                <h3 className={classes.cardTitle}>
                  {arrivals >= 0 ? arrivals : <LinearProgress />}
                </h3>
              </CardHeader>
              <CardFooter stats>
                {arrivalErr ? (
                  <Danger>
                    <Warning />
                    Failed
                  </Danger>
                ) : (
                  <div className={classes.stats}>
                    <DateRange />
                    Updated for the Last {timeStr}
                  </div>
                )}
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </CardBody>
      <CardFooter stats>
        <h3 className={classes.stats}>Country: {airport.country}</h3>
        <h3 className={classes.stats}>ICAO: {airport.ICAO}</h3>
        <h3 className={classes.stats}>IATA: {airport.IATA}</h3>
      </CardFooter>
    </Card>
  );
}
