const mongoose = require('mongoose')
const { Schema } = mongoose // = à mongoose.Schema

// Déclaration du Schéma
const RestaurantSchema = Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  // [{}] = Restaurant contiendra plusieurs plats
  dishes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dish'
  }]
}, { timestamps: true })

module.exports = mongoose.model('Restaurant', RestaurantSchema)
