import { Router } from 'express';
import { registerCustomerValidator, loginValidator } from "../middlewares/validator.js";
import { login,registerCustomer } from "../auth/auth.controller.js";
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

export default router;