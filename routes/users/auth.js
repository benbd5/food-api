const router = require('express').Router()

const { generateToken } = require('../../helpers/tokenHelper')

const User = require('../../models/User')

router.route('/register')
  .post((req, res) => {
    const { email, password, firstName, lastName, phone } = req.body

    if (!email || !password) return res.status(500).send('Email or password is missing')

    const user = new User({
      email, password, firstName, lastName, phone
    })
    user.save((error, result) => {
      if (error) return res.status(500).send(error)

      // Pour supprimer le password, il faut passer le user en objet pour utiliser la méthode delete
      // _user pour ne pas remplacer la constante user
      const _user = result.toObject()
      delete user.password

      // Génération du token
      const payload = {
        id: _user._id
      }
      generateToken(payload, (error, token) => {
        if (error) return res.status(500).send('Error while generating token')
        return res.send({
          user,
          token
        })
      })
    })
  })

router.route('/login')
  .post((req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(500).send('Email or password is missing')

    // Récupérer l'utilisateur avec son email
    User.findOne({ email: email }, (error, user) => {
      if (error || !user) return res.status(403).send('Invalid credentials')

      // Comparer les mdp (celui en paramètre et celui stocké dans l'utilisateur récupéré) avec la méthode comparePassword qui se trouve dans le model User
      user.comparePassword(password, (error, isMatch) => {
        if (error || !isMatch) return res.status(500).send('Invalid credentials')

        // Pour supprimer le password, il faut passer le user en objet pour utiliser la méthode delete
        user = user.toObject()
        delete user.password

        // Si mdp correct, on génère un token et on l'envoit
        // Payload => données stockées à l'intérieur
        const payload = {
          // Données à stocker dans le token
          id: user._id
        }

        // Génération du token
        generateToken(payload, (error, token) => {
          if (error) return res.status(500).send('Error while generating token')
          return res.send({
            user,
            token
          })
        })
      })
    })
  })

module.exports = router
