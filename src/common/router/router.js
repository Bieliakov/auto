module.exports = (function(){

    function Router(){
        this.routes = {};
        window.addEventListener('hashchange', (this.router).bind(this));
        window.addEventListener('load', (this.router).bind(this));
    }

    Router.prototype = {
        route: function(path, Controller, params){
            this.routes[path] = { Controller: Controller, params: params };
        },
        router: function(){
            var hashLessURL = location.hash.slice(1) || '/';

            var hashLessURLArray = hashLessURL.split('/');
            var routeName = hashLessURLArray[0] || '/';

            var searchParams = {};
            for (var i = 1; i < hashLessURLArray.length; i = i + 2){
                searchParams[hashLessURLArray[i]] = hashLessURLArray[i + 1];
            }

            var route = this.routes[routeName];

            var routeController = new route.Controller(route.params);

            if (!routeController.started && routeController.init) {
                routeController.init(searchParams);
            } else if (routeName === '/'){
                window.app.buttonSearch.classList.toggle('active',true);
                window.app.buttonWishList.classList.toggle('active',false);
                routeController.init();
            }

            if (routeName === 'search') {
                window.app.buttonSearch.classList.toggle('active',true);
                window.app.buttonWishList.classList.toggle('active',false);
                routeController.init(searchParams);
            }

            if (routeName === 'wishlist'){
                window.app.buttonSearch.classList.toggle('active',false);
                window.app.buttonWishList.classList.toggle('active',true);
                routeController.init(searchParams);
            }
        }
    };

    return Router;

})();