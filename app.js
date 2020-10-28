import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import "./passport";

const app = express();

const CokieStore = MongoStore(session);

app.set('view engine', "pug");
//원하는 만큼 middleware를 선언 middelware 처리 후, route
app.use("/uploads", express.static("uploads"));
//upload라는 directory로 감 
app.use("/static", express.static("static"));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());//보안을 위함
app.use(morgan("dev"));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CokieStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;