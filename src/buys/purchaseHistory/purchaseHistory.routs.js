import express from "express";
import { listPurchaseHistory } from "../purchaseHistory/purchaseHistory.contrroller.js";
import {validarJWT} from "../../middlewares/validar-jwt.js";

const router = express.Router();
 
router.get("/",validarJWT, listPurchaseHistory);
 
export default router;