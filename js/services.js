'use strict';

angular.module('operations')
    .constant("baseURL","https://easymarket-server.mybluemix.net/api/")
    .constant("dbBaseURL","https://easymarket-db.mybluemix.net/api/")
    .service('crawlService', ['$resource', 'baseURL', function($resource,baseURL) {

        this.getCategories = function() {
            console.log('getCategories');
            var categories = ['categoria 1'];
            return categories;
        }

        this.crawlCategories = function() {
            return $resource(baseURL+"categories",null, {'query': {method:'GET', isArray:true}});
        }

    }])

    .service('dbService', ['$resource', 'dbBaseURL', function($resource,dbBaseURL) {

        this.getCategories = function() {
            return $resource(dbBaseURL+"categories",null, {'query': {method:'GET', isArray:true}});
        }

        this.saveCategories = function() {
            return $resource(dbBaseURL+"categories",null, {'save': {method:'POST', isArray:true}});
        }

        this.saveSubCategories = function() {
            return $resource(dbBaseURL+"SubCategories",null, {'save': {method:'POST', isArray:true}});
        }

        this.deleteAllCategories = function(supermarketId) {
            var url = dbBaseURL+"Supermarkets/" + supermarketId + "/categories";
            return $resource(url,{'delete' : {method: 'DELETE'}});
        }

        this.getSubCategories = function() {
            return $resource(dbBaseURL+"subCategories",null, {'query': {method:'GET', isArray:true}});
        }

        this.deleteAllSubCategories = function(categoryId) { 
            var url = dbBaseURL+"Categories/" + categoryId + "/subCategories";
            return $resource(url,{'delete' : {method: 'DELETE'}});
        }

        this.deleteSubCategoryById = function(subCategoryId) { 
            var url = dbBaseURL+"subCategories/" + subCategoryId;
            return $resource(url,{'delete' : {method: 'DELETE'}});
        }

    }])

    ;