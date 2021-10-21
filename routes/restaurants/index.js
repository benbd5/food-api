const router = require('express').Router()

const Restaurant = require('../../models/Restaurant')

router.route('/') // Correspond à /restaurants
  // GET
  .get((req, res) => {
    // Récupérer la liste des restaurants depuis MongoDB
    Restaurant.find((error, result) => {
      if (error) {
        return res.status(500).send('Erreur lors de la récupération des restaurants')
      } else {
        return res.send(result)
      }
    })
  })
  // POST
  .post((req, res) => {
    // Extraction des paramètres du corps de la requête
    const { body } = req
    const { name, description, dishes } = body

    if (!name) return res.status(500).send('Name is missing')
    if (!description) return res.status(500).send('Description is missing')
    if (!dishes) return res.status(500).send('dishes is missing')

    const restaurant = new Restaurant({
      name: name,
      description: description,
      dishes
    })

    restaurant.save((error, result) => {
      if (error) return res.status(500).send(error)
      Restaurant.find((error, result) => {
        if (error) {
          return res.status(500).send('Erreur lors de la récupération des restaurants')
        } else {
          return res.send(result)
        }
      })
    })
  })
  .delete((req, res) => {
    const { body } = req
    const { id } = body

    if (!id) return res.status(500).send('Id is missing')

    Restaurant.findByIdAndDelete(id, (error, result) => {
      if (error) return res.status(500).send(error)
      Restaurant.find((error, result) => {
        if (error) {
          return res.status(500).send('Erreur lors de la récupération des restaurants')
        } else {
          return res.send(result)
        }
      })
    })
  })
  .patch((req, res) => {
    // Double extraction, récupération de l'objet entier afin d'avoir toutes ses propriétés
    const { body: { restaurant } } = req

    if (!restaurant) return res.status(500).send('Restaurant Object is missing')

    const id = restaurant._id

    if (!id) return res.status(500).send('Id is missing')

    Restaurant.findByIdAndUpdate(id, restaurant, (error, result) => {
      if (error) return res.status(500).send(error)
      else {
        Restaurant.find((error, result) => {
          if (error) {
            return res.status(500).send(error)
          } else {
            return res.send(result)
          }
        })
      }
    })
  })

module.exports = router
