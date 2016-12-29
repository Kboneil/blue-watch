angular.module('blueWatchApp')
    .controller('LoginController', LoginController);

function LoginController($http, $location, adminservice) {
    console.log('LoginController loaded');
    var controller = this;
    controller.adminservice = adminservice;

    //whenever controller is loaded, will check to see if user which/if any user is logged in
    // adminservice.loggedin();


    //logged in email to display
    controller.loggedInEmail = function() {
        adminservice.loggedin().then(function(response) {}, function(error) {
            $location.path('/login');
        });
    };

    controller.login = function() {
        console.log('logging in');
        $http.post('/login', {
            email: controller.email,
            password: controller.password,
        }).then(function() {
            controller.loggedInEmail();
            adminservice.normalLoggedin();
            if (adminservice.loggedInDate == undefined || adminservice.loggedInDate == '' || adminservice.loggedInDate == null) {
                $location.path('/userUpdate');
            } else {
                $location.path('/resources');
            }
        }, function(error) {
            console.log('error loggin in', error);
        });
    };

    controller.forgotPasswordEmail = function(email) {
        var body = {
            email: email
        };
        $http.post('/login/mail', body).then(function(response) {
            controller.email = '';
        }, function(error) {
            console.log('error in searching email', error);
        });
    };



}
