angular.module('blueWatchApp')
    .controller('ApprovalController', ApprovalController);

function ApprovalController(adminservice, ReviewsService, ResourcesService) {
    console.log('ApprovalController loaded!');

    var review = this;
    review.reviewsArray = [];
    review.resources = [];
    review.reviewsService = ReviewsService;
    review.resourceService = ResourcesService;

    //whenever controller is loaded, will check to see if user which/if any user is logged in
    adminservice.normalLoggedin();

    review.getPendingReviews = function() {
        review.reviewsService.getPendingReviews().then(function(response) {
            review.reviewsArray = response.data;
            review.getResources();
        }, function(error) {
            console.log('error getting reviews', error);
        });
    }; //End of getPendingReviews

    //get pending reviews on load
    review.getPendingReviews();

    review.getResources = function() {
        review.resourceService.getResources().then(function(response) {
            review.resources = response.data;
            review.addCompanyName(review.resources);
        }, function(error) {
            console.log('error getting resources', error);
        });
    }; //End of getResources

    review.addCompanyName = function(resources) {
        review.reviewsArray.forEach(function(review) {
            resources.forEach(function(resource) {
                if (review.resource_id == resource._id) {
                    review.companyName = resource.company;
                }
            });
        });
    }; //End of addCompanyName

    review.captureInfo = function(reviews) {
        review.capturedCompanyName = reviews.companyName;
        review.capturedComments = reviews.comments;
        review.capturedRating = reviews.rating;
        review.capturedId = reviews._id;
    }; //End of capture info on modal click

    review.approvedReview = function(id, comments) {
        var data = {
            comments: comments
        }
        review.reviewsService.approvedReview(id, data).then(function(response) {
            review.getPendingReviews();
        }, function(error) {
            console.log('error approving review', error);
        });
    }; //End of approvedReview

    review.deleteReview = function(id) {
        review.reviewsService.deleteReview(id).then(function(response) {
            review.getPendingReviews();
        }, function(error) {
            console.log('error deleting review', error);
        });
    }; //End of deleteReview

} // End of ApprovalController
