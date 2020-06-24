var searchBtn = $("#searchBtn");
var searchDisplay = $(".searchDisplay");
var searchInput = $("#searchInput");

searchBtn.on("click", function(){
    event.preventDefault();
    var cityBtn = $("<button>");
    cityBtn.text(searchInput.val());
    searchDisplay.prepend(cityBtn);
})