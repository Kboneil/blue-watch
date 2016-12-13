angular.module('blueWatchApp')
    .service('ReviewsService', ReviewsService);

function ReviewsService($http) {
    var service = this;

    service.getPendingReviews = function() {
        return $http.get('/reviews').then(function(response) {
            return response;
        });
    }; //End of getPendingReviews

    service.approvedReview = function(id, data) {
        return $http.put('/reviews/' + id, data).then(function(response) {
            return response;
        });
    }; //End of approvedReview /update

    service.deleteReview = function(id) {
        return $http.delete('/reviews/' + id).then(function(response) {
            return response;
        });
    }; //End of deleteReview

    service.getPublicReviews = function(id) {
        return $http.get('/publicreviews/' + id).then(function(response) {
            return response;
        });
    }; //End of getPublicReviews

    service.createReview = function(reviewData) {
        return $http.post('/publicreviews', reviewData).then(function(response) {
            return response;
        });
    }; //End of createReview

    service.sendEmail = function(data) {
        return $http.post('/publicreviews/mail', data).then(function(response) {
            return response;
        });
    }; //End of sendEmail

}; //End of service
