"use strict";


function mod(n, m) {
    return ((n % m) + m) % m;
}


class Restaurant {
    name
    foodItems
    rating

    constructor(name) { // accepts name of Restaurant and array of food items.
        this.name = name;
        this.foodItems = [];
        this.rating = parseInt(100*(1 +Math.random()*4))/100
    }
    addFood(name){
        this.foodItems.push(name);
    }
}



class FoodItem{
    name
    ingredients
    category
    description
    price
    constructor(name){  //accepts name of FoodItem and its possible ingredients
        this.name=name;
        this.ingredients = [];
    }
    addIngredient(name){
        this.ingredients.push(name);
    }
    set description(value){
        if (value.includes("\r")){
            value = value.substring(0, value.indexOf("\r"));
        }
        this.description = value;
    }
}


class Recipe {
    choices;
    foodItem;
    constructor(foodItem, choices){
        this.foodItem = foodItem;
        this.choices = choices;
    }
    get orderString(){
        let results = this.foodItem.name;
        let toppings = "";
        for(let i = 0; i<this.foodItem.ingredients.length; i++){
            if(this.choices[i])
                toppings += ", " + this.foodItem.ingredients[i].name;
        }
        if(toppings.length >= 1)
            results += toppings;
        results += ".";
        return results;
    }
    get name(){
        return this.foodItem.name;
    }
    get price(){
        return this.foodItem.price;
    }
}

class Ingredient{
    name;
    constructor(name){
        this.name = name;
    }
}


//Users on this site essentially exist to have reviews and have a name.
class User{
    name;
    constructor(name){
        this.name = name;
    }
}


class Friend extends User{
    distance;
    constructor(name, distance){
        super(name);
        this.distance=distance;
    }
}


//A review for a restaurant.
class RestaurantReview{
    user
    rating
    restaurant
    constructor(user, rating, restaurant){
        this.user=user;
        this.rating=rating;
        this.restaurant=restaurant;
    }
}

//Review for a specific FoodItem at a specific Restaurant.
class FoodReview extends RestaurantReview{
    recipe  //binary array.
    constructor(user, rating, restaurant, foodItem, choices){
        super(user, rating, restaurant);
        this.recipe = new Recipe(foodItem, choices)
    }
}


//Data Creation
//This is used to see if a name is found in an array. Used for searching EXACT names.
//This returns the position of an Object in an array, whose name attribute matches the name, EXACTLY.
function FindPosInArray(array, name){
    let pos = -1;
    for(let i = 0; i<array.length && pos === -1; i++){
        if(array[i].name === name)
            pos = i;
    }
    return pos;
}


function loadFile(file){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}


//Data Creation
//Accepts restaurants.txt and creates an array containing restaurant items and food items.
function createRestaurants(){
    let contents = getRestaurantText();
    let lines = contents.split('\n')
    let restaurants = [];
    let foods = [];
    for(let line = 0; line< lines.length; line++){
        if(lines[line].length > 1 && lines[line][0] !== ' ' && lines[line][0] !== '#') {
            let restaurant = new Restaurant(lines[line].substring(0, lines[line].indexOf("(")));
            let foodString = lines[line].substring(lines[line].indexOf("(") +1, lines[line].indexOf(")")).split(", ")
            for(let j = 0; j<foodString.length; j++){
                if(foodString[j].length > 1) {
                    let foodItem = new FoodItem(foodString[j]);
                    if (FindPosInArray(foods, foodItem.name) === -1)
                        foods.push(foodItem)
                    restaurant.addFood(foodItem);
                }
            }
            restaurants.push(restaurant);
        }
    }
    let test = {};
    return [restaurants, foods];
}

//Data Creation
//Adds additional foods to the restaurant, ones for burgers and pizzas. Made out of laziness. Accepts restaurants array and foods array.
//Consider just adding the food items to the restaurant so that this can be removed.
function createAdditionalFood(restaurants, foods){
    for(let i = 0; i<restaurants.length; i++){
        let items = []
        if(restaurants[i].name.includes("Burger"))
            items = ["Cheeseburger", "French Fries", "Hot Dog", "Jumbo Dog"];
        if(restaurants[i].name.includes("Pizza"))
            items = ["Olive Lovers Pizza", "Margarita Pizza", "Meat Lovers"];
        for(let j=0; j<items.length; j++){
            let a = new FoodItem(items[j]);
            if(FindPosInArray(foods, a) === -1){
                foods.push(a);
            }
            a = foods[FindPosInArray(foods, items[j])];
            restaurants[i].addFood(a);
        }
    }
}

//Data Creation
//adds food information from food.txt. Accepts foods array and ingredients array.
function foodFacts(foods, ingredients){
    let contents = getFoodText();
    let lines = contents.split('\n')
    for(let line = 0; line< lines.length; line++){
        if(lines[line].length > 1 && lines[line][0] !== ' ' && lines[line][0] !== '#') {
            let foodItem = lines[line].split(":");
            let food = new FoodItem(foodItem[0])
            if(FindPosInArray(foods, food.name) === -1) {
                foods.push(food);
            }
            food = foods[FindPosInArray(foods, food.name)];
            food.category = foodItem[2];
            food.price = foodItem[1];
            food.description=foodItem[3];
            let ingredientList = foodItem[4].split(", ")
            for(let j = 0; j<ingredientList.length; j++){
                let a = new Ingredient(ingredientList[j]);
                if(FindPosInArray(ingredients, a.name) === -1)
                    ingredients.push(a);
                food.addIngredient(a);
            }
        }
    }
    return [foods, ingredients];
}

//Debugging
//prints everything, accepts array of restaurants.
function printData(restaurants){
    for(let i = 0; i<restaurants.length; i++){
        console.log(i + " " + restaurants[i].name + ": ")
        let items = restaurants[i].foodItems;
        for(let j = 0; j<items.length && items.length !== 0; j++){
            console.log("     $" + items[j].price + ", " + items[j].name + ", " + items[j].category + ", \"" + items[j].description + "\"");
            let ingredients = items[j].ingredients;
            for(let q = 0; q<ingredients.length; q++){
                console.log("            " + ingredients[q].name + ",");
            }
        }
    }
}

//Data Creation
//Creates the data, Returns an array. a[0]=Restaurants. a[1]=Foods. a[2]=Ingredients.
function createData(){
    let returnVal = createRestaurants();
    let restaurants = returnVal[0];
    let foods = returnVal[1];
    let ingredients = [];
    createAdditionalFood(restaurants, foods);
    foodFacts(foods, ingredients);
    //All information is now stored in restaurants, foods and ingredients.
    return [restaurants, foods, ingredients];
}

//Data creation.
//We create 1 profile for each of us, friends on the person using it.
//Returns array of Friends.
function createFriends(){
    let result = []
    result.push(new Friend("Aniket S", 2));
    result.push(new Friend("Grafar P", 3));
    result.push(new Friend("Matty P", 4));
    result.push(new Friend("Ryan Campbell", 5));
    result.push(new Friend("ChrisVat", 5));
    return result;
}


//DataCreation.
//Creates a set of 30 random users.
function createRandomUsers(){
    let firstNames = ["Jim", "Talkie", "Dave", "Esmeralda", "Wayne", "Garth", "Cassandra", "Tucker", "Dale", "Sarah", "Stacy", "Alexandra"];
    let lastNames = ["Young", "Toaster", "Lizewski", "Murray", "Brown", "G", "Casablancas", "Garfunkel", "Hungry", "Neutron", "Simpson"];
    let result = [];
    for(let i = 0; i<30; i++){
        result.push(new User(firstNames[Math.floor(Math.random() * firstNames.length)] + " "
            + lastNames[Math.floor(Math.random() * lastNames.length)]))
    }
    return result;
}



// !!USE THIS TO FIND RESTAURANTS BY QUERY!!
//If you want all restaurants, query the empty string.
//Accepts an array of Restaurants and a Query. Returns an array of Restaurants that meet the query.
function search(array, query){
    let result = [];
    for(let i = 0; i<array.length; i++){
        if(array[i].name.toLowerCase().includes(query.toLowerCase()))
            result.push(array[i]);
        else if('foodItems' in array[i]){
            let foodItems = array[i].foodItems;
            for(let j = 0; j<foodItems.length; j++){
                if(foodItems[j].name.toLowerCase().includes(query.toLowerCase())){
                    result.push(array[i]);
                    break;
                }
            }
        }
    }
    return result;
}



function compareReviews(a, b){
    if (a.rating > b.rating)
        return -1;
    else if (b.rating < a.rating)
        return 1;
    else
        return 0;
}


//helper function for generating restaurant reviews. Accepts user list and restaurant list and makes reviews for it.
//Please use generateTrendingReview or generateFriensAndTheirReviews, to get data.
//This is just a helper function, don't use this.
function generateRestaurantReviews(userList, restaurantList){
    let result = [];
    for(let i = 0; i<restaurantList.length; i++){
        let user1 = userList[Math.floor(Math.random() * userList.length)];
        let user2 = userList[Math.floor(Math.random() * userList.length)];
        while(user1 === user2)
            user2 = userList[Math.floor(Math.random() * userList.length)];
        result.push(new RestaurantReview(user1,parseInt(100*(1 +Math.random()*4))/100,restaurantList[i],));
    }
    return result.sort(compareReviews);
}


//Accepts a restaurant, Generates random Food Reviews for that restaurant.
//Accepts just ONE restaurant.
function generateFoodReviews(users, restaurants){
    let result = [];
    for(let j = 0; j<restaurants.length; j++) {
        let restaurant = restaurants[j];
        let foodList = restaurant.foodItems;
        for (let i = 0; i < foodList.length; i++) {
            let user1 = users[Math.floor(Math.random() * users.length)];
            let user2 = users[Math.floor(Math.random() * users.length)];
            while (user1 === user2)
                user2 = users[Math.floor(Math.random() * users.length)];
            let ingredientChoices = foodList[i].ingredients;
            let choices1 = [];
            let choices2 = [];
            for (let j = 0; j < ingredientChoices.length; j++) {
                choices1.push(Math.random() >= 0.5)
                choices2.push(Math.random() >= 0.5)
            }
            result.push(new FoodReview(user1, parseInt(100 * (1 + Math.random() * 4)) / 100, restaurant, foodList[i], choices1))
            result.push(new FoodReview(user2, parseInt(100 * (1 + Math.random() * 4)) / 100, restaurant, foodList[i], choices2))
        }
    }
    return result.sort(compareReviews);
}


function sortByRating(array){
    return array.sort(compareReviews);
}

function indexByName(array, value){
    let index = -1;
    for(let i = 0; i<array.length; i++){
        if(array[i].name.localeCompare(value) === 0){
            index = i;
            break;
        }
    }
    return index;
}


function filterReviews(restaurants, reviews, query){
    let currentList = search(restaurants, query);
    let result = [];
    for(let i = 0; i< reviews.length; i++){
        //console.log("Index of " + reviews[i].name + currentList.indexOf(reviews[i].restaurant.name));
        if (indexByName(currentList, reviews[i].restaurant.name) !== -1){
            result.push(reviews[i])
        }
    }
    return result;
}


function getData(){
    //must run this. Reads the textfiles to produce the data.
    if(sessionStorage.getItem("Restaurants") === null){
        let results = createData();
        sessionStorage.setItem("Restaurants", JSON.stringify(results[0]));
        sessionStorage.setItem("Food", JSON.stringify(results[1]));
        sessionStorage.setItem("Ingredients", JSON.stringify(results[2]));

        //generate friends and trending users
        let friends = createFriends();
        let randomUsers = createRandomUsers();
        sessionStorage.setItem("Friends", JSON.stringify(friends));
        sessionStorage.setItem("Users", JSON.stringify(randomUsers));

        //generate and store reviews
        sessionStorage.setItem("UserRestaurantReviews", JSON.stringify(generateRestaurantReviews(randomUsers, results[0])));
        sessionStorage.setItem("FriendRestaurantReviews", JSON.stringify(generateRestaurantReviews(friends, results[0])));
        sessionStorage.setItem("UserFoodReviews", JSON.stringify(generateFoodReviews(randomUsers, results[0])));
        sessionStorage.setItem("FriendFoodReviews", JSON.stringify(generateFoodReviews(friends, results[0])));

        // conditional items:
        sessionStorage.setItem("Trending", "false");
        let testVal = [];
        localStorage.setItem("cartContents", JSON.stringify(testVal));

        sessionStorage.setItem("Restaurants", JSON.stringify(results[0]));
    }
    sessionStorage.setItem("FeaturedReviewNum", "0");
}






function changeReviews(value){
    sessionStorage.setItem(("Trending"), value);
    let buttons = document.getElementsByClassName('deleteMe');
    while(buttons[0]) {
        buttons[0].parentNode.removeChild(buttons[0]);
    }
    displayRestaurantReviews();
}


function displayCart(){
        let cart = JSON.parse(localStorage.getItem("cartContents"));

        let cartItems = document.getElementsByClassName('deleteMeToo');
        while(cartItems[0]) {
            cartItems[0].parentNode.removeChild(cartItems[0]);
        }
        let cost = 0.0;
        if(cart != null) {
            if(document.getElementById("cartEmpty")){
                document.getElementById("cartEmpty").parentElement.removeChild(document.getElementById("cartEmpty"));
            }
            // document.getElementById("cartOrderItem").childNodes[0].nodeValue="hi";
            for (let i = 0; i < cart.length; i++) {
                cost+=parseFloat(cart[i].foodItem.price);
                let uiMain = document.createElement("li");
                uiMain.className = "deleteMeToo";
                uiMain.innerText = cart[i].foodItem.name;
                let costText = document.createElement("p");
                costText.innerText = "$" + cart[i].foodItem.price;
                let ingredientWords = "";
                let ui = document.createElement("p");
                let numElm = 0;
                for(let j = 0; j < cart[i].choices.length; j++){
                    if(cart[i].choices[j]){
                        numElm ++;
                        if(ingredientWords.length > 0)
                            ingredientWords += ", ";
                        ingredientWords += cart[i].foodItem.ingredients[j].name;
                    }
                }
                if(numElm > 0)
                    uiMain.appendChild(document.createElement("br"));
                ui.innerText = ingredientWords;
                uiMain.appendChild(ui);
                uiMain.appendChild(document.createElement("br"));
                uiMain.appendChild(costText);
                let orderedBy = " Ordered By: ";
                let ord = document.createElement("p");
                ord.innerText = orderedBy;
                uiMain.appendChild(ord);
                //create the drop down:
                let friends = ["Me", "ChrisVat", "Ryan Campbell", "Matty P", "Aniket S"]
                let dropDown = document.createElement("select");
                dropDown.className = "cart1Drop";
                for(let i =0; i<friends.length; i++){
                    let myOption = document.createElement("option");
                    myOption.innerText = friends[i];
                    dropDown.appendChild(myOption);
                }
                uiMain.appendChild(dropDown);
                uiMain.appendChild(document.createElement("br"))
                let button = document.createElement("button");
                button.className = "removeCartButton";
                button.innerText = "Remove";
                button.addEventListener("click", function(){removeItemFromCart(i)});
                uiMain.appendChild(button);
                document.getElementById("CartList").appendChild(uiMain);
            }
        }
        if (cart.length === 0){
            if(document.getElementById("cartEmpty")){
                document.getElementById("cartEmpty").parentElement.removeChild(document.getElementById("cartEmpty"));
            }
            let p = document.createElement("h1");
            p.innerText = "Cart Empty";
            p.id = "cartEmpty";
            document.getElementById("CartList").appendChild(p);

        }
        cost = parseInt(cost*100)/100;
        document.getElementById("TotalCost").innerText = "Total Cost: $"+cost;
}

function removeItemFromCart(item){
    let temp = cartContents;
    let tempL = cartContents.length;
    cartContents = [];
    for(let i = 0; i<item; i++){
        cartContents.push(temp.shift());
    }
    temp.shift();
    for(let i = item+1; i<tempL; i++){
        cartContents.push(temp.shift());
    }
    localStorage.setItem("cartContents", JSON.stringify(cartContents));

    displayCart();
}




function displayRestaurantReviews() {
    let reviews;
    let dir;
    if(window.location.search.includes("restaurant=")){  // we are in a restaurant page.
        if(!JSON.parse(sessionStorage.getItem("Trending")))
            reviews = filterReviews(JSON.parse(sessionStorage.getItem("Restaurants")), JSON.parse(sessionStorage.getItem("FriendFoodReviews")),
                decodeURI(String(window.location.search).substring(window.location.search.indexOf("=") + 1).replace("+", " ")));
        else
            reviews = filterReviews(JSON.parse(sessionStorage.getItem("Restaurants")), JSON.parse(sessionStorage.getItem("UserFoodReviews")),
                decodeURI(String(window.location.search).substring(window.location.search.indexOf("=") + 1).replace("+", " ")));
        dir = getFoodPhotoDir(reviews[0].recipe.foodItem.name.toLowerCase());
        //console.log("dir: " + dir);

    // ADD SORT HERE
        reviews = reviews.sort(compareReviews);

    }
    else{ //searching for a restaurant

        if(!JSON.parse(sessionStorage.getItem("Trending")))
            reviews = filterReviews(JSON.parse(sessionStorage.getItem("Restaurants")), JSON.parse(sessionStorage.getItem("FriendRestaurantReviews")),
                String(window.location.search).substring(window.location.search.indexOf("=") + 1).replace("+", " "));
        else
            reviews = filterReviews(JSON.parse(sessionStorage.getItem("Restaurants")), JSON.parse(sessionStorage.getItem("UserRestaurantReviews")),
                String(window.location.search).substring(window.location.search.indexOf("=") + 1).replace("+", " "));
    }
    for (let i = 0; i < reviews.length; i++) {

        let btn = document.createElement("BUTTON");
        btn.className = "deleteMe";
        let itemValue = "";
        if(window.location.search.includes("restaurant=")) { // in restaurant page.
            itemValue = reviews[i].recipe.foodItem.name;
            let restNum = -1;
            let foodNum = -1;
            let dataTest = JSON.parse(sessionStorage.getItem("Restaurants"));
            for(let p = 0; p<dataTest.length && restNum == -1; p++){
                if(reviews[0].restaurant.name == dataTest[p].name) {
                    restNum = p;
                }
            }
            for(let j = 0; j < dataTest[restNum].foodItems.length && foodNum == -1; j++){
                if(reviews[i].recipe.foodItem.name == dataTest[restNum].foodItems[j].name) {
                    foodNum = j;
                }
            }
            btn.onclick = function(){
                ingredientsFromPremade(restNum, foodNum, reviews[i].recipe.choices, reviews[i].user.name);
            };
        }
        else{
            btn.onclick=function(){window.location.search='restaurant='+ reviews[i].restaurant.name};
            itemValue = reviews[i].restaurant.name;
        }
        btn.innerHTML =  "<span class = 'ReviewText SocialMenu RestaurantReviews'  >" + reviews[i].user.name + " Reviewed" + "<br/>" + "'" + itemValue + "'" +  "<br/> </span>";
        if (window.location.search.includes("restaurant="))



            dir = getFoodPhotoDir(reviews[i].recipe.foodItem.name.toLowerCase());
            
        else
            dir = getRestaurantPhotoDir(reviews[i].restaurant.name.toLowerCase())
        btn.setAttribute("style", "background-image: url(" + dir + ")");
        btn.style.backgroundSize = "cover";
        btn.style.backgroundRepeat = 'no-repeat'
        btn.style.backgroundPosition = 'center';

        
            var stars = new Image();
            stars.src = "stars/" + Math.round(reviews[i].rating) + "star.png"
            stars.style.width = "35%";
            btn.appendChild(stars);
           
        document.getElementById("RestaurantReviews").appendChild(btn);
    }
    if(sessionStorage.getItem("Trending") == 'true')
        document.getElementById("reviewTitle").innerText = "Trending Reviews";
        
    else
        document.getElementById("reviewTitle").innerText = "Friend Reviews";

}


function changeFeaturedReview(increment){
    sessionStorage.setItem("FeaturedReviewNum", parseInt(sessionStorage.getItem("FeaturedReviewNum")) + increment);
    displayFeaturedReview();
}

function displayFeaturedReview() {
    if(window.location.search.includes("restaurant=")) {  // we are in a restaurant page.
        let reviews = filterReviews(JSON.parse(sessionStorage.getItem("Restaurants")), JSON.parse(sessionStorage.getItem("FriendFoodReviews")),
            decodeURI(String(window.location.search).substring(window.location.search.indexOf("=") + 1).replace("+", " ")));
        let btn = document.getElementById("featuredReviewButton");

        if (reviews[0] !== undefined) { //looking for food.
            let uniqueReview = getUniqueFoodReviews(reviews);
            let index =  mod(parseInt((sessionStorage.getItem("FeaturedReviewNum")) + uniqueReview.length*10), uniqueReview.length);
            let restNum = -1;
            let foodNum = -1;
            let dataTest = JSON.parse(sessionStorage.getItem("Restaurants"));
            for(let i = 0; i<dataTest.length && restNum == -1; i++){
                if(dataTest[i].name == uniqueReview[index].restaurant.name) {
                    restNum = i;
                }
            }
            for(let i = 0; i < dataTest[i].foodItems.length && foodNum == -1; i++){
                if(dataTest[restNum].foodItems[i].name == uniqueReview[index].recipe.foodItem.name) {
                    foodNum = i;
                }
            }

            btn.onclick = function(){
                ingredients(restNum, foodNum);
            };


            btn.innerHTML = "<span class = 'ReviewText'> Featured Item at " + uniqueReview[index].restaurant.name +  " <br/>" + uniqueReview[index].recipe.foodItem.name + "<br/> </span>";
            // btn.style.textAlign
            //btn.onclick = function () {   //this will need to pop up menu with food choices.
            //    window.location.search = 'restaurant=' + reviews[0].name;
            //};

            let dir = getFoodPhotoDir(uniqueReview[index].recipe.foodItem.name.toLowerCase())
            btn.setAttribute("style", "background-image: url(" + dir + ")");
            btn.style.backgroundSize = 'cover';
            btn.style.backgroundRepeat = 'no-repeat';
            btn.style.backgroundPosition = 'center';

            var stars = new Image();
            stars.src = "stars/" + Math.round(uniqueReview[index].rating) + "star.png"
            stars.style.width = "35%";
            btn.appendChild(stars);


        }
    }
    else {  //looking for restaurant.
        let bestRest = sortByRating(search(JSON.parse(sessionStorage.getItem("Restaurants")),
            String(window.location.search).substring(window.location.search.indexOf("=") + 1).replace("+", " ")));
        let btn = document.getElementById("featuredReviewButton");
        if (bestRest[0] !== undefined) {
            let uniqueReview = getUniqueRestaurantReviews(bestRest);
            let index = mod(parseInt(sessionStorage.getItem("FeaturedReviewNum") + uniqueReview.length*10), uniqueReview.length);
            btn.innerHTML = "<span class = 'ReviewText'> Featured Restaurant <br/>" + uniqueReview[index].name + "<br/> </span>";
            btn.onclick = function () {
                window.location.search = 'restaurant=' + bestRest[0].name;
            };
            let dir = getRestaurantPhotoDir(uniqueReview[index].name.toLowerCase())
            btn.setAttribute("style", "background-image: url(" + dir + ")");
            btn.style.backgroundSize = 'cover';
            btn.style.backgroundRepeat = 'no-repeat'
            btn.style.backgroundPosition = 'center';

            var stars = new Image();
            stars.src = "stars/" + Math.round(uniqueReview[index].rating) + "star.png"
            stars.style.width = "35%";
            btn.appendChild(stars);

        }



    }
}


function getUniqueFoodReviews(array){
    let result = [];
    for(let i=0; i<array.length && result.length<3; i++){
        let found = false;
        for(let j = 0; j<result.length && !found; j++){
            found = result[j].recipe.foodItem.name.localeCompare(array[i].recipe.foodItem.name) === 0;
        }
        if(!found)
            result.push(array[i]);
    }
    return result;
}

function getUniqueRestaurantReviews(array){
    let result = [];
    for(let i=0; i<array.length && result.length<3; i++){
        let found = false;
        for(let j = 0; j<result.length && !found; j++){
            found = result[j].name.localeCompare(array[i].name) === 0;
        }
        if(!found)
            result.push(array[i]);
    }
    return result;
}


function addNewReview(review){
    // here here here
    let allReviews = JSON.parse(sessionStorage.getItem("FriendFoodReviews"));
    let test = JSON.stringify(review);
    let reviewS = JSON.parse(test);
    allReviews.push(reviewS);
    sessionStorage.setItem("FriendFoodReviews", JSON.stringify(allReviews));
    document.getElementById('reviewPopup').style.display='none';

    let buttons = document.getElementsByClassName('deleteMe');
    while(buttons[0]) {
        buttons[0].parentNode.removeChild(buttons[0]);
    }
    displayRestaurantReviews();
}

function addReviewThing(){
    let num = document.getElementById('reviewRating').value;
    if(num==0){
        num = 1;
    }
    if(!Number.isInteger(num)){
        num = parseInt(num) || 5;
    }
    num=Math.min(5, num);
    num=Math.max(1,num);

    let name = "AnonymousUser";  //PUT ACTUAL USERNAME HERE!
    if(sessionStorage.getItem("UserName") != null) {
        name = sessionStorage.getItem("UserName");
    }

    let user = new Friend(name);
    let review = getReview(user, num);
    addNewReview(review);
}


function getRestaurantPhotoDir(foodName){
    let category = "";
    foodName = foodName.toLowerCase();
    if(foodName.includes("aniket"))
        category = "ani";
    else if(foodName.includes("boat"))
        category = "bananaBoat";
    else if(foodName.includes("bob"))
        category = "bobsBurgers";
    else if(foodName.includes("boston"))
        category = "bostonPizza";
    else if(foodName.includes("chunky"))
        category = "chunkyCheese";
    else if(foodName.includes("cow"))
        category = "cow";
    else if(foodName.includes("frozen banana"))
        category = "frozenBanana";
    else if(foodName.includes("gazpacho"))
        category = "gazpach";
    else if(foodName.includes("good"))
        category = "goodBurger";
    else if(foodName.includes("gusteau"))
        category = "gusteaus";
    else if(foodName.includes("krusty"))
        category = "krusty";
    else if(foodName.includes("los pollos"))
        category = "lph";
    else if(foodName.includes("mamma"))
        category = "mamma";
    else if(foodName.includes("matthias"))
        category = "matty";
    else if(foodName.includes("party"))
        category = "party";
    else if(foodName.includes("paunch"))
        category = "paunch";
    else if(foodName.includes("piece"))
        category = "piece";
    else if(foodName.includes("slim"))
        category = "slims";
    else if(foodName.includes("sous"))
        category = "sous";
    else if(foodName.includes("wellington"))
        category = "wellington";

    return "restaurantImages/" + category + "/" + category+".jpg";
}



function getFoodPhotoDir(foodName){
    let category = "";
    foodName = foodName.toLowerCase();
    let hash = 0;
    for(let i = 0; i<foodName.length && i<5; i++){
        hash += foodName.charCodeAt(i);
    }
    if(foodName.includes("heisen"))
        category = "heisen";
    else if(foodName.includes("fajita"))
        category = "fajita";
    else if(foodName.includes("world famous chicken"))
        category = "chicken";
    else if(foodName.includes("gordita"))
        category = "gordita";
    else if(foodName.includes("taco"))
        category = "taco";
    else if(foodName.includes("fries"))
        category = "fries";
    else if(foodName.includes("shake"))
        category = "shake";
    else if(foodName.includes("pickle"))
        category = "pickle";
    else if(foodName.includes("burger") || foodName.includes("sandwich") || foodName.includes("krabby")
        || foodName.includes("four cheddar") || foodName.includes("sweet home") || foodName.includes("eggers can")
        || foodName.includes("gordon") || foodName.includes("big dipper"))
        category = "burger";
    else if(foodName.includes("dog"))
        category = "hotdog";
    else if(foodName.includes("pickle"))
        category = "pickle";
    else if(foodName.includes("coral"))
        category = "coral";
    else if(foodName.includes("ring"))
        category = "onionring";
    else if(foodName.includes("ron swanson"))
        category = "enormousburger";
    else if(foodName.includes("tornado"))
        category = "meattornado";
    else if(foodName.includes("heart attack"))
        category = "heartattack";
    else if(foodName.includes("gravy"))
        category = "gravybucket";
    else if(foodName.includes("artery"))
        category = "artery";
    else if(foodName.includes("wings"))
        category = "wings";
    else if(foodName.includes("quesadilla"))
        category = "quesadilla";
    else if(foodName.includes("chicken sandwich"))
        category = "chickenburger";
    else if(foodName.includes("pizza") || foodName.includes("meat lovers") || foodName.includes("slice")
        || foodName.includes("be topped"))
        category = "pizza";
    else if(foodName.includes("sprite"))
        category = "sprite";
    else if(foodName.includes("fettuccine"))
        category = "fettucinialfredo";
    else if(foodName.includes("manicotti"))
        category = "manicotti";
    else if(foodName.includes("rigatoni"))
        category = "rigatoni";
    else if(foodName.includes("fettuccine"))
        category = "fettucinialfredo";
    else if(foodName.includes("steak") || foodName.includes("beef") || foodName.includes("rib eye"))
        category = "steak";
    else if(foodName.includes("ratatouille"))
        category = "ratatouille";
    else if(foodName.includes("fish") || foodName.includes("arctic char"))
        category = "fish";
    else if(foodName.includes("mousse"))
        category = "mousse";
    else if(foodName.includes("tartar"))
        category = "fancy";
    else if(foodName.includes("tart"))
        category = "tart";
    else if(foodName.includes("tiramisu"))
        category = "tiramisu";
    else if(foodName.includes("foie") || foodName.includes("duck"))
        category = "duck";
    else if(foodName.includes("soup") || foodName.includes("gazpacho"))
        category = "soup";
    else if(foodName.includes("pie"))
        category = "pie";
    else if(foodName.includes("chicken breast"))
        category = "chickenbreast";
    else if(foodName.includes("prawn"))
        category = "prawn";
    else if(foodName.includes("salad"))
        category = "salad";
    else if(foodName.includes("olives"))
        category = "olives";
    else if(foodName.includes("cheese") || foodName.includes("cheddar") || foodName.includes("brie")
        || foodName.includes("feta") || foodName.includes("asiago"))
        category = "cheese";
    else if(foodName.includes("cake"))
        category = "cake";
    else if(foodName.includes("ice cream"))
        category = "icecream";
    else if(foodName.includes("frozen clam") || foodName.includes("frozen lamb"))
        category = "coldsoup";
    else if(foodName.includes("chowder"))
        category = "chowder";
    else if(foodName.includes("double dipped"))
        category = "dippedbanana";
    else if(foodName.includes("go banana") || foodName.includes("girly banana") || foodName.includes("george")
        || foodName.includes("simple simon") || foodName.includes("original frozen banana"))
        category = "banana";
    else if(foodName.includes("iced tea"))
        category = "icedtea";
    else if(foodName.includes("tea"))
        category = "tea";
    else if(foodName.includes("coffee") || foodName.includes("americano"))
        category = "coffee";
    else if(foodName.includes("cappuccino") || foodName.includes("latte"))
        category = "cappuccino";
    else if(foodName.includes("espresso"))
        category = "espresso";
    else if(foodName.includes("chocolate banana soft"))
        category = "bananasoftc";
    else if(foodName.includes("lla banana soft"))
        category = "bananasoftv";
    else if(foodName.includes("chunky"))
        category = "icecreamcup";
    else if(foodName.includes("float"))
        category = "cokefloat";
    else if(foodName.includes("crackers"))
        category = "crackers";
    else if(foodName.includes("banana split"))
        category = "bananasplit";
    return "foodImages/" + category + "/" + category + ((hash%foodPhotoCount[category]) + 1) +".jpg";
}

function hidePopUp(){
    document.getElementById("foodPopup").style.display = "none";

}

function getRestaurantText(){
    let string1 = "Aniket's Iced Chowder Cafe(Frozen Clam Chowder, Frozen Lamb Chowder, Lukewarm Potato Chowder, Scolding Hot Cheese Chowder)\n" +
        "Banana Boat Ice Cream(Banana Split, Chocolate Banana Soft Serve, Vanilla Banana Soft Serve, Chunky Monkey, Coke-Float)\n" +
        "Bob's Burgers(The Original Burger, Don't You Four Cheddar Bout Me, Sweet Home Avocado, Eggers Can't Be Cheesers, Gordon Hamsy)\n" +
        "Boston Pizza(Fried Wings, Quesadillas, Chicken Sandwich, The Big Dipper Burger, Tacos)\n" +
        "Christopher's Chunky Cheeses(Chunk o' Cheddar, Bowl o' Brie, Fist o' Feta, A-ton o' Asiago, Aged Crackers)\n" +
        "Frozen Banana Stand(Original Frozen Banana, On the Go-Go Banana, Double Dipped Frozen, Giddy-Girly Banana, George Daddy, Simple Simon)\n" +
        "Good Burger(Good Burger, Good Fries, Good Shake, Good Pickle, Double Good Burger)\n" +
        "Gusteau's(Grilled Steak, Ratatouille, Roasted Cod Fish, Chocolate Mousse, Apple Tart, Tiramisu)\n" +
        "Jack Rabbit Slims(Milkshake, Foie and Loathing in Las VeGras, Honey I Shrunk The Soup, Blueberry Pie)\n" +
        "Krusty Krab(Krabby Patty Burger, Double Krabby Patty Burger, Triple Krabby Patty Burger, Coral bits, Kelp Rings)\n" +
        "Los Pollos Hermanos(Gus' World Famous Chicken, The Heisenberg Special, Fajitas, Gale's Gordita, Jesse's Tasty Tacos)\n" +
        "Mamma Mia's Pizzeria(Mia's Famous Fettuccine Alfredo, Mia's Manicotti, Mia's Rigatoni, Mia's Meaty Pizzaroni)\n" +
        "Matthias' Burger Stank Shack(Matty's Big Ol' Cheeseburger, MeeMaw's Famous Burger Slider, Matt's Curly Fries, Matt's Musk Burger)\n" +
        "MilkTheCow(Chai Tea, Green Tea, Coffee, Iced Tea, Cappuccino, Americano, Latte, Espresso)\n" +
        "Paunch Burger(The Ron Swanson Supreme, The Meat Tornado, The Heart Attack, Gravy Bucket, The Artery Clogger)\n" +
        "Piece a da Pizza(Pizza Your Heart, Slice To Meat You, Can't Be Topped, Slice Slice Baby)\n" +
        "Pizza Party(Party Pizza for 8, Jumbo Party Pizza for 10, Sad Lonely Pizza for One)\n" +
        "Ryan's Great Gazpacho Emporium(Green Grape and Cucumber Gazpacho, Red Pepper Gazpacho, Butter Gazpacho, Yogurt Gazpacho)\n" +
        "Sous Sol(Warm Olives, Cheese Plate, Vegan \"Tartare\", Braised Beef Short Rib, Duck Leg Confit, Manitoba Arctic Char, Flourless Chocolate Cake, House Made Ice Cream)\n" +
        "529 Wellington(Chicken Breast, Jumbo Prawns, Caesar Salad, Carved Prime Beef, 8 oz. Beef Tenderloin, 12 oz. Beef Tenderloin, 14 oz. New York Steak, 14 oz. Rib Eye)";
    return string1;
}

function getFoodText(){
    let string2 = "Gus' World Famous Chicken:5.38:Main:Delicious Fried Chicken Cooked Perfectly By Gus.:Extra Gus Sauce, BBQ Sauce Dip, Ketchup Dip:\n" +
        "The Heisenberg Special:50.00:Main:A Special Concoction made by one of our Cooks. We'd tell you what's in it, but then we'd have to kill you.:Extra Methylamine, Chili Powder:\n" +
        "Fajitas:8.18:Main:Spicy and Delicious ABQ Fajitas.:Lettuce, Tomatoes, Onions, Peppers, Guacamole:\n" +
        "Gale's Gordita:3.91:Main:A Mouth Watering Pastry cooked perfectly by our renowned cook Gale.:Extra Gus Sauce:\n" +
        "Jesse's Tasty Tacos:4.01:Main:Three Tacos, with a little extra Chili Powder on all of them.:Lettuce, Tomatoes, Onions, Guacamole, Spicy Sauce:\n" +
        "Good Burger:5.07:Main:The best burger in Town. Comes with extra Good Sauce.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Cheddar, Extra Good Sauce:\n" +
        "Good Fries:2.03:Main:The best fries in Town. Comes fried in Good Sauce.:Extra Salt, Buttered Fries, Ketchup:\n" +
        "Good Shake:4.85:Main:The best vanilla Shake In Town. Comes with Good Sauce on top.:Chocolate Sauce, Bananas, Cherries:\n" +
        "Good Pickle:5.62:Dessert:Our world famous Good Pickles. Brined to pickley perfection in Good Sauce.:Extra Good Sauce:\n" +
        "Double Good Burger:8.85:Main:Its like a Good Burger, but twice as Good (Double Patty).:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Cheddar, Extra Good Sauce:\n" +
        "Cheeseburger:15.32:Main:A Classic Cheeseburger.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo:\n" +
        "French Fries:6.32:Main:Delicious classic French fries, nothing special here!:Extra Salt, Buttered Fries, Ketchup:\n" +
        "Hot Dog:5.33:Main:A classic hotdog.:Ketchup, Mustard, Onions, Relish:\n" +
        "Jumbo Dog:7.31:Main:A classic jumbo dog, it's like a hotdog but bigger!:Ketchup, Mustard, Onions, Relish:\n" +
        "Krabby Patty Burger:4.25:Main:Our Ocean Famous Burger. Comes with Secret Sauce.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Cheddar, Extra Secret Sauce:\n" +
        "Double Krabby Patty Burger:6.50:Main:A Krabby Patty Burger with an Extra Patty.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo,  Cheddar, Extra Secret Sauce:\n" +
        "Triple Krabby Patty Burger:8.95:Main:A Double Krabby Patty Burger with 1.5x the Patty.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo,  Cheddar, Extra Secret Sauce:\n" +
        "Coral bits:2.41:Appetizer:Fresh Coral Grilled To Perfection.:Ketchup:\n" +
        "Kelp Rings:5.97:Main:Deep Fried Kelp shaped into a ring. Good for the soul, bad for the arteries.:Ketchup:\n" +
        "The Original Burger:6.15:Main:There can only be one original. Bob's Best Burger with our Secret Sauce.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Cheddar, Extra Bob Sauce:\n" +
        "Don't You Four Cheddar Bout Me:5.93:Main:A Delicious Cheese Burger with Aged Cheddar.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Extra Bob Sauce:\n" +
        "Sweet Home Avocado:6.46:Main:A Tasty Burger Topped with A Smattering Of Avocado.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Cheddar, Extra Avocado, Extra Bob Sauce:\n" +
        "Eggers Can't Be Cheesers:9.69:Main:Cheeseburger with an egg on it. Sweet livin'.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Cheddar, Mayo, Extra Bob Sauce:\n" +
        "Gordon Hamsy:7.82:Main:Served with Squash and Ham. Brought Tears To Gordon Ramsay's Eyes.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Cheddar, Mayo, Extra Ham, Extra Bob Sauce:\n" +
        "The Ron Swanson Supreme:7.65:Main:Quadruple Burger, hold the veggies.:Extra Meat, Additional Protein, Extra Preservatives:\n" +
        "The Meat Tornado:10.35:Main:Assorted Meats, Guaranteed to Give you the Meat Sweats.:Extra Meat, Additional Protein, Extra Preservatives:\n" +
        "The Heart Attack:4.91:Main:Onion Loaf. Comes with a waiver you need to sign before eating it.:Extra Meat, Additional Protein, Extra Preservatives, Extra lard:\n" +
        "Gravy Bucket:7.23:Main:It's a Bucket o' Gravy. Simple as that.:Additional Protein:\n" +
        "The Artery Clogger:15.35:Appetizer:Assorted Meats and Gravies. Just one person has finished the meal in its entirety, but many have died trying.:Extra Meat, Additional Protein, Extra Preservatives:\n" +
        "Matty's Big Ol' Cheeseburger:6.35:Main:Extra Large Cheeseburger. Cooked by North-West St. Vital's fifth best Fry Cook.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Cheddar, Mayo:\n" +
        "MeeMaw's Famous Burger Slider:1.81:Main:Extra Small Cheeseburger. Cooked by the Mother of North-West St. Vital's fifth best Fry Cook.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Cheddar, Mayo:\n" +
        "Matt's Curly Fries:1.21:Main:Like normal fries but all bendy.:Extra Salt, Buttered Fries, Ketchup:\n" +
        "Matt's Musk Burger:6.36:Main:Matty's Big Ol' Cheeseburger with extra Musk Sauce.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Cheddar, Mayo:\n" +
        "Fried Wings:4.98:Main:Delicious Fried Wings.:Spicy Dip, Medium Dip, Cool Dip, Ranch Dip:\n" +
        "Quesadillas:5.13:Main:Our Famous Quesadillas. You're going to love them.:Lettuce, Tomatoes, Onions, Peppers, Guacamole:\n" +
        "Chicken Sandwich:6.81:Main:Our Chicken Sandwich was perfected through iterative design.:Lettuce, Tomatoes, Guacamole:\n" +
        "The Big Dipper Burger:7.41:Main:It's astronomically good.:Lettuce, Ketchup, Mustard, Tomatoes, Spicy Sauce, Peppers, Guacamole:\n" +
        "Tacos:4.36:Main:Our crunchy beef tacos, they are a classic.:Lettuce, Tomatoes, Onions, Guacamole, Spicy Sauce:\n" +
        "Olive Lovers Pizza:18.51:Main:Pizza which comes with extra olives!:Green Olives, Black Olives, Extra Cheese:\n" +
        "Margarita Pizza:16.42:Main:A classic style margarita pizza.:Extra Cheese, Extra Basil, Extra Tomatoes:\n" +
        "Meat Lovers:22.53:Main:A classic style meat pizza, comes with extra pepperoni and sausage.:Extra Bacon, Extra Pepperoni, Extra Sausage:\n" +
        "Party Pizza for 8:27.69:Main:A comically large Pizza designed to perfectly fill the bellies of 8 people.:Ham, Pineapple, Bacon, Pepperoni, Sausage, Extra Cheese, Chicken, Ranch:\n" +
        "Jumbo Party Pizza for 10:35.54:Main:An EXTRA large pizza for 10 people.:Ham, Pineapple, Bacon, Pepperoni, Sausage, Extra Cheese, Ham, Chicken, Ranch:\n" +
        "Sad Lonely Pizza for One:4.24:Main:A sad pizza designed perfectly for one person to consume in its entirety.:Ham, Pineapple, Bacon, Pepperoni, Sausage, Extra Cheese, Chicken, Ranch:\n" +
        "Pizza Your Heart:13.21:Main:It is so good that it will fill your belly AND your heart. Comes with our delicious pizza sauce.:Ham, Pineapple, Bacon, Pepperoni, Sausage, Extra Cheese, Chicken, Ranch:\n" +
        "Slice To Meat You:12.63:Main:A delicious pizza topped with slices of ham.:Extra Ham, Pineapple, Bacon, Pepperoni, Sausage, Extra Cheese, Ham, Chicken, Ranch:\n" +
        "Can't Be Topped:18.33:Main:An Extra Large Cheese Pizza topped with Extra Small Pizzas.:Ham, Pineapple, Bacon, Pepperoni, Sausage, Extra Cheese, Chicken, Ranch:\n" +
        "Slice Slice Baby:13.96:Main:Cold Pizza, toppings of your choice.:Ham, Pineapple, Bacon, Pepperoni, Sausage, Extra Cheese, Chicken, Ranch:\n" +
        "Mia's Famous Fettuccine Alfredo:6.04:Main:A creamy and delicious pasta coming from Mamma Mia!:Extra Alfredo Sauce:\n" +
        "Mia's Manicotti:4.68:Main:A zesty Manicotti served hot and ready from Mamma Mia!:Tomato Sauce:\n" +
        "Mia's Rigatoni:7.04:Main:A perfectly cooked Rigatoni, world famous, coming straight from Mamma Mia's oven!:Tomato Sauce:\n" +
        "Mia's Meaty Pizzaroni:3.86:Main:Mamma Mia's hidden recipe, hint (it's a pizza + a rigatoni!):Tomato Sauce, Pepperoni:\n" +
        "Grilled Steak:12.33:Main:Cooked Medium Rare, don't like your steaks medium rare? Eat somewhere else.:Buttered, Bacon-wrapped:\n" +
        "Ratatouille:9.96:Main:Cooked by our famous Chef, Remy.:Make It Large:\n" +
        "Roasted Cod Fish:14.85:Main:A roasted fresh cod fish. Perfectly cooked and seasoned.:Asparagus, Additional Sauce:\n" +
        "Chocolate Mousse:11.62:Dessert:Delicious, velvety, chocolate. A great way to end a meal.:Make It Large:\n" +
        "Apple Tart:7.99:Dessert:Delicious, perfectly baked apple tart.:Make It Large:\n" +
        "Tiramisu:6.15:Dessert:A classic dessert done right.:Make It Large:\n" +
        "Milkshake:5.00:Drink:Tastes as good as a Five Dollar Milkshake should.:Chocolate Sauce, Bananas, Cherries:\n" +
        "Foie and Loathing in Las VeGras:6.19:Main:Delicious Foie Gras.:Make It Large:\n" +
        "Honey I Shrunk The Soup:7.35:Main:Our famous cream soup.:Make It Spicy:\n" +
        "Blueberry Pie:7.13:Dessert:A slice of delicious blueberry pie.:Make It Large:\n" +
        "Chicken Breast:5.35:Main:Perfectly cooked Portuguese chicken breast, comes with rice and a potato (as do most Portuguese foods).:Extra Potato, Extra Rice, Spicy Chicken:\n" +
        "Jumbo Prawns:9.75:Main:Jumbo prawns which come with our delicious prawn sauce.:Extra Sauce:\n" +
        "Caesar Salad:5.97:Appetizer:To make our Caesar Salads, we take a normal salad then stab it 23 times. Et tu, brute?:Tomatoes, Spinach:\n" +
        "Carved Prime Beef:22.63:Main:A tender medium rare prime beef.:Buttered, Bacon-wrapped:\n" +
        "8 oz. Beef Tenderloin:22.61:Main:8 oz. of perfectly cooked medium rare Beef Tenderloin.:Buttered, Bacon-wrapped:\n" +
        "12 oz. Beef Tenderloin:28.36:Main:12 oz. of perfectly cooked medium rare Beef Tenderloin.:Buttered, Bacon-wrapped:\n" +
        "14 oz. New York Steak:33.12:Main:14 oz. of perfectly cooked medium rare New York Steak.:Buttered, Bacon-wrapped:\n" +
        "14 oz. Rib Eye:29.43:Main:14 oz. of perfectly cooked medium rare Rib Eye.:Buttered, Bacon-wrapped:\n" +
        "Warm Olives:5.44:Appetizer:Warm Olives served with a tasty citrus sauce. Tastes better than it sounds.:Make It Large:\n" +
        "Cheese Plate:8.71:Appetizer:A great way to start a meal. Comes with crackers.:Make It Large, Include Blue Cheese:\n" +
        "Vegan \"Tartare\":15.39:Appetizer:Smoked Beets, Coconut Creme Fraiche, Horseradish, Pickled Mustard seeds, French Bread.:Make It Large, No Horseradish:\n" +
        "Braised Beef Short Rib:25.35:Main:Beef reduction, Roasted Root Vegetables, Cremini, Shiitake & Oyster Mushrooms.:Make It Large, Extra Mushrooms:\n" +
        "Duck Leg Confit:20.00:Main:Bacon & White Bean Cassoulet, Red Wine Jus, Tomato & Onion Reduction.:Make It Large:\n" +
        "Manitoba Arctic Char:20.00:Main:Cocount Creme Lentils, Smoked Beets, Anchovy Bread Crumbs, Pickled Shallot.:Make It Large:\n" +
        "Flourless Chocolate Cake:7.50:Dessert:Vanilla Creme Fraiche, Candied Pecans.:Make It Large:\n" +
        "House Made Ice Cream:12.00:Dessert:Vanilla Ice Cream, Flourless Chocolate Brownie Pieces, Rum Caramel, Berries.:Whipped Cream, Extra Scoop: \n" +
        "Green Grape and Cucumber Gazpacho:8.58:Main:Nothing better than cold soup ft. Grape and Cucumber.:Large Bowl, Spicy:\n" +
        "Red Pepper Gazpacho:8.63:Main:Soup? Cold. Peppers? Red. Delicious? Maybe.:Large Bowl, Spicy:\n" +
        "Butter Gazpacho:7.63:Main:Cold Butter Soup, just like how my mother used to make.:Large Bowl, Spicy:\n" +
        "Yogurt Gazpacho:8.27:Main:Gazpacho made from Yogurt. Shockingly mediocre.:Large Bowl, Spicy:\n" +
        "Frozen Clam Chowder:8.15:Main:Frozen Clam Chowder Popsicle. It's trendy. Reheat at your own convenience.:Make It Large:\n" +
        "Frozen Lamb Chowder:8.15:Main:Frozen Lamb Chowder Popsicle. It's trendy. Reheat at your own convenience.:Make It Large:\n" +
        "Lukewarm Potato Chowder:6.92:Main:Lukewarm Potato Chowder. Our famous recipe. Pairs well with Scolding Hot Cheese Chowder.:Large Bowl, Peppers, Spicy:\n" +
        "Scolding Hot Cheese Chowder:6.57:Main:A delicious Hot Cheese Chowder! Let it cool before sipping. Pairs well with Lukewarm Potato Chowder.:Large Bowl, Peppers, Spicy:\n" +
        "Original Frozen Banana:1.00:Dessert:It's a frozen banana!:Whipped Cream, Chocolate Chips, Caramel, On A Stick:\n" +
        "On the Go-Go Banana:1.01:Dessert:Frozen banana for those on the go!:Whipped Cream, Chocolate Chips, Caramel, On A Stick:\n" +
        "Double Dipped Frozen:1.50:Dessert:Frozen banana double dipped in our banana sauce!:Whipped Cream, Chocolate Chips, Caramel, On A Stick:\n" +
        "Giddy-Girly Banana:0.99:Dessert:Frozen banana topped with fruit berries.:Whipped Cream, Chocolate Chips, Caramel, On A Stick:\n" +
        "George Daddy:2.00:Dessert:Three Frozen Bananas, for the price of two!:Whipped Cream, Chocolate Chips, Caramel, On A Stick:\n" +
        "Simple Simon:0.50:Dessert:A normal, non-frozen banana.:With Peel:\n" +
        "Chai Tea:4.29:Drink:A tasty tea to warm your soul.:Strong:\n" +
        "Green Tea:4.26:Drink:A tasty tea to warm your soul.:Strong:\n" +
        "Coffee:6.66:Drink:A perfectly brewed coffee to fuel your work.:Strong:\n" +
        "Iced Tea:3.71:Drink:American Iced Tea perfect for drinking under the hot sun.:Strong:\n" +
        "Cappuccino:6.17:Drink:Comes with cappuccino art on top!:Strong:\n" +
        "Americano:5.76:Drink:Brewed to perfection.:Strong:\n" +
        "Latte:6.52:Drink:Espresso and steamed milk. Simple and delicious.:Strong:\n" +
        "Espresso:5.34:Drink:Nobody actually likes espresso, but we get it, you need the caffeine.:Strong:\n" +
        "Banana Split:3.05:Dessert:Bananas and ice cream, could you really ask for more?:Whipped Cream, Chocolate Sauce, Strawberries, Caramel:\n" +
        "Chocolate Banana Soft Serve:5.50:Dessert:Bananas and chocolate ice cream. Delicious.:Whipped Cream, Chocolate Sauce:\n" +
        "Vanilla Banana Soft Serve:5.50:Dessert:Banans and vanilla ice cream. Fantastic.:Whipped Cream, Chocolate Sauce:\n" +
        "Chunky Monkey:8.45:Dessert:Chocolate chunks, ice cream and love!:Whipped Cream, Chocolate Sauce, Strawberries, Banana, Caramel:\n" +
        "Coke-Float:6.68:Drink:Coke and vanilla ice cream. Its foamy!:Make It Large:\n" +
        "Chunk o' Cheddar:34.52:Main:Big Chunk of Cheddar Cheese. For Cheese Lovers, by Cheese Lovers.:Aged:\n" +
        "Bowl o' Brie:34.22:Main:Big Bag of Brie. For Cheese Lovers, by Cheese Lovers.:Aged:\n" +
        "Fist o' Feta:34.63:Main:Big Fist Full of Feta Cheese. For Cheese Lovers, by Cheese Lovers.:Aged:\n" +
        "A-ton o' Asiago:32.11:Main:A ton (metaphorically) of Asiago Cheese. For Cheese Lovers, by Cheese Lovers.:Aged:\n" +
        "Aged Crackers:4.33:Appetizer:Air Aged, delicious whole wheat crackers to pair with one of our cheeses.:Salted:";
    return string2;
}


let foodPhotoCount = {  // folder name, count of files in that folder.
    "artery": 1,
    "banana": 5,
    "bananasoftc": 2,
    "bananasoftv": 1,
    "bananasplit": 1,
    "burger": 9,
    "cake": 1,
    "cappuccino": 2,
    "cheese": 9,
    "chicken": 1,
    "chickenbreast": 1,
    "chickenburger": 1,
    "chowder": 3,
    "coffee": 5,
    "cokefloat": 1,
    "coldsoup": 2,
    "coral": 1,
    "crackers": 1,
    "curlyfries": 1,
    "dippedbanana": 1,
    "duck": 1,
    "enormousburger": 2,
    "enormouspizza": 1,
    "espresso": 1,
    "fajita": 2,
    "fancy": 1,
    "fettucinialfredo": 1,
    "fish": 2,
    "fries": 4,
    "gordita": 1,
    "gravybucket": 1,
    "heartattack": 1,
    "heisen": 1,
    "hotdog": 3,
    "icecream": 2,
    "icecreamcup": 1,
    "icedtea": 1,
    "manicotti": 1,
    "meattornado": 1,
    "mousse": 1,
    "olives": 1,
    "onionring": 3,
    "pickle": 2,
    "pie": 2,
    "pizza": 9,
    "prawn": 1,
    "quesadilla": 2,
    "ratatouille": 1,
    "rigatoni": 1,
    "salad": 1,
    "shake": 3,
    "soup": 2,
    "sprite": 1,
    "steak": 10,
    "taco": 3,
    "tart": 1,
    "tea": 10,
    "tiramisu": 1,
    "wings": 1
}



getData();