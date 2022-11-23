const { request, response } = require('express')

const { Product } = require('../models')

const getProducts = async (req = request, res = response) => {
  try {
    let { from = 0, lot = 5 } = req.query
    from = from <= 0 || isNaN(from) ? 0 : from - 1

    const query = { status: true }

    const [products, total] = await Promise.all([
      Product.find(query).skip(from).limit(lot),
      Product.countDocuments(query),
    ])

    const quantity = products.length
    const pagination = {
      from: Number(from + 1),
      lot: Number(lot),
    }

    res.json({
      total,
      quantity,
      pagination,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const createProduct = async (req = request, res = response) => {
  try {
    const { name, description, price } = req.body
    const product = new Product({
      name,
      description,
      price,
    })
    await product.save()

    res.status(201).json({
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

module.exports = {
  getProducts,
  createProduct,
}
