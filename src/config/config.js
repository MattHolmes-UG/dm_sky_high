const BASE_API_URL = "https://opensky-network.org/api";
const querylimit = 10;
const openSkyApiEndPoints = {
  allStates: "/states/all",
  allFlights: "/flights/all",
  flightsByAircraft: "/flights/all",
  flightArrivals: "/flights/arrivals",
};
// one day in secs
const DEFAULT_FLIGHT_INTERVAL = 2 * 60 * 60; // two hour interval in ms
const MAJOR_CITIES = [
  "London",
  "New York",
  "Tokyo",
  "Shanghai",
  "Los Angeles",
  "Atlanta",
  "Moscow",
  "Milan",
  "Paris",
  "Amsterdam"
];

export {
  BASE_API_URL,
  querylimit,
  MAJOR_CITIES,
  openSkyApiEndPoints,
  DEFAULT_FLIGHT_INTERVAL,
};
