
var queryURL = "https://data.police.uk/api/leicestershire/NC04"
let latlon

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    console.log(response)
})

const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://zoopla.p.rapidapi.com/house-prices/estimate?area=tower%20hamlets&ordering=descending&page_number=1&page_size=40",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "4a8d4a065emsh408cdcdfe8a5c30p157467jsnfc37494fcb57",
		"X-RapidAPI-Host": "zoopla.p.rapidapi.com"
	}
};

//call the zoopla api via rapidapi for the area in the url above and average the house prices
$.ajax(settings).then(function (response) {
	console.log(response);
    var houseprices = []
    for(let i=0;i<response.property.length;i++){
        var price = response.property[i].estimate_value
        if(price>0){houseprices.push(price)}
    }
    let averageprice = average(houseprices).toFixed(0)
    latlon = response.bounding_box
    console.log(houseprices)
    console.log(averageprice)
    console.log(latlon)
});

// function to average arrays
function average(arr){
    let sum = 0
    for (let i = 0;i<arr.length;i++){
        sum+= arr[i]
    }
    return sum / arr.length
}