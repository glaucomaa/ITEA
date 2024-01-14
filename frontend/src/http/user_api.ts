import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from ".";

const $user_api = axios.create({
  baseURL: BASE_URL,
});

$user_api.interceptors.request.use((config: AxiosRequestConfig<any>) => {
  config.headers = config.headers ?? {};
  config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

export default $user_api;
