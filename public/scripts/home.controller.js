angular.module('blueWatchApp')
.controller('HomeController', HomeController);

function HomeController($http, $location) {
  console.log('Home controller');
  var controller = this;

  controller.globalMarkers;


controller.resources;
controller.selectedCategoryArray;

//loads all the resources on page load
  controller.getResources = function(){

      $http.get('/resource').then(function(response){
          controller.resources=response.data;
          console.log(controller.resources);
      });

  };
  controller.getResources();




  controller.searchResources = function(search){
    console.log(search);
  }

//changes the category list to list of resources from selected category
controller.change = {categoryList:false};
controller.change = {selectedCateogry:false};
  controller.expandCategory = function(category){
    console.log(category);
    controller.selectedCategoryArray = [];
    //will take in what the user wants so it can be listed on the DOM
    controller.resources.forEach(function(resource){
      if (resource.category.categoryName === category){
        controller.selectedCategoryArray.push(resource);
      }
    });
      //this hides the categoryList and shows the list of selected categories
    controller.change.categoryList = !controller.change.categoryList;
    controller.change.selectedCateogry = !controller.change.selectedCateogry;
  }

  controller.backCategories = function(category){
    controller.search="";
    controller.change = {categoryList:false};
    controller.change = {selectedCateogry:false};
  }

//examples of locations
var cities = [
    {
        city : 'Toronto',
        desc : 'Wellness',
        lat : 43.7000,
        long : -79.4000
    },
    {
        city : 'New York',
        desc : 'Counseling',
        lat : 40.6700,
        long : -73.9400
    },
    {
        city : 'Chicago',
        desc : 'Family therapy',
        lat : 41.8819,
        long : -87.6278
    },
    {
        city : 'Los Angeles',
        desc : 'Financial Services',
        lat : 34.0500,
        long : -118.2500
    },
    {
        city : 'Las Vegas',
        desc : 'Doctor',
        lat : 36.0800,
        long : -115.1522
    }
];

//sets where the map is located, type and zoom
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(40.0000, -98.0000),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };


//creates the map
    controller.map = new google.maps.Map(document.getElementById('map'), mapOptions);

//array of all the markers
    controller.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info){

        var marker = new google.maps.Marker({
            map: controller.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<p>' + marker.title + ': ' + marker.content + '</p>');
            infoWindow.open(controller.map, marker);
        });

        var myMarker = {
          marker: marker,
          visible: false,
          // ...
        }
        controller.globalMarkers = myMarker;
        controller.markers.push(myMarker);


        // console.log('checkInOrOut() ', checkInOrOut(marker));
        // checkInOrOut(marker);

    }

  google.maps.event.addListener(controller.map, 'idle', function() {
      // console.log(checkInOrOut(controller.globalMarkers));
      // checkInOrOut(controller.globalMarkers);
      // for (i = 0; i < cities.length; i++){
      //     createMarker(cities[i]);
      // }
      console.log('checkInOrOut() ', checkInOrOut(controller.markers));
      checkInOrOut(controller.markers);

    });
    function checkInOrOut(markers){
      markers.forEach(function(resourceMarker){
        // console.log('resourceMarker ', resourceMarker);
      var marker = resourceMarker.marker;

     controller.map.getBounds().contains(marker.getPosition());
     console.log('marker ', marker);
      });
      }

    //
    for (i = 0; i < cities.length; i++){
        createMarker(cities[i]);
    }

    controller.openInfoWindow = function(event, selectedMarker){
        event.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }


  controller.searchAddress = function() {

  var addressInput = document.getElementById('address-input').value;

  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({address: addressInput}, function(results, status) {

    if (status == google.maps.GeocoderStatus.OK) {

      var myResult = results[0].geometry.location;

      controller.map.setCenter(myResult);

      controller.map.setZoom(15);

    }  else { // if status value is not equal to "google.maps.GeocoderStatus.OK"

    // warning message
    alert("The Geocode was not successful for the following reason: " + status);

  }

  });
}




};
