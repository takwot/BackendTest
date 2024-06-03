import { NextFunction, Request, Response } from "express";
import { TokenService } from "../services/token.service";

export class Middleware {
  public static checkToken(req: Request, res: Response, next: NextFunction) {
    const { token } = req.cookies;

    if (!token) {
      res.json({ status: false }).status(401);
    }

    const userData = TokenService.validateAccessToken(token);

    if (!userData) {
      res.json({ status: false }).status(401);
    }

    req.body = { ...req.body, user: userData };
    next();
  }

  public static error(res: Response, message: string, status: number) {
    res.json({ status: false, message: message }).status(status);
  }
}
