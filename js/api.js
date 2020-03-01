var x = document.getElementById("p1");

x.innerHTML = "test";

var lat = 0;
var long = 0;

function queryAPI() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(search);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function search(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;
  var getstr =
    "/businessInfo?latitude=" +
    lat.toString() +
    "&longitude=" +
    long.toString();
  console.log(getstr);
  $.get("/businessInfo?latitude=38.062144&longitude=-78.5092769", function (
    data
  ) {
    x.innerHTML = data;
  });
}

var y = document.getElementById("loc");