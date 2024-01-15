import { Router } from "express"
import { productsLimitController, productsIdController, productsAddController, productsUpdateController, productsDeleteController } from "../helpers/product.controllers.js"
export const router = Router()

router.get("/api/products", productsLimitController);
router.get("/api/products/:pid", productsIdController);

router.post("/api/products", productsAddController);

router.put("/api/products/:pid", productsUpdateController)

router.delete("/api/products/:pid", productsDeleteController)