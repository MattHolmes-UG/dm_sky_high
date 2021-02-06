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
import GridItem from "components/AirportModalCard/node_modules/components/Grid/GridItem.js.js";
import GridContainer from "components/AirportModalCard/node_modules/components/Grid/GridContainer.js.js";
import CustomTabs from "components/AirportModalCard/node_modules/components/CustomTabs/CustomTabs.js.js";
import Danger from "components/AirportModalCard/node_modules/components/Typography/Danger.js.js";
import Card from "components/AirportModalCard/node_modules/components/Card/Card.js.js";
import CardHeader from "components/AirportModalCard/node_modules/components/Card/CardHeader.js.js";
import CardIcon from "components/AirportModalCard/node_modules/components/Card/CardIcon.js.js";
import CardBody from "components/AirportModalCard/node_modules/components/Card/CardBody.js.js";
import CardFooter from "components/AirportModalCard/node_modules/components/Card/CardFooter.js.js";
import Modal from "components/AirportModalCard/node_modules/components/Modal/Modal.js.js";
import AirportModalCard from "components/AirportModalCard/AirportModalCard.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/groups/views/dashboardStyle.js";
import OpenSkyServices from "services/openSky";
import { DEFAULT_FLIGHT_INTERVAL, MAJOR_AIRPORTS } from "config/config";
import { CircularProgress } from "@material-ui/core";

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
  const [interval, setInterval] = React.useState(60);
  const [flightData, setFlightData] = React.useState([]);
  const [begin, setBegin] = React.useState(
    getDateInSecs(`01-29-2021 12:59:59`)
  ); //mm-dd-yyyy
  const [end, setEnd] = React.useState(
    begin + DEFAULT_FLIGHT_INTERVAL - interval * 60
  );
  const cities = MAJOR_AIRPORTS;
  const classes = useStyles();

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
        {cities.map((airport, i) => {
          return (
            <GridItem key={airport.ICAO} xs={12} sm={12} md={4}>
              <Modal
                key={airport.name}
                open={airport.name === open}
                id={airport.name}
                handleClose={() => setOpen(0)}
                content={<AirportModalCard airport={airport} timeStr={timeStr} />}
              />
              <Card
                onClick={() => {
                  setOpen(airport.name);
                }}
                key={airport.name + (i - 1)}
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
                  <h4 className={classes.cardTitle}>{airport.name}</h4>
                  <p className={classes.cardCategory}>
                    <span className={classes.successText}>
                      <ArrowUpward className={classes.upArrowCardCategory} />{" "}
                    </span>{" "}
                    Air traffic in the last {timeStr}
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
