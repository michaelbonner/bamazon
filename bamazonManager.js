const mysql = require('mysql');
const chalk = require('chalk');
const inquirer = require('inquirer');

function runMenu() {
    inquirer.prompt([
        {
            name: 'menu',
            type: 'list',
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ],
            message: 'Select an option:'
        }
    ]).then(function(answers) {
        
    });
}