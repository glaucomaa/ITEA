import axios from "axios";
import { BASE_URL } from "../http";
import $user_api from "../http/user_api";

export default class EventService {
  static async getEvents(limit: number, page: number, search: string) {
    try {
      if (localStorage.getItem("token")) {
        const response = await $user_api.get("/events_api/get_actual", {
          params: {
            _page: page,
            _limit: limit,
            _search: search,
          },
        });
        return response;
      } else {
        const response = await axios.get(BASE_URL + "/events_api/get_actual", {
          params: {
            _page: page,
            _limit: limit,
            _search: search,
          },
        });
        return response;
      }
    } catch (err: any) {
      throw err;
    }
  }

  static async getPastEvents(limit: number, page: number, search: string) {
    try {
      if (localStorage.getItem("token")) {
        const response = await $user_api.get("/events_api/get_past", {
          params: {
            _page: page,
            _limit: limit,
            _search: search,
          },
        });
        return response;
      } else {
        const response = await axios.get(BASE_URL + "/events_api/get_past", {
          params: {
            _page: page,
            _limit: limit,
            _search: search,
          },
        });
        return response;
      }
    } catch (err: any) {
      throw err;
    }
  }
  static async getEventById(id: string | undefined) {
    try {
      const response = await axios.get(
        BASE_URL + "/events_api/get_event/" + id
      );
      return response;
    } catch (err: any) {
      throw err;
    }
  }
  static async getSavedEvents(limit: number, page: number, search: string) {
    try {
      const response = await $user_api.get("/events_api/get_saved", {
        params: {
          _page: page,
          _limit: limit,
          _search: search,
        },
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  }
  static async getRecomendedEvents(
    limit: number,
    page: number,
    search: string
  ) {
    try {
      const response = await $user_api.get("/events_api/get_recomended", {
        params: {
          _page: page,
          _limit: limit,
          _search: search,
        },
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  }
}
