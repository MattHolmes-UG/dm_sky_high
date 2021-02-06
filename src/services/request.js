import { BASE_API_URL } from "config/config";

const validateResponse = (response) => {
  console.log("response code", response);
  if (!response.ok) {
    // message.error(response.statusText);
    // handle error
    return response;
    // throw Error(response.statusText);
  }
  return response;
};

const requestErrorHandler = (error) => {
  console.error("Error:", error);
};

const request = async ({ endpoint, method = "get", body = {}, query = {} }) => {
  console.log("received", endpoint, method, body);
  let url = `${BASE_API_URL}${endpoint}`;
  const myHeaders = new Headers({
    "Content-Type": "application/json",
  });
  const options = {
    method,
    mode: "cors",
    credentials: "include",
    headers: myHeaders,
  };
  if (Object.keys(body).length > 0 && typeof body === "object") {
    options.body = JSON.stringify(body);
  }

  if (Object.keys(query).length > 0 && typeof query === "object") {
    console.log("adding query", query);
    Object.keys(query).forEach((key, index) => {
      console.log({ index });
      url =
        index === 0
          ? `${url}?${key}=${query[key]}`
          : `${url}&${key}=${query[key]}`;
    });
    console.log("query added. Url", url);
  }

  const result = await fetch(url, options)
    .then(validateResponse)
    .then((response) => {
      const jsonRes = response.json();
      jsonRes["statusCode"] = response.statusCode;
      jsonRes["statusText"] = response.statusText;
      return jsonRes;
    })
    .then((data) => {
      const promise = Promise.resolve(data);
      return promise;
    })
    .catch((err) => {
      requestErrorHandler(err);
      return Promise.reject(err);
    });

  return result;
};

export default request;
