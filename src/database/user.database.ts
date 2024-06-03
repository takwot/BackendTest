import { IUserDto } from "../dtos/user.dto";
import { IUserReg } from "../types/user.type";
import { hashPass } from "../utils/utils";
import { client } from "./prisma";

const db = client.user;

export class UserDataBase {
  public static async createUser(user: IUserReg) {
    try {
      const newUser = await db.create({
        data: {
          email: user.email,
          password: hashPass(user.password),
          first_name: user.first_name,
          gender: 0,
          last_name: "",
        },
      });
      return newUser;
    } catch (err) {
      return null;
    }
  }

  public static async login(email: string, password: string) {
    try {
      const user = await db.findFirst({
        where: {
          email,
          password: hashPass(password),
        },
      });
      return user;
    } catch (e) {
      return null;
    }
  }

  public static async getProfile(email: string) {
    try {
      const user = await db.findFirst({
        where: {
          email: email,
        },
      });

      return user;
    } catch (err) {
      return null;
    }
  }

  public static async getUser(id: number) {
    try {
      const user = await db.findFirst({
        where: { id: id },
      });
      return user;
    } catch (er) {
      return null;
    }
  }

  public static async getUsers() {
    try {
      const data = await db.findMany();
      return data;
    } catch (er) {
      return null;
    }
  }

  public static async changeUser(
    id: number,
    user: {
      email: string;
      first_name: string;
      last_name: string;
      gender: number;
    }
  ) {
    try {
      const newUser = await db.update({ data: user, where: { id } });
      return newUser;
    } catch (er) {
      return null;
    }
  }

  public static async updateAvatar(name: string, email: string) {
    try {
      const newAvatar = await db.update({
        where: { email },
        data: { photo: name },
      });
      return newAvatar;
    } catch (err) {
      return null;
    }
  }
}
