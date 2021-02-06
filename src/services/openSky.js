import request from "./request";
import { openSkyApiEndPoints } from "config/config";

const {
  allFlights
} = openSkyApiEndPoints;
const getAllFlights = (begin, end) => {
  return request({
    endpoint: allFlights,
    method: "get",
    query: { begin, end },
  });
};

const OpenSkyServices = {
  getAllFlights,
};

export default OpenSkyServices;
