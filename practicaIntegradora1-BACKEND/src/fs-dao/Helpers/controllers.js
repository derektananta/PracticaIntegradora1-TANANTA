import { readProductsFile } from '../Helpers/readProductsFile.js'
import { readCart } from '../Helpers/readCart.js'

let productData

readProductsFile()
    .then(data => {
        productData = data.products
    })
    .catch(error => {
        throw new Error('Error loading data:', error)
    })

export const productLimitController = (req, res) => {
    let limit = req.query.limit
    limit = parseInt(limit)

    if (!isNaN(limit)) {
        let filteredProducts = productData.slice(0, limit)
        limit > 0
            ? res.send({ filteredProducts })
            : res.status(404).json({ error: 'You must get at least one product.' })
    } else {
        res.send(productData)
    }
}

export const productIdController = (req, res) => {
    let pid = req.params.pid
    pid = parseInt(pid)

    let productID = productData.find(p => p.id === pid)

    productID
        ? res.send({ productID })
        : res
              .status(404)
              .json({ error: 'There is no product with the requested id or an invalid parameter was entered.' })
}

export const productAddController = (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'The request body is empty or no valid data was provided.' })
    }

    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category']

    for (const field of requiredFields) {
        if (!(field in req.body)) {
            return res.status(400).json({ error: `The field "${field}" is required in the request body.` })
        }
    }

    if (typeof req.body.price !== 'number') {
        return res.status(400).json({ error: 'The field \'price\' must be a number.' })
    }

    if (typeof req.body.stock !== 'number') {
        return res.status(400).json({ error: 'The field \'stock\' must be a number.' })
    }

    if (!('status' in req.body)) {
        req.body.status = true
    }

    const lastProductId = productData.reduce((maxId, product) => {
        return product.id > maxId ? product.id : maxId
    }, -1)

    const newProduct = req.body
    newProduct.id = lastProductId + 1
    productData.push(newProduct)
    res.status(201).json(productData)
}

export const productUpdateController = (req, res) => {
    const productUpdate = req.body
    const pid = req.params.pid
    const index = productData.findIndex(i => i.id == pid)
    'id' in productUpdate && productUpdate.id !== pid
        ? delete productUpdate.id && res.status(400).send('Cannot update product Id.')
        : null
    index > -1
        ? (productData[index] = { ...productData[index], ...productUpdate })
        : res.status(404).send('The product you are looking for does not exist.')

    res.send(productData)
}

export const productDeleteController = (req, res) => {
    const pidDelete = req.params.pid
    const index = productData.findIndex(i => i.id == pidDelete)
    index > -1
        ? productData.splice(index, 1)
        : res.send('There is no product with the requested id or an invalid parameter was entered.')
    res.send(productData)
}

let carts

readCart()
    .then(data => {
        carts = data.carts
    })
    .catch(error => {
        throw new Error('Error loading data:', error)
    })

export const cartCreateController = (req, res) => {
    const highestCartId = carts.reduce((maxId, cartItem) => {
        return cartItem.id > maxId ? cartItem.id : maxId
    }, -1)

    const newCart = {
        products: [],
        id: highestCartId + 1,
    }

    carts.push(newCart)

    res.send({
        carts: carts,
    })
}

export const cartIdListController = (req, res) => {
    let cid = req.params.cid
    cid = parseInt(cid)

    let cartId = carts.find(c => c.id === cid)

    if (cartId) {
        res.status(200).json({ cart: cartId })
    } else {
        res.status(404).json({ error: 'Cart not found.' })
    }
}

export const cartProductAddController = (req, res) => {
    let pid = req.params.pid
    let cid = req.params.cid
    pid = parseInt(pid)
    cid = parseInt(cid)

    const cart = carts.find(c => c.id === cid)

    if (!cart) {
        res.status(404).send({ error: 'Cart not found.' })
        return
    }

    const product = productData.find(p => p.id === pid)

    if (!product) {
        res.status(404).send({ error: 'Product not found.' })
        return
    }

    const existingProduct = cart.products.find(p => p.product === pid)

    if (existingProduct) {
        existingProduct.quantity += 1
    } else {
        cart.products.push({
            product: pid,
            quantity: 1,
        })
    }

    res.send({ cart })
}
