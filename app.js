$(document).ready(function () {
  console.log("Hello");

  // testing git if working
  // test from Hedi 2
  // hello, this is Myhkas
  // hi,,this is bhagyashree

  var apiKeyEdamam = "3f642c68bfcff6ece5c16c3331baa7e2";
  var appIdEdamam = "3da4186d";
  var searchInput = "chicken";

  var apiKeySpoonacular = "c9fe105f079040448d102d03d9a54c78";

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

        console.log(recipePicture);


        // need to add feature to limit string length
        // need to add feature to limit the height of picture

        $("#displayRecipe").prepend(`
          <div  id="recipeCard" data-id="${ingredientsId}" class="card m-2" style="width: 18rem;">
          <img class="card-img-top" src="https://spoonacular.com/recipeImages/${recipePicture}" alt="Card image cap">
          <h5  class="card-title">${recipeName}</h5>
          <p class="card-text">Cooktime : ${cookTime} min</p>
          <p class="card-text">Servings : ${servings} pers</p>
              </div>`
        )
      }

    });
    var query = $("#userInput").val("")

  })

  // add feature to be able to click the entire card instead of h5
  $(document).on("click", "#recipeCard", function () {
    var recipeId = parseInt($(this).attr("data-id"));

    $.ajax({
      url: `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKeySpoonacular}&includeNutrition=false`,
      type: "GET",
      dataType: "json",

    }).then(function (response) {
      console.log(response);
      var ingredients = [];
      for (i = 0; i < response.extendedIngredients.length; i++) {
        ingredients.push(response.extendedIngredients[i].name);
      }
      console.log(ingredients);
      for (i = 0; i < ingredients.length; i++) {
        var target = $(this)
        $(this).append(`
          <p>${ingredients[i]}</p>`
        )

      }

    })

  })


})



  // FOR INGREDIENTS : https://api.spoonacular.com/recipes/716429/information?includeNutrition=false
  // FOR SEARCH : https://api.spoonacular.com/recipes/search?apiKey=c9fe105f079040448d102d03d9a54c78&query=burger

  //   $("#userSubmit").on("click", function (e) {
  //     e.preventDefault()
  //     $("#displayRecipe").html("")
  //     var query = $("#userInput").val()

  //     $.ajax({
  //       url: `https://api.edamam.com/search?q=${query}&app_id=${appIdEdamam}&app_key=${apiKeyEdamam}`,
  //       type: "GET",
  //       dataType: "json",

  //     }).then(function (response) {
  //       console.log(response);

  //       for (var i = 0; i < response.hits.length; i++) {
  //         var recipeName = response.hits[i].recipe.label;
  //         var recipePicture = response.hits[i].recipe.image;
  //         var cookTime = response.hits[i].recipe.totalTime;
  //         var ingredients = response.hits[i].recipe.ingredients;
  //         var calories = Math.round(response.hits[i].recipe.calories);

  //         $("#displayRecipe").prepend(`
  //     <div class="card m-2" style="width: 18rem;">
  //     <img class="card-img-top" src="${recipePicture}" alt="Card image cap">
  //     <div class="card-body">
  //         <h5 class="card-title">${recipeName}</h5>
  //         <p class="card-text">Cooktime : ${cookTime} min, with ${ingredients.length} ingredients</p>
  //         <span class="badge badge-info" data-toggle="tooltip" data-placement="bottom" title="${calories} cal">More info</span>
  //         </div>`
  //         )
  //       }

  //     })
  //     var query = $("#userInput").val("")

  //   })

  //   $(document).on("click", "button", function () {
  //     $("#displayRecipe").html("")
  //     var search = $(this).text()


  //     $.ajax({
  //       url: `https://api.edamam.com/search?q=${search}&app_id=${appIdEdamam}&app_key=${apiKeyEdamam}`,
  //       type: "GET",
  //       dataType: "json",

  //     }).then(function (response) {
  //       console.log(response);

  //       for (var i = 0; i < response.hits.length; i++) {
  //         var recipeName = response.hits[i].recipe.label;
  //         var recipePicture = response.hits[i].recipe.image;
  //         var cookTime = response.hits[i].recipe.totalTime;
  //         var ingredients = response.hits[i].recipe.ingredients;
  //         var calories = Math.round(response.hits[i].recipe.calories);

  //         $("#displayRecipe").prepend(`
  //     <div class="card m-2" style="width: 18rem;">
  //     <img class="card-img-top" src="${recipePicture}" alt="Card image cap">
  //     <div class="card-body">
  //         <h5 class="card-title">${recipeName}</h5>
  //         <p class="card-text">Cooktime : ${cookTime} min, with ${ingredients.length} ingredients</p>
  //         <span class="badge badge-info" data-toggle="tooltip" data-placement="bottom" title="${calories} cal">More info</span>
  //     </div>`
  //         )
  //       }

  //     })
  //   })


  // });

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

