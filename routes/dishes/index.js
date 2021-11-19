/**
 * 0- Créer model document mongo { titre, description, prix, catégorie (énumération) (starter, dish, dessert, boisson)}
 * 1- Créer la route d'api
 * 2- CRUD gestion des plats
 * 3- BONUS: associer les plats à un ou des restaurants
**/

const router = require('express').Router()

const Dishes = require('../../models/Dishes')
const Restaurant = require('../../models/Restaurant')

router.route('/')
  .get((req, res) => {
    // Récupération des plats pour 1 restaurant donné
    const id = req.query.id
    if (id) {
      Dishes.find({ restaurant: id }, (error, result) => {
        if (error) return res.send(500).send('Erreur lors de la récupération des plats')
        return res.send(result)
      })
    } else {
      Dishes.find((error, result) => {
        if (error) return res.send(500).send('Erreur lors de la récupération des plats')
        return res.send(result)
      })
    }
  })
  .post((req, res) => {
    const { title, description, price, category, restaurant } = req.body
    if (!title || !price || !category) return res.status(500).send('Title is missing')
    if (!description) return res.status(500).send('Description is missing')
    if (!price) return res.status(500).send('price is missing')
    if (!category) return res.status(500).send('category is missing')
    if (!restaurant) return res.status(500).send('restaurant is missing')

    const dishes = new Dishes({
      title, description, price, category, restaurant
    })

    dishes.save((error, result) => {
      if (error) return res.status(500).send(error)

      // Lien avec le restaurant
      // On récupère le restaurant
      Restaurant.findById(restaurant, (error, resto) => {
        if (error) return res.send(500).send('Erreur lors de la récupération des plats')

        // On ajoute le plat dans le resto
        resto.dishes.push(dishes)
        resto.save((error, result) => {
          if (error) return res.send(500).send('Erreur lors de la récupération des plats')

          Dishes.find((error, result) => {
            if (error) return res.send(500).send('Erreur lors de la récupération des plats')
            return res.send(result)
          })
        })
      })
    })
  })
  .patch((req, res) => {
    const { body: { dish } } = req

    if (!dish) return res.status(500).send('Missing data')

    const { _id } = dish

    if (!_id) return res.status(500).send('Id is missing')

    Dishes.findByIdAndUpdate(_id, dish, (error, result) => {
      if (error) return res.status(500).send(error)
      Dishes.find((error, result) => {
        if (error) return res.send(500).send('Erreur lors de la récupération des plats')
        return res.send(result)
      })
    })
  })
  .delete((req, res) => {
    const { body: { id } } = req

    if (!id) return res.status(500).send('Id is missing')

    Dishes.findByIdAndDelete(id, (error, result) => {
      if (error) return res.status(500).send(error)
      Dishes.find((error, result) => {
        if (error) return res.send(500).send('Erreur lors de la récupération des plats')
        return res.send(result)
      })
    })
  })

module.exports = router
