const submitButton = document.getElementById('submit-button');
const generatorForm = document.getElementById('generator-form');

let food = '';
let meal = [];
let dish = [];
let time = 'infinite'
let data = null;
let excludeIng = [];

let random = false;


submitButton.addEventListener('click', async (e) => {
  if(!generatorForm.reportValidity()) {
    e.preventDefault();
    return; 
  }
  e.preventDefault();
  const formData = new FormData(generatorForm);
  const obj = Object.fromEntries(formData);
  console.log(obj);
  food = obj.recipe;
  if (obj.mealType.length > 0) {
    meal = [obj.mealType];
  }
  if (obj.dishType.length > 0) {
    dish = [obj.dishType];
  }
  if (obj.cookingTime.length > 0) {
    time = obj.cookingTime;
  }
  if (obj.exclusions) {
    let noSpacesString = obj.exclusions.trim();
    excludeIng = noSpacesString.split(',').map(value => value.trim());
  }
  console.log('Button has been pressed');
  await getRecipes();
  displayRecipes();
});

// Add submit event listener
generatorForm.addEventListener('submit', e => {

  // Check required fields
  let requiredFilled = true;
  document.querySelectorAll('.required').forEach(el => {
    if(el.value === '') {
      requiredFilled = false;
    }
  });

  // Prevent form submit if required not filled
  if(!requiredFilled) {
    e.preventDefault();
  }

});

async function getRecipes() {
  if (food !== '') {
    try {
      
      const APP_ID = 'c5a33dfe';
      const APP_KEY = '051be5d9489024b76fdfc036bfacd0f0';
      const PATH = 'https://api.edamam.com/api/recipes/v2';
      let URL = `${PATH}?type=public&random=false&q=${food}&app_id=${APP_ID}&app_key=${APP_KEY}&random=true`;
      if (excludeIng) {
        for(let i = 0 ; i < excludeIng.length ; i++) {
          URL += `&excluded=${excludeIng[i]}`
        }
      }
      if (time !== "infinite") {
        URL += `&time=${time}`;
      }
      if (meal.length > 0 && dish.length > 0) {
        URL += `&mealType=${meal}&dishType=${dish}`;
      } else if (meal.length > 0) {
        URL += `&mealType=${meal}`;
      } else if (dish.length > 0) {
        URL += `&dishType=${dish}`;
      }

      console.log(URL);

      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
    }
  }
}

function displayRecipes() {
  if (food.length > 0 && data.hits.length > 2) {
    const cardsSection = document.getElementById('cards-section');
    const generatorSection = document.getElementById('generator-section');
    
    // Set initial styles
    cardsSection.style.transition = "height 1s cubic-bezier(0.68, -0.55, 0.27, 1.55), width 1s cubic-bezier(0.68, -0.55, 0.27, 1.55), background-color 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
    cardsSection.style.height = "550px";
    cardsSection.style.width = "100%";
    cardsSection.style.backgroundColor = "rgb(218, 207, 209)";
    cardsSection.style.display = "grid";
    cardsSection.style.placeItems = "center";
    cardsSection.style.alignContent = "start";
    cardsSection.style.rowGap = "30px"

    generatorSection.style.height = "650px";

    setTimeout(() => {
      cardsSection.style.opacity = 0;
      cardsSection.innerHTML = `
      <h1>Results for ${food.toUpperCase()}</h1>
      <div class="align-grid">
        <div class="grid-everything">
          <div class="main">
            <div class="center">
              <img src="${data.hits[0].recipe.image}" alt="" class="main-img" />
            </div>
            <div>
              <p class="bolded-text">${data.hits[0].recipe.label}</p>
            </div>
            <p class="time-p">Cooking Time: ${data.hits[0].recipe.totalTime} min</p>
            <div class="center">
            <a class="add-button" href="${data.hits[0].recipe.url}" target="_blank">The Recipe!</a>
            </div>
          </div>
          <div class="main">
            <div class="center">
              <img src="${data.hits[1].recipe.image}" alt="" class="main-img" />
            </div>
            <div>
              <p class="bolded-text">${data.hits[1].recipe.label}</p>
            </div>
            <p class="time-p">Cooking Time: ${data.hits[1].recipe.totalTime} min</p>            <div class="center">
            <a class="add-button" href="${data.hits[1].recipe.url}" target="_blank">The Recipe!</a>
            </div>
          </div>
          <div class="main">
            <div class="center">
              <img src="${data.hits[2].recipe.image}" alt="" class="main-img" />
            </div>
            <div>
              <p class="bolded-text">${data.hits[2].recipe.label}</p>
            </div>
            <p class="time-p">Cooking Time: ${data.hits[2].recipe.totalTime} min</p>
            <div class="center">
            <a class="add-button" href="${data.hits[2].recipe.url}" target="_blank">The Recipe!</a>
            </div>
          </div>
        </div>
      </div>
      `
    cardsSection.offsetHeight;
    cardsSection.style.opacity = 1;
    }, 900)

    if (cardsSection) {
      cardsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'end',     
      });
    }
    
  } else {
    const cardsSection = document.getElementById('cards-section');
    const generatorSection = document.getElementById('generator-section');

    
    // Set initial styles
    cardsSection.style.transition = "height 1s cubic-bezier(0.68, -0.55, 0.27, 1.55), width 1s cubic-bezier(0.68, -0.55, 0.27, 1.55), background-color 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
    cardsSection.style.height = "100px";
    cardsSection.style.width = "100%";
    cardsSection.style.backgroundColor = "rgb(218, 207, 209)";
    cardsSection.style.display = "flex";
    cardsSection.style.justifyContent = "center";
    cardsSection.style.alignItems = "flex-start";
    generatorSection.style.height = "610px";
    setTimeout(() => {
      cardsSection.innerHTML = `
      <h1 class="not-enough-header">Not Enough Recipes Avaliable... :(</h1>
      `;
    }, 2000);

    if (cardsSection) {
      cardsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'end',     
      });
    }
  }
}