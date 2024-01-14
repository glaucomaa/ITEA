import $auth_api, { BASE_URL } from "../http";
import axios, { AxiosResponse } from "axios";
export interface AuthResponse {
  accessToken: string;
}

export default class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      return $auth_api.post<AuthResponse>("/auth_api/login", {
        username: email,
        password,
      });
    } catch (err: any) {
      throw err;
    }
  }
  static async registration(
    email: string,
    password: string,
    name: string,
    lastName: string,
    phone: string
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      return axios.post<AuthResponse>(BASE_URL + "/auth_api/registration", {
        email,
        password,
        name,
        lastName,
        phone,
      });
    } catch (err: any) {
      throw err;
    }
  }
}
