var lat = 37.7749;
var long = -122.431297;
var imgList = document.getElementById("images");

function updatePosition(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;

  getstr = "/imageInfo?longitude=" + long.toString() + "&latitude=" + lat.toString();
  $.get(getstr, function (data) {
    for (var i = 0; i < data.businesses.length; i++) {
      let imgUrl = data.businesses[i].image_url;
      let weblink = data.businesses[i].url;
      let storename = data.businesses[i].name;
      imgList.innerHTML += `<li class="center"><div class="img__wrap center"><a href="${weblink}"><img src="${imgUrl}" class="smaller"></a><p class="img__description">${storename}</p></div></li>`
    }
  });
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


});