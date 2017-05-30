var displayData = {
  city: document.querySelector("#city"),
  temperature: document.querySelector("#temperature"),
  weather: document.querySelector("#weather"),
  icon: document.querySelector("#icon"),
  source: document.querySelector("#source")
  };

function getWeather(latitude, longitude) {
  if (window.XMLHttpRequest){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function(){
      var response = JSON.parse(xhr.responseText);
      displayData.city.innerHTML = response.city.name;
      var tempArr = [];
      for(var i=0; i < response.list.length/2; i++){
        var elem = response.list[i];
        var detailWeather = response.list[i].weather[0];
        var description = detailWeather.description;

        var descriptionIcon = "http://openweathermap.org/img/w/" + detailWeather.icon + ".png";
        displayData.temperature.innerHTML+= "<td>"+elem.dt_txt+"</td><td>"+elem.main.temp+"<sup>o</sup>C</td><td>"+description+"<img src='"+descriptionIcon+"'/></td>";
        
      }
      flickrLoad(latitude, longitude, description);
    }, false);

    xhr.addEventListener("error", function(err){
      alert("Initial request error");
      }, false);

    var target = "http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=d0cdf185380e8b72b0a1f3bc234e2941&units=metric" ;

  xhr.open("GET", target, true);
  xhr.send();
  } else {
    alert("Initial XMLHttpRequest");
  }
}


function flickrLoad(latitude, longitude, description){
    var searchDesc, splitDesc;
    splitDesc = description.split(" ");
    searchDesc = splitDesc.slice(-1)[0];
    console.log(searchDesc);

    if (window.XMLHttpRequest){
    var body = document.getElementsByTagName('body')[0];
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function(){
        var response = xhr;
        var fullText = response.responseText;
        console.log(response);
        var segment = (fullText.slice(14, -14)) + "}";
        var fullJSON = JSON.parse(segment);
        var imgURL = fullJSON.photos.photo[0].url_l;
        var img = new Image();
        img.src = imgURL;
	body.style.background = 'url(' + imgURL + ') no-repeat center center fixed';
        //body.style.backgroundImage = 'url(' + imgURL + ')';

    }, false);
    xhr.open("GET", "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=bb0aa3f100a726b84f80cb8375f71c78&lat=" + latitude + "&lon=" + longitude + "&accuracy=1&tags=" + searchDesc + "&sort=relevance&extras=url_l&format=json", true);
    xhr.send();
}}


function findIP(){
  if (window.XMLHttpRequest){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function(){
        var response = JSON.parse(xhr.responseText);
        console.log(response.lat, response.lon);
        getWeather(response.lat, response.lon);
        displayData.source.innerHTML = "From: " + response.query;
    }, false);
    xhr.open("GET", "http://ip-api.com/json", true);
    xhr.send();
}}

findIP();
