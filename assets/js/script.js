const urlParams = new URLSearchParams(window.location.search);
const postcodent = urlParams.get("area")
var postcode = postcodent.trim()
searchpostcode(postcode)
let history = [];

init()

if(history.includes(postcode)){}else{
    history.push(postcode)
    localStorage.setItem("history",JSON.stringify(history))
    $("#postcodehistory").empty()
    populatehistory(postcode)
} 


function init(){
    history = JSON.parse(localStorage.getItem("history"))
    if(history===null){history = []}else{
        populatehistory()
    }
}

function populatehistory(postcode){
    for(i=0;i<history.length;i++){
        var posthist = $("<button></button>").text(history[i])
        posthist.attr("class","btn btn-secondary")
        posthist.attr("data-postcode",postcode)
        posthist.attr("id","postbutton")
        $("#postcodehistory").append(posthist)
    }
}

$("#searchbtn").on("click",function(event){
    event.preventDefault()
    $("#properties").empty()
    $("#prices").empty()
    $("#crimes").empty()
    postcode = $("#search").val().trim()
    if(postcode===""){return}else{searchpostcode(postcode)}
    if(history.includes(postcode)){return}else{
        history.push(postcode)
        localStorage.setItem("history",JSON.stringify(history))
        $("#postcodehistory").empty()
        populatehistory(postcode)}
    $("#search").val("")
})

$("#postcodehistory").on("click","button",function(event){
    event.preventDefault()
    $("#properties").empty()
    $("#prices").empty()
    $("#crimes").empty()
    postcode = $(this).text()
    searchpostcode(postcode)
})

//call the zoopla api via rapidapi for the area in the url above and average the house prices
function searchpostcode(postcode){
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
        for (var key in houseprices) {
            var type = $("<div></div>").text(key)
            var price = $("<div></div>").text("£"+houseprices[key].toLocaleString("en-US"))
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
