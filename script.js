//for search
(function(){
    data = createData();
    // console.log(data);
    //document.getElementById("searchButton").addEventListener("click", searchBox);
    document.getElementById("checkoutButton").addEventListener("click", searchResults);
    window.addEventListener("popstate", searchResults());
    document.getElementById("logo").addEventListener("click", goHome);
    
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
    if(urlParams.get("search")){
        const header = document.getElementById("resultsHeader");
        header.innerHTML = "Search results for: "+urlParams.get("search");
        const list = document.getElementById("resultsList");

        const restaurants = search(data[0], urlParams.get("search"));
        if(restaurants.length > 0){
            list.innerHTML = "";
            for(let i = 0; i<restaurants.length; i++){
                list.innerHTML += "<a href = \"#"+ restaurants[i].name +"\">"+ restaurants[i].name+"</a>";
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
