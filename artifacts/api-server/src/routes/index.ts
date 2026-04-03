import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cmsRouter from "./cms";
import registrationsRouter from "./registrations";
import portalRouter from "./portal";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cmsRouter);
router.use(registrationsRouter);
router.use("/portal", portalRouter);

export default router;
