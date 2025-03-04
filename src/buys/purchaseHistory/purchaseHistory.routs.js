import express from "express";
import { listPurchaseHistory } from "../purchaseHistory/purchaseHistory.contrroller.js";
 
const router = express.Router();
 
router.get("/", listPurchaseHistory);
 
export default router;