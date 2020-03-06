var lat = 37.7749;
var long = -122.431297;
var locInput = document.getElementById("locInput");
var removepad = document.getElementById("removepad");
var term = document.getElementById("term");
var loc = document.getElementsByName("loc");
var openness = document.getElementsByName("open");
var body = document.getElementById("mainBody");

function updatePosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updatePosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
$(document).ready(function () {
    getLocation();

    if (localStorage.getItem("favorites") === null) {
        localStorage.setItem("favorites", JSON.stringify([]));
    }
});

$("input[type=radio][name=loc]").change(function () {
    if (this.value == "other") {
        locInput.style.display = "inline";
        removepad.style.paddingRight = "0";
    } else if (this.value == "this") {
        locInput.style.display = "none";
        removepad.style.paddingRight = "20%";
    }
});

$("#options").submit(function (e) {
    e.preventDefault();
});

term.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        getShops();
    }
});

locInput.addEventListener("keydown", function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        getShops();
    }
});

function getShops() {
    var getstr = "/businessInfo?";
    getstr += "term=" + term.value + "&";
    for (var i = 0; i < loc.length; i++) {
        if (loc[i].checked) {
            if (loc[i].value == "this") {
                getstr +=
                    "longitude=" + long.toString() + "&latitude=" + lat.toString() + "&";
            } else if (loc[i].value == "other") {
                getstr += "location=" + locInput.value + "&";
            }
        }
    }
    var checkCosts = Array.prototype.slice
        .call(document.querySelectorAll(".cost:checked"))
        .map(function (el) {
            return el.value;
        })
        .join(", ");
    if (checkCosts.length == 0) {
        checkCosts = "1,2,3,4";
    }
    getstr += "price=" + checkCosts + "&";
    for (var i = 0; i < openness.length; i++) {
        if (openness[i].checked) {
            if (openness[i].value == "open") {
                getstr += "open_now=true";
            }
        }
    }
    $.get(getstr, function (data) {
        body.innerHTML = data;
        var allRestaraunts = document.getElementsByName("restaurant");
        for (var i = 0; i < allRestaraunts.length; i++) {
            if (inFavorites(JSON.parse($(allRestaraunts[i]).attr("storeinfo")))) {
                allRestaraunts[i].innerHTML = "star";
            }
        }
    });
}

function inFavorites(el) {
    var storedFaves = JSON.parse(localStorage.getItem("favorites"));
    for (var i = 0; i < storedFaves.length; i++) {
        if (storedFaves[i].name == el.name && storedFaves[i].rating == el.rating && storedFaves[i].price == el.price) {
            return true;
        }
    }
    return false;
}

function removeFrom(theList, el) {
    result = theList;
    for (var i = 0; i < theList.length; i++) {
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
    //console.log(JSON.stringify(storedFaves));
}

function showMap() {
    var theMap = document.getElementById("map_div");
    theMap.style.display = "block";
    var mapbtn = document.getElementById("mapbtn");
    mapbtn.style.display = "none";
    var getstr = "/mapInfo?";
    getstr += "term=" + term.value + "&";
    for (var i = 0; i < loc.length; i++) {
        if (loc[i].checked) {
            if (loc[i].value == "this") {
                getstr +=
                    "longitude=" + long.toString() + "&latitude=" + lat.toString() + "&";
            } else if (loc[i].value == "other") {
                getstr += "location=" + locInput.value + "&";
            }
        }
    }
    var checkCosts = Array.prototype.slice
        .call(document.querySelectorAll(".cost:checked"))
        .map(function (el) {
            return el.value;
        })
        .join(", ");
    if (checkCosts.length == 0) {
        checkCosts = "1,2,3,4";
    }
    getstr += "price=" + checkCosts + "&";
    for (var i = 0; i < openness.length; i++) {
        if (openness[i].checked) {
            if (openness[i].value == "open") {
                getstr += "open_now=true";
            }
        }
    }
    $.get(getstr, function (data) {
        var temp = JSON.parse(data);
        var coords = [];
        var links = [];
        var name = [];
        for (var i = 0; i < temp.businesses.length; i++) {
            coords.push({
                lat: temp.businesses[i].coordinates.latitude,
                lng: temp.businesses[i].coordinates.longitude
            });
            links.push(temp.businesses[i].url);
            name.push(temp.businesses[i].name);
        }
        var curLoc = {
            lat: lat,
            lng: long
        };
        geocoder = new google.maps.Geocoder();
        if (document.getElementById("other").checked) {
            geocoder.geocode({
                'address': locInput.value
            }, function (results, status) {
                if (status == 'OK') {
                    curLoc = results[0].geometry.location;
                    var map = new google.maps.Map(
                        document.getElementById('map_div'), {
                            zoom: 12,
                            center: curLoc
                        }
                    );
                    var infowindow = new google.maps.InfoWindow();
                    for (var i = 0; i < coords.length; i++) {
                        var marker = new google.maps.Marker({
                            position: coords[i],
                            map: map,
                            title: name[i]
                        });
                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent(name[i]);
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                    }
                    return;
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            })
        }

        var map = new google.maps.Map(
            document.getElementById('map_div'), {
                zoom: 12,
                center: curLoc
            }
        );
        var infowindow = new google.maps.InfoWindow();
        for (var i = 0; i < coords.length; i++) {
            var marker = new google.maps.Marker({
                position: coords[i],
                map: map,
                title: name[i]
            });
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(name[i]);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }
    });
}