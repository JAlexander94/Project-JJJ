
let latlon

const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://zoopla.p.rapidapi.com/house-prices/get-market-activity?area=e1w3qs",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "4a8d4a065emsh408cdcdfe8a5c30p157467jsnfc37494fcb57",
		"X-RapidAPI-Host": "zoopla.p.rapidapi.com"
	}
};

//call the zoopla api via rapidapi for the area in the url above and average the house prices
$.ajax(settings).then(function (response) {
    latlon = response.bounding_box
    let lat = response.latitude
    let lon = response.longitude
    let queryURL = "https://data.police.uk/api/crimes-street/all-crime?lat="+lat+"&lng="+lon
    let houseprices = {}
    let numbersold = {}
    let responseobject = Object.keys(response)
    let detached = responseobject.find(element => element === "detached")
    if(typeof detached !== "undefined"){houseprices["detached"] = response.detached['5_years'].average_price_paid}
    let semi_detached = responseobject.find(element => element === "semi_detached")
    if(typeof semi_detached !== "undefined"){houseprices["semi_detached"] = response.semi_detached['5_years'].average_price_paid}
    let terraced = responseobject.find(element => element === "terraced")
    if(typeof terraced !== "undefined"){houseprices["terraced"] = response.terraced['5_years'].average_price_paid}
    let flat = responseobject.find(element => element === "flat")
    if(typeof flat !== "undefined"){houseprices["flat"] = response.flat['5_years'].average_price_paid}
    console.log(houseprices)
    console.log(latlon)
    console.log(lat,lon)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response)
    })
});

// function to average arrays
function average(arr){
    let sum = 0
    for (let i = 0;i<arr.length;i++){
        sum+= arr[i]
    }
    return sum / arr.length
}