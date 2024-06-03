import e, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Middleware } from "../utils/middleware";
import { UserService } from "../services/user.service";
import { TokenService } from "../services/token.service";
import { IUserDto } from "../dtos/user.dto";
import { IUser } from "../types/user.type";
import { UploadedFile } from "express-fileupload";

export class UserContoller {
  public static async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Middleware.error(res, "validation error", 422);
    }

    const user = await UserService.createUser(req.body);

    if (!user) {
      return Middleware.error(res, "some error while creating user", 400);
    }

    const token = TokenService.generateTokens(user);

    res.cookie("token", token.accessToken, {
      maxAge: 86400000,
      httpOnly: true,
    });
    res.json(user).status(200);
  }

  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await UserService.login(email, password);

    if (!user) {
      return Middleware.error(res, "user not found", 404);
    }

    const token = TokenService.generateTokens(user);

    res.cookie("token", token.accessToken, {
      maxAge: 86400000,
      httpOnly: true,
    });
    res.json(user);
  }

  public static async getProfile(req: Request, res: Response) {
    const { user } = req.body;

    const userData = await UserService.getProfile(user.email);

    if (!userData) {
      return Middleware.error(res, "some error", 400);
    }

    const data = new IUserDto(userData);

    res.json({ user: data });
  }

  public static async getUser(req: Request, res: Response) {
    const { id } = req.params;

    const user = await UserService.getUser(Number(id));

    if (!user) {
      return Middleware.error(res, "user not found", 404);
    }

    const userData = new IUserDto(user);

    res.json({ user: userData });
  }

  public static async getUsers(req: Request, res: Response) {
    const { page } = req.query;

    const data = await UserService.getUsers();

    if (!data) {
      return res.json({ users: [] });
    }

    if (page) {
      const start = (Number(page) - 1) * 10;
      const end = Number(page) * 10;
      return res.json({ users: data.slice(start, end) });
    }

    res.json({ users: data });
  }

  public static async editUser(req: Request, res: Response) {
    const { email, first_name, last_name, gender } = req.body;
    const { id } = req.params;

    const user = await UserService.getUser(Number(id));

    if (!user) {
      return Middleware.error(res, "user not found", 404);
    }

    const newUser = {
      email: email ? email : user.email,
      first_name: first_name ? first_name : user.first_name,
      last_name: last_name ? last_name : user.last_name,
      gender: gender ? gender : user.gender,
    };

    const updatedUser = await UserService.updateUser(Number(id), newUser);

    if (!updatedUser) {
      return Middleware.error(res, "some error", 400);
    }

    res.json({ status: true });
  }

  public static async updatePhoto(req: Request, res: Response) {
    const { user } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
      return Middleware.error(res, "no file to upload", 400);
    }
    const file = req.files.file as UploadedFile;

    const name = file.name.split(".");
    if (name[name.length - 1] === "jpg" || name[name.length - 1] === "png") {
      file.mv(
        `./avatar/${file.name}-${user.email}.${name[name.length - 1]}`,
        function (err) {
          if (err) {
            return Middleware.error(res, "error while upload file", 500);
          }
        }
      );

      const newAvatar = await UserService.updateAvatar(
        `${file.name}-${user.email}.${name[name.length - 1]}`,
        user.email
      );

      if (!newAvatar) {
        return Middleware.error(res, "some error", 400);
      }

      return res.json({ status: true });
    } else {
      return Middleware.error(res, "unsupported file type", 400);
    }
  }
}
