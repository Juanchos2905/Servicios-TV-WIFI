const { request, response } = require('express')

const { isObjectId } = require('../helpers/validate-object-id')
const { Service, User, Product } = require('../models')

const getServices = async (req = request, res = response) => {
  try {
    const services = await Service.find({ status: true })
      .populate('user')
      .populate('products')

    res.status(200).json({
      total: services.length,
      services,
    })
  } catch (error) {
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const createService = async (req = request, res = response) => {
  try {
    const data = {
      user: [],
      products: [],
      totalPrice: 0,
    }
    const { user: userId, products: productsIds } = req.body

    if (!isObjectId(userId)) {
      return res.status(400).json({
        msg: 'Debe ser un id Mongo',
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({
        msg: `No existe un usuario con id ${userId} en la BD`,
      })
    }
    data.user = user._id

    const invalidIds = productsIds.filter((productId) => {
      if (!isObjectId(productId)) {
        return productId
      }
    })

    if (invalidIds.length > 0) {
      return res.status(400).json({
        msg: 'Debe ser id de mongo válidos',
        invalidIds,
      })
    }

    const productsDB = await Product.find({ _id: { $in: productsIds } })
    const productsIdsDB = productsDB.map((productDB) => productDB._id.valueOf())
    const productsIdsNotFound = productsIds.filter((productId) => {
      if (!productsIdsDB.includes(productId)) {
        return productId
      }
    })

    if (productsIdsNotFound.length > 0) {
      return res.status(400).json({
        msg: 'Los siguiente productos no existen en la BD',
        productsIdsNotFound,
      })
    }

    if (productsDB.length === 0) {
      return res.status(400).json({
        msg: 'Debe haber como mínimo un producto para realizar la factura',
      })
    }

    data.totalPrice =
      productsDB.length === 1
        ? productsDB[0].price
        : productsDB.reduce((a, b) => a.price + b.price)

    data.products = productsDB

    const service = new Service(data)
    service.save()

    res.status(200).json({
      service,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

module.exports = {
  getServices,
  createService,
}
