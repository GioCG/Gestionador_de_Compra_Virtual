import express from "express";
import {validarJWT} from "../../middlewares/validar-jwt.js"
import { addProductToCart,confirmPurchase } from "../shoppingCart/shoppingCart.controller.js";
 
const router = express.Router();
 
router.post("/product",  addProductToCart);

router.post("/", validarJWT,  confirmPurchase);
 
export default router;