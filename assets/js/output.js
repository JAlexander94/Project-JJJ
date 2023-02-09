
// creating city specific 
const brsTMLng = -2.587910;
const brsTMLat = 51.454514;
const brsUniLng = -2.603288;
const brsUniLat = 51.458447;
const stJudeLat = 51.45986176148458; 
const stJudeLong = -2.5796042120717884;
const BS1Lat = 51.448603274535;
const BS1Long = -2.601619783368318;
// created two variables for longitude and latitude
const lng = BS1Long;
const lat = BS1Lat;


// URL from the police api including long and lat data
var queryURLSS = "https://data.police.uk/api/stops-street?lat=" + lat + "&lng=" +lng;
var queryURLAll = "https://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" +lng;

 // Performing GET requests to the OMDB API and logging the responses to the console
 $.ajax({
    url: queryURLAll,
    method: "GET"
  }).then(function(response) {
    console.log(response)

     // for all crime
   console.log(response[0].category)
    // for stop and search
  //  console.log(response[0].legislation)
  //  console.log(response[0].age_range)
  //  console.log(response[0].object_of_search)

  //  let searchTd = response[0].legislation;
  //  let ageTd = response[0].age_range;
  //  let crimeTd = response[0].object_of_search;

  
  // Create and save a reference to new empty table row
    // const row = $("<tr>");
  //  const ulEL = $("<ul>");
  //  const liEl = $("<li>");
  //  divEL.append(ulEL);
  //  ulEL.append(liEl);
  //  $("p").append(searchTd).append($("<br>"));
  //  $("p").append(ageTd).append($("<br>"));
  //  $("p").append(crimeTd).append($("<br>"));
  });
  