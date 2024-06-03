import { Router } from "express";
import UserRouter from "./UserRouter";

const MainRouter = Router();

MainRouter.use("/user", UserRouter);

export default MainRouter;
