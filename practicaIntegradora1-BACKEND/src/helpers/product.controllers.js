import { productsModel } from "../models/products.model.js"

export const productsLimitController = async (req, res) => {
    try {
        let limit = req.query.limit
        let result = await productsModel.find().limit(Number(limit))
        res.send({ result: "success", payload: result })
    }

    catch (err) {
        res.status(500).send("Server error: " + err)
    }
}

export const productsIdController = async (req, res) => {
    try {
        let pid = req.params.pid
        try {
            let result = await productsModel.findById(pid)
            res.send({ result: "success", payload: result })
        }

        catch (err) {
            res.status(404).send("Cannot get products with this id: " + err)
        }
    }
    catch (err) {
        res.status(500).send("Server error: " + err)
    }
}

export const productsAddController = async (req, res) => {
    try {
        let { title, description, price, thumbnail, code, stock, category } = req.body
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) return res.status(400).send({ status: "error", error: "Incomplete values" })

        let result = await productsModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category
        })

        res.send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const productsUpdateController = async (req, res) => {

    try {
        try {
            let pid = req.params.pid
            let productReplace = req.body
            if (!productReplace.title || !productReplace.description || !productReplace.price || !productReplace.thumbnail || !productReplace.code || !productReplace.stock || !productReplace.category) return res.status(400).send({ status: "error", error: "Incomplete values" })
            let result = await productsModel.updateOne({ _id: pid }, productReplace)
            res.send({ result: "success", payload: result })
        }

        catch (err) {
            res.status(404).send("The product with this Id cannot be updated because it does not exist: " + err)
        }
    }
    catch (err) {
        res.status(500).send("Server error: " + err)
    }

}

export const productsDeleteController = async (req, res) => {

    try {
        try {
            let pid = req.params.pid
            let result = await productsModel.deleteOne({ _id: pid })
            res.send({ result: "success", payload: result })
        }

        catch (err) {
            res.status(404).send("The product with this Id cannot be deleted because it does not exist: " + err)
        }
    }
    catch (err) {
        res.status(500).send("Server error: " + err)
    }
}