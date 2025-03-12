import { Router } from 'express';
import {addProduct,searchProduct,listProducts,listProductsFilteredByCategory,
    editProductStock,editProduct,mostSaledProduct,mostSaledProducts,deleteProduct}  from "../product/product.controler.js";
import {isAdmin} from "../middlewares/validar-roles.js";
import {validarJWT} from "../middlewares/validar-jwt.js";
import { addProductValidations, editProductValidations, editProductStockValidations,validateSearchQuery } from "../middlewares/product-validator.js";

const router = Router();

router.post("/", validarJWT, isAdmin, addProductValidations, addProduct);

router.get("/search/:name", validarJWT, isAdmin,validateSearchQuery, searchProduct);

router.get("/",  validarJWT, isAdmin, listProducts);

router.get("/most-saled-products", mostSaledProducts);

router.get("/most-saled",mostSaledProduct);

router.get("/category/:categoryName", validarJWT, listProductsFilteredByCategory);

router.put("/:id", validarJWT, isAdmin, editProductValidations, editProduct);

router.put("/stock/:id", validarJWT, isAdmin, editProductStockValidations, editProductStock);

router.delete("/:id", validarJWT, isAdmin, deleteProduct);

export default router;
