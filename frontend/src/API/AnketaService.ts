import axios from "axios";
import { BASE_URL } from "../http";
import $user_api from "../http/user_api";
import anketaPriorityInterface from "../interfaces/anketaPriorityInterface";

export default class AnketaService {
  static async getAnketaEvents() {
    try {
      const response = await axios.get(BASE_URL + "/user_api/get_anketa");
      return response;
    } catch (err: any) {
      throw err;
    }
  }
  static async postAnketaPriority(anketa_priority: anketaPriorityInterface[]) {
    try {
      const response = await $user_api.post("/user_api/anketa_post", {
        anketa_priority: anketa_priority,
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  }
}
