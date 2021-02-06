import katlImg from "assets/img/sidebar-1.jpg";
import zbaaImg from "assets/img/pexels-photo-723240.jpeg";


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
    avatar: katlImg
  },
  {
    name: "Beijing Capital International Airport",
    city: "Chaoyang-Shunyi, Beijing",
    country: "China",
    IATA: "PEK",
    avatar: zbaaImg,
    ICAO: "ZBAA",
  },
  {
    name: "Los Angeles International Airport",
    city: "Los Angeles, California",
    country: "United States",
    avatar: katlImg,
    IATA: "LAX",
    ICAO: "KLAX",
  },
  {
    avatar: katlImg,
    name: "Dubai International Airport",
    city: "Garhoud, Dubai",
    country: "UAE",
    IATA: "DXB",
    ICAO: "OMDB",
  },
  {
    avatar: katlImg,
    name: "Tokyo Haneda Airport",
    city: "Ōta, Tokyo",
    country: "Japan",
    IATA: "HND",
    ICAO: "RJTT",
  },
  {
    avatar: katlImg,
    name: "O'Hare International Airport",
    city: "Chicago, Illinois",
    country: "United States",
    IATA: "ORD",
    ICAO: "KORD",
  },
  {
    avatar: katlImg,
    name: "London Heathrow Airport",
    city: "Hillingdon, London",
    country: "UK",
    IATA: "LHR",
    ICAO: "EGLL",
  },
  {
    name: "Shanghai Pudong International Airport",
    city: "Pudong, Shanghai",
    avatar: katlImg,
    country: "China",
    IATA: "PVG",
    ICAO: "ZSPD",
  },
  {
    name: "Charles de Gaulle Airport",
    city: "Roissy-en-France, Île-de-France (Paris)",
    avatar: katlImg,
    country: "France",
    IATA: "CDG",
    ICAO: "LFPG",
  },
  {
    avatar: katlImg,
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
