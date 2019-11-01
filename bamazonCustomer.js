const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    // password is generic as it is public
    password: 'password1',
    database: 'bamazon'
});

var products;

var getProducts = function() {
    console.log('\n')
    var queryProducts = 'SELECT * FROM products';
    connection.query(queryProducts, function(error, results) {
        if (error) {
            console.log('\nThere was a connection error.')
        } else {
            products = results;
            console.log(chalk.magentaBright.underline('ID:\t|\tProduct      \t|\tPrice'))
            results.forEach(product => {
                if (product.stock_quantity > 0) {
                    var divider = '\t|\t';
                    var lg_divider = '     \t|\t';
                    var list = "";
                    if (product.product_name.length < 8) {
                        list = product.item_id +  divider + product.product_name + lg_divider + '$' + product.price;
                    } else if (product.product_name.length > 11) {
                        list = product.item_id +  divider + product.product_name.substring(0, 11) + divider + '$' + product.price;
                    } else {
                        list = product.item_id +  divider + product.product_name + divider + '$' + product.price;
                    }

                    if (product.item_id % 2 === 0) {
                        console.log(chalk.blue(list));
                    } else {
                        console.log(list);
                    }
                }
            });
            sellProducts();
        }
    });
}

var updateProducts = function(product_name, amount_purchased, cost) {
    var queryProducts = 'UPDATE products SET stock_quantity = stock_quantity - ? WHERE ?';
    connection.query(queryProducts, [amount_purchased, { product_name: product_name }], function(error, results) {
        if (error) throw error; 
        console.log('You purchased ' + product_name + ' at a quantity of ' + amount_purchased +
            '.\nYour total amount charged is $' + cost + '.' );
        buyAgain();
    });
}

function sellProducts() {
        inquirer.prompt([
            {
                name: 'prod_id',
                message: chalk.cyan('What is the ID of the product you want to buy?'),
                validate: function(value) {
                    if (/[0-9]/i.test(value) && value > 0 && value <= products.length) {
                        return true;
                    }
                    return 'Enter a valid ID!';
                }
            },
        ]).then(function(id_answer) {
            console.log(chalk.greenBright('\nYou selected ' + products[id_answer.prod_id-1].product_name + '. There are ' + products[id_answer.prod_id-1].stock_quantity + ' available to purchase.'));
            inquirer.prompt(
                {
                    name: 'quantity',
                    message: chalk.cyan('How many do you wish to buy?'),
                    validate: function(value) {
                        if (/[0-9]/i.test(value) && value > 0 && value <= products[id_answer.prod_id-1].stock_quantity) {
                            return true;
                        }
                        return chalk.redBright('Enter in a valid stock quantity');
                    }
                }).then(function(quantity_answer) {
                    var cost = products[id_answer.prod_id-1].price * quantity_answer.quantity;
                    updateProducts(products[id_answer.prod_id-1].product_name, quantity_answer.quantity, cost);
            });
        });    
}

function buyAgain() {
    inquirer.prompt(
        {
            name: 'again',
            message: 'Do you want to purchase another item?',
            type: 'confirm'
        }
    ).then(function(answer) {
        if (answer.again) {
            getProducts();
        } else {
            connection.end();
        }
    });
}

getProducts();