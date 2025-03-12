import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail } from "../helpers/db-validator.js";

export const registerCustomerValidator = [
    body("name", "The name is required").not().isEmpty(),
    body("email", "The email must be valid").isEmail(),
    body("email").custom(existenteEmail),
    body("address", "The address is required").not().isEmpty(),
    body("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
    validarCampos
]
export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address"),
    body("name").optional().isString().withMessage("Enter a valid name"),
    body("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
    validarCampos
];

