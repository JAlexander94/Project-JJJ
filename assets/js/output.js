
// creating city specific 
// const brsTMLng = -2.587910;
// const brsTMLat = 51.454514;
// const brsUniLng = -2.603288;
// const brsUniLat = 51.458447;
// const stJudeLat = 51.45986176148458; 
// const stJudeLong = -2.5796042120717884;
// const BS1Lat = 51.448603274535;
// const BS1Long = -2.601619783368318;
// created two variables for longitude and latitude
// const lng = BS1Long;
// const lat = BS1Lat;


// // URL from the police api including long and lat data
// var queryURLSS = "https://data.police.uk/api/stops-street?lat=" + lat + "&lng=" +lng;
// var queryURLAll = "https://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" +lng;

 // Performing GET requests to the police API and logging the responses to the console
//  $.ajax({
//     url: queryURLAll,
//     method: "GET"
//   }).then(function(response) {
//     console.log(response)

//      // for all crime
//    console.log(response[0].category)
//    console.log(response[0].month)

//      let categoryTd = response[0].category;
//    let monthTd = response[0].month;
//    console.log("This is categoryTd: " + categoryTd);
//    console.log("This is monthTd: " + monthTd);

  // Create and save references to 2 td elements containing the category, month
//   const catTd = $("<div>").text(categoryDiv);
//   const MonTd = $("<div>").text(monthDiv);
//   console.log("this is catTD: " + catTd);
// tbody.append(row);
//  row.append(catTd);
//  row.append(MonTd);
//  let p = $('p');
//  p.append(catTd).append("<br>")
//  p.append(monTd).append("<br>")
   
  // });

  // setting local storage to get data from the form 
//   const house = $('form.propertyType.house');
// localStorage.setItem("house", house);
// localStorage.getItem("house");

// create area and content for the results on Output.html
const resultsList = document.getElementById('results');

const urlParams = new URLSearchParams(window.location.search);

const propertyType = urlParams.get("propertyType");
const bedrooms = urlParams.get("formBedNumber");
const priceRange = urlParams.get("priceRange");
const postcode = urlParams.get("postcode");

console.log(`Property Type: ${propertyType}`);
console.log(`Bedrooms: ${bedrooms}`);
console.log(`Price Range: ${priceRange}`);
console.log(`Postcode: ${postcode}`);


const br1 = $("<br>");
const br2 = $("<br>");
const br3 = $("<br>");
const br4 = $("<br>");
  // resultsList.append(`Property Type: ${propertyType}`);
  resultsList.append(br1.get(0));
 
  resultsList.append(`Number of Bedrooms: ${bedrooms}`);
  resultsList.append(br2.get(0)); 
  resultsList.append(`Price range: ${priceRange}`);
  resultsList.append(br3.get(0));  
  resultsList.append(`Postcode: ${postcode}`);
// getUrlParams();

// // Jo test code for connections
// function getZooplaData( ) {
//   let postcodeZoopla = responseobject.find(element => element === "postcode")
//   if (postcode === postcodeZoopla) {
//   console.log("postcode found");
// } else { console.log("no postcode found")}
// }

// getZooplaData();
  
   
   // the user postocode {postcode} is grabbed from the form and created in output.js. 
// It gets trimmed to remove white space and gets passed to postcodeURL
// function setPostcode() {

let postcodeURL = postcode.trim(); 
// return postcodeURL;
// }
// setPostcode();

// postcodeURL gets used in the "url" setting in const settings [script.js]

const settings = {
	"async": true,
	"crossDomain": true,
	// "url": "https://zoopla.p.rapidapi.com/house-prices/get-market-activity?area=bs15jw",
    "url": "https://zoopla.p.rapidapi.com/house-prices/get-market-activity?area=" + postcodeURL,
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
    //take the central latitude and longitude from the zoopla API for use with the police API and construct the police API query
    let lat = response.latitude
    let lon = response.longitude
    console.log("this is lat " + lat + "this is lon" + lon)
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
});


// function to average arrays
function average(arr){
    let sum = 0
    for (let i = 0;i<arr.length;i++){
        sum+= arr[i]
    }
    return sum / arr.length
}

