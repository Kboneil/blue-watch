angular.module('blueWatchApp')
    .controller('HomeController', HomeController);

function HomeController($http, $location, $scope, ResourcesService, LogoutService) {


    console.log('Home controller');
    var controller = this;
    // LogoutService.status = false;


        console.log('Home controller');
        var controller = this;
        controller.change = {
            categoryList: false
        };
        controller.change = {
            selectedCategory: false
        };
        controller.change = {
            checkedCategory: false
        };
        controller.change = {
            singleResource: false
        };
        controller.change = {
            backButton :false
        };

    controller.categoryListToggle = function(){
        controller.change.categoryList = true,
        controller.change.selectedCategory = false,
        controller.change.checkedCategory = false,
        controller.change.singleResource = false,
        controller.change.backButton = false,
        controller.change.backButton2 = false
    };
    controller.selectedCategoryToggle = function(){
        controller.change.categoryList = false;
        controller.change.selectedCategory = true,
        controller.change.checkedCategory = false,
        controller.change.singleResource = false,
        controller.change.backButton = true,
        controller.change.backButton2 = false

    };
    controller.checkedCategoryToggle = function(){
        controller.change.categoryList = false;
        controller.change.selectedCategory = false,
        controller.change.checkedCategory = true,
        controller.change.singleResource = false,
        controller.change.backButton = false,
        controller.change.backButton2 = true
    };
    controller.singleResourceToggle = function(){
        controller.change.categoryList = false;
        controller.change.selectedCategory = false,
        controller.change.checkedCategory = false,
        controller.change.singleResource = true,
        controller.change.backButton = !controller.change.backButton2,
        controller.change.backButton2 = !controller.change.backButton
    };


    controller.categoryListToggle();



    //array of all the markers
    controller.markers = [];

    controller.globalMarkers;
    controller.resources;
    controller.selectedCategoryArray;

    //sets where the map is located, type and zoom

    var mapOptions = {
        center: new google.maps.LatLng(38.62452, -90.18514),
        // center: new google.maps.LatLng(44.9778, 93.2650), //this lat/long to center of cities - jsm
        zoom: 5, //zoom level to show most - jsm
        mapTypeId: google.maps.MapTypeId.ROADMAP,

        panControl: true,
        mapTypeControl: false,
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: false,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    };


    //creates the map
    controller.map = new google.maps.Map(document.getElementById('map'), mapOptions);



    //loads all the resources on page load
    controller.getResources = function() {

        $http.get('/resource').then(function(response) {

            controller.resourcesToSearch = response.data;
            console.log(controller.resourcesToSearch);

            controller.resources = response.data;

            controller.resources.forEach(function(info) {

              var id = info._id;
              $http.get('/publicreviews/'+id).then(function(response) {
                  var totalRating=0;
                  info.review = response.data;
                  info.numberOfReviews = info.review.length;

                  //make function to create average Rating
                  if(info.numberOfReviews>0){
                      info.review.forEach(function(review){
                          totalRating +=review.rating;
                          info.averageRating = totalRating/info.numberOfReviews;
                      });
                  } else{
                      info.averageRating = 0;
                  }

                 });
                controller.createMarker(parseFloat(info.lat), parseFloat(info.long), info);

            }); //End of for each
            console.log('controller.resources', controller.resources);
            controller.showVisible(controller.markers); //show all markers

        }); //end of http get resource

    }; //End of getResources


    //create marker
    controller.createMarker = function(latinfo, lnginfo, info) {

      // console.log('category color ', info.category.color);
      // console.log('ResourcesService.icons ', ResourcesService.service.icons);

      // var icons = ResourcesService.service.icons;

        info.marker = new google.maps.Marker({
            map: controller.map,
            position: new google.maps.LatLng(latinfo, lnginfo),
            title: info.company,
            category: info.category.categoryName,
            visible: true,
            icon: '/assets/img/'+ info.category.color+'_Marker.png'
            // icons[info.category.color].icon
        });

        info.marker.content =

        '<span star-rating rating-value="'+info.averageRating+'" max="5"></span>'
        +'<div class="infoWindowContent">' + info.description + '</div> Contact: '+info.contact+'</div></div>';

        info.marker.infoWindow = new google.maps.InfoWindow();

        //event listener for marker click
        google.maps.event.addListener(info.marker, 'click', function() {
            controller.closeInfoWindow();


            controller.showSingleResource(info);
            controller.singleResourceToggle();

            info.marker.infoWindow.setContent('<p><strong>' + info.marker.title +'</strong>'
            + info.marker.content + '</p>');
            info.marker.infoWindow.open(controller.map, info.marker);

        });
        //close infoWindow when clicked anywhere on map
        google.maps.event.addListener(controller.map, 'click', controller.closeInfoWindow);
        //listen for bounds status
        google.maps.event.addListener(controller.map, 'idle', function() {
            info.marker.boundsStatus = controller.map.getBounds().contains(info.marker.getPosition());
            //apply changes on the DOM
            $scope.$apply();

        });
        controller.markers.push(info.marker);



    }; //End of createMarker

    controller.showSingleResource = function(resource){

        controller.selectedResource = resource;

        //get review ratings and comments
        controller.getSelectedRating(resource);
        //hide all markers
        controller.hideMarkers(controller.markers);

        //show markers of selected category
        controller.showVisible([controller.selectedResource.marker]);
        controller.singleResourceToggle();

    };

    //close all open window
    controller.closeInfoWindow = function() {
        controller.markers.forEach(function(marker) {
            marker.infoWindow.close();
        });

    };

    controller.hideMarkers = function(markers) {

        markers.forEach(function(marker) {
            marker.setVisible(false);
            controller.closeInfoWindow();
        });

    };

    controller.showVisible = function(controllerMarkers) {
        var bounds = new google.maps.LatLngBounds();

        console.log(controllerMarkers);

        if(controllerMarkers.length>1){
        controllerMarkers.forEach(function(marker) {
            marker.setVisible(true);
            controller.closeInfoWindow();
            // extending bounds to contain this visible marker position
            bounds.extend(marker.getPosition());
        });

        // setting new bounds to visible markers of
        controller.map.fitBounds(bounds);
    }else{
      controllerMarkers[0].setVisible(true);
      controller.closeInfoWindow();
      controller.map.setCenter(controllerMarkers[0].position);
    }
}
    controller.getResources(); //run getResources function


    //show marker when company name is clicked
    controller.openInfoWindow = function($event, selectedMarker, resource) {
        event.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
        controller.showSingleResource(resource);
            controller.singleResourceToggle();


    }

    controller.expandCategory = function(category) {

        //array of markers to show
        controller.showMarkers = [];

        controller.selectedCategoryArray = [];

        //will take in what the user wants so it can be listed on the DOM
        controller.resources.forEach(function(resource) {

            if (resource.category.categoryName == category) {
                controller.selectedCategoryArray.push(resource);
                controller.showMarkers.push(resource.marker);
            }

        });

        //hide all markers
        controller.hideMarkers(controller.markers);


        //show markers of selected category
        controller.showVisible(controller.showMarkers);


        //this hides the categoryList and shows the list of selected categories

        controller.selectedCategoryToggle();
    }

    controller.expandCheckedCategory = function(category) {
        console.log(category);

      if (category[0] == false) {
        alert ('Please check a category');
        return;
      }

        //markers to show based on selected category
        controller.showMarkers = [];
        controller.vals = [];
        controller.categoryColors = [];
        getValues(category);

        function getValues(category) {
            for (var key in category) {
                if (category.hasOwnProperty(key)) {
                    //we only want selected vales in our array
                    if (category[key] !== false) {
                        controller.vals.push(category[key]);
                    }
                }
            }
            return controller.vals;
        }
        console.log(controller.vals);

        controller.checkedCategory = [];

        controller.vals.forEach(function(checkedCategory) {
            var selectedCategoryArray = [];
            controller.resources.forEach(function(resource) {
                if (resource.category.categoryName === checkedCategory) {
                    selectedCategoryArray.push(resource);
                    controller.showMarkers.push(resource.marker);
                }
            });
            console.log('Color for checked ', selectedCategoryArray);
            var name = controller.resources[0].category.categoryName;
            controller.checkedCategory.push({
                name: checkedCategory,
                resources: selectedCategoryArray
            });
            // console.log('checked category ', controller.checkedCategory);
        });
        //hide all markers
        controller.hideMarkers(controller.markers);
        //show markers of selected category
        controller.showVisible(controller.showMarkers);
        console.log(controller.showMarkers);

        //this hides the categoryList and shows the list of selected categories
        controller.checkedCategoryToggle();
    }
    controller.backCategories = function(category) {
        //refreshes the map and show all
        controller.showVisible(controller.markers);
        controller.search = "";

            controller.categoryListToggle();

    }

    controller.backToSelectedcategories = function(category){
console.log(category);
    if (angular.isObject(category)==true){
        controller.expandCheckedCategory(category);
    }else{
        controller.expandCategory(category);

}

    }

controller.searchResources = function(search){
    search = search.toString();
    $http.get('/resource/' + search).then(function(response){
        console.log(response);
    });
};


    controller.searchAddress = function() {
        console.log(addressInput);
        var addressInput = document.getElementById('address-input').value;

        var distance = parseFloat(controller.distance);
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
            address: addressInput
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                var myResult = results[0].geometry.location;

                controller.map.setCenter(myResult);

                controller.map.setZoom(distance);

            } else { // if status value is not equal to "google.maps.GeocoderStatus.OK"

                // warning message
                alert("The Geocode was not successful for the following reason: " + status);

            }

        });
    }

controller.getId = function(id){
  controller.id = id;
  console.log('id', id);
  console.log(controller.id);
};


    // target element
    var el = document.querySelector('#el');

    // current rating, or initial rating
    var currentRating = 0;

    // max rating, i.e. number of stars you want
    var maxRating= 5;

    // callback to run after setting the rating
    var callback = function(rating) {
      controller.starReview = rating
      console.log(rating);
     };

    // rating instance
    var myRating = rating(el, currentRating, maxRating, callback);

// sets rating and doesn't run callback
    // myRating.setRating(3, false);
    //
    // myRating.getRating();


    controller.createReview = function(review, id){
      console.log('id', controller.id);
      var body = {
        resource_id: controller.id,
        rating: controller.starReview,
        comments: review
      }
      controller.reviewNotes = '';
      console.log(body);
          $http.post('/publicreviews', body
        ).then(function(){
        console.log('success posting');
        controller.sendMail(body);
        }, function(error) {
          console.log('error creating review', error);
        });
    }

    controller.sendMail = function(data) {
            $http.post('/publicreviews/mail', data).then(function(results) {
                console.log(results);
            });
        }; // end sendMail


//show all ratings for the resource selected
    controller.getSelectedRating = function (resource) {
        console.log(resource);

    //get review array of that id in the .review property
    controller.selectedReviewArrays = resource.review;
        console.log(controller.selectedReviewArrays);

    };

} //End of HomeController

angular.module('blueWatchApp')
.directive('starRating', function () {
    return {
        restrict: 'AE',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" >' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            // onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                console.log(scope.ratingValue);
                scope.stars = [];

                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue,
                         half: scope.ratingValue % 1 > 0 && i === Math.floor(scope.ratingValue)
                    });
                }
            };
            scope.toggle = function (index) {
               scope.ratingValue = index + 1;
            //    scope.onRatingSelected({
            //        rating: index + 1
            //    });
           };

           scope.$watch('ratingValue', function (newVal, oldVal) {

               if (newVal) {
                   updateStars();
               } else if(newVal == '' ){
                   updateStars();
               }

           });
       }
   }
});
