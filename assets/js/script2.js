

const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://zoopla.p.rapidapi.com/house-prices/get-market-activity?area=co101pq",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "7dd7c3d5e5msh5597199b6be8500p1bd494jsnfd9a07e9ce01",
		"X-RapidAPI-Host": "zoopla.p.rapidapi.com"
	}
};

//call the zoopla api via rapidapi for the area in the url above and average the house prices
$.ajax(settings).then(function (response) {
    let houseprices = {}
    let responseobject = Object.keys(response)
    let detached = responseobject.find(element => element === "detached")
    if(typeof detached !== "undefined"){houseprices["Detached"] = response.detached['5_years'].average_price_paid}
    let semi_detached = responseobject.find(element => element === "semi_detached")
    if(typeof semi_detached !== "undefined"){houseprices["Semi Detached"] = response.semi_detached['5_years'].average_price_paid}
    let terraced = responseobject.find(element => element === "terraced")
    if(typeof terraced !== "undefined"){houseprices["Terraced"] = response.terraced['5_years'].average_price_paid}
    let flat = responseobject.find(element => element === "flat")
    if(typeof flat !== "undefined"){houseprices["Flat"] = response.flat['5_years'].average_price_paid}
    console.log(houseprices)
<<<<<<< HEAD
    console.log(averageprice)
    // temporary check for what comes back as latlon
    let checkLatlon = JSON.stringify(latlon)
    console.log("this is latlon: " + checkLatlon)
=======
    //take the central latitude and longitude from the zoopla API for use with the police API and construct the police API query
    let lat = response.latitude
    let lon = response.longitude
    let queryURL = "https://data.police.uk/api/crimes-street/all-crime?lat="+lat+"&lng="+lon
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(data){
        //first filter through the crime data to find all the instances of each type of crime and the group them together via concat
        let crimes = {}
        var asb = data.filter(item => item.category === "anti-social-behaviour")
        var public_order = data.filter(item => item.category === "public-order")
        var asb_po = asb.concat(public_order)
        var theft = data.filter(item => item.category.includes("theft"))
        var shoplift = data.filter(item => item.category.includes("shoplifting"))
        var petty_theft = theft.concat(shoplift)
        var burglary = data.filter(item => item.category === "burglary")
        var robbery = data.filter(item => item.category === "robbery")
        var vehicle = data.filter(item => item.category === "vehicle-crime")
        var major_theft = burglary.concat(robbery,vehicle)
        var drugs = data.filter(item => item.category === "drugs")
        var arson = data.filter(item => item.category.includes("arson"))
        var violent = data.filter(item => item.category === "violent-crime")
        var weapons = data.filter(item => item.category.includes("weapons"))
        var arson_violent = arson.concat(violent,weapons)
        //second check those group arrays have something in them and then add them to the crimes object with the number of instances
        if(asb_po.length!=="undefined"){crimes["Anti Social Behaviour"] = asb_po.length}
        if(drugs.length!=="undefined"){crimes["Drugs"] = drugs.length}
        if(petty_theft.length!=="undefined"){crimes["Petty Theft"] = petty_theft.length}
        if(major_theft.length!=="undefined"){crimes["Major Theft"] = major_theft.length}
        if(arson_violent.length!=="undefined"){crimes["Violent Crime & Arson"] = arson_violent.length}
        console.log(crimes)
    })
>>>>>>> 4f8a8f59029949af09f2347ac595c79798e13619
});


// function to average arrays
function average(arr){
    let sum = 0
    for (let i = 0;i<arr.length;i++){
        sum+= arr[i]
    }
    return sum / arr.length
}