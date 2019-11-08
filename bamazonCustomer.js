const inquirer = require("inquirer");
const chalk = require("chalk");

const connection = require("./dbConnection");

// var to store the products from the DB
var products;
// var to identify if this is the first time the program is running
var runFirstTime = true;

// gets products from the database and updates the products variable
function getProducts() {
  var queryProducts = "SELECT * FROM products";
  connection.query(queryProducts, function(error, results) {
    if (error) {
      console.log("Connection error occured!");
    } else {
      products = results;
    }
    // if this is the first time its ran get a list of products
    if (runFirstTime) {
      getListofProducts();
      // set runFirstTime to false so that it doesnt run again
      runFirstTime = false;
    }
  });
}

function getListofProducts() {
  console.log("\n");
  // table headers
  console.log(chalk.magentaBright.underline("ID:\t|\tProduct      \t|\tPrice"));
  // products data results in unified columns
  products.forEach(product => {
    var divider = "\t|\t";
    var lg_divider = "     \t|\t";
    var list = "";
    if (product.product_name.length < 8) {
      list =
        product.item_id +
        divider +
        product.product_name +
        lg_divider +
        "$" +
        product.price.toFixed(2);
    } else if (product.product_name.length > 11) {
      list =
        product.item_id +
        divider +
        product.product_name.substring(0, 11) +
        divider +
        "$" +
        product.price.toFixed(2);
    } else {
      list =
        product.item_id +
        divider +
        product.product_name +
        divider +
        "$" +
        product.price.toFixed(2);
    }

    // set alternating colors and gray if out of stock
    if (product.stock_quantity > 0) {
      if (product.item_id % 2 === 0) {
        console.log(chalk.blue(list));
      } else {
        console.log(list);
      }
    } else {
      console.log(chalk.gray.strikethrough(list + " OUT OF STOCK"));
    }
  });

  // call sellProducts to start the questions
  sellProducts();
}

var updateProducts = function(product_name, amount_purchased, cost, sales) {
  var queryProducts =
    "UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = ? WHERE ?";
  connection.query(
    queryProducts,
    [amount_purchased, sales, { product_name: product_name }],
    function(error, results) {
      if (error) throw error;
      console.log(
        chalk.greenBright(
          "You purchased " +
            product_name +
            " at a quantity of " +
            amount_purchased +
            ".\nYour total amount charged is $" +
            cost.toFixed(2) +
            "."
        )
      );
      getProducts();
      buyAgain();
    }
  );
};

function sellProducts() {
  inquirer
    .prompt([
      {
        name: "prod_id",
        message: chalk.cyan("What is the ID of the product you want to buy?"),
        validate: function(value) {
          if (/[0-9]/g.test(value) && value > 0 && value <= products.length) {
            if (products[value - 1].stock_quantity < 1) {
              return "Out of stock! Choose another item!";
            }
            return true;
          }
          return "Enter a valid ID!";
        }
      }
    ])
    .then(function(id_answer) {
      console.log(
        chalk.greenBright(
          "\nYou selected " +
            products[id_answer.prod_id - 1].product_name +
            ". There are " +
            products[id_answer.prod_id - 1].stock_quantity +
            " available to purchase."
        )
      );
      inquirer
        .prompt({
          name: "quantity",
          message: chalk.cyan("How many do you wish to buy?"),
          validate: function(value) {
            if (
              /[0-9]/g.test(value) &&
              value > 0 &&
              value <= products[id_answer.prod_id - 1].stock_quantity
            ) {
              return true;
            }
            return chalk.redBright("Enter in a valid stock quantity");
          }
        })
        .then(function(quantity_answer) {
          var cost =
            products[id_answer.prod_id - 1].price * quantity_answer.quantity;
          var sales = products[id_answer.prod_id - 1].product_sales + cost;
          updateProducts(
            products[id_answer.prod_id - 1].product_name,
            quantity_answer.quantity,
            cost,
            sales
          );
        });
    });
}

function buyAgain() {
  inquirer
    .prompt({
      name: "again",
      message: "Do you want to purchase another item?",
      type: "confirm"
    })
    .then(function(answer) {
      if (answer.again) {
        getListofProducts();
      } else {
        connection.end();
      }
    });
}

getProducts();
