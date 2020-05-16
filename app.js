$(document).ready(function () {

    // GLOBAL SCOPE VARIBLES -----------------------


    var apiKeySpoonacular = "c9fe105f079040448d102d03d9a54c78";
    var favoriteRecipes = [];
    var cart = JSON.parse(window.localStorage.getItem("myCart")) || [];
    var myRecipes = JSON.parse(window.localStorage.getItem("myRecipes")) || [];
    var nbRecipesCart = (window.localStorage.getItem("sizeCart")) || 0;


    var ingredientsAPI = [];

    // INIT FUNCTIONS ------------------------------

    // Hide alert on all pages
    $("#alert").hide();
    // Hide save button on Create_recipes.html
    $("#saveLocalStorage").hide()

    //Hide Original Home Search Bar
    hideHomeSearchBar();

    // Function to load on cart.html

    if (location.href.endsWith("Cart.html")) {
        var displayCart = [] || 0;


        if (nbRecipesCart === 0) {
            $("thead").hide()
            $("#toremove").append("<h5>You have zero item in cart. Why don't you create recipes, and add some elements to the cart ?</h5>")
        } else {
            for (var i = 0; i < cart.length; i++) {
                // Print text to show the number of recipes
                displayCart[i] = cart[i].split("#");
                var indexDisplayCart = displayCart[i];

                $("#recipeAmount").text(`You have ${nbRecipesCart} recipe(s) in your cart`)

                $("#table")
                    .append(`
              <tr>
                <th data-id="${i}" scope="col">${indexDisplayCart[1]} ${indexDisplayCart[2]}</th>
                <th data-id="${i}" scope="col">${indexDisplayCart[0]}</th>
                <th data-id="${i}" scope="col">${indexDisplayCart[3]}</th>
                <th><div class="form-check">
                  <input class="form-check-input position-static" type="checkbox" id="blankCheckbox" value="option1" aria-label="...">
                </div></th>
              </tr>
              `);
            }
        }

    }

    // Function to load on My_recipes page

    if (location.href.endsWith("My_Recipes.html")) {
        for (var i = 0; i < myRecipes.length; i++) {
            $("#displayMyrecipes")
                .prepend(`<div id="recipeCard${i}" class="card m-3" style="width: 18rem;" >
  <div class="card-body">
     
      <button type="button" id="deleteButton" class="btn btn-danger btn-circle btn-sm" data-id=${i}>Delete</button>
      <button type="button" id="cartBtn" class="btn btn-warning btn-circle btn-sm" data-id=${i}>Cart</button>
    
      <h5 class="card-title">${myRecipes[i].name}</h5>
      <p class="card-text">Time to Cook : ${myRecipes[i].time} min</p>
      <p>Ingredients :</p>
      <ul id="renderIngredients"></ul>
      <p>Instructions :</p>
      <ol id="renderInstructions" class="card-text"></ol>
       </div>
</div>`);
            renderInstructions(myRecipes[i].inst);
            renderIngredients(myRecipes[i].ing);
        }
    }



    //working on edit button
    // <button type="button" class="btn btn-primary btn-circle btn-sm" data-id=${i} >Edit</button>




    // ON CLICK BUTTONS ---------------------------

    // BUTTON TO GET PDF FILE

    var doc = new jsPDF();
    var specialElementHandlers = {
        '.container': function (element, renderer) {
            return true;
        }
    };

    $('#pdf').click(function () {
        doc.fromHTML($('#table').html(), 30, 30, {
            'width': 700,
            'elementHandlers': specialElementHandlers
        });
        doc.save(`my-cart${moment()}.pdf`);
    });

    // BUTTON TO CLEAR CART CONTENT

    $("#clearCart").on("click", function () {
        cart = [];
        nbRecipesCart = 0;
        window.localStorage.setItem("sizeCart", 0);
        window.localStorage.setItem("myCart", JSON.stringify(cart));
        $("#recipeAmount").text(`You have 0 recipe(s) in your cart`)
        $("#table").html("")
    })

    // BUTTON TO DELETE RECIPE on my_recipes.html

    $(document).on("click", "#deleteButton", function () {
        var deleteId = $(this).attr("data-id");
        myRecipes.splice(deleteId, 1);
        $(`#recipeCard${deleteId}`).remove();
        window.localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
    });




    // BUTTON TO SEARCH RECIPES on index.html

    $("#userSubmit").on("click", function (e) {
        showHomeSearchBar();
        e.preventDefault();
        $("#displayRecipe").html("");
        $("header").hide();
        var query = $("#userInput").val();

        $.ajax({
            url: `https://api.spoonacular.com/recipes/search?apiKey=${apiKeySpoonacular}&query=${query}&number=9`,
            type: "GET",
            dataType: "json",
        }).then(function (response) {

            for (let i = 0; i < response.results.length; i++) {
                var recipeName = response.results[i].title;
                var recipePicture = response.results[i].image;
                var cookTime = response.results[i].readyInMinutes;
                var ingredientsId = response.results[i].id;
                var servings = response.results[i].servings;

                displayRecipe(
                    recipePicture,
                    recipeName,
                    cookTime,
                    servings,
                    ingredientsId
                );
            }
        });
        var query = $("#userInput").val("");
    });

    // BUTTON TO OPEN RECIPE INSTRUCTION IN NEW PAGE on index.html

    $(document).on("click", "#link", function () {
        var recipeId = parseInt($(this).attr("data-id"));

        $.ajax({
            url: `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKeySpoonacular}&includeNutrition=false`,
            type: "GET",
            dataType: "json",
        }).then(function (response) {
            var recipeUrl = response.sourceUrl;
            window.open(recipeUrl);
        });
    });

    // BUTTON TO SHOW INGREDIENTS on index.html

    $(document).on("click", "#info-btn", function () {
        var recipeId = parseInt($(this).attr("data-id"));

        $.ajax({
            url: `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKeySpoonacular}&includeNutrition=false`,
            type: "GET",
            dataType: "json",
        }).then(function (response) {
            var ingredients = [];
            var amount = [];
            var unit = [];
            var list = [];

            for (i = 0; i < response.extendedIngredients.length; i++) {
                ingredients.push(response.extendedIngredients[i].name);
                amount.push(response.extendedIngredients[i].amount);
                unit.push(response.extendedIngredients[i].unit);
                list.push(ingredients[i] + " " + amount[i] + "(" + unit[i] + ")");
            }

            $(`.hidden-text${recipeId}`).html("");
            for (i = 0; i < ingredients.length; i++) {
                $(`.hidden-text${recipeId}`).append(
                    `<li>${amount[i]} ${ingredients[i]} (${unit[i]})</li>`
                );
            }
        });
    });

    //CART BUTTON FROM API CALL on index.html

    $(document).on("click", "#cartButton", function () {
        var recipeId = parseInt($(this).attr("data-id"));
        var recipeName = $(this).attr("data-name");
        $.ajax({
            url: `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKeySpoonacular}&includeNutrition=false`,
            type: "GET",
            dataType: "json",
        }).then(function (response) {
            var ingredients = [];
            var amount = [];
            var unit = [];

            for (i = 0; i < response.extendedIngredients.length; i++) {
                ingredients.push(response.extendedIngredients[i].name);
                amount.push(response.extendedIngredients[i].amount);
                unit.push(response.extendedIngredients[i].unit);
                cart.push(
                    ingredients[i] +
                    "#" +
                    amount[i] +
                    "#" +
                    "(" +
                    unit[i] +
                    ")" +
                    "#" +
                    recipeName
                );
            }
            cart.sort();
            window.localStorage.setItem("myCart", JSON.stringify(cart));
            nbRecipesCart++;
            window.localStorage.setItem("sizeCart", nbRecipesCart);
            showAlert("Added to Cart!", "success");
        });
    });

    // CART BUTTON FOR MY RECIPES on my_recipes.html

    $(document).on("click", "#cartBtn", function () {
        var recipeId = parseInt($(this).attr("data-id"));
        var ingredientsList = myRecipes[recipeId].ing;
        var tempIng = [];
        for (let i = 0; i < ingredientsList.length; i++) {
            var tempIng = ingredientsList[i] + "#" + myRecipes[recipeId].name;
            cart.push(tempIng);
        }
        cart.sort();
        window.localStorage.setItem("myCart", JSON.stringify(cart));
        //need to fix
        nbRecipesCart++;
        window.localStorage.setItem("sizeCart", nbRecipesCart);
        showAlert("Added to Cart!", "success");
    });

    // PRE-FILTERED BUTTONS on index.html

    $(document).on("click", ".filter", function () {
        showHomeSearchBar();
        $("#displayRecipe").html("");
        var query = $(this).text();
        $("header").hide();
        $.ajax({
            url: `https://api.spoonacular.com/recipes/search?apiKey=${apiKeySpoonacular}&query=${query}&number=9`,
            type: "GET",
            dataType: "json",
        }).then(function (response) {

            for (let i = 0; i < response.results.length; i++) {
                var recipeName = response.results[i].title;
                var recipePicture = response.results[i].image;
                var cookTime = response.results[i].readyInMinutes;
                var ingredientsId = response.results[i].id;
                var servings = response.results[i].servings;

                displayRecipe(
                    recipePicture,
                    recipeName,
                    cookTime,
                    servings,
                    ingredientsId
                );
            }
        });
    });

    // CHECKBOX TO STRIKE ITEMS on cart.html

    $(".form-check-input").click(function () {
        var textLine = $(this).parent().parent().parent()
        if ($(this).prop("checked") == true) {

            textLine.attr("class", "strike");
        }
        else if ($(this).prop("checked") == false) {
            textLine.attr("class", "normal");
        }
    });
});

// FUNCTIONS ---------------------------------

// Function to display the recipe on the screen 

function displayRecipe(pic, name, time, servings, id) {
    $("#displayRecipe").prepend(`
          <div  id="recipeCard" class="card m-3" style="width: 18rem;">
            <img class="card-img-top" src="https://spoonacular.com/recipeImages/${pic}" alt="Card image cap" style="height:250px">
            <div class="card-body" style=>
              <h5  id= "recName" class="card-title">${name}</h5>
              <p class="card-text">Cooktime : ${time} min</p>
              <p class="card-text">Servings : ${servings} pers</p>
              <button id="info-btn" type="button" class="btn btn-secondary btn-circle btn-sm" data-id="${id}" data-toggle="collapse" data-target="#ingredients${id}" aria-expanded="false" aria-controls="ingredients${id}">Info</button>
           
              <button id="cartButton" type="button" class="btn btn-warning btn-circle btn-sm" data-id = "${id}" data-name="${name}">Cart</button>
              <button id="link" type="button" class="btn btn-info btn-circle btn-sm" data-id="${id}" href="">Link</button>            
              </div>
            <div class="collapse" id="ingredients${id}">
              <div class="card card-body">
                <ul class=hidden-text${id}></ul>
              </div>
            </div>
            
          </div>`);
}

//working on favorite button
/* <button id="fav-btn" type="button" class="btn btn-danger btn-circle btn-sm" data-id="${name}">Fav</button> */

// Function to add to favorite list (need to be improved by using for loop (instead of includes), to be able to remove from favorite list by using splice)
function addFavorite(name) {
    if (favoriteRecipes.includes(name)) {
    } else {
        favoriteRecipes.push(name);
    }
}

function renderInstructions(arr) {
    for (let i = 0; i < arr.length; i++) {
        $("#renderInstructions").append(`<li>${arr[i]}</li>`);
    }
}

function renderIngredients(arr) {
    for (let i = 0; i < arr.length; i++) {
        $("#renderIngredients").append(`<li>${arr[i]}</li>`);
    }
}

//Global Vars
var arrIngredients = [];
var arrInstructions = [];
var displayIngredients = [];

$("#addIngredients").on("click", function (e) {
    e.preventDefault();
    var ammountInput = $("#ammountInput").val();
    var unitInput = $("#unitInput").val();
    var ingredientsInput = $("#ingredientsInput").val();
    displayIngredients.push(
        ammountInput + " " + unitInput + " " + ingredientsInput
    );
    arrIngredients.push(
        //Removed "#" and replaced with " "; make sure there is no conflict
        ingredientsInput + " " + ammountInput + " " + "(" + unitInput + ")"
    );
    $("#ingredientsInput").val("");
    $("#ammountInput").val("");
    $("#unitInput").val("");
    showAlert("Ingredient Added", "success");
});

$("#addInstructions").on("click", function (e) {
    e.preventDefault();
    var instructionsInput = $("#instructionsInput").val();
    arrInstructions.push(instructionsInput);
    $("#instructionsInput").val("");
    showAlert("Instruction Added", "success");
});

function generateRecipe(name, time, ingredients, instructions) {
    $(
        "#Preview"
    ).prepend(`<div id="recipeCard" class="card m-2" style="width: 18rem;" >
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">Time to Cook : ${time} min</p>
                <p>Ingredients :</p>
                <ul id="renderIngredients"></ul>
                <p>Instructions :</p>
                <ol id="renderInstructions" class="card-text"></ol>
            </div>
        </div>`);
    renderInstructions(instructions);
    renderIngredients(ingredients);
}

//Add Notification to tell user added ingredients, instructions etc.
var myRec = {};
$("#previewButton").on("click", function () {
    var recipeName = $("#recipeNameInput").val();
    var cookTime = $("#cookTimeInput").val();
    generateRecipe(recipeName, cookTime, displayIngredients, arrInstructions);

    myRec.name = recipeName;
    myRec.time = cookTime;
    myRec.ing = arrIngredients;
    myRec.inst = arrInstructions;

    $("#recipeNameInput").val("");
    $("#cookTimeInput").val("");
    $("#formToCreateRecipe").hide()
    $("#saveLocalStorage").show()
});


// REUSABLE FUNCTION TO SHOW A NOTIFICATION ON ACTION

function showAlert(str, type) {
    $("#alert").show();
    $("#alert").attr("class", `alert alert-${type}`);
    $("#alert").text(str);
    window.setTimeout(function () {
        $("#alert").hide();
    }, 2000);
}

//NEWLY ADDED CODE FROM NAPO!!! 
function hideHomeSearchBar() {
    $("#homeSearchBar").hide();
}

function showHomeSearchBar() {
    $("#homeSearchBar").show();
}

$("#homePageLink").on("click", function () {
    hideHomeSearchBar();
})
//ENDED NEW CODE FROM NAPO!!!

//Add more data to our recipe Cards? Food Type? Etc...

// BUTTON SAVE MY RECIPE on create_recipes.html
var myRecipes = JSON.parse(window.localStorage.getItem("myRecipes")) || [];
$("#saveLocalStorage").on("click", function () {
    myRecipes.push(myRec);
    window.localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
    myRec = {};
    arrIngredients = [];
    arrInstructions = [];
    showAlert("Recipe saved", "success");
    $("#Preview").html("");
    $("#formToCreateRecipe").show()
    $("#saveLocalStorage").hide()
});



  // FOR INGREDIENTS : https://api.spoonacular.com/recipes/716429/information?includeNutrition=false
  // FOR SEARCH : https://api.spoonacular.com/recipes/search?apiKey=c9fe105f079040448d102d03d9a54c78&query=burger


    // BUTTON TO ADD TO FAVORITE LIST on index.html
    //working on it

    // $(document).on("click", "#fav-btn", function () {
    //     var recipeName = $(this).attr("data-id");
    //     console.log(recipeName);

    //     addFavorite(recipeName);
    //     console.log(favoriteRecipes);
    //     $(this).attr("class", "btn btn-success btn-circle btn-sm");
    // });
