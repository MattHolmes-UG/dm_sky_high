import React, { useEffect } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Modal from "components/Modal/Modal.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/groups/views/dashboardStyle.js";
import OpenSkyServices from "services/openSky";
import { DEFAULT_FLIGHT_INTERVAL, MAJOR_CITIES } from "config/config";

const useStyles = makeStyles(styles);

const getDateInSecs = (date = null) => {
  let timeInMs = 0;
  if (date) {
    console.log(date);
    timeInMs = new Date(date).getTime();
  } else {
    timeInMs = new Date().getTime();
  }
  return Math.floor(timeInMs / 1000) - DEFAULT_FLIGHT_INTERVAL;
};

// const currentTimeInSecs = Math.floor(new Date().getTime() / 1000);

export default function Dashboard() {
  const [open, setOpen] = React.useState(0);
  const [interval, setInterval] = React.useState(60)
  const [flightData, setFlightData] = React.useState([]);
  const [begin, setBegin] = React.useState(getDateInSecs(`01-29-2021 12:59:59`)); //mm-dd-yyyy
  const [end, setEnd] = React.useState(
    begin + DEFAULT_FLIGHT_INTERVAL - interval * 60
  );
  const cities = MAJOR_CITIES;
  const classes = useStyles();

  const getModalCard = (data, city, timeStr) => {
    let departures = 0,
     arrivals = 0
    data.forEach(flight => {
      flight.arrivalAirportCandidatesCount ? arrivals += 1 : departures += 1;
    })
    return (
      <Card>
        <CardHeader color="primary">
          <h2 className={classes.cardTitleWhite}>{city}</h2>
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
                    <Icon>content_copy</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Departures</p>
                  <h3 className={classes.cardTitle}>{departures}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                    Last {timeStr}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
              <Card>
                <CardHeader color="success" stats icon>
                  <CardIcon color="success">
                    <Store />
                  </CardIcon>
                  <p className={classes.cardCategory}>Arrivals</p>
                  <h3 className={classes.cardTitle}>{arrivals}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                    Last {timeStr}
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    );
  };

  useEffect(() => {
    OpenSkyServices.getAllFlights(begin, end)
      .then((data) => {
        if (data.length === 0) {
          // alert('No records found for time interval');
        }
        setFlightData(data);
        console.log(data);
      })
      .catch((error) => {
        // alert(error);
      });
  }, [cities]);

  const timeStr =
    interval >= 60
      ? `${interval / 60} hrs ${
          interval % 60 > 0 ? `${interval % 60} mins` : ""
        }`
      : `${interval} mins`;

  return (
    <div>
      <GridContainer>
        {cities.map((name, i) => {
          return (
            <GridItem key={name + i} xs={12} sm={12} md={4}>
              <Modal
                key={name}
                open={name === open}
                id={name}
                handleClose={() => setOpen(0)}
                content={getModalCard(flightData.slice(0, 100*(i+1)), name, timeStr)}
              />
              <Card
                onClick={() => {
                  setOpen(name);
                }}
                key={name + (i - 1)}
              >
                <CardHeader color="success">
                  <ChartistGraph
                    className="ct-chart"
                    data={
                      i % 2 === 0
                        ? completedTasksChart.data
                        : emailsSubscriptionChart.data
                    }
                    type="Line"
                    options={
                      i % 2 === 0
                        ? dailySalesChart.options
                        : emailsSubscriptionChart.options
                    }
                    listener={
                      i % 2 === 0
                        ? dailySalesChart.animation
                        : emailsSubscriptionChart.animation
                    }
                  />
                </CardHeader>
                <CardBody>
                  <h4 className={classes.cardTitle}>{name}</h4>
                  <p className={classes.cardCategory}>
                    <span className={classes.successText}>
                      <ArrowUpward className={classes.upArrowCardCategory} />{" "}
                    </span>{" "}
                    Air traffic in the last {timeStr} for {name}
                  </p>
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <AccessTime /> updated 1 minute ago
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          );
        })}
      </GridContainer>
    </div>
  );
}
