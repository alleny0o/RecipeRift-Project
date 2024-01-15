const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyRecipes = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  isSelected: {
    type: Boolean,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Recipes = mongoose.model('Recipes', dailyRecipes);
module.exports = Recipes;