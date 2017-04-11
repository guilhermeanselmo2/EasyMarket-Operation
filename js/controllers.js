'use strict';

angular.module('operations')

.controller('HomeCtrl', ['$scope', '$rootScope', '$location', 'crawlService', 'dbService', function($scope, $rootScope, $location, crawlService, dbService)
{
    $rootScope.activetab = $location.path();
    var categories = crawlService.getCategories();
    var categoriesCleared = [];
    $scope.mainCategory = categories[0];
    
    var getCategoriesFromDb = function(){
        dbService.getCategories().query()
        .$promise.then(
            function(response) {
                console.log("Got categories!");
                $scope.categories = response;
            },
            function(response) {
                console.log("Voltou algo errado");
                $scope.message = "PC-Error: "+response.status + " " + response.statusText;
                console.log($scope.message);
                console.log("Response String is :\n" + response);
                console.log("Response JSON is :\n" + JSON.stringify(response));
            }
        );
    }

    var getSubCategories = function(){
        dbService.getSubCategories().query()
        .$promise.then(
            function(response) {
                console.log("Got subcategories");
                $scope.subCategories = response;
            },
            function(response) {
                console.log("Voltou algo errado");
                $scope.message = "PC-Error: "+response.status + " " + response.statusText;
                console.log($scope.message);
                console.log("Response String is :\n" + response);
                console.log("Response JSON is :\n" + JSON.stringify(response));
            }
        );
    }

    getCategoriesFromDb();
    getSubCategories();
       

    $scope.fetchCategories = function(supermarketId){
        if($scope.categories.length > 0){
            for(var index = 0; index < $scope.categories.length; index++){
                categoriesCleared.push(false);
                clearSubCategories($scope.categories[index].id, index, supermarketId);
            }
        } else {
            crawlCategories();
        }
    }

    var clearCategories = function(supermarketId){
        dbService.deleteAllCategories(supermarketId).delete()
        .$promise.then(
            function(response) {
                console.log("Deleted all categories");
                console.log("Response is :\n" + JSON.stringify(response));
                $scope.categories = [];
                $scope.subCategories = [];
                crawlCategories();
            },
            function(response) {
                console.log("Something went wrong while deleting the categories");
                $scope.message = "PC-Error: "+response.status + " " + response.statusText;
                console.log($scope.message);
                console.log("Response String is :\n" + response);
                console.log("Response JSON is :\n" + JSON.stringify(response));
            }
        );
    }

    var crawlCategories = function(){
        crawlService.crawlCategories().query()
        .$promise.then(
            function(response) {
                console.log("Finished crawling");
                for(var index = 0; index < response.length; index++){
                    var category = {};
                    console.log(response[index].name);
                    category.name = response[index].name;
                    category.link = response[index].link;
                    category.supermarketId = response[index].supermarketId;
                    $scope.categories.push(category);
                    var subCategories = response[index].subCategories;
                    for(var subIndex = 0; subIndex < subCategories.length; subIndex++){
                        var subCategory = {};
                        subCategory.name = subCategories[subIndex].name;
                        subCategory.link = subCategories[subIndex].link;
                        subCategory.categoryId = response[index].link;
                        $scope.subCategories.push(subCategory);
                    }
                }
                //$scope.categories = response;
                //console.log("Response is :\n" + JSON.stringify(response));
                saveCategories($scope.categories);
            },
            function(response) {
                console.log("Something went wrong while crawling the categories");
                $scope.message = "PC-Error: "+response.status + " " + response.statusText;
                console.log($scope.message);
                console.log("Response String is :\n" + response);
                console.log("Response JSON is :\n" + JSON.stringify(response));
            }
        );

    }

    var clearSubCategories = function(categoryId, index, supermarketId){
        console.log("clearSubCategories index: " + index);
        dbService.deleteAllSubCategories(categoryId).delete()
        .$promise.then(
            function(response) {
                console.log("Deleted all sub categories");
                $scope.categories = [];
                $scope.subCategories = [];
                categoriesCleared[index] = true;
                if(categoriesCleared.indexOf(false) === -1){
                    clearCategories(supermarketId);
                }

            },
            function(response) {
                console.log("Something went wrong while deleting the sub categories");
                $scope.message = "PC-Error: "+response.status + " " + response.statusText;
                console.log($scope.message);
                console.log("Response String is :\n" + response);
                console.log("Response JSON is :\n" + JSON.stringify(response));
            }
        );
    }

    var deleteSubCategoryById = function(subCategoryId){
        dbService.deleteSubCategoryById(subCategoryId).delete()
        .$promise.then(
            function(response) {
                console.log("Deleted sub category " + subCategoryId);

            },
            function(response) {
                console.log("Something went wrong while deleting the sub categories");
                $scope.message = "PC-Error: "+response.status + " " + response.statusText;
                console.log($scope.message);
                console.log("Response String is :\n" + response);
                console.log("Response JSON is :\n" + JSON.stringify(response));
            }
        );
    }

    var saveCategories = function(categories){
        dbService.saveCategories().save(categories)
        .$promise.then(
            function(response) {
                console.log("Finished saving the categories to the db");
                var idMap = {};
                for(var index = 0; index < response.length; index++){
                    idMap[response[index].link] = response[index].id;
                }
                updateSubCategoriesId(idMap);
                saveSubCategories($scope.subCategories);
            },
            function(response) {
                console.log("Something went wrong while saving the categories");
                $scope.message = "PC-Error: "+response.status + " " + response.statusText;
                console.log($scope.message);
                console.log("Response String is :\n" + response);
                console.log("Response JSON is :\n" + JSON.stringify(response));
            }
        );
    }

    var saveSubCategories = function(subCategories){
        dbService.saveSubCategories().save(subCategories)
        .$promise.then(
            function(response) {
                console.log("Finished saving the subCategories to the db");
            },
            function(response) {
                console.log("Something went wrong while saving the subCategories");
                $scope.message = "PC-Error: "+response.status + " " + response.statusText;
                console.log($scope.message);
                console.log("Response String is :\n" + response);
                console.log("Response JSON is :\n" + JSON.stringify(response));
            }
        );
    }


    var updateSubCategoriesId = function(idMap){
        console.log("Update subcategories Id");
        for(var index = 0; index < $scope.subCategories.length; index++){
            $scope.subCategories[index].categoryId = idMap[$scope.subCategories[index].categoryId];
        }
        console.log("Finished updating");
    }



}]);
 
app.controller('SobreCtrl', function($rootScope, $location)
{
   $rootScope.activetab = $location.path();
});
 
app.controller('ContatoCtrl', function($rootScope, $location)
{
   $rootScope.activetab = $location.path();
});