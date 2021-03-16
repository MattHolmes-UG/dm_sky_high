import request from "./request";
import { productEndPoints } from "config/config";

const { allProducts } = productEndPoints;
const getAllProducts = () => {
  return request({
    apiUrl: allProducts,
    method: "post",
    query: {},
    body: {
      angular_test: "angular-developer",
    },
    mode: "cors",
  });
};

const productService = {
  getAllProducts
};

export default productService;
