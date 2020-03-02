var shopList = document.getElementById("shopList");

$(document).ready(function () {
    if (localStorage.getItem("favorites") === null || localStorage.getItem("favorites") == "[]") {
        shopList.innerHTML = '<li class="colleciton-item center padsides">You have no favorites! Select them on the search page</li>';
    } else {
        var favorites = JSON.parse(localStorage.getItem("favorites"));
        for (i = 0; i < favorites.length; i++) {
            let name = favorites[i].name;
            let rating = favorites[i].rating;
            let price = favorites[i].price;
            var listhtml = `<li class="collection-item taller">
          <div class="padlessbottom">
            <span class="title">${name}</span>
            <a class="secondary-content favorite">
                <i storeinfo='{"rating":${rating},"price":"${price}","name":"${name}"}'
            onclick="favoriter(this)" class="material-icons favorite">star</i>
            </a>
          </div>
          <div class="addSpace">
            <ul class="resAtt">
              <li>Rating: ${rating}/5</li>
              <li>Price: ${price}</li>
            </ul>
          </div>
        </li>`
            shopList.innerHTML += listhtml;
        }
    }
});

function removeFrom(theList, el) {
    result = theList;
    for (i = 0; i < theList.length; i++) {
        if (theList[i].name == el.name && theList[i].rating == el.rating && theList[i].price == el.price) {
            result.splice(i, 1);
        }
    }
    return result;
}

function favoriter(el) {
    var storedFaves = JSON.parse(localStorage.getItem("favorites"));
    if (el.innerHTML == "star_border") {
        el.innerHTML = "star";
        storedFaves.push(JSON.parse($(el).attr("storeinfo")));
        localStorage.setItem("favorites", JSON.stringify(storedFaves));
    } else {
        el.innerHTML = "star_border";
        storedFaves = removeFrom(storedFaves, JSON.parse($(el).attr("storeinfo")));
        localStorage.setItem("favorites", JSON.stringify(storedFaves));
    }
}