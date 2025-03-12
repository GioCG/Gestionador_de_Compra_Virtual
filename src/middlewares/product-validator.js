import { body, param } from "express-validator";

export const addProductValidations = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("description").notEmpty().withMessage("La descripción es obligatoria"),
  body("price").isNumeric().withMessage("El precio debe ser un número"),
  body("categoryName").notEmpty().withMessage("La categoría es obligatoria"),
  body("stock").isNumeric().withMessage("El stock debe ser un número"),
  body("image").optional().isString().withMessage("La imagen debe ser una URL válida"),
];

export const editProductValidations = [
  param("id").isMongoId().withMessage("ID de producto no válido"),
  body("name").optional().notEmpty().withMessage("El nombre es obligatorio"),
  body("description").optional().notEmpty().withMessage("La descripción es obligatoria"),
  body("price").optional().isNumeric().withMessage("El precio debe ser un número"),
];

export const editProductStockValidations = [
  param("id").isMongoId().withMessage("ID de producto no válido"),
  body("stock").isNumeric().withMessage("El stock debe ser un número"),
];

export const validateSearchQuery = (req, res, next) => {
  const { name } = req.params; 

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "El parámetro 'name' es requerido y debe ser una cadena de texto" });
  }

  next();
};
