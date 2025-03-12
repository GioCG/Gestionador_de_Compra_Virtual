import { Router } from 'express';
import { addCategory,listCategories,updateCategory,deleteCategory } from "../category/category.controller.js";
import {isAdmin} from "../middlewares/validar-roles.js";
import {validarJWT} from "../middlewares/validar-jwt.js";
import {deleteFileOnError} from "../middlewares/delete-file-on-error.js"

const router = Router();
 
router.post(
    '/',[
        isAdmin,
        validarJWT,
        deleteFileOnError,
    ],
    addCategory
);
 
router.get(
    '/',[
        isAdmin,
        validarJWT
    ],
    listCategories
);

router.put(
    '/:id',[
        isAdmin,
        validarJWT,
        deleteFileOnError,
    ],
    updateCategory
);
router.delete(
    '/:id',[
        isAdmin,
        validarJWT,
        deleteFileOnError,
    ],
    deleteCategory
);
 
export default router;