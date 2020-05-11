$(document).ready(function () {
  // GLOBAL SCOPE VARIBLES 

  var apiKeySpoonacular = "c9fe105f079040448d102d03d9a54c78";
  var favoriteRecipes = [];
  var cart = [];


  // ON CLICK BUTTONS 

  $("#userSubmit").on("click", function (e) {
    e.preventDefault()
    $("#displayRecipe").html("")
    var query = $("#userInput").val()

    $.ajax({
      url: `https://api.spoonacular.com/recipes/search?apiKey=${apiKeySpoonacular}&query=${query}`,
      type: "GET",
      dataType: "json",

    }).then(function (response) {
      console.log(response);

      for (let i = 0; i < response.results.length; i++) {
        var recipeName = response.results[i].title;
        var recipePicture = response.results[i].image;
        var cookTime = response.results[i].readyInMinutes;
        var ingredientsId = response.results[i].id;
        var servings = response.results[i].servings;


        // need to add feature to limit string length
        // need to add feature to limit the height of picture --> Done

        displayRecipe(recipePicture, recipeName, cookTime, servings, ingredientsId)
      }

    });
    var query = $("#userInput").val("")
  })

  // BUTTON TO OPEN RECIPE INSTRUCTION IN NEW PAGE

  $(document).on("click", "#link", function () {
    var recipeId = parseInt($(this).attr("data-id"));

    $.ajax({
      url: `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKeySpoonacular}&includeNutrition=false`,
      type: "GET",
      dataType: "json",

    }).then(function (response) {
      var recipeUrl = response.sourceUrl
      window.open(recipeUrl);

    })
  })

  // BUTTON TO SHOW INGREDIENTS

  $(document).on("click", "#info-btn", function () {
    var recipeId = parseInt($(this).attr("data-id"));

    $.ajax({
      url: `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKeySpoonacular}&includeNutrition=false`,
      type: "GET",
      dataType: "json",

    }).then(function (response) {
      console.log(response);
      var ingredients = [];
      var amount = [];
      var unit = [];
      var list = [];


      for (i = 0; i < response.extendedIngredients.length; i++) {
        ingredients.push(response.extendedIngredients[i].name);
        amount.push(response.extendedIngredients[i].amount);
        unit.push(response.extendedIngredients[i].unit);
        list.push(amount[i] + " " + ingredients[i] + "(" + unit[i] + ")")
      }
      console.log(list);

      $(`.hidden-text${recipeId}`).html("")
      for (i = 0; i < ingredients.length; i++) {

        $(`.hidden-text${recipeId}`).append(`<li>${amount[i]} ${ingredients[i]} (${unit[i]}</li>`)

      }
    })
  })

  // FILTER BUTTONS

  $(document).on("click", ".filter", function () {
    $("#displayRecipe").html("")
    var query = $(this).text()
    $.ajax({
      url: `https://api.spoonacular.com/recipes/search?apiKey=${apiKeySpoonacular}&query=${query}`,
      type: "GET",
      dataType: "json",

    }).then(function (response) {
      console.log(response);

      for (let i = 0; i < response.results.length; i++) {
        var recipeName = response.results[i].title;
        var recipePicture = response.results[i].image;
        var cookTime = response.results[i].readyInMinutes;
        var ingredientsId = response.results[i].id;
        var servings = response.results[i].servings;


        // need to add feature to limit string length
        // need to add feature to limit the height of picture --> Done

        displayRecipe(recipePicture, recipeName, cookTime, servings, ingredientsId)
      }

    });

  })

  // BUTTON TO ADD TO FAVORITE LIST

  $(document).on("click", "#fav-btn", function () {
    var recipeName = ($(this).attr("data-id"));
    console.log(recipeName);

    addFavorite(recipeName)
    console.log(favoriteRecipes);
    $(this).attr("class", "btn btn-success btn-circle btn-sm")

  })

  // Function to display the recipe on the screen

  function displayRecipe(pic, name, time, servings, id) {
    $("#displayRecipe").prepend(`
          <div  id="recipeCard" class="card m-2" style="width: 18rem;">
            <img class="card-img-top" src="https://spoonacular.com/recipeImages/${pic}" alt="Card image cap" style="height:250px">
            <div class="card-body">
              <h5  class="card-title">${name}</h5>
              <p class="card-text">Cooktime : ${time} min</p>
              <p class="card-text">Servings : ${servings} pers</p>
              <button id="info-btn" type="button" class="btn btn-danger btn-circle btn-sm" data-id="${id}" data-toggle="collapse" data-target="#ingredients${id}" aria-expanded="false" aria-controls="ingredients${id}">Info</button>
              <button id="fav-btn" type="button" class="btn btn-danger btn-circle btn-sm" data-id="${name}">Fav</button>
              <button type="button" class="btn btn-danger btn-circle btn-sm" data-id="${id}">Cart</button>
              <button id="link" type="button" class="btn btn-danger btn-circle btn-sm" data-id="${id}" href="">Link</button>            
              </div>
            <div class="collapse" id="ingredients${id}">
              <div class="card card-body">
                <ul class=hidden-text${id}></ul>
              </div>
            </div>
            
          </div>`
    )
  }

  // Function to add to favorite list (need to be improved by using for loop (instead of includes), to be able to remove from favorite list by using splice)
  function addFavorite(name) {
    if (favoriteRecipes.includes(name)) {
      console.log("already fav");

    } else {
      favoriteRecipes.push(name);
    }
  }


})



  // FOR INGREDIENTS : https://api.spoonacular.com/recipes/716429/information?includeNutrition=false
  // FOR SEARCH : https://api.spoonacular.com/recipes/search?apiKey=c9fe105f079040448d102d03d9a54c78&query=burger


  // PSEUDO CODE

  // GLOBAL SCOPE VARIABLES
  // myRecipes : array of objects (recipe)
  // recipe : object (name, method, ingredients, cooking time, portions ...)
  // cart : array
  // favoriteRecipes : array (IDs of recipes)


  // CLICK BUTTONS
  // HOME : Search Button to get start the API request
  // HOME : View Recipe Button to see the details of a recipe
  // HOME : filter recipes by categories
  // MY_RECIPES : Add button to pre-validate information and see it on the preview
  // MY_RECIPES : Submit button to push the recipe in local storage

  // APIs TESTING
  // test a few APIs to understand how are structured the items


  // FUNCTIONS
  // HOME - INIT : Render suggested recipes on page load, using API results
  // HOME - INIT : Render caroussel with my recipes on page load + Handle case with zero recipes, using myRecipes array
  // MY_RECIPES - INIT : Render my recipes on page load + Handle case with zero recipes, using myRecipes array
  // CREATE_RECIPES : preview function (careful for mobile display)
  // CART - INIT : load items from myRecipes.recipe.ingredients

  // ALL : Show alert (success, danger, primary)

