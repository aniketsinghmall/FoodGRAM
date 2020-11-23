let currRestaurant=-1, currMenuItem=-1;

(function(){
    data = createData();
    document.getElementById("checkoutButton").addEventListener("click", checkoutDropDown);
    window.addEventListener("popstate", searchResults());
    document.getElementById("logo").addEventListener("click", goHome);
    window.addEventListener("hashchange", restaurantSelected);
    
})();

async function checkoutDropDown(){
    if(!document.getElementById("proceedCheckout")){
        const dropDown = document.createElement("div");
        dropDown.id = "checkoutDropDown";
        dropDown.class = "headerButton right";
        document.getElementById("headerButtons").appendChild(dropDown);
        const checkout = document.createElement("button");
        checkout.id = "proceedCheckout";
        checkout.innerHTML = "Proceed to Checkout";
        checkout.addEventListener("click", function(){window.location.href = "checkout.html";});
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
            for(let i = 0; i<restaurants.length; i++){
                //document.getElementById(restaurants[i].name).addEventListener("click", );
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
                    let s = "<button "+fn+">"+data[0][i].foodItems[j].name+"</button> \n<form class = \"ingredients\" id = \""+"restaurant"+i+"menuItem"+j+"\"></form>";
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

    if(document.getElementById("restaurant"+restaurant+"menuItem"+menuItem).innerHTML == ""){
        
        document.getElementById("restaurant"+restaurant+"menuItem"+menuItem).innerHTML = "<ul style=\"width: 0%;\">";
        for(let i = 0; i<data[0][restaurant].foodItems[menuItem].ingredients.length; i++){
            document.getElementById("restaurant"+restaurant+"menuItem"+menuItem).innerHTML += "<li><input type = \"checkbox\" name=\"restaurant"+restaurant+"menuItem"+menuItem+"ingredient"+i+"\">"+
                                                                                                "<label for=\"restaurant"+restaurant+"menuItem"+menuItem+"ingredient"+i+"\">"+
                                                                                                data[0][restaurant].foodItems[menuItem].ingredients[i].name+
                                                                                                "</label></li>";
        }
        document.getElementById("restaurant"+restaurant+"menuItem"+menuItem).innerHTML += "<li><button class=\"AddToCart\" style=\"background-color:#03DAC5; width:25%; text-align:center; height: 15%; padding: 5px; margin-left: 100px; font-size: 30px; color: black; border-color: black;\">Add to Cart</button></li>"
        document.getElementById("restaurant"+restaurant+"menuItem"+menuItem).innerHTML += "</ul>";
        if(currRestaurant != -1 && currMenuItem != -1)
            document.getElementById("restaurant"+currRestaurant+"menuItem"+currMenuItem).innerHTML="";
        currRestaurant = restaurant;
        currMenuItem = menuItem;
    }
    else{
        document.getElementById("restaurant"+restaurant+"menuItem"+menuItem).innerHTML="";
        currRestaurant = -1;
        currMenuItem = -1;
    }
}



