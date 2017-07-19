
app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){
    $routeProvider
        .when('/',{
            // location of the template
        	templateUrl		: 'views/index-view.html',
        	// Which controller it should use
          controller 		: 'mainController',
        	controllerAs 	: 'main'
        })
        .when('/matches',{
        	templateUrl     : 'views/matches-view.html',
        	controller 		: 'matchesController',
        	controllerAs 	: 'matches'
        })
        .when('/table',{

        	templateUrl     : 'views/table-view.html',
        	controller 		: 'tableController',
        	controllerAs 	: 'tcontrol'
        })
        .when('/match-detail-view',{

          templateUrl     : 'views/match-detail-view.html',
          controller 		: 'detailController',
          controllerAs 	: 'details'
        })

        .otherwise(
            {
                //redirectTo:'/'
                template   : '<h1>404 page not found</h1>'
            }
        );
        $locationProvider.html5Mode(true);
}]);
