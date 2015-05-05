function DBHandler() {
	this.define = {};
}

DBHandler.prototype = {
	setUpDatabase: function(dbms, credentials) {
		switch(dbms) {
			case 'mysql':
				this.define.dbms = 'mysql';
				break;
			case 'mongodb':
				this.define.dbms = 'mongodb';
				break;
			case 'couchdb':
				this.define.dbms = 'couchdb';
				break;
		}
	},

	getData: function(callback) {
		var data = {action: "get_fruits"};
		$.post("../server/index.php", data, function(result){
			var result = JSON.parse(result);
			console.log(result);

			callback(result);
		});
	},
	updateData: function(id, data) {
		console.log("Received update data");
		console.log(id);
		console.log(data);

		id = id.$id;

		var postData = {action: "edit_fruit", id: id, update: data};

		$.post("../server/index.php", postData, function(result){
			console.log(result);
			$("#viewPane").html(result);
		
		});
	},
	deleteData: function(id) {
		console.log(id);
		id = id.$id;

		var data = {action: 'delete_fruit', id: id};

		$.post("../server/index.php", data, function(result){
			console.log("deleted fruit:"+id);
			$("#viewPane").html(result);
		});

	},
	addData: function(data, callback) {
		data.action = "add_fruit";
		console.log(data);
		//$("#viewPane").html(data);
		
		$.post("../server/index.php", data, function(id){
			console.log("added fruit:"+id);
			//$("#viewPane").html(result);
			callback(id);
		});
	}
}