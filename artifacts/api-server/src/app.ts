import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import { adminRouter } from "./routes/cms";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRouter);
app.use("/api", router);

export default app;
