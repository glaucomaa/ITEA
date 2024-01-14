import $user_api from "../http/user_api";
import IUser from "../interfaces/userInterface";

export default class UserService {
  static async patchRate(id: string, rate: number) {
    try {
      const response = await $user_api.post(`/user_api/patch_rate`, {
        id: id,
        rate: rate,
      });
    } catch (err: any) {
      throw err;
    }
  }
  static async patchSaved(id: string, move: boolean) {
    try {
      const response = await $user_api.post(`/user_api/patch_saved`, {
        id: id,
        append: move,
      });
    } catch (err: any) {
      throw err;
    }
  }
  static async patchVisited(id: string, move: boolean) {
    try {
      const response = await $user_api.post(`/user_api/patch_visited`, {
        id: id,
        append: move,
      });
    } catch (err: any) {
      throw err;
    }
  }
  static async getUser() {
    try {
      const response = await $user_api.get<IUser>(`/user_api/get_user`);
      return response;
    } catch (err: any) {
      throw err;
    }
  }
}
