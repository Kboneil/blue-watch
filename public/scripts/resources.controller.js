angular.module('blueWatchApp')
    .controller('ResourcesController', ResourcesController);


function ResourcesController($http, $location, $q, ResourcesService, $scope, adminservice) {

    var controller = this;
    controller.categories = [];
    controller.resources = [];

    controller.resourcesService = ResourcesService;
    controller.customIconInfo = [];

    controller.iconColor = '';



    //whenever controller is loaded, will check to see if user which/if any user is logged in
    adminservice.normalLoggedin();



    controller.getResources = function() {

        controller.resourcesService.getResources().then(function(response) {
            controller.resources = response.data;
        }, function(error) {
            console.log('error getting resource', error);
        });
    }; //End of getResources

    //display resources on page load
    controller.getResources();

    //controller to create new resource
    controller.createresource = function() {

        var address = controller.street + ' ' + controller.city + ' ' + controller.state + ' ' + controller.zip;

        controller.verifyAddress(address).then(function(response) {
            var lat = response.lat;
            var long = response.long;
            var body = {
                company: controller.company,
                description: controller.description,
                contact: controller.contact,
                website: controller.website,
                street: controller.street,
                street2: controller.street2,
                city: controller.city,
                state: controller.state,
                zip: controller.zip,
                category: controller.category,
                lat: lat.toString(),
                long: long.toString()
            };

            controller.resourcesService.createresource(body).then(function() {
                controller.getResources();
                //empty form after resource is added
                controller.company = '';
                controller.description = '';
                controller.contact = '';
                controller.website = '';
                controller.street = '';
                controller.street2 = '';
                controller.city = '';
                controller.state = '';
                controller.zip = '';
                controller.category = '';

            }, function(error) {
                console.log('error creating resource', error);
            }); //End of createResourceService

        }); //End of verify address

    }; //End of createResource

    //loads all the false icons on resources page
    controller.getIcons = function() {
        controller.customIconInfo.length = 0;

        controller.resourcesService.getIcons().then(function(response) {
            controller.customIconInfo = response.data;
        }, function(error) {
            console.log('error getting icons', error);
        });

    }; //End of getIcons

    //get icons on page loads
    controller.getIcons();


    controller.getcategories = function() {
        controller.resourcesService.getcategories().then(function(response) {
            controller.categories = response.data;
        }, function(error) {
            console.log('error getting categories', error);
        });
    }; //End of getcategories

    //get categories on page loads
    controller.getcategories();

    //capture resource info on modal click
    controller.captureInfo = function(company, description, contact, website, street, street2, city, state, zip, category, id) {
        controller.capturedCompany = company;
        controller.capturedDescription = description;
        controller.capturedContact = contact;
        controller.capturedWebsite = website;
        controller.capturedStreet = street;
        controller.capturedStreet2 = street2;
        controller.capturedCity = city;
        controller.capturedState = state;
        controller.capturedZip = zip;
        controller.capturedCategory = category;
        controller.capturedId = id;
        // console.log('capturedId',controller.capturedId)
    };

    controller.updateResource = function(id) {
        var address = controller.capturedStreet + ' ' + controller.capturedCity + ' ' + controller.capturedState + ' ' + controller.capturedZip;
        controller.verifyAddress(address).then(function(response) {
            var lat = response.lat;
            var long = response.long;
            var body = {
                company: controller.capturedCompany,
                description: controller.capturedDescription,
                contact: controller.capturedContact,
                website: controller.capturedWebsite,
                street: controller.capturedStreet,
                street2: controller.capturedStreet2,
                city: controller.capturedCity,
                state: controller.capturedState,
                zip: controller.capturedZip,
                category: controller.capturedCategory,
                lat: lat.toString(),
                long: long.toString()
            };

            controller.resourcesService.updateResource(id, body).then(function(response) {
                controller.getResources();
                controller.getIcons();
                controller.getcategories();

                //empty modal after successful update
                controller.capturedCompany = '';
                controller.capturedDescription = '';
                controller.capturedContact = '';
                controller.capturedWebsite = '';
                controller.capturedStreet = '';
                controller.capturedStreet2 = '';
                controller.capturedCity = '';
                controller.capturedState = '';
                controller.capturedZip = '';
                controller.capturedCategory = '';
                controller.capturedId = '';


            }, function(error) {
                console.log('error editing resource', error);
            }); //End of updateResourceService
        }); //End of verifyAddress
    }; //End of updateResource

    controller.findResourceId = function(id) {
        resourceIdToDelete = id;
    };

    controller.deleteResource = function() {
        controller.resourcesService.deleteResource(resourceIdToDelete).then(function(response) {
            controller.getResources();
        }, function(error) {
            console.log('error deleting resource', error);
        }); //End of deleteResource Service
    }; //End deleteResource

    controller.createCategory = function() {
        var data = {
            categoryName: controller.categoryName,
            color: controller.color
        };
        controller.resourcesService.createCategory(data).then(function(response) {
            controller.getcategories();
            controller.getIcons();
            //empty form
            controller.categoryName='';
            controller.color='';
        }, function(error) {
            console.log('error creating resource', error);
        }); //End of createCategory service

    }; //End of createCategory



    controller.captureOldColor = function(color) {
        controller.oldColor = color;
    };

    //updateCategory function
    controller.updateCategory = function(category) {

        var body = {
            categoryName: category.categoryName,
            color: category.newColor,
            oldColor: category.color
        };
        var id = category._id;

        controller.resourcesService.updateCategory(id, body).then(function(response) {
            controller.getcategories();
            controller.getResources();
            controller.getIcons();
        }, function(error) {
            console.log('error editing categories', error);
        }); //end of updateCategory service
    }; //end of updateCategory



    //find id to pass into delete category model confirmation
    controller.findCategoryId = function(id) {
        idToDelete = id;
    };
    // delete category
    controller.deleteCategory = function() {
        controller.resourcesService.deleteCategory(idToDelete).then(function(response) {
            controller.getcategories();
            controller.getIcons();
        }, function(error) {
            console.log('error deleting category');
        }); //End of deleteCategory service
    }; //End of deleteCategory


    controller.verifyAddress = function(address) {
        return $q(function(resolve, reject) {
            var geocoder = new google.maps.Geocoder();
            console.log(address);

            geocoder.geocode({
                address: address
            }, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat();
                    var long = results[0].geometry.location.lng();
                    resolve({
                        lat,
                        long
                    });
                } else { // if status value is not equal to "google.maps.GeocoderStatus.OK"
                    // warning message
                    alert("There is no address found! Please check and verify address is correct " + status);
                    reject();
                }
            });
        });
    };



    // other way to show dropdown functionality

    //   $('.selected-items-box').bind('click', function(e){
    //     e.stopPropagation();
    //     $('.multiple-select-wrapper .list').toggle('slideDown');
    //   });
    //
    //   $('.multiple-select-wrapper .list').bind('click', function(e){
    //   	e.stopPropagation();
    //     	$('.multiple-select-wrapper .list').slideUp();
    //   });
    //
    //   $(document).bind('click', function(){
    //   	$('.multiple-select-wrapper .list').slideUp();
    //   });
    //
    // controller.selectedColor=function(marker){
    //     controller.capturedMarker=marker;
    //     console.log(marker);
    // }









} //End of ResourcesController

//directive to convert url to correct format
angular.module('blueWatchApp')
    .directive('httpPrefix', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, controller) {
                function ensureHttpPrefix(value) {
                    // Add prefix if we don't have http:// prefix already AND we don't have part of it
                    if (value && !/^(https?):\/\//i.test(value) &&
                        'http://'.indexOf(value) !== 0 && 'https://'.indexOf(value) !== 0) {
                        controller.$setViewValue('http://' + value);
                        controller.$render();
                        return 'http://' + value;
                    } else
                        return value;
                }
                controller.$formatters.push(ensureHttpPrefix);
                controller.$parsers.splice(0, 0, ensureHttpPrefix);
            }
        };
    });
