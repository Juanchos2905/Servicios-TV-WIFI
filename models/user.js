const { Schema, model } = require('mongoose')

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
  },
  typeId: {
    type: String,
    required: [true, 'El tipo de identificación es obligatorio'],
    enum: ['C.C', 'T.I', 'T.E'],
  },
  id: {
    type: String,
    required: [true, 'La identificación es obligatoria'],
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  img: {
    type: String,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    required: [true, 'El rol es obligatorio'],
    default: 'CLIENT_USER',
  },
  status: {
    type: Boolean,
    default: true,
  },
})

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, google, status, ...user } = this.toObject()
  user.id = _id
  return user
}

module.exports = model('User', UserSchema)
