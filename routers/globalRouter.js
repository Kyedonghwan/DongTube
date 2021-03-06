import express from "express";
import { getJoin, getMe, postLogin, getLogin, logout, postJoin, githubLogin, postGithubLogin } from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import routes from "../routes";
import { onlyPublic, onlyPrivate } from "../middlewares";
import passport from "passport";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.github, githubLogin);
globalRouter.get(routes.githubCallback, passport.authenticate("github", { failureRedirect: "/login" }), postGithubLogin);

globalRouter.get(routes.me, getMe);
export default globalRouter;