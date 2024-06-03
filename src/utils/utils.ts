import jwt from "jsonwebtoken";
import { createHash } from "crypto";

const secret = "";

export function jwtSign(payload: {}) {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

export function hashPass(pass: string) {
  return createHash("sha256")
    .update(pass as string)
    .digest("hex");
}
