const yelp = require("yelp-fusion");

const apiKey =
  "jnvBl_qSJ0cJxTSy01pcCPEyAYey6gKKO3cSS_7_Ft-d8ObyIfKvxbXRdiBGcFaj9Y60k7Xtz2MyFfymIOaT6tgN1FcBzNbEbd5Zs6c-hD_GjIOB-_RY2WC58LZVXnYx";

const searchRequest = {
  term: "Coffee",
  location: "charlottesville, va"
};

const client = yelp.client(apiKey);

client
  .search(searchRequest)
  .then(response => {
    const firstResult = response.jsonBody.businesses[0];
    const prettyJson = JSON.stringify(firstResult, null, 4);
    document.getElementById("p1").innerHTML = prettyJson;
    console.log(prettyJson);
  })
  .catch(e => {
    console.log(e);
  });
