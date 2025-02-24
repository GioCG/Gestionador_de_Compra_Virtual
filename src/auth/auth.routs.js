import { Router } from 'express';
import { registerAdminValidator,registerCustomerValidator, loginValidator } from "../middlewares/validator.js";
import { login,registerCustomer,registerAdmin } from "../auth/auth.controller.js";
import {deleteFileOnError} from "../middlewares/delete-file-on-error.js"

const router = Router();
 
router.post(
    '/login',[
        loginValidator,
        deleteFileOnError,
    ],
    login
);
 
router.post(
    '/register',[
        registerCustomerValidator,
        deleteFileOnError,
    ],
    registerCustomer
);

router.post(
    '/registerAdmin',[
        registerAdminValidator,
        deleteFileOnError,
    ],
    registerAdmin
);
 
export default router;