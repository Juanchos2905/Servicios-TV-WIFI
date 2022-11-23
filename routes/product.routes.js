const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields, validateJWT, isRole } = require('../middlewares')
const { getProducts, createProduct } = require('../controllers')

const router = Router()

router.get('/', getProducts)

router.post(
  '/',
  [
    check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('description', 'La descripción es requerida').not().isEmpty(),
    check('price', 'El precio es requerido').not().isEmpty(),
    validateFields,
  ],
  createProduct
)

module.exports = router
