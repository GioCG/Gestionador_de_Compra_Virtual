import {Router} from "express";
import {check} from "express-validator";
import { listUser,updateUser,updatePassword,deleteUser } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos} from "../middlewares/validar-campos.js";
import { isSameUser} from "../middlewares/user-validator.js";

const router = Router();
//error
router.get("/",listUser);

router.put(
    "/:id",
    [
        isSameUser,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)
//error
router.put(
    "/password/:id",
    [        
        isSameUser,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updatePassword
)
//error
router.delete(
    "/:id",
    [
        isSameUser,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)

export default router;