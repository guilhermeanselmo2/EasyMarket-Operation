var app = angular.module("operations", ['ui.router', 'ngResource']);

app.config(function($stateProvider, $urlRouterProvider) {
   $stateProvider
      .state('app', {
         url:'/',
            views: {
               'content': {
                  templateUrl : 'views/home.html',
                  controller  : 'HomeCtrl'
               }
            }
      })

      // route for the aboutus page
      .state('app.aboutus', {
          url:'aboutus',
          views: {
              'content@': {
                  templateUrl : 'views/about.html',
                  controller  : 'SobreCtrl'
              }
          }
      })

      // route for the contactus page
      .state('app.contactus', {
          url:'contactus',
          views: {
              'content@': {
                  templateUrl : 'views/contactus.html',
                  controller  : 'ContactController'
              }
          }
      });

   $urlRouterProvider.otherwise('/');
});


/*var app = angular.module("operations", ['ngRoute', 'ngResource']);

app.config(function($routeProvider, $locationProvider)
{
   // remove o # da url
   $locationProvider.html5Mode(false);
 
   $routeProvider
 
   // para a rota '/', carregaremos o template home.html e o controller 'HomeCtrl'
   .when('/', {
      templateUrl : 'views/home.html',
      controller     : 'HomeCtrl',
   })
 
   // para a rota '/sobre', carregaremos o template sobre.html e o controller 'SobreCtrl'
   .when('/sobre', {
      templateUrl : 'views/about.html',
      controller  : 'SobreCtrl',
   })
 
   // para a rota '/contato', carregaremos o template contato.html e o controller 'ContatoCtrl'
   .when('/contato', {
      templateUrl : 'views/contactus.html',
      controller  : 'ContatoCtrl',
   })
 
   // caso não seja nenhum desses, redirecione para a rota '/'
   .otherwise ({ redirectTo: '/' });
});*/