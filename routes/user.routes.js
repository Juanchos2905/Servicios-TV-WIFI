const { Router } = require('express')
const { check } = require('express-validator')

const { validateFields } = require('../middlewares')
const { isValidRole, emailExists } = require('../helpers')
const { getUsers, createUser } = require('../controllers')

const router = Router()

router.get('/', getUsers)

router.post(
  '/',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').not().isEmpty(),
    check('typeId', 'El tipo de identificación es obligatorio').not().isEmpty(),
    check('id', 'La identificación es obligatoria').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom(emailExists),
    check('password', 'El passsword es obligatorio').not().isEmpty(),
    check('password', 'El passsword debe ser de 6 letras o más').isLength({
      min: 6,
    }),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    check('role').custom(isValidRole),
    validateFields,
  ],
  createUser
)

module.exports = router
