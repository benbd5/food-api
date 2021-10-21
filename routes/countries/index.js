const router = require('express').Router()
const request = require('request')

router.route('/') // Correspond à /countries
  .get((req, res) => {
    const countries = require('../../data/countries-FR.json')
    res.status(200).send(countries)
  })

router.route('/cities') // Correspond à /countries/cities
  .post((req, res) => {
    // Récupérer le pays depuis les paramètres de la requête
    const body = req.body
    const country = body.country

    if (!country) {
      return res.status(500).send('Country is missing !')
    } else {
      // Récupérer la liste des villes depuis les paramètres de la requête
      // Préparation de la requête vers countriesNow
      const options = {
        method: 'POST',
        url: `${process.env.COUNTRIES_NOW_API_URL}/countries/cities`,
        headers: {
          'Content-Type': 'application/json'
        },
        // Intégration du paramètre récupéré depuis notre requête initale
        body: JSON.stringify({
          country: country
        })
      }

      // Exécution de la requête vers l'API externe countriesnow
      request(options, function (error, response) {
        if (error) throw new Error(error)
        // Traitement des données reçues (transformation au format JSON)
        const body = JSON.parse(response.body)
        if (body && body.data && !body.error) {
          // Envoyer la liste des villes en réponse
          return res.send(body.data)
        } else {
          res.status(500).send('Erreur lors de la récupération de la liste des villes')
        }
      })
    }
  })

module.exports = router
