angular.module('blueWatchApp')
    .controller('LoginController', LoginController);

function LoginController($http, $location, adminservice) {
    console.log('LoginController loaded');
    var controller = this;
    controller.adminservice = adminservice;
    controller.showFailLoginAlert = false;
    controller.firstLoggedInAlert = true;
    controller.adminservice.id;

    controller.adminservice.firstName;
    controller.adminservice.lastName;
    controller.adminservice.email;



    //logged in email to display
    controller.loggedInEmail = function() {
      console.log('check user');
        controller.adminservice.normalLoggedin().then(function(response) {

        }, function(error) {
            $location.path('/login');
        });
    };
    //whenever controller is loaded, will check to see if user which/if any user is logged in
controller.loggedInEmail();

    controller.login = function() {
        console.log('logging in');
        $http.post('/login', {
            email: controller.email,
            password: controller.password,
        }).then(function() {
          controller.showFailLoginAlert = false;
            controller.adminservice.normalLoggedin();
            if (adminservice.loggedInDate == undefined || adminservice.loggedInDate == '' || adminservice.loggedInDate == null) {
                console.log(controller.firstLoggedInAlert);
                $location.path('/userUpdate');
            } else {
                $location.path('/resources');
            }
        }, function(error) {
          controller.showFailLoginAlert = true;
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


 // switch flag
 controller.switchBool = function (value) {
     controller.showFailLoginAlert = !controller.showFailLoginAlert;
     controller.firstLoggedInAlert = !controller.firstLoggedInAlert;
 };

 controller.updatePassword = function(id, password) {
     var data = {
         password: password
     };
     controller.adminservice.updatePassword(id, data).then(function(response) {
         console.log('successfully updated password', response);
         $location.path('/resources');

         // empty form
         controller.password = '';


     });
 }





}
