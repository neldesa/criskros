import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cmsRouter from "./cms";
import registrationsRouter from "./registrations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cmsRouter);
router.use(registrationsRouter);

export default router;
