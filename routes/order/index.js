const router = require('express').Router()
const User = require('../../models/User')
const Order = require('../../models/Order')

router.route('/')
  .post(async (req, res) => {
    const { body } = req
    const { user, cart } = body

    if (!user || !cart) res.status(500).send('Missing data')

    try {
      const userExist = await User.findOne({ email: user.email })
      let orderUser
      if (!userExist) {
        // On créé un user (_user = variable temporaire pour éviter de renommer user que l'on récupère dans la requête)
        const _user = new User({
          email: user.email,
          password: Math.random().toString(36).slice(-8),
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        })
        orderUser = await _user.save()
      } else {
        orderUser = userExist
      }
      // La commande est reliée à l'utilisateur précédemment créé
      const order = new Order({
        user: orderUser._id,
        cart: cart,
        address: user.address
      })
      const orderSaved = await order.save()
      return res.send(orderSaved)
    } catch (error) {
      return res.status(500).send(error)
    }
  })

module.exports = router
