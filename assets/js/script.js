let history = [];
//call initialisation of the buttons on the search page
indinit()
//pulls data from the url into javasxcript from clicking the search button on the search page and then uses that to fill out the page with the api info
const urlParams = new URLSearchParams(window.location.search);
const postcodent = urlParams.get("area")
var postcode = postcodent.trim()
if(postcode!==""){
    searchpostcode(postcode)
    searchlistings(postcode)
}else{
    var housepricediv = $("<div></div>")
    housepricediv.attr("class","card")
    var housepr = $("<ul></ul>")
    housepr.attr("class","list-group list-group-flush")
    housepr.append("There is no data for this postcode. Please try again.")
    housepricediv.append(housepr)
    $("#prices").append(housepricediv)
}
//calls initialisation of the buttons on the results page
init()
//adds newly searched for postcode into local history and adds it as a button on the results page
if(history.includes(postcode)||postcode===""){}else{
    history.push(postcode)
    localStorage.setItem("history",JSON.stringify(history))
    $("#postcodehistory").empty()
    populatehistory(postcode)
} 

//initialisation function initialising the resulst page with historical buttons oulled form local storage
function init(){
    history = JSON.parse(localStorage.getItem("history"))
    if(history===null){history = []}else{
        populatehistory()
    }
}
//initialisation fucntion initialising the search page with historical buttons from local storage
function indinit(){
    history = JSON.parse(localStorage.getItem("history"))
    if(history===null){history = []}else{
    for(i=0;i<history.length;i++){
        var posthist = $("<button></button>").text(history[i])
        posthist.attr("class","btn btn-secondary")
        posthist.attr("id","postbutton")
        posthist.attr("type","text")
        posthist.attr("name","area")
        posthist.attr("value",history[i])
        $("#indpostcodehistory").append(posthist)
    }
    }
}
//the function which populates the historical buttons on the results page using the history variable which has been filled on initialisation from local storage
function populatehistory(postcode){
    for(i=0;i<history.length;i++){
        var posthist = $("<button></button>").text(history[i])
        posthist.attr("class","btn btn-secondary")
        posthist.attr("data-postcode",postcode)
        posthist.attr("id","postbutton")
        $("#postcodehistory").append(posthist)
    }
}
// event listener which operates if user uses the search function in the nav to look for a new postcode and populates the api info and adds that postcode to buttons and local storage
$("#searchbtn").on("click",function(event){
    event.preventDefault()
    $("#properties").empty()
    $("#prices").empty()
    $("#crimes").empty()
    postcode = $("#search").val().trim()
    if(postcode===""){return}else{
        searchpostcode(postcode)
        searchlistings(postcode)
    }
    if(history.includes(postcode)){return}else{
        history.push(postcode)
        localStorage.setItem("history",JSON.stringify(history))
        $("#postcodehistory").empty()
        populatehistory(postcode)}
    $("#search").val("")
})
//event listener which operates when a user clicks one of the historical buttons and populates the api info
$("#postcodehistory").on("click","button",function(event){
    event.preventDefault()
    $("#properties").empty()
    $("#prices").empty()
    $("#crimes").empty()
    postcode = $(this).text()
    searchpostcode(postcode)
    searchlistings(postcode)
})

//function which populates results page with the info from the apis
function searchpostcode(postcode){
//calls the zoopla api via rapidapi for a given postcode and then adds the house price information to the prices div in results page and makes a lat and lon variable for the police api
$.ajax({
    "async": true,
	"crossDomain": true,
	"url": "https://zoopla.p.rapidapi.com/house-prices/get-market-activity?area="+postcode,
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "6156dd255fmshe3b2167ef08204ep13744cjsn7586408dcfe8",
		"X-RapidAPI-Host": "zoopla.p.rapidapi.com"}
}).then(function (response) {
    let houseprices = {}
    let responseobject = Object.keys(response)
    let detached = responseobject.find(element => element === "detached")
    console.log(response)
    if(typeof detached !== "undefined"){houseprices["Detached"] = response.detached['5_years'].average_price_paid}
    let semi_detached = responseobject.find(element => element === "semi_detached")
    if(typeof semi_detached !== "undefined"){houseprices["Semi Detached"] = response.semi_detached['5_years'].average_price_paid}
    let terraced = responseobject.find(element => element === "terraced")
    if(typeof terraced !== "undefined"){houseprices["Terraced"] = response.terraced['5_years'].average_price_paid}
    let flat = responseobject.find(element => element === "flat")
    if(typeof flat !== "undefined"){houseprices["Flat"] = response.flat['5_years'].average_price_paid}
   
        var housepricediv = $("<div></div>")
        housepricediv.attr("class","card")
        var housepr = $("<ul></ul>")
        housepr.attr("class","list-group list-group-flush")
        //checking if the postcode, lon or lat fields are undefined
        if (response.error_code =='5') {
            // data property is empty
            housepr.append("There is no data for this postcode. Please try again.")
          }
        for (var key in houseprices) {
            var type = $("<div></div>").text(key)
            var price = $("<div></div>").text("??"+houseprices[key].toLocaleString("en-US"))
            type.attr("class","col-6")
            type.attr("style","border-right: 1px solid black")
            type.attr("id","text")
            price.attr("class","col-6")
            price.attr("id","text")
            var priceli = $("<li></li>")
            priceli.attr("class","list-group-item d-flex")
            priceli.append(type,price)
            housepr.append(priceli)
          }
        housepricediv.append(housepr)
        $("#prices").append(housepricediv)
    
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
            var crimesdiv = $("<div></div>")
            crimesdiv.attr("class","card")
            var crimeul = $("<ul></ul>")
            crimeul.attr("class","list-group list-group-flush")
            for (var key in crimes) {
                var crtype = $("<div></div>").text(key)
                var crnum = $("<div></div>").text(crimes[key])
                crtype.attr("class","col-6")
                crtype.attr("style","border-right: 1px solid black")
                crtype.attr("id","text")
                crnum.attr("class","col-6")
                crnum.attr("id","text")
                var crimeli = $("<li></li>")
                crimeli.attr("class","list-group-item d-flex")
                crimeli.append(crtype,crnum)
                crimeul.append(crimeli)
            }
            crimesdiv.append(crimeul)
            $("#crimes").append(crimesdiv)
    })
});
}
//function which uses the postcode via the zoopla api in rapid api to add clickable buttons with the most recent 5 listings within 1 mile of that location which click through to the zoopla page 
function searchlistings(postcode){
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://zoopla.p.rapidapi.com/properties/list?area="+postcode+"&category=residential&listing_status=sale&order_by=age&ordering=descending&page_number=1&page_size=5&radius=1",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "6156dd255fmshe3b2167ef08204ep13744cjsn7586408dcfe8",
            "X-RapidAPI-Host": "zoopla.p.rapidapi.com"
        }
    }).then(function (response) {
        var listingsdiv = $("<div></div>")
        listingsdiv.attr("class","card")
        var listingsul = $("<ul></ul>")
        listingsul.attr("class","list-group list-group-flush")
        for(let i=0;i<response.listing.length;i++){
            var listing = $("<a></a>").text(response.listing[i].title)
            listing.attr("class","btn btn-primary")
            listing.attr("href",response.listing[i].details_url)
            var listingli = $("<li></li>")
            listingli.attr("class","list-group-item")
            listingli.append(listing)
            listingsul.append(listingli)
        }
        listingsdiv.append(listingsul)
        $("#properties").append(listingsdiv)
        
    });

}
