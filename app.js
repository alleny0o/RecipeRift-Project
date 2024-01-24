// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const schedule = require('node-schedule')
const Recipes = require('./models/daily-recipes');

// Creating Express application
const app = express();

// Register view engine
app.set('view engine', 'ejs');

// MongoDB connection URI
const dbURI = 'mongodb+srv://daily-recipe-57:u7LcVB3R@daily-recipe.t9wqaxr.mongodb.net/daily-recipe?retryWrites=true&w=majority';

// Connecting to MongoDB
mongoose.connect(dbURI)
  .then((result) => {
    // Starting the server after successful database connection
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch((err) => {
    // Handling database connection errors
    console.log('Error connecting to the database:', err);
  });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// getSelected function
async function getSelected () {
  const currSelected = await Recipes.findOne({ isSelected: true });
  return currSelected;
}

// Serving static files from the 'main' directory
app.get('/', async (req, res) => {
  const currSelected = await getSelected();
  res.render('index', {currSelected});
});

// Using mongoose and mongo
const selectRandomRecipe = async () => {
  const prevSelected = await Recipes.findOne({ isSelected: true });
  if (prevSelected) {
    prevSelected.isSelected = false;
    await prevSelected.save();
  }

  const count = await Recipes.countDocuments();
  let random = Math.floor(Math.random() * count);
  while (Number(prevSelected.index) === random) {
    random = Math.floor(Math.random() * count);
  }
  const randomRecipe = await Recipes.findOne().skip(random);

  randomRecipe.isSelected = true;
  await randomRecipe.save();

};

schedule.scheduleJob('* * * * *', () => {
  selectRandomRecipe();
  console.log('new recipe on the board!');
});

// Handling 404 errors by sending a custom 404 page
app.use((req, res) => {
  res.status(404).sendFile('./404/404.html', { root: __dirname });
});
