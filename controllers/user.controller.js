const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')

const getUsers = async (req = request, res = response) => {
  try {
    let { from = 0, lot = 5 } = req.query
    from = from <= 0 || isNaN(from) ? 0 : from - 1

    const query = { status: true }

    const [users, total] = await Promise.all([
      User.find(query).skip(from).limit(lot),
      User.countDocuments(query),
    ])

    const quantity = users.length
    const pagination = {
      from: Number(from + 1),
      lot: Number(lot),
    }

    res.json({
      total,
      quantity,
      pagination,
      users,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

const createUser = async (req = request, res = response) => {
  try {
    const { name, lastName, typeId, id, email, password, role } = req.body
    const user = new User({
      name,
      lastName,
      typeId,
      id,
      email,
      password,
      role,
    })

    user.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync())
    await user.save()

    res.status(201).json({
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error en el servidor',
    })
  }
}

module.exports = { getUsers, createUser }
