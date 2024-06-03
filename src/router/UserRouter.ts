import { Router } from "express";
import { UserContoller } from "../controller/UserController";
import { body } from "express-validator";
import { Middleware } from "../utils/middleware";

const UserRouter = Router();

UserRouter.post(
  "/register",
  body("first_name").isString(),
  body("email").isEmail(),
  body("password").isString().isLength({ min: 5 }),
  UserContoller.register
);
UserRouter.get("/profile", Middleware.checkToken, UserContoller.getProfile);
UserRouter.post("/login", UserContoller.login);
UserRouter.get("/profile/:id", Middleware.checkToken, UserContoller.getUser);
UserRouter.get("/profiles", Middleware.checkToken, UserContoller.getUsers);
UserRouter.put("/profile/:id", Middleware.checkToken, UserContoller.editUser);
UserRouter.put(
  "/profile/:id/photo",
  Middleware.checkToken,
  UserContoller.updatePhoto
);

export default UserRouter;
