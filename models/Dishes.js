const mongoose = require('mongoose')
const { Schema } = mongoose

const DishesSchema = Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['starter', 'dish', 'dessert', 'drink'],
    default: 'starter',
    required: true
  },
  // Pour lier les restaurants avec les plats
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Dishes', DishesSchema)
