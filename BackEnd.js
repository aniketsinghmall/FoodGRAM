//CV - Let me know if there are any problems with the code.

"use strict";
let fs = require('fs')

class Restaurant {
    #_Name
    #_foodItems

    constructor(name) { // accepts name of Restaurant and array of food items.
        this.#_Name = name;
        this.#_foodItems = []
    }
    addFood(name){
        this.#_foodItems.push(name);
    }
    get name(){
        return this.#_Name;
    }
    get foodItems(){
        return this.#_foodItems;
    }
}

class FoodItem{
    #_Name
    #_ingredients
    #_category
    #_description
    #_price
    constructor(name){  //accepts name of FoodItem and its possible ingredients
        this.#_Name=name;
        this.#_ingredients = [];
    }
    addIngredient(name){
        this.#_ingredients.push(name);
    }
    get name(){
        return this.#_Name
    }
    set category(value){
        this.#_category = value;
    }
    set description(value){
        if (value.includes("\r")){
            value = value.substring(0, value.indexOf("\r"));
        }
        this.#_description = value;
    }
    get description(){
        return this.#_description;
    }
    get category(){
        return this.#_category;
    }
    set price(value){
        this.#_price = value;
    }
    get price(){
        return this.#_price;
    }
    get ingredients(){
        return this.#_ingredients
    }
}


class Recipe {
    #_choices;
    #_foodItem;
    constructor(foodItem, choices){
        this.#_foodItem = foodItem;
        this.#_choices = choices;
    }
    get orderString(){
        let results = this.#_foodItem.name;
        let toppings = "";
        for(let i = 0; i<this.#_foodItem.ingredients.length; i++){
            if(this.#_choices[i])
                toppings += ", " + this.#_foodItem.ingredients[i].name;
        }
        if(toppings.length >= 1)
            results += toppings;
        results += ".";
        return results;
    }
    get name(){
        return this.#_foodItem.name;
    }
}

class Ingredient{
    #_name;
    constructor(name){
        this.#_name = name;
    }
    get name(){
        return this.#_name;
    }

}


//Users on this site essentially exist to have reviews and have a name.
class User{
    #_name;
    constructor(name){
        this.#_name = name;
    }
    get name(){
        return this.#_name;
    }
}


class Friend extends User{
    #_distance;
    constructor(name, distance){
        super(name);
        this.#_distance=distance;
    }
}


//A review for a restaurant.
class RestaurantReview{
    #_user
    #_rating
    #_restaurant
    constructor(user, rating, restaurant){
        this.#_user=user;
        this.#_rating=rating;
        this.#_restaurant=restaurant;
    }
    get name(){
        return this.#_user.name;
    }
    get user(){
        return this.#_user;
    }
    get rating(){
        return this.#_rating;
    }
    get restaurant(){
        return this.#_restaurant.name;
    }
}

//Review for a specific FoodItem at a specific Restaurant.
class FoodReview extends RestaurantReview{
    #_recipe  //binary array.
    constructor(user, rating, restaurant, foodItem, choices){
        super(user, rating, restaurant);
        this.#_recipe = new Recipe(foodItem, choices)
    }
    get recipe(){
        return this.#_recipe;
    }
    get orderString(){
        return this.#_recipe.orderString;
    }
    get itemName(){
        return this.#_recipe.name;
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

//Data Creation
//Accepts restaurants.txt and creates an array containing restaurant items and food items.
function createRestaurants(){
    let file = "restaurants.txt";
    let contents = fs.readFileSync(file,"utf8");
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
    let file = "food.txt";
    let contents = fs.readFileSync(file,"utf8");
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
        else if(array[i] instanceof Restaurant){
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
//Please use generateTrendingReview or generateFriendsAndTheirReviews, to get data.
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


//Generate Random Trending Reviews. These are currently dynamic and will change every time a restaurant is reloaded,
//as is the nature of trending pages. Also makes it much easier to do it like that lol.
function generateTrendingRestaurantReview(restaurants, query){
    let users = createRandomUsers();
    let restaurantList = search(restaurants, query);
    return generateRestaurantReviews(users, restaurantList);
}


//Accepts all restaurants.
//Returns array, [0] is friends, [1] is array of their reviews.
function generateFriendsRestaurantReviews(friends, restaurants){
    return [friends, generateRestaurantReviews(friends, restaurants)];
}


//Accepts a restaurant, Generates random Food Reviews for that restaurant.
//Accepts just ONE restaurant.
function generateFoodReviews(users, restaurant){
    let result = [];
    let foodList = restaurant.foodItems;
    for(let i = 0; i<foodList.length; i++){
        let user1 = users[Math.floor(Math.random() * users.length)];
        let user2 = users[Math.floor(Math.random() * users.length)];
        while(user1 === user2)
            user2 = users[Math.floor(Math.random() * users.length)];
        let ingredientChoices = foodList[i].ingredients;
        let choices1 = [];
        let choices2 = [];
        for(let j = 0; j<ingredientChoices.length; j++){
            choices1.push(Math.random() >= 0.5)
            choices2.push(Math.random() >= 0.5)
        }
        result.push(new FoodReview(user1,parseInt(100*(1 +Math.random()*4))/100, restaurant, foodList[i], choices1))
        result.push(new FoodReview(user2,parseInt(100*(1 +Math.random()*4))/100, restaurant, foodList[i], choices2))
    }
    return result.sort(compareReviews);
}

function generateFriendFoodReviews(friends, restaurant){
    return [friends, generateFoodReviews(friends, restaurant)];
}


function generateTrendingFoodReviews(restaurant){
    let users = createRandomUsers();
    return generateFoodReviews(users, restaurant);
}

function generateFriendFoodReviews(friends, restaurant){
    return generateFoodReviews(friends, restaurant);
}


function main(){
    //must run this. Reads the textfiles to produce the data. data[0]=Restaurants. data[1]=Foods. data[2]=Ingredients
    let data = createData();
    printData(data[0]);  // data[0]=Restaurants. data[1]=Foods. data[2]=Ingredients


    // search restaurants by some query. Returns array of restaurants matching query.
    let results = search(data[0], "");
    for(let i = 0; i<results.length; i++){
        //console.log(results[i].name);
    }

    //Creates random users to use for the trending page.
    //You most likely will not need this function.
    let users = createRandomUsers(); //Creates random Trending users (not friends). Returns array of Users.
    for(let i = 0; i<users.length; i++){
        //console.log(users[i].name);
    }

    //Generates random Restaurant Reviews for a query. Pass it all restaurants and your query. It returns array of Restaurant Reviews.
    let restaurantReviews = generateTrendingRestaurantReview(data[0], "");
    for (let i =0; i<restaurantReviews.length; i++){ //Returns array of those Reviews sorted by Rating.
        //console.log(restaurantReviews[i].name + ", " + restaurantReviews[i].rating + "/5, " + restaurantReviews[i].restaurant);
    }


    //createFriends will generate the main users friends. Only run this once to have consistent reviews.
    let friends = createFriends();
    //Generates all friend restaurant reviews.
    let friendRestaurantReviews = generateFriendsRestaurantReviews(friends, data[0])[1];
    for (let i =0; i<restaurantReviews.length; i++){
        //console.log(friendRestaurantReviews[i].name + ", " + friendRestaurantReviews[i].rating + "/5, " + friendRestaurantReviews[i].restaurant);
    }


    //Generate food reviews for friends. Pass Friend and Restaurant object.
    let friendReviews = generateFriendFoodReviews(friends, data[0][1]);
    for (let i =0; i<friendReviews.length; i++){ //Returns array of those Reviews sorted by Rating.
        //console.log(friendReviews[i].name + ", " + friendReviews[i].rating + "/5, " + friendReviews[i].restaurant + ", " + friendReviews[i].orderString);
    }


    //Generate Trending Data Reviews. Pass a restaurant object.
    let trendingReviews = generateTrendingFoodReviews(data[0][1]);
    for (let i =0; i<trendingReviews.length; i++){ //Returns array of those Reviews sorted by Rating.
        //console.log(trendingReviews[i].name + ", " + trendingReviews[i].rating + "/5, " + trendingReviews[i].restaurant + ", " + trendingReviews[i].orderString);
    }
    //When trying to create FoodReviews for a specific restaurant you need to link to a specific Restaurant Object.
    //To get such an object, use the search function. search(data[0], "name of restaurant")[0] to get the pointer.
}

main();