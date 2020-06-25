var searchBtn = $("#searchBtn");
var searchDisplay = $(".searchDisplay");
var searchInput = $("#searchInput");
var apiKey = "&appid=e21226f283ae95c0b00c1b133834dc05";
var units = "&units=imperial";

//When Search Button is clicked, new city button is added to page
searchBtn.on("click", function(){
    event.preventDefault();
    var cityBtn = $("<button>");
    cityBtn.text(searchInput.val());
    searchDisplay.prepend(cityBtn);
    getWeather(searchInput.val());
})



// $(".cityBtn").on("click", function(){
//     cityName = $(this).val();
//     console.log(cityName);
// })

function getWeather(cityName){
   var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + units + apiKey;
   $.ajax({
       url: queryUrl,
       method: "GET"
   }).then(function(response){
        console.log(response);
        $("#cityHeader").text(cityName + " " + (new Date().toLocaleDateString()));
        $("#todayTemp").text((response.main.temp) + "℉");
        //update humidity 
        //update windspeed
        //add weather icon to header

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        console.log(lat);
        console.log(lon);
        getUVIndex(lat,lon);
        fiveDay(cityName);

   }
   )}

function fiveDay(cityName){
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + units + apiKey;
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        console.log(response)
        // debugger;
        var dayCounter = 1;
        for(let i = 3;i<response.list.length;i+=8){
            // debugger;
            console.log(response.list[i].dt_txt);
            var formatedDate = new Date(response.list[i].dt_txt).toLocaleDateString();
            var cardDate = $("<h4>");
            cardDate.text(formatedDate);
            $("#day" + dayCounter).append(cardDate);
            var dayIcon = iconGenerator(response.list[i].weather[0].icon);
            $("#day" + dayCounter).append(dayIcon);
            dayCounter++;
        }
    })
}

function iconGenerator(icon){
    var iconImg = $("<img>");
    var iconUrl = "http://openweathermap.org/img/wn/";   
    iconImg.attr("src", iconUrl + icon + "@2x.png");
    return iconImg;
} 

function getUVIndex(lat, lon){
    var queryUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + apiKey;
    console.log(queryUrl);
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        console.log(response.value);
        $("#todayUVIndex").text(response.value);
    })
}