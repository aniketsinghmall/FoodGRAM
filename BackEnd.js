//CV - Let me know if there are any problems with the code.

"use strict";

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


function testCode(){
    //must run this. Reads the textfiles to produce the data. data[0]=Restaurants. data[1]=Foods. data[2]=Ingredients
    let data = createData();
    //printData(data[0]);  // data[0]=Restaurants. data[1]=Foods. data[2]=Ingredients


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
    for (let i =0; i<friendRestaurantReviews.length; i++){
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


function main(){
    //must run this. Reads the textfiles to produce the data. data[0]=Restaurants. data[1]=Foods. data[2]=Ingredients
    return createData();
}

let myfriends = createFriends();
//displayReviews();

let data=createData();
let friends=createFriends()



function displayRestaurantReviews() {
    let results = generateFriendsRestaurantReviews(friends, data[0])[1];
    for (let i = 0; i < results.length; i++) {
        let btn = document.createElement("BUTTON");
        btn.value = "im a button";
        //btn.onclick = func;
        btn.innerHTML = results[i].name + "\n" + results[i].rating + "/5\n" + results[i].restaurant;
        document.getElementById("RestaurantReviews").appendChild(btn);
    }
}



function getRestaurantText(){
    let string1 = "Aniket's Iced Chowder Cafe(Frozen Clam Chowder, Frozen Lamb Chowder, Lukewarm Potato Chowder, Scolding Hot Cheese Chowder)\n" +
    "Banana Boat Ice Cream(Banana Split, Chocolate Banana Softserve, Vanilla Banana Softserve, Chunky Monkey, Coke-Float)\n" +
    "Bob's Burgers(The Original Burger, Don't You Four Cheddar Bout Me, Sweet Home Avocado, Eggers Can't Be Cheesers, Gourdon Hamsy)\n" +
    "Boston Pizza(Fried Wings, Quesadillas, Chicken Sandwich, The Big Dipper, Tacos)\n" +
    "Christophers Chunky Cheeses(Chunk o' Cheddar, Bowl o' Brie, Fist o' Feta, A-ton o' Asiago, Aged Crackers)\n" +
    "Frozen Banana Stand(Original Frozen Banana, On the Go-Go Banana, Double Diped Frozen, Giddy-Girly Banana, George Daddy, Simple Simon)\n" +
    "Good Burger(Good Burger, Good Fries, Good Shake, Good Pickle, Double Good Burger)\n" +
    "Gusteau's(Grilled Steak, Ratatouille, Roasted Cod Fish, Chocolate Mousse, Apple Tart, Tiramisu)\n" +
    "Jack Rabbit Slims(MilkShake, Foie and Loathing in Las VeGras, Honey I Shrunk The Soup, Blueberry Pie)\n" +
    "Krusty Krab(Krabby Patty, Double Krabby Patty, Triple Krabby Patty, Coral bits, Kelp Rings)\n" +
    "Los Pollos Hermanos(Gus' World Famous Chicken, The Heisenberg Special, Fajitas, Gales Gordita, Jesse's Tasty Tacos)\n" +
    "Mamma Mia's Pizzaria(Mia's Famous Fettuccini Alfredo, Mia's Manicotti, Mia's Rigatoni, Mia's Meaty Pizzaroni)\n" +
    "Matthias' Burger Stank Shack(Matty's Big Ol' Cheeseburger, MeeMaw's Famous Burger Slider, Matt's Curly Fries, Matt's Musk Burger)\n" +
    "MilkTheCow(Chai Tea, Green Tea, Coffee, Iced Tea, Cappuccino, Americano, Latte, Espresso)\n" +
    "Paunch Burger(The Ron Swanson Supreme, The Meat Tornado, The Heart Attack, Gravy Bucket, The Artery Clogger)\n" +
    "Pauls \"Pizza\"(\"Pepperoni\" \"Pizza\", \"Sprite\", \"Pizza\" On A \"Stick\")\n" +
    "Piece a da Pizza(Pizza Your Heart, Slice To Meat You, Can't Be Topped, Slice Slice Baby)\n" +
    "Pizza Party(Party Pizza for 8, Jumbo Party Pizza for 10, Sad Lonely Pizza for One)\n" +
    "Ryan's Great Gazpacho Emporium(Green Grape and Cucumber Gazpacho, Red Pepper Gazpacho, Butter Gazpacho, Yogurt Gazpacho)\n" +
    "Sous Sol(Warm Olives, Cheese Plate, Vegan \"Tartare\", Braised Beef Short Rib, Duck Leg Confit, Manitoba Arctic Char, Flourless Chocolate Cake, House Made Ice Cream)\n" +
    "529 Wellington(Chicken Breast, Jumbo Prawns, Caesar Salad, Carved Prime Beef, 8 oz. Beef Tenderloin, 12 oz. Beef Tenderloin, 14 oz. New York Steak, 14 oz. Rib Eye)";
    return string1; 
}

function getFoodText(){
    let string2 = "Gus' World Famous Chicken:5.38:Main:Delicious Fried Chicken Cooked Perfectly By Gus.:Extra Gus Sauce, BBQ Sauce Dip, Ketchup Dip:\n" +
    "The Heisenberg Special:50.00:Main:A Special Concoction made by one of our Cooks. We'd tell you whats in it, but then we'd have to kill you.:Extra Methylamene, Chili Powder:\n" +
    "Fajitas:8.18:Main:Spicy and Declicious ABQ Fajitas.:Lettuce, Tomatoes, Onions, Peppers, Guacamole:\n" +
    "Gales Gordita:3.91:Main:A Mouth Watering Pastry cooked perfectly by our renownend cook Gale.:Extra Gus Sauce:\n" +
    "Jesse's Tasty Tacos:4.01:Main:Three Tacos, with a little extra Chippy Powder on all of them.:Lettuce, Tomatoes, Onions, Guacamole, Spicy Sauce:\n" +
    "Good Burger:5.07:Main:The Best Burger in Town. Comes with extra Good Sauce.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Cheddar, Extra Good Sauce:\n" +
    "Good Fries:2.03:Main:The Best Fries in Town, Comes fried in Good Sauce.:Extra Salt, Buttered Fries, Ketchup:\n" +
    "Good Shake:4.85:Main:The Best Vanilla Shake In Town. Comes with Good Sauce on top.:Chocolate Sauce, Bananas, Cherries:\n" +
    "Good Pickle:5.62:Dessert:Our World Famous Good Pickles, Brined to Pickley perfection in Good Sauce.:Extra Good Sauce:\n" +
    "Double Good Burger:8.85:Main:Its like a Good Burger, but twice as Good (Double Patty).:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Cheddar, Extra Good Sauce:\n" +
    "Cheeseburger:15.32:Main:A Classic Cheeseburger.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo:\n" +
    "French Fries:6.32:Main:Delicious classic french fries, nothing special here!:Extra Salt, Buttered Fries, Ketchup:\n" +
    "Hot Dog:5.33:Main:A classic hotdog.:Ketchup, Mustard, Onions, Relish:\n" +
    "Jumbo Dog:7.31:Main:A classic jumbodog, its like a hotdog but bigger!:Ketchup, Mustard, Onions, Relish:\n" +
    "Krabby Patty:4.25:Main:Our Ocean Famous Burger. Comes with Secret Sauce.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Cheddar, Extra Secret Sauce:\n" +
    "Double Krabby Patty:6.50:Main:A Krabby Patty with an Extra Patty.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo,  Cheddar, Extra Secret Sauce:\n" +
    "Triple Krabby Patty:8.95:Main:A Double Krabby Patty with 1.5x the Patty.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo,  Cheddar, Extra Secret Sauce:\n" +
    "Coral bits:2.41:Appetizer:Fresh Coral Grilled To Perfection.:\n" +
    "Kelp Rings:5.97:Main:Deep Fried Kelp shaped into a ring. Good for the soul, bad for the arteries.:\n" +
    "The Original Burger:6.15:Main:There can only be one original. Bob's Best Burger with our Secret Sauce.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Cheddar, Extra Bob Sauce:\n" +
    "Don't You Four Cheddar Bout Me:5.93:Main:A Delicious Cheese Burger with Aged Cheddar.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Extra Bob Sauce:\n" +
    "Sweet Home Avocado:6.46:Main:A Tasty Burger Topped with A Smathering Of Avacado.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Mayo, Cheddar, Extra Avacado, Extra Bob Sauce:\n" +
    "Eggers Can't Be Cheesers:9.69:Main:Cheeseburger with an egg on it. Sweet livin'.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Cheddar, Mayo, Extra Bob Sauce:\n" +
    "Gourdon Hamsy:7.82:Main:Served with Squash and Ham. Brought Tears To Gordon Ramsay's Eyes.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Cheddar, Mayo, Extra Ham, Extra Bob Sauce:\n" +
    "French Fries:6.32:Main:Delicious classic french fries, nothing special here!:Extra Salt, Buttered Fries, Ketchup:\n" +
    "Hot Dog:5.33:Main:A classic Hotdog.:Ketchup, Mustard, Onions, Relish:\n" +
    "Jumbo Dog:7.31:Main:A classic Jumbodog, its like a Hotdog but bigger!:Ketchup, Mustard, Onions, Relish:\n" +
    "The Ron Swanson Supreme:7.65:Main:Quadruple Burger, hold the veggies.:Extra Meat, Additional Protein, Extra Perservatives:\n" +
    "The Meat Tornado:10.35:Main:Assorted Meats, Guranteed to Give you the Meat Sweats.:Extra Meat, Additional Protein, Extra Perservatives:\n" +
    "The Heart Attack:4.91:Main:Onion Loaf. Comes with a waiver you need to sign before eating it.:Extra Meat, Additional Protein, Extra Perservatives, Extra lard:\n" +
    "Gravy Bucket:7.23:Main:It's a Bucket o' Gravy. Simple as that.:Additional Protein:\n" +
    "The Artery Clogger:15.35:Appetizer:Assorted Meats and Graveys. Just one person has finished the meal in its entirity, but many have died trying.:Extra Meat, Additional Protein, Extra Perservatives:\n" +
    "Matty's Big Ol' Cheeseburger:6.35:Main:Extra Large Cheeseburger. Cooked by North-West St. Vital's fifth best Fry Cook.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Cheddar, Mayo:\n" +
    "MeeMaw's Famous Burger Slider:1.81:Main:Extra Small Cheeseburger. Cooked by the Mother of North-West St. Vital's fifth best Fry Cook.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Cheddar, Mayo:\n" +
    "Matt's Curly Fries:1.21:Main:Like normal fries but all bendy.:Extra Salt, Buttered Fries, Ketchup:\n" +
    "Matt's Musk Burger:6.36:Main:Matty's Big Ol' Cheeseburger with extra Musk Sauce.:Tomatoes, Ketchup, Mustard, Pickles, Onions, Cheddar, Mayo:\n" +
    "French Fries:6.32:Main:Delicious classic french fries, nothing special here!:Extra Salt, Buttered Fries, Ketchup:\n" +
    "Fried Wings:4.98:Main:Delicious Fried Wings.:Spicy Dip, Medium Dip, Cool Dip, Ranch Dip:\n" +
    "Quesadillas:5.1:Main:Our Famous Quesadillas. You're going to love them.:Lettuce, Tomatoes, Onions, Peppers, Guacamole:\n" +
    "Chicken Sandwich:6.81:Main:Our Chicken Sandwhich was perfected through iterative design.:Lettuce, Tomatoes, Guacamole:\n" +
    "The Big Dipper:7.41:Main:It's astronomically good.:Lettuce, Ketchup, Mustard, Tomatoes, Spicy Sauce, Peppers, Guacamole:\n" +
    "Tacos:4.36:Main:Our crunchy beef tacos, they are a classic.:Lettuce, Tomatoes, Onions, Guacamole, Spicy Sauce:\n" +
    "Olive Lovers Pizza:18.51:Main:Pizza which comes with extra olives!:Green Olives, Black Olives, Extra Cheese:\n" +
    "Margarita Pizza:16.42:Main:A classic style margarita pizza.:Extra Cheese, Extra Basil, Extra Tomatoes:\n" +
    "Meat Lovers:22.53:Main:A classic style meat pizza, comes with extra pepperoni and sasauge.:Extra Bacon, Extra Pepperoni, Extra Sasauge:\n" +
    "Party Pizza for 8:27.69:Main:A comically large Pizza designed to perfectly fill the bellies of 8 people.:Ham, Pineapple, Bacon, Pepperoni, Sasauge, Extra Cheese, Chicken, Ranch:\n" +
    "Jumbo Party Pizza for 10:35.54:Main:An EXTRA large pizza for 10 people.:Ham, Pineapple, Bacon, Pepperoni, Sasauge, Extra Cheese, Ham, Chicken, Ranch:\n" +
    "Sad Lonely Pizza for One:4.24:Main:A sad pizza designed perfectly for one person to consume in its entirity.:Ham, Pineapple, Bacon, Pepperoni, Sasauge, Extra Cheese, Chicken, Ranch:\n" +
    "\"Pepperoni\" \"Pizza\":4.8:Main:A secret \"recipe\" using some \"Pepperoni\".:Extra Dough, Extra Sauce:\n" +
    "\"Sprite\":6.88:Drink:The world famous \"drink\", known to some as \"Sprite\".:Extra Sprite:\n" +
    "\"Pizza\" On A \"Stick\":7.44:Main:It's the deliciousness of pizzas combined with the class and convinience of food on a stick.:Pepperoni, Ham, Oak Wood Stick:\n" +
    "Pizza Your Heart:13.21:Main:It is so good that it will fill your belly AND your heart. Comes with our delicious pizza sauce.:Ham, Pineapple, Bacon, Pepperoni, Sasauge, Extra Cheese, Chicken, Ranch:\n" +
    "Slice To Meat You:12.63:Main:A delicious pizza topped in slices of ham.:Extra Ham, Pineapple, Bacon, Pepperoni, Sasauge, Extra Cheese, Ham, Chicken, Ranch:\n" +
    "Can't Be Topped:18.33:Main:An Extra Large Cheese Pizza topped by Extra Small Pizzas.:Ham, Pineapple, Bacon, Pepperoni, Sasauge, Extra Cheese, Chicken, Ranch:\n" +
    "Slice Slice Baby:13.96:Main:Cold Pizza, toppings of your choice.:Ham, Pineapple, Bacon, Pepperoni, Sasauge, Extra Cheese, Chicken, Ranch:\n" +
    "Mia's Famous Fettuccini Alfredo:6.04:Main:A creamy and delicious pasta coming from Mamma Mia!:Extra Alfredo Sauce:\n" +
    "Mia's Manicotti:4.68:Main:A zesty Manicotti served hot and ready from Mamma Mia!:Tomato Sauce:\n" +
    "Mia's Rigatoni:7.04:Main:A perfectly cooked Rigatoni, world famous, coming straight from Mamma Mia's oven!:Tomato Sauce:\n" +
    "Mia's Meaty Pizzaroni:3.86:Main:Mamma Mia's hidden recipe, hint(its a pizza + a rigatoni!):Tomato Sauce, Pepperoni:\n" +
    "Grilled Steak:12.33:Main:Cooked Medium Rare, don't like your steaks medium rare? Eat somewhere else.:Buttered, Bacon-wrapped:\n" +
    "Ratatouille:9.96:Main:Cooked by our famous Chef, Remy.:Make It Large:\n" +
    "Roasted Cod Fish:14.85:Main:A roasted fresh cod fish. Perfectly cooked and seasoned.:Asparagus, Additional Sauce:\n" +
    "Chocolate Mousse:11.62:Dessert:Delicious, velvety, chocolate. A greaty way to end a meal.:Make It Large:\n" +
    "Apple Tart:7.99:Dessert:Delicious, perfectly baked apple tart.:Make It Large:\n" +
    "Tiramisu:6.15:Dessert:A classic dessert done right.:Make It Large:\n" +
    "MilkShake:5.00:Drink:Tastes as good as a Five Dollar Milkshake should.:Chocolate Sauce, Bananas, Cherries:\n" +
    "Foie and Loathing in Las VeGras:6.19:Main:Delicious Foie Gras.:Make It Large:\n" +
    "Honey I Shrunk The Soup:7:Main:Our famous cream soup.:Make It Spicy:\n" +
    "Blueberry Pie:7.1:Dessert:A slice of delicious blueberry pie.:Make It Large:\n" +
    "Chicken Breast:5.35:Main:Perfectly cooked portuguese chicken breast, comes with rice and a potato (as do most portuguese foods).:Extra Potato, Extra Rice, Spicy Chicken:\n" +
    "Jumbo Prawns:9.75:Main:Jumbo prawns which come with our delcious prawn sauce.:Extra Sauce:\n" +
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
    "Frozen Clam Chowder:8.15:Main:Frozen Clam Chowder Popsicle. It's trendy. Reheat at your own convinience.:Make It Large:\n" +
    "Frozen Lamb Chowder:8.15:Main:Frozen Lamb Chowder Popsicle. It's trendy. Reheat at your own convinience.:Make It Large:\n" +
    "Lukewarm Potato Chowder:6.92:Main:Lukewarm Potato Chowder. Our famous recipe. Pairs well with Scolding Hot Cheese Chowder.:Large Bowl, Peppers, Spicy:\n" +
    "Scolding Hot Cheese Chowder:6.57:Main:A delicious Hot Cheese Chowder! Let it cool before sipping. Pairs well with Lukewarm Potato Chowder.:Large Bowl, Peppers, Spicy:\n" +
    "Original Frozen Banana:1.00:Dessert:Its a frozen banana!:Whipped Cream, Chocolate Chips, Caramel, On A Stick:\n" +
    "On the Go-Go Banana:1.01:Dessert:Frozen banana for those on the go!:Whipped Cream, Chocolate Chips, Caramel, On A Stick:\n" +
    "Double Diped Frozen:1.50:Dessert:Frozen banana double dipped in our banana sauce!:Whipped Cream, Chocolate Chips, Caramel, On A Stick:\n" +
    "Giddy-Girly Banana:0.99:Dessert:Frozen banana topped with fruitberries.:Whipped Cream, Chocolate Chips, Caramel, On A Stick:\n" +
    "George Daddy:2.00:Dessert:Three Frozen Bananas, for the price of two!:Whipped Cream, Chocolate Chips, Caramel, On A Stick:\n" +
    "Simple Simon:0.50:Dessert:A normal, non frozen banana.:With Peel:\n" +
    "Chai Tea:4.29:Drink:A tasty tea to warm your soul.:Strong:\n" +
    "Green Tea:4.26:Drink:A tasty tea to warm your soul.:Strong:\n" +
    "Coffee:6.66:Drink:A perfectly brewed coffee to fuel your work.:Strong:\n" +
    "Iced Tea:3.71:Drink:American Iced Tea perfect for drinking under the hot sun.:Strong:\n" +
    "Cappuccino:6.17:Drink:Comes with cappuccino art on top!:Strong:\n" +
    "Americano:5.76:Drink:Brewed to perfection.:Strong:\n" +
    "Latte:6.52:Drink:Espresso and steamed milk. Simple and delicious.:Strong:\n" +
    "Espresso:5.34:Drink:Nobody really likes actually likes espresso, but we get it, you need the caffeine.:Strong:\n" +
    "Banana Split:3.05:Dessert:Bananas and ice cream, could you really ask for more?:Whipped Cream, Chocolate Sauce, Strawberries, Caramel:\n" +
    "Chocolate Banana Softserve:5.50:Dessert:Bananas and chocolate icecream. Delicious.:Whipped Cream, Chocolate Sauce:\n" +
    "Vanilla Banana Softserve:5.50:Dessert:Banans and vanilla icecream. Fantastic.:Whipped Cream, Chocolate Sauce:\n" +
    "Chunky Monkey:8.45:Dessert:Chocolate chunks, ice cream and love!:Whipped Cream, Chocolate Sauce, Strawberries, Banana, Caramel:\n" +
    "Coke-Float:6.68:Drink:Coke and vanilla ice cream. Its foamy!:Make It Large:\n" +
    "Chunk o' Cheddar:34.52:Main:Big Chunk of Cheddar Cheese. For Cheese Lovers, by Cheese Lovers.:Aged:\n" +
    "Bowl o' Brie:34.22:Main:Big Bag of Brie. For Cheese Lovers, by Cheese Lovers.:Aged:\n" +
    "Fist o' Feta:34.63:Main:Big Fist Full of Feta Cheese. For Cheese Lovers, by Cheese Lovers.:Aged:\n" +
    "A-ton o' Asiago:32.11:Main:A ton (metaphorically) of Asiago Cheese. For Cheese Lovers, by Cheese Lovers.:Aged:\n" +
    "Aged Crackers:4.33:Appetizer:Air Aged, delicious whole wheat crackers to pair with one of our cheeses.:Salted:";
    return string2;
}


main();

/*
export = Restaurant;
module.exports = FoodItem;
module.exports = Recipe;
module.exports = Ingredient;
module.exports = User;
module.exports = Friend;
module.exports = RestaurantReview;
module.exports = FoodReview;
*/