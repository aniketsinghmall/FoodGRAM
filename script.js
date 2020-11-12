(function(){
    document.getElementById("searchButton").addEventListener("click", searchBox);
    document.getElementById("checkoutButton").addEventListener("click", checkoutDropDown);

})();


async function searchBox(){
    if(!document.getElementById("searchInput")){
        const searchBar = document.createElement("form");
        searchBar.id = "searchBar";
        searchBar.class = "headerButton right";
        document.getElementById("headerButtons").appendChild(searchBar);
        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.id = "searchInput";
        inputBox.class = "headerButton right";
        searchBar.appendChild(inputBox);
        inputBox.style = "width:300px";
    }
    else{
        //document.getElementById("searchBar").removeChild("searchInput");
        document.getElementById("searchInput").style = "animation-name:searchClose";
        await sleep(250);
        const node = document.getElementById("searchBar");
        node.parentNode.removeChild(document.getElementById("searchBar"));
        
    }

}

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