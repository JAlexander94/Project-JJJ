
var queryURL = "https://data.police.uk/api/crimes-street-dates"

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    console.log(response)
})

const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://zoopla.p.rapidapi.com/house-prices/estimate?area=e1w&ordering=descending&page_number=1&page_size=40",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "4a8d4a065emsh408cdcdfe8a5c30p157467jsnfc37494fcb57",
		"X-RapidAPI-Host": "zoopla.p.rapidapi.com"
	}
};

$.ajax(settings).then(function (response) {
	console.log(response);
    var houseprices = []
    for(let i=0;i<response.property.length;i++){
        var price = response.property[i].estimate_value
        if(price>0){houseprices.push(price)}
        
    }
    console.log(houseprices)
});