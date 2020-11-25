let currRestaurant=-1, currMenuItem=-1;
let cartContents = [];
let windowLocationSearch;

(function(){
    data = createData();
    document.getElementById("checkoutButton").addEventListener("click", checkoutDropDown);
    window.addEventListener("popstate", searchResults());
    document.getElementById("logo").addEventListener("click", goHome);
})();

async function checkoutDropDown(){
    cartContents = JSON.parse(window.localStorage.getItem("cartContents"));
    if(!document.getElementById("proceedCheckout")){
        const dropDown = document.createElement("div");
        dropDown.id = "checkoutDropDown";
        dropDown.class = "headerButton right";
        document.getElementById("headerButtons").appendChild(dropDown);
        let cartItem;
        let totalPrice = 0;
        let list = document.createElement("ul");
        list.style= "overflow:scroll; height:66%; list-style-type: square;"
        dropDown.appendChild(list);
        for(let i = 0; i<cartContents.length; i++){
            cartItem = document.createElement("li");
            cartItem.className = "checkoutItem";
            cartItem.innerHTML = cartContents[i].foodItem.name + "<br> <div style=\"padding-left:20px;\">- $" + cartContents[i].foodItem.price+"</div>";
            list.appendChild(cartItem);
            totalPrice += parseFloat(cartContents[i].foodItem.price);
        }
        let line = document.createElement("hr");
        line.style = "position:absolute; bottom:125px; left:0px; right:0px; background-color: rgb(35, 35, 35); height: 20px; padding-left:0px; padding-right:30px; z-index: 11; border-color:rgba(0,0,0,0);";
        dropDown.appendChild(line);
        line = document.createElement("hr");
        line.style = "position:absolute; bottom:135px; left:0px; right:0px; background-color: #03DAC5; height: 3px; padding-left:0px; padding-right:30px; z-index: 12;";
        dropDown.appendChild(line);
        cartItem = document.createElement("div");
        cartItem.innerHTML = "Total price: $"+totalPrice.toFixed(2);
        cartItem.style = "position:absolute; bottom:110px; left:10px; right:10px; font-family:Arial;";
        dropDown.appendChild(cartItem);
        const checkout = document.createElement("button");
        checkout.id = "proceedCheckout";
        checkout.innerHTML = "Proceed to Checkout";
        checkout.addEventListener("click", proceedToCheckout);
        dropDown.appendChild(checkout);
        await sleep(230);

        checkout.style = "font-size:20px";

    }
    else{
        document.getElementById("proceedCheckout").style = "animation-name:proceedClose";
        document.getElementById("checkoutDropDown").style = "animation-name:checkoutClose";
        await sleep(230);
        document.getElementById("checkoutDropDown").parentNode.removeChild(document.getElementById("checkoutDropDown"));
    }
}

async function proceedToCheckout(){
    document.getElementById('cart').style.display='block';
    document.getElementById("proceedCheckout").style = "animation-name:proceedClose";
    document.getElementById("checkoutDropDown").style = "animation-name:checkoutClose";
    await sleep(230);
    document.getElementById("checkoutDropDown").parentNode.removeChild(document.getElementById("checkoutDropDown"));
}

function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

function searchResults(){
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get("search")){ //they searched
        const header = document.getElementById("resultsHeader");
        header.innerHTML = "Search results for: "+urlParams.get("search");
        const list = document.getElementById("resultsList");

        const restaurants = search(data[0], urlParams.get("search"));
        if(restaurants.length > 0){
            list.innerHTML = "";
            for(let i = 0; i<restaurants.length; i++){
                let s = "<button id = \""+restaurants[i].name+"\" onclick=\"(function(){window.location.search='restaurant='+`"+restaurants[i].name+"`;})();\">"+restaurants[i].name+"</button>";
                list.innerHTML += s;
                
            }
        }
        else{
            list.innerHTML = "<h2>No results found</h2>"
            list.innerHTML += "<img src = plate.png style = \"width:50%; height: 50%; margin: auto; display:block; float:none\">";
        }
    }
    else if(urlParams.get("restaurant")){  //restaurant page, get food items.
        const restaurantName = decodeURIComponent(urlParams.get("restaurant"));
        const header = document.getElementById("resultsHeader")
        header.innerHTML = restaurantName + " Menu";
        const list = document.getElementById("resultsList");
        for(let i = 0; i<data[0].length; i++){
            if(data[0][i].name == restaurantName){
                list.innerHTML = "";
                for(let j = 0; j<data[0][i].foodItems.length; j++){
                    let fn = "onclick=\"(function(){"+
                        "ingredients("+i+", "+j+");"+ 
                    "})();\"";
                    let s = "<button "+fn+">"+data[0][i].foodItems[j].name+" - $"+ data[0][i].foodItems[j].price+"</button> \n<form class = \"ingredients\" id = \""+"restaurant"+i+"menuItem"+j+"\"></form>";
                    list.innerHTML += s;
                }
            }
        }
    }
    else if(urlParams.get("search") === null){ //opening the page first itme.
        const header = document.getElementById("resultsHeader");
        header.innerHTML = "Popular Restaurants ";
        const list = document.getElementById("resultsList");

        const restaurants = search(data[0], "");
        if(restaurants.length > 0){
            list.innerHTML = "";
            for(let i = 0; i<restaurants.length; i++){
                let s = "<button id = \""+restaurants[i].name+"\" onclick=\"(function(){window.location.search='restaurant='+`"+restaurants[i].name+"`;})();\">"+restaurants[i].name+"</button>";
                list.innerHTML += s;

            }
        }
        else{
            list.innerHTML = "<h2>No results found</h2>"
            list.innerHTML += "<img src = plate.png style = \"width:50%; height: 50%; margin: auto; display:block; float:none\">";
        }
    }
}

function goHome(){

    window.location.search = "";
}

function ingredients(restaurant, menuItem){
    windowLocationSearch = window.location.search;
    document.getElementById('foodPopup').style.display = "block";
    document.getElementById('FoodName').innerText = data[0][restaurant].foodItems[menuItem].name;
    document.getElementById('FoodDesc').innerText = "\"" + data[0][restaurant].foodItems[menuItem].description + "\"";
    document.getElementById("IngredientList").innerHTML = "";

    for(let i = 0; i<data[0][restaurant].foodItems[menuItem].ingredients.length; i++){
        let helper;
        if(i%2 === 0)
            helper = "\"IngredientRow1\"";
        else
            helper = "\"IngredientRow2\"";
        let theOnPressFunction = "onclick=\"document.getElementById('checkBoxRestaurant"+restaurant+"menuItem"+menuItem+"ingredient"+i+"').checked = "+
            "!document.getElementById('checkBoxRestaurant"+restaurant+"menuItem"+menuItem+"ingredient"+i+"').checked;\"";
        document.getElementById("IngredientList").innerHTML += "<li " + theOnPressFunction + " class = "+ helper +" style=\"display: block\"><input id = \"checkBoxRestaurant"+restaurant+"menuItem"+menuItem+"ingredient"+i+"\" " +
            "type = \"checkbox\" class=\"checkItem\" name=\"restaurant"+restaurant+"menuItem"+menuItem+"ingredient"+i+"\">"+"<label class = \"checkText\" for=\"restaurant"+restaurant+"menuItem"+menuItem+"ingredient"+i+"\">"+
            data[0][restaurant].foodItems[menuItem].ingredients[i].name+"</label></li>";
    }
    // document.getElementById("IngredientList").innerHTML += "<li><input type=\"button\" class=\"AddToCart\" onclick=\"addToCart();\" style=\"background-color:#03DAC5; " +
    //    "width:25%; text-align:center; height: 15%; padding: 5px; margin-left: 100px; margin-top: 10px; font-size: 30px; color: black; border-color: black; border-radius: 15px\" value=\"Add to cart\"></li>"


    document.getElementById("IngredientList").innerHTML += "</ul>";
    currRestaurant = restaurant;
    currMenuItem = menuItem;
}

function addToCart(){
    let customization = [];
    for(let i = 0; i<data[0][currRestaurant].foodItems[currMenuItem].ingredients.length; i++){
        customization.push(document.getElementById("checkBoxRestaurant"+currRestaurant+"menuItem"+currMenuItem+"ingredient"+i).checked);
    }
    cartContents.push(new Recipe(data[0][currRestaurant].foodItems[currMenuItem], customization));
    ingredients(currRestaurant, currMenuItem);
    localStorage.setItem("cartContents", JSON.stringify(cartContents));
}
