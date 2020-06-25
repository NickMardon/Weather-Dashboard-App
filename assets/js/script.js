//global variables
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
    cityBtn.attr("class","cityBtn");
    //Click listener for city buttons to toggle between searched cities
    cityBtn.on("click",function(){
        event.preventDefault();
        console.log($(this).text());
        getWeather($(this).text());
    })
    searchDisplay.prepend(cityBtn);
    getWeather(searchInput.val());
})

//getWeather function generates current days weather stats
function getWeather(cityName){
    $("#currentIcon").empty();
   var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + units + apiKey;
   $.ajax({
       url: queryUrl,
       method: "GET"
   }).then(function(response){
        //city name and date
        $("#cityHeader").text(cityName + " " + (new Date().toLocaleDateString()));
        //current day weather icon
        var currentIcon = iconGenerator(response.weather[0].icon);
        $("#currentIcon").append(currentIcon);
        $("#todayTemp").text((response.main.temp) + "℉");
        //update humidity 
        $("#todayHumidity").text((response.main.humidity) + "%");
        //update windspeed
        $("#todayWindSpeed").text((response.wind.speed) + "MPH")
        //define lat and lon to pass into uv index
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        getUVIndex(lat,lon);
        fiveDay(cityName);
   }
   )}

//calls five day API endpoint and populates page with data
function fiveDay(cityName){
    $("#day1").empty();
    $("#day2").empty();
    $("#day3").empty();
    $("#day4").empty();
    $("#day5").empty();
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + units + apiKey;
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        var dayCounter = 1;
        //for loop grabs the data of each day at noon
        for(let i = 3;i<response.list.length;i+=8){
            //Date populated on card
            var formatedDate = new Date(response.list[i].dt_txt).toLocaleDateString();
            var cardDate = $("<h4>");
            cardDate.text(formatedDate);
            $("#day" + dayCounter).append(cardDate);
            //icon populated on card
            var dayIcon = iconGenerator(response.list[i].weather[0].icon);
            $("#day" + dayCounter).append(dayIcon);
            //temp populated on card
            var cardTemp = $("<p>");
            cardTemp.text("Temp: " + (response.list[i].main.temp) + "℉");
            $("#day" + dayCounter).append(cardTemp);
            var cardHumidity = $("<p>");
            cardHumidity.text("Humidity: " + (response.list[i].main.humidity) + "%");
            $("#day" + dayCounter).append(cardHumidity);
            dayCounter++;
        }
    })
}
// Generate Weather Icons
function iconGenerator(icon){
    var iconImg = $("<img>");
    var iconUrl = "http://openweathermap.org/img/wn/";   
    iconImg.attr("src", iconUrl + icon + "@2x.png");
    return iconImg;
} 
//Get UV index
function getUVIndex(lat, lon){
    var queryUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + apiKey;
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        $("#todayUVIndex").text(response.value);
    })
}