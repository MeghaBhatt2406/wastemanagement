// Routes/ReportRoutes.js
import { Router } from "express";
import { 
  createReport, 
  getRecentReports, 
  updateReport,
  addVerificationImage 
} from "../controllers/ReportControllers.js"; // Change this line
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getDBConnection } from "../db/dbConfig.js";

const reportRouter = Router();

reportRouter.use(async (req, res, next) => {
  await getDBConnection();
  next();
});

reportRouter.post("/create-report", verifyToken, createReport);
reportRouter.get("/get-recent-report", verifyToken, getRecentReports);
reportRouter.get("/get-reports", verifyToken, getRecentReports);
reportRouter.patch("/update-report", verifyToken, updateReport);
reportRouter.post("/verification-image", verifyToken, addVerificationImage);

export default reportRouter;