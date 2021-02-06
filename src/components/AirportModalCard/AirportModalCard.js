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
  
  export default AirportModalCard = ({airport, timeStr}) => {
     const [departures, setDepartures] = useState(0);
     const [arrivals, setArrivals] = useState(0);
      useEffect(() => {
        OpenSkyServices.getAirportDepartures(airport.ICAO, begin, end)
          .then((data) => {
            setDepartures(data.length);
            console.log("de", data);
          })
          .catch((error) => {
            // alert(error);
          });
        OpenSkyServices.getAirportArrivals(airport.ICAO, begin, end)
          .then((data) => {
            setArrivals(data.length);
            console.log("ar", data);
          })
          .catch((error) => {
            // alert(error);
          });
      }, [])
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
                    <Icon>content_copy</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Departures</p>
                  {departures ? (
                    <h3 className={classes.cardTitle}>{departures}</h3>
                  ) : (
                    <CircularProgress />
                  )}
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
                  {arrivals ? (
                    <h3 className={classes.cardTitle}>{arrivals}</h3>
                  ) : (
                    <CircularProgress />
                  )}
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
        <CardFooter stats>
          <h3 className={classes.stats}>Country: {airport.country}</h3>
          <h3 className={classes.stats}>ICAO: {airport.ICAO}</h3>
          <h3 className={classes.stats}>IATA: {airport.IATA}</h3>
        </CardFooter>
      </Card>
    );
  };