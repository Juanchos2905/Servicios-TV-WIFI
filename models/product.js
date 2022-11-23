const { Schema, model } = require('mongoose')

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
  },
  description: {
    type: String,
    required: [true, 'La descripción del producto es obligatoria'],
  },
  price: {
    type: Number,
    required: [true, 'El precio del producto es obligatorio'],
  },
})

ProductSchema.methods.toJSON = function () {
  const { __v, _id, status, ...product } = this.toObject()
  product.id = _id

  return product
}

module.exports = model('Product', ProductSchema)
