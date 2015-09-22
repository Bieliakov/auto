module.exports = function (document, localStorage, XMLHttpRequest) {

    var Model       = require('./CarListModel.js');
    var View        = require('./CarListView.js')(document);

    var Car = require('../../common/car-item/itemController.js')(localStorage, XMLHttpRequest);

    var Q = require('../../../node_modules/q/q.js');

	function CarListController(service, events) {
        this.service = service;
        this.model = new Model(service);
        this.view = new View();
        this.events = events;
        this.view.bind('showNextPage',(function(){
            this.getNextCars();
        }).bind(this));
	}

    CarListController.prototype = {

		getCarIDsFromURL: function(searchParams){
            this.model.setSearchParams(searchParams);
            this.view.render('showLoading');
            this.getCarIds()
                .then((this.getCarPromices).bind(this))
                .then((this.showCars).bind(this))
                .then((this.getNextCars).bind(this));
		},

        getNextCars: function(){
            console.log('getNextCars');
            this.view.render('showAddLoading');
            this.model.nextPage();
            this.getCarIds()
                .then((this.getCarPromices).bind(this))
                .then((this.showAddCars).bind(this));
        },

        getCarIds: function(){
            return this.service.getCarIds(this.model.getSearchParams());
        },

        getCarPromices: function(carIds){
            if(!Array.isArray(carIds)){
                throw new Error('carIds is not Array in CarListController.showCars');
            }
            var carPromises = [];
            carIds.forEach((function(carId){
                if(isNaN(+carId)){
                    throw new Error('carIds must contain Array of numbers in CarListController.showCars');
                }
                var car = new Car(this.service,this.events);
                var carPromise = car.showCar(carId);
                carPromises.push(carPromise);
            }).bind(this));
            return carPromises;
        },

        showCars: function(carPromises) {
            Q.allSettled(carPromises)
                .then(function(carPromises){
                    var carHtmls = [];
                    carPromises.forEach(function(result){
                        if (result.state === 'fulfilled') {
                            carHtmls.push(result.value);
                        }
                    });
                    return carHtmls;
                })
                .then((function(carHtmls){
                    this.view.render('showCars', { cars : carHtmls});
                }).bind(this));
        },
        showAddCars: function(carPromises) {
            Q.allSettled(carPromises)
                .then(function(carPromises){
                    var carHtmls = [];
                    carPromises.forEach(function(result){
                        if (result.state === 'fulfilled') {
                            carHtmls.push(result.value);
                        }
                    });
                    return carHtmls;
                })
                .then((function(carHtmls){
                    this.view.render('showAddCars', { cars : carHtmls});
                    this.view.render('hideAddLoading');
                }).bind(this));
        }
	
	};

	return CarListController;

};