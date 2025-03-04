import { Router } from 'express';
import { addCategory,listCategories,updateCategory,getCategoryById,deleteCategory } from "../category/category.controller.js";
import {deleteFileOnError} from "../middlewares/delete-file-on-error.js"

const router = Router();
 
router.post(
    '/',[
        deleteFileOnError,
    ],
    addCategory
);
 
router.get(
    '/',[
        deleteFileOnError,
    ],
    listCategories
);

router.get(
    '/:id',[
        deleteFileOnError,
    ],
    getCategoryById
);

router.put(
    '/:id',[
        deleteFileOnError,
    ],
    updateCategory
);
router.delete(
    '/:id',[
        deleteFileOnError,
    ],
    deleteCategory
);
 
export default router;