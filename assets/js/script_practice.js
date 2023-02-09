
// grab the long lat data from zoopla once they search for a postcode 

// creating city specific 
const brsTMLng = -2.587910;
const brsTMLat = 51.454514;
const brsUniLng = -2.603288;
const brsUniLat = 51.458447;
// created two variables for longitude and latitude
const lng = brsUniLng;
const lat = brsUniLat;

var queryURL = "https://data.police.uk/api/crimes-street-dates";
var queryURLSS = "https://data.police.uk/api/stops-street?lat=" + lat + "&lng=" +lng;

$.ajax({
    url: queryURLSS,
    method: "GET"
}).then(function(response){
    console.log(response)
})

// const settings = {
// 	"async": true,
// 	"crossDomain": true,
// 	"url": "https://zoopla.p.rapidapi.com/house-prices/estimate?area=e1w&ordering=descending&page_number=1&page_size=40",
// 	"method": "GET",
// 	"headers": {
// 		"X-RapidAPI-Key": "4a8d4a065emsh408cdcdfe8a5c30p157467jsnfc37494fcb57",
// 		"X-RapidAPI-Host": "zoopla.p.rapidapi.com"
// 	}
// };

// $.ajax(settings).then(function (response) {
// 	console.log(response);
//     var houseprices = []
//     for(let i=0;i<response.property.length;i++){
//         var price = response.property[i].estimate_value
//         if(price>0){houseprices.push(price)}
        
//     }
//     console.log(houseprices)
// });