import axios, { AxiosRequestConfig } from "axios";

export const BASE_URL = `http://localhost:8000`;
const $auth_api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default $auth_api;
