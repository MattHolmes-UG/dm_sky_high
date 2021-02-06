import request from "./request";
import { openSkyApiEndPoints } from "config/config";

const {
  allFlights,
  airportArrivals,
  airportDepartures
} = openSkyApiEndPoints;
const getAllFlights = (begin, end) => {
  return request({
    endpoint: allFlights,
    method: "get",
    query: { begin, end },
  });
};
const getAirportArrivals = (airport, begin, end) => {
  return request({
    endpoint: airportArrivals,
    method: "get",
    query: { begin, end, airport },
  });
};
const getAirportDepartures = (airport, begin, end) => {
  return request({
    endpoint: airportDepartures,
    method: "get",
    query: { begin, end, airport },
  });
};

const OpenSkyServices = {
  getAllFlights,
  getAirportArrivals,
  getAirportDepartures
};

export default OpenSkyServices;
