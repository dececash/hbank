import axios from "axios";

const instance = axios.create({
  baseURL: "",
  timeout: 3000,
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export const post = (url, params) => {
    console.log(url,">>>>>")
  return instance.post(url, params);
};


