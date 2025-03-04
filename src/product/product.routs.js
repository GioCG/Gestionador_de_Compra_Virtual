import { Router } from 'express';
import {addProduct,searchProduct,listProducts,listProductsFilteredByCategory,
        productStock,mostSaledProduct,mostSaledProductFromName,mostSaledProducts}  from "../product/product.controler.js";

const router = Router();

router.post(
    "/",[
    ],
    addProduct
);
router.get(
    "/search",[

    ],
     searchProduct
);
router.get(
    "/",[

    ],
     listProducts
);
router.get(
    "/category/:categoryId",[

    ],
     listProductsFilteredByCategory
);
router.get(
    "/stock/:productId",[

    ],
     productStock
);
router.get(
    "/most-saled",[
    ],
     mostSaledProduct
);
router.get(
    "/most-saled-products",[
    ],
     mostSaledProducts
);
router.get(
    "/most-saled-from-name",[
    ],
    mostSaledProductFromName
);

export default router;