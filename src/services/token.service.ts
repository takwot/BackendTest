import jwt from "jsonwebtoken";
import { IUserDto } from "../dtos/user.dto";

const ACCESS_SECRET_KEY: string = process.env.SECRET || "secret";

export class TokenService {
  public static generateTokens(payload: IUserDto) {
    const accessToken = jwt.sign({ email: payload.email }, ACCESS_SECRET_KEY, {
      expiresIn: "1d",
    });

    return {
      accessToken,
    };
  }
  public static validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, ACCESS_SECRET_KEY);
      return userData;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
