const BASE_API_URL = "https://opensky-network.org/api";
const querylimit = 10;
const openSkyApiEndPoints = {
  allStates: "/states/all",
  allFlights: "/flights/all",
  airportDepartures: "/flights/departure",
  airportArrivals: "/flights/arrival",
};
// one day in secs
const DEFAULT_FLIGHT_INTERVAL = 2 * 60 * 60; // two hour interval in ms
const MAJOR_AIRPORTS = [
  {
    name: "Hartsfield–Jackson Atlanta International Airport",
    city: "Atlanta, Georgia",
    country: "US",
    IATA: "ATL",
    ICAO: "KATL",
  },
  {
    name: "Beijing Capital International Airport",
    city: "Chaoyang-Shunyi, Beijing",
    country: "China",
    IATA: "PEK",
    ICAO: "ZBAA",
  },
  {
    name: "Los Angeles International Airport",
    city: "Los Angeles, California",
    country: "United States",
    IATA: "LAX",
    ICAO: "KLAX",
  },
  {
    name: "Dubai International Airport",
    city: "Garhoud, Dubai",
    country: "UAE",
    IATA: "DXB",
    ICAO: "OMDB",
  },
  {
    name: "Tokyo Haneda Airport",
    city: "Ōta, Tokyo",
    country: "Japan",
    IATA: "HND",
    ICAO: "RJTT",
  },
  {
    name: "O'Hare International Airport",
    city: "Chicago, Illinois",
    country: "United States",
    IATA: "ORD",
    ICAO: "KORD",
  },
  {
    name: "London Heathrow Airport",
    city: "Hillingdon, London",
    country: "UK",
    IATA: "LHR",
    ICAO: "EGLL",
  },
  {
    name: "Shanghai Pudong International Airport",
    city: "Pudong, Shanghai",
    country: "China",
    IATA: "PVG",
    ICAO: "ZSPD",
  },
  {
    name: "Charles de Gaulle Airport",
    city: "Roissy-en-France, Île-de-France (Paris)",
    country: "France",
    IATA: "CDG",
    ICAO: "LFPG",
  },
  {
    name: "Charles de Gaulle Airport",
    city: "Roissy-en-France, Île-de-France (Paris)",
    country: "France",
    IATA: "DFW",
    ICAO: "KDFW",
  },
];

export {
  BASE_API_URL,
  querylimit,
  MAJOR_AIRPORTS,
  openSkyApiEndPoints,
  DEFAULT_FLIGHT_INTERVAL,
};
