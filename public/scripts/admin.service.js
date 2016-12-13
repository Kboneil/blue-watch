angular.module('blueWatchApp')
    .service('adminservice', function($http) {

        var adminservice = this;
        //this is to use logged in user in view
        adminservice.user = "";
        adminservice.isLoggedIn = false;
        adminservice.accessLevel = false;

        adminservice.loggedin = function() {
            return $http.get('/admin/adminSchema').then(function(response) {
                adminservice.user = response.data.firstName;
                adminservice.isLoggedIn = true;
                if (response.data.accessLevel == 'no') {
                    adminservice.accessLevel = false;
                } else {
                    adminservice.accessLevel = true;
                }

                return adminservice.user;

            }, function(error) {

                return adminservice.isLoggedIn = false;
            });
        };


        adminservice.normalLoggedin = function() {
            return $http.get('/login/info').then(function(response) {
                adminservice.user = response.data.firstName;
                adminservice.isLoggedIn = true;
                if (response.data.accessLevel == 'no') {
                    adminservice.accessLevel = false;
                } else {
                    adminservice.accessLevel = true;
                }

                return adminservice.user;

            }, function(error) {

                return adminservice.isLoggedIn = false;
            });
        };

        //get admin users
        adminservice.getUsers = function() {
            return $http.get('/admin').then(function(response) {
                return response;
            });
        }; //End of get admin users

        //add new user
        adminservice.addNewUser = function(userData) {
            return $http.post('/admin', userData).then(function(response) {
                return response;
            });
        }; //End of addNewUser

        adminservice.updateUser = function(id, userData) {
            return $http.put('/admin/' + id, userData).then(function(response) {
                return response;
            });
        }; //End of updateUser

        adminservice.deleteUser = function(id) {
            return $http.delete('/admin/' + id).then(function(response) {
                return response;
            });
        }; //End of deleteUser

    }); //End of service function
