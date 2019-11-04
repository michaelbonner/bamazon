const mysql = require('mysql');
const chalk = require('chalk');
const inquirer = require('inquirer');
require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    // password is generic as it is public
    password: 'password1',
    database: 'bamazon'
});

function viewProductSales() {
    var queryDepts = 'SELECT a.dept_id, a.dept_name, a.over_head_costs, SUM(b.product_sales) AS total_sales, ' + 
                    'SUM(b.product_sales) - a.over_head_costs AS total_profit  ' +
                    'FROM departments a INNER JOIN products b ON a.dept_name = b.department_name ' +
                    'GROUP BY b.department_name;';
    connection.query(queryDepts, function(error, results) {
        if (error) {
            console.log(chalk.red('There was an error querying the data.'));
        } else {
            console.table(results);
            runMenu();
        }
    });
}

function createDepartment() {
    inquirer.prompt([
        {
            name: 'deptName',
            message: chalk.cyan('Enter the new department\'s name'),
            validate: function(value) {
                if (value != '' && value.length < 50) {
                    return true;
                }
                return 'Enter a valid department name!';
            }
        },
        {
            name: 'overhead',
            message: chalk.cyan('Enter the overhead cost for the department.'),
            validate: function(value) {
                if (/[0-9]/g.test(value) && value > 0 && value < 9999999999.99) {
                    return true;
                }
                return 'Enter a valid overhead cost!';
            }
        }
    ]).then(answers => {
        var queryAdd = 'INSERT INTO departments (dept_name, over_head_costs) VALUES (?, ?)';
        connection.query(queryAdd, [answers.deptName, answers.overhead], function(error) {
            if (error) {
                console.log(chalk.red('There was an issue adding the department. Please try again.'));
            } else {
                console.log(chalk.greenBright('The department has been added.'));
            }
            runMenu();
        });
    });
}

function runMenu() {
    inquirer.prompt([
        {
            name: 'choice',
            message: chalk.cyan('Choose an option below:'),
            choices: ['View Product Sales by Department', 'Create a New Department', 'Exit'],
            type: 'list'
        }
    ]).then(answer => {
        switch (answer.choice) {
            case 'View Product Sales by Department':
                viewProductSales();
                break;
            case 'Create a New Department':
                createDepartment();
                break;
            default:
                connection.end();
        }
    });
}

runMenu();