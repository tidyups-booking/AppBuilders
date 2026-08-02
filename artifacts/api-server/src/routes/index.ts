import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import aiRouter from "./ai";
import jobberRouter from "./jobber";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingsRouter);
router.use(aiRouter);
router.use(jobberRouter);

export default router;
