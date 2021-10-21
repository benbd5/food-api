const router = require('express').Router()

const User = require('../../models/User')

const withAuth = require('../../middlewares/authMiddleware')
const { extractIdFromRequestAuthHeader } = require('../../helpers/tokenHelper')

router.route('/')
  .get(withAuth, (req, res) => {
    // On récupère l'id depuis le helper
    const id = extractIdFromRequestAuthHeader(req)

    // Méthode callback
    /* User.findById(id, (error, result) => {
      if (!id) return res.status(500).send('Id is missing')
      if (error) return res.status(500).send(error)
      return res.send(result)
    }) */

    // Méthode Promesse
    User.findById(id).select('-password') // pour ne pas sélectionner le password retournées par mongodb (plus simple avec les promesses)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error))
  })

module.exports = router
