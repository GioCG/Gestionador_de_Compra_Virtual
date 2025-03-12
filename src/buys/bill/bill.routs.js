import express from "express";
import { listBillFromUser,editBill } from "../bill/bill.controller.js";
import {validarJWT} from "../../middlewares/validar-jwt.js";

const router = express.Router();
 
router.get("/", validarJWT,listBillFromUser);

router.put("/:id", validarJWT,editBill);
 
export default router;