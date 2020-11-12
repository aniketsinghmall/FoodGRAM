(function(){
    document.getElementById("searchButton").addEventListener("click", searchBox);

})();


async function searchBox(){
    if(!document.getElementById("searchInput")){
        const searchBar = document.createElement("form");
        searchBar.id = "searchBar";
        searchBar.class = "headerButton right";
        const searchButton = document.getElementById("searchButton");
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
        await sleep(500);
        const node = document.getElementById("searchBar");
        node.parentNode.removeChild(document.getElementById("searchBar"));
        
    }

}

function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
 }