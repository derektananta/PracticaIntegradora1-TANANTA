import { Router } from "express"
import { cartsCreateController, cartsIdController, cartsAddProductController, cartsList, cartsDelete } from "../helpers/carts.controllers.js"
export const router = Router()

router.get("/api/carts", cartsList)
router.get("/api/carts/:cid", cartsIdController)

router.post("/api/carts", cartsCreateController)
router.post("/api/carts/:cid/products/:pid", cartsAddProductController )

router.delete("/api/carts/:cid", cartsDelete)


