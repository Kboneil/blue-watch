angular.module('blueWatchApp')
    .controller('AdminSetupController', AdminSetupController);

function AdminSetupController(adminservice, $location) {
    console.log('AdminSetupController loaded!');
    $(document).ready(function() {
        $('[data-toggle="popover"]').popover();
    });
    var admin = this;
    admin.usersArray = [];
    admin.capturedId = '';
    admin.accessLevel = 'no';
    admin.adminservice = adminservice;


    //whenever controller is loaded, will check to see if user which/if any user is logged in
    admin.adminservice.loggedin();

    admin.getUsers = function() {
            admin.adminservice.getUsers().then(function(response) {
                console.log('successfully get users', response);
                admin.usersArray = response.data;
            });
        } //End of getUser

    admin.addNewUser = function(firstName, lastName, email, password, access) {

        var data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            accessLevel: admin.accessLevel
        };

        admin.adminservice.addNewUser(data).then(function(response) {
            console.log('successfully added a new user', response);
            admin.getUsers();
            // empty form
            admin.firstName = '';
            admin.lastName = '';
            admin.email = '';
            admin.password = '';
            admin.accessLevel = 'no';
        });

    }; //End of addNewUser



    admin.getUsers();

    //capturen info on modal click
    admin.captureInfo = function(id, firstName, lastName, email, password, access) {
        admin.capturedId = id;
        admin.capturedFirstName = firstName;
        admin.capturedLastName = lastName;
        admin.capturedEmail = email;
        admin.capturedPassword = password;
        admin.capturedAccessLevel = access;
    }; //End of captureId

    admin.updateUser = function(firstName, lastName, email, password, access) {
        var data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            accessLevel: access
        };
        admin.adminservice.updateUser(admin.capturedId, data).then(function(response) {
            console.log('successfully updated the user', response);
            admin.getUsers();

            // empty form
            admin.firstName = '';
            admin.lastName = '';
            admin.email = '';
            admin.password = '';
            admin.accessLevel = 'no';

        });
    }; //End of updateUser



    admin.deleteUser = function(id) {

        admin.adminservice.deleteUser(id).then(function(response) {
            console.log('successfully deleted the user', response);
            admin.getUsers();
        });
    }; //End of deleteUser

  


}; // End of AdminSetupController
