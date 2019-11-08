const mysql = require("mysql");
const chalk = require("chalk");
const inquirer = require("inquirer");
require("console.table");

const connection = require("./dbConnection");

// gets products from the database and updates the products variable
// paramater is a boolean to identify if manager wants to see low inventory (true)
function getProducts(showLowInventory) {
  console.log("\n");
  if (!showLowInventory) {
    var queryProducts = "SELECT * FROM products";
  } else {
    var queryProducts = "SELECT * FROM products WHERE stock_quantity < 6";
  }
  connection.query(queryProducts, function(error, results) {
    if (error) {
      console.log(chalk.red("Connection error occured!"));
    } else {
      console.table(results);
    }
    runMenu();
  });
}

function addInventory() {
  var queryProducts = "SELECT * FROM products";
  connection.query(queryProducts, function(error, results) {
    if (error) {
      console.log(chalk.red("Connection error occured!"));
    } else {
      console.table(results);
      inquirer
        .prompt([
          {
            name: "item_id",
            message: chalk.cyan(
              'Enter the "item_id" of the product that needs inventory added.'
            ),
            validate: function(value) {
              if (
                /[0-9]/g.test(value) &&
                value > 0 &&
                value <= results.length
              ) {
                return true;
              }
              return "Enter a valid ID!";
            }
          },
          {
            name: "count",
            message: chalk.cyan(
              "Enter the quantity of how much to increase the inventory of the product."
            ),
            validate: function(value) {
              if (/[0-9]/g.test(value) && value > 0) {
                return true;
              }
              return "Enter a valid quantity!";
            }
          }
        ])
        .then(function(answers) {
          var queryUpdate =
            "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
          stockCount =
            parseInt(answers.count) +
            parseInt(results[answers.item_id - 1].stock_quantity);
          connection.query(queryUpdate, [stockCount, answers.item_id], function(
            error
          ) {
            if (error) {
              console.log(
                chalk.red(
                  "There was an issue updating the quantity. Please try again."
                )
              );
            } else {
              console.log(chalk.greenBright("The inventory has been added."));
              runMenu();
            }
          });
        });
    }
  });
}

function addProduct() {
  var deptQuery = "SELECT * FROM departments";
  connection.query(deptQuery, function(error, results) {
    if (error) {
      console.log(chalk.red("Connection error occured!"));
    } else {
      var departments = [];
      results.forEach(row => {
        departments.push(row.dept_name);
      });
      inquirer
        .prompt([
          {
            name: "productName",
            message: chalk.cyan("Enter the name of the new product."),
            validate: function(value) {
              if (value != "" && value.length < 100) {
                return true;
              }
              return "Enter a valid product name!";
            }
          },
          {
            name: "deptName",
            message: chalk.cyan("Choose the department."),
            choices: departments,
            type: "list"
          },
          {
            name: "price",
            message: chalk.cyan("What is the price of this item?"),
            validate: function(value) {
              if (/[0-9]/g.test(value) && value > 0 && value < 9999999999.99) {
                return true;
              }
              return "Enter a valid price!";
            }
          },
          {
            name: "count",
            message: chalk.cyan("How many are in inventory?"),
            validate: function(value) {
              if (/[0-9]/g.test(value) && value > 0) {
                return true;
              }
              return "Enter a valid amount!";
            }
          }
        ])
        .then(function(answers) {
          var queryAdd =
            "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)";
          connection.query(
            queryAdd,
            [
              answers.productName,
              answers.deptName,
              answers.price,
              answers.count
            ],
            function(error) {
              if (error) {
                console.log(
                  chalk.red(
                    "There was an issue adding the product. Please try again."
                  )
                );
              } else {
                console.log(chalk.greenBright("The product has been added."));
              }
              runMenu();
            }
          );
        });
    }
  });
}

// run the menu options for the manager
function runMenu() {
  inquirer
    .prompt([
      {
        name: "menu",
        type: "list",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit"
        ],
        message: chalk.cyan("Select an option:")
      }
    ])
    .then(function(answers) {
      switch (answers.menu) {
        case "View Products for Sale":
          getProducts(false);
          break;
        case "View Low Inventory":
          getProducts(true);
          break;
        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          addProduct();
          break;
        default:
          connection.end();
      }
    });
}

runMenu();
