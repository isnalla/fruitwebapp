var app = angular.module('dbsoria', ['ngAnimate'])
.factory('fruitFactory', function() {
	var dbHandler = new DBHandler();
	// dbHandler.setUpDatabase('mysql');
	// dbHandler.setUpDatabase('mongdb');
	// dbHandler.setUpDatabase('couchdb');

	var fruitFactory = {};

	fruitFactory.getData = function(callback) {
		return dbHandler.getData(callback);
	};

	fruitFactory.updateData = function(id, data) {
		dbHandler.updateData(id, data);
	};

	fruitFactory.deleteData = function(id) {
		dbHandler.deleteData(id);
	};

	fruitFactory.addData = function(data, callback) {
		dbHandler.addData(data, callback);
	}

	return fruitFactory;
})
.controller('bodyCtrl', function($scope, $animate, fruitFactory) {
	$scope.fruitstand = {
		openFruitstand: false,
		selectedFruit: {
			selected: false,
			_id: "",
			index: -1
		},
		editing: {
			name: "",
			distributor: "",
			price: "",
			quantity: ""
		},
		addNewFruit: false
	};

	$scope.fruitstand.fruits;
	fruitFactory.getData(function(data){

		$scope.fruitstand.fruits = data;
	});

	$scope.fruitstand.openningFruitstand = function() {
		$scope.fruitstand.openPacket = false;
		$scope.fruitstand.openFruitstand = true;
	};

	$scope.selectFruit = function(id) {
		if($scope.fruitstand.addNewFruit) {
			$scope.fruitstand.addNewFruit = false;
			$scope.fruitstand.viewOther = "";
		}
		$scope.fruitstand.selectedFruit._id = id;
		$scope.fruitstand.selectedFruit.index = $scope.findFruitIndex(id);
		$scope.fruitstand.selectedFruit.selected = true;
		$scope.fruitstand.viewOther = "viewInfo";
	}

	$scope.deselectFruit = function() {
		$scope.fruitstand.selectedFruit.selected = false;
		$scope.fruitstand.viewOther = "";

		$scope.fruitstand.showNameEdit = false;
		$scope.fruitstand.showDistributorEdit = false;
		$scope.fruitstand.showPriceEdit = false;
		$scope.fruitstand.showQuantityEdit = false;
	}

	$scope.submitChanges = function() {
		var submitted = $scope.fruitstand.editing;
		var changes = {};

		for(var key in submitted) {
			if(submitted[key] == "") continue;
			if(key != 'price') {
				changes[key] = submitted[key];
			}
			else {
				var date = new Date;
				var m = date.getMonth()+1;
				var d = date.getDate();
				var y = date.getFullYear();

				if(m < 10) m = "0" + m;
				if(d < 10) d = "0" + d;

				var curr = m + "-" + d + "-" + y;
				changes.price = ((submitted.price).indexOf('.') == -1)? submitted.price + ".00" : submitted.price;
				changes.dateUpdated = curr;
			}
		}

		if((Object.keys(changes)).length != 0) {
			fruitFactory.updateData($scope.fruitstand.selectedFruit._id, changes);
			var index = $scope.fruitstand.selectedFruit.index;
			for (var key in changes) {
				if(key == 'price') {
					$scope.fruitstand.fruits[index].price = changes.price;
					($scope.fruitstand.fruits[index].priceHistory).push({ amount: changes.price, dateUpdated: changes.dateUpdated });
				}
				else {
					$scope.fruitstand.fruits[index][key] = changes[key];
				}
			}
		}

		$scope.fruitstand.showNameEdit = false;
		$scope.fruitstand.showDistributorEdit = false;
		$scope.fruitstand.showPriceEdit = false;
		$scope.fruitstand.showQuantityEdit = false;
		$scope.fruitstand.editing = {};
	}

	$scope.findFruitIndex = function(id) {
		for(var i in $scope.fruitstand.fruits) {
			if($scope.fruitstand.fruits[i]._id == id) return i;
		}
		return -1;
	}

	$scope.deleteFruit = function() {
		$scope.fruitstand.selectedFruit.selected = false;
		$scope.fruitstand.viewOther = "";

		var index = $scope.fruitstand.selectedFruit.index;
		var removed = $scope.fruitstand.fruits.splice(index, 1);
		
		fruitFactory.deleteData($scope.fruitstand.selectedFruit._id);
	}

	$scope.addNew = function() {
		if($scope.fruitstand.selectedFruit.selected) {
			$scope.fruitstand.selectedFruit.selected = false;
			$scope.fruitstand.viewOther = "";
		}
		$scope.fruitstand.addNewFruit = true;
		$scope.fruitstand.viewOther = "viewAdd";
	}

	$scope.cancelAdd = function() {
		$scope.fruitstand.adding = {};
		$scope.fruitstand.addNewFruit = false;
		$scope.fruitstand.viewOther = "";
	}

	$scope.submitAdding = function() {
		$scope.fruitstand.addNewFruit = false;
		$scope.fruitstand.viewOther = "";
		var date = new Date;
		var m = date.getMonth()+1;
		var d = date.getDate();
		var y = date.getFullYear();

		if(m < 10) m = "0" + m;
		if(d < 10) d = "0" + d;

		var curr = m + "-" + d + "-" + y;
		var price = $scope.fruitstand.adding.price;
		$scope.fruitstand.adding.price = ((price).indexOf('.') == -1)? price + ".00" : price;
		$scope.fruitstand.adding.dateAdded = curr;
		$scope.fruitstand.adding.priceHistory = {
			amount: $scope.fruitstand.adding.price,
			dateUpdated: curr
		};
		fruitFactory.addData($scope.fruitstand.adding, function(newId) {
			// $scope.fruitstand.fruits = fruitFactory.getData();
			$scope.fruitstand.adding._id = newId;
			$scope.fruitstand.fruits.push($scope.fruitstand.adding);
		});
	}
})
.animation('.viewIntro', function() {
	return {
		enter: function(element, done) { done(); },
		leave: function(element, done) { done(); },
		move: function(element, done) { done(); },
		beforeAddClass: function(element, className, done) { 
			if(className == 'open') {
				var openButton = $(element.find('#openButton'));
				var flap = $(openButton.find('#flap'));

				openButton.on('webkitTransitionEnd', function() {
					done();
				});

				flap.one("webkitTransitionEnd", function() {
					openButton.css('background', '#00e676');
					$(this).animate({width: '100px'});
					done();
				});
			}
			else {
				done();
			}
		},
		addClass: function(element, className, done) { 
			if(className == 'open') {
				var introBg = $(element.find("#introBg"));
				var text1 = $(element.find('#text1'));
				var text2 = $(element.find('#text2'));
				var openButton = $(element.find('#openButton'));
				var text3 = $($(this).find("#text3"));

				done();
			}
			else {
				done();
			}
		},
		beforeRemoveClass: function(element, className, done) { done(); },
		removeClass: function(element, className, done) { done(); },
		allowCancel: function(element, className, done) { done(); }
	}
});