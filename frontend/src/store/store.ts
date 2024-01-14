import { makeAutoObservable } from "mobx";
import AuthService from "../API/AuthService";
import UserService from "../API/UserService";
import IUser from "../interfaces/userInterface";

export default class Store {
  user = {} as IUser;
  isAuth = false;
  supportAlertIsOpen = false;
  supportAlertMessage = "";
  mainLoader = false;
  eventLoader = false;

  constructor() {
    makeAutoObservable(this);
  }
  setMainLoader(bool: boolean) {
    this.mainLoader = bool;
  }
  setEventLoader(bool: boolean) {
    this.eventLoader = bool;
  }
  setAuth(bool: boolean) {
    this.isAuth = bool;
  }
  supportAlertChange(bool: boolean) {
    this.supportAlertIsOpen = bool;
    if (!bool) {
      this.supportAlertMessage = "";
    }
  }
  setUser(user: IUser) {
    this.user = user;
  }
  async appendSave(id: string) {
    try {
      await UserService.patchSaved(id, true);
    } catch (err: any) {
      throw err;
    }
  }
  async delSave(id: string) {
    try {
      await UserService.patchSaved(id, false);
    } catch (err: any) {
      throw err;
    }
  }
  async appendVisit(id: string, rate: number) {
    try {
      await UserService.patchVisited(id, true);
    } catch (err: any) {
      throw err;
    }
  }
  async delVisit(id: string) {
    try {
      await UserService.patchVisited(id, false);
    } catch (err: any) {
      throw err;
    }
  }
  async changeRate(rate: number, id: string) {
    try {
      await UserService.patchRate(id, rate);
    } catch (err: any) {
      this.supportAlertMessage = err?.response?.data.detail;
      this.supportAlertChange(true);
    }
  }
  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log("ya tut");
      localStorage.setItem("token", response.data.accessToken);
      this.setAuth(true);
    } catch (err: any) {
      throw err;
    }
  }
  async registration(
    email: string,
    password: string,
    name: string,
    lastName: string,
    phone: string
  ) {
    try {
      const response = await AuthService.registration(
        email,
        password,
        name,
        lastName,
        phone
      );
      localStorage.setItem("token", response.data.accessToken);
      // this.setAuth(true);
    } catch (err: any) {
      throw err;
    }
  }
  logout() {
    localStorage.removeItem("token");
    this.setAuth(false);
    this.setUser({} as IUser);
  }
  async getUser() {
    try {
      const response = await UserService.getUser();
      this.setUser(response.data);
      this.setAuth(true);
    } catch (err: any) {
      throw err;
    }
  }
}
