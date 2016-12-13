angular.module('blueWatchApp')
    .service('ResourcesService', ResourcesService);

function ResourcesService($http) {
    var service = this;
    service.openIcons = [];

    service.icons = {
        'green': {
            icon: '/assets/img/Green_Marker.png'
        },
        'purple': {
            icon: '/assets/img/Purple_Marker.png'
        },
        'yellow': {
            icon: '/assets/img/Yellow_Marker.png'
        },
        'orange': {
            icon: '/assets/img/Orange_Marker.png'
        },
        'blue': {
            icon: '/assets/img/Blue_Marker.png'
        },
        'red': {
            icon: '/assets/img/Red_Marker.png'
        },
        'pink': {
            icon: 'assets/img/Pink_Marker.png'
        },
        'light purple': {
            icon: '/assets/img/LightPurple_Marker.png'
        },
        'light green': {
            icon: '/assets/img/LightGreen_Marker.png'
        },
        'lighter green': {
            icon: '/assets/img/LighterGreen_Marker.png'
        },
        'light blue': {
            icon: '/assets/img/LightBlue_Marker.png'
        },
        'lighter blue': {
            icon: '/assets/img/LighterBlue_Marker.png'
        },
        'gray': {
            icon: '/assets/img/Gray_Marker.png'
        },
        'gold': {
            icon: 'assets/img/Gold_Marker.png'
        },
        'burgundy': {
            icon: 'assets/img/Burgundy_Marker.png'
        }
    };

    service.createresource = function(resourceData) {
        return $http.post('/resource', resourceData).then(function(response) {
            return response;
        });
    }; //End of createresource

    service.getResources = function() {
        return $http.get('/resource').then(function(response) {
            return response;
        });

    }; //End of getResources

    service.updateResource = function(id, resourceData) {
        return $http.put('/resource/' + id, resourceData).then(function(response) {
            return response;
        });
    }; //End of updateResource

    service.deleteResource = function(id) {
        return $http.delete('/resource/' + id).then(function(response) {
            return response;
        });
    }; //End of deleteResource

    service.getIcons = function() {
        return $http.get('/icons').then(function(response) {
            return response;
        });
    }; //End of getIcons

    service.getcategories = function() {
        return $http.get('/categories').then(function(response) {
            return response;
        });
    }; //End of getcategories

    service.createCategory = function(categoryData) {
        return $http.post('/categories', categoryData).then(function(response) {
            return response;
        });
    }; //End of createCategory

    service.updateCategory = function(id, categoryData) {
        return $http.put('/categories/' + id, categoryData).then(function(response) {
            return response;
        });

    }; //End of updateCategory
    service.deleteCategory = function(id) {
        return $http.delete('/categories/' + id).then(function(response) {
            return response;
        });
    }; //End of deleteCategory

    service.getSearchedResource = function(search){
      return $http.get('/resource/' + search).then(function(response){
        return response;
      });
    }; //End of getSearchedResource

};
