import { cartsModel } from "../models/carts.model.js"
import { productsModel } from "../models/products.model.js"

export const cartsIdController = async (req, res) => {
    try {
        let cid = req.params.cid
        let result = await cartsModel.findById({ _id: cid })
        res.send({ result: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }

}

export const cartsCreateController = async (req, res) => {
    try {
        let result = await cartsModel.create({ products: [] })
        res.send({ result: "success", payload: result })

    }

    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const cartsAddProductController = async (req, res) => {
    try {
        try {
            let pid = req.params.pid
            let cid = req.params.cid

            let product = await productsModel.findById(pid)
            let cart = await cartsModel.findById(cid)

            const existingProductIndex = cart.products.findIndex((cartProduct) => cartProduct._id.equals(product._id));

            if (existingProductIndex === -1) {
                product.quantity = 1;
                cart.products.push(product);
            } else {
                const existingProduct = cart.products[existingProductIndex];
                await cartsModel.findOneAndUpdate(
                    { _id: cid, "products._id": existingProduct._id },
                    { $inc: { "products.$.quantity": 1 } }
                );
            }
            await cart.save();

            res.send({ result: "success", payload: cart });
        }
        catch (err) {
            res.status(404).send("Cannot add product to cart, the product or cart doesn´t exist " + err)
        }

    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const cartsList = async (req, res) => {
    try {
        let result = await cartsModel.find()
        res.send({ result: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const cartsDelete = async (req, res) => {
    try {
        let cid = req.params.cid
        let result = await cartsModel.deleteOne({ _id: cid })
        res.send({ result: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}