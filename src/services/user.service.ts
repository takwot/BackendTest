import { UserDataBase } from "../database/user.database";
import { IUserDto } from "../dtos/user.dto";
import { IUserReg } from "../types/user.type";

export class UserService {
  public static async createUser(user: IUserReg) {
    const newUser = await UserDataBase.createUser(user);

    return newUser;
  }

  public static async getProfile(email: string) {
    const user = await UserDataBase.getProfile(email);
    return user;
  }

  public static async login(email: string, password: string) {
    const data = await UserDataBase.login(email, password);
    return data;
  }

  public static async getUser(id: number) {
    const user = await UserDataBase.getUser(id);
    return user;
  }

  public static async getUsers() {
    const data = await UserDataBase.getUsers();
    return data;
  }

  public static async updateUser(
    id: number,
    user: {
      email: string;
      first_name: string;
      last_name: string;
      gender: number;
    }
  ) {
    return await UserDataBase.changeUser(id, user);
  }

  public static async updateAvatar(name: string, email: string) {
    return await UserDataBase.updateAvatar(name, email);
  }
}
