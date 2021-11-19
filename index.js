require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const port = process.env.PORT

// Import du middleware pour logger les appels d'API
const loggerMiddleware = require('./middlewares/logger')
app.use(loggerMiddleware)

// Autoriser les requêtes depuis le front React (Access Control Allow Origin)
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const router = express.Router()

// Chaine de connexion à la base de données MongoDB
const mongoDbConnectionString =
  `mongodb+srv://userTest:${process.env.PASSWD}${process.env.HOST}/${process.env.DBNAME}?retryWrites=true&w=majority`

mongoose.connect(mongoDbConnectionString, null, error => {
  if (error) throw new Error(error)
})

// Récupération de la connexion
const db = mongoose.connection

// Listener de connexion pour valider la connexion
db.once('open', () => {
  console.info('Connexion à la base : OK')
})

app.get('/', (req, res) => {
  res.send('Hello')
})

// Utilisation du router par Express
app.use(router)

// Déclaration des routes d'API principales
app.use('/countries', require('./routes/countries'))
app.use('/restaurants', require('./routes/restaurants'))
app.use('/dishes', require('./routes/dishes'))
app.use('/auth', require('./routes/users/auth'))
app.use('/me', require('./routes/users'))
app.use('/payment', require('./routes/payment'))
app.use('/order', require('./routes/order'))

app.listen(port, () => {
  console.log(`Ok ça marche http://localhost:${port}`)
})
