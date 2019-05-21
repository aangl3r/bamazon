var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'bamazonDB'
});

//this function makes sure the user is putting only whole numbers as inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return "Please enter a Whole number only.";
	}
}

//this is the function that prompts the customer to make a purchase
function purchase() {

	//inquirer prompt
	inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: "Please enter the ID of the item you would like to buy.",
			validate: validateInput,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: "How many would you like to purchase?",
			validate: validateInput,
			filter: Number
		}
	]).then(function(input) {

		var item = input.id;
		var quantity = input.quantity;

		//query the bamazonDB for data
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {id: item}, function(err, data) {
			if (err) throw err;

            //if the user enters a whole number ID that does not exist, the data array will be empty and this returns an error
			if (data.length === 0) {
				console.log('Invalid ID');
				displayInventory();

			} else {
				var productData = data[0];

				//checks if the quantity requested is available
				if (quantity <= productData.stock_quantity) {
					console.log("Your item is in stock!");

					//var to hold the query that will update the products table
					var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE id = ' + item;

					//updates inventory and tells the user the total
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log("Your oder has been placed! Please pay $" + productData.price * quantity);
						console.log("\n---------------------------------------------------\n");

						connection.end();
					})
                }
                //if quantity requested is not available
                else {
					console.log("This product is not available in the quantity requested. Please try again.");
					console.log("\n---------------------------------------------------\n");

					displayInventory();
				}
			}
		})
	})
}

//this function displays the inventory in the console
function displayInventory() {

	//query variable for DB
	queryStr = 'SELECT * FROM products';

	//db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log("Current Inventory: ");
		console.log("\n---------------------------------------------------\n");

        //var to hold the output from the query
		var output = "";
		for (var i = 0; i < data.length; i++) {
			output = "";
			output += "Item ID: " + data[i].id + " -- ";
			output += "Product Name: " + data[i].product_name + " -- ";
			output += "Department: " + data[i].department_name + " -- ";
			output += "Price: $" + data[i].price + "\n";

			console.log(output);
		}

        console.log("\n---------------------------------------------------\n");

	  	//Prompt the user for item/quantity they would like to purchase
	  	purchase();
	})
}

// Run the application logic
displayInventory();