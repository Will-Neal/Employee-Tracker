//Require 
const mysql = require('mysql2')
const inquirer = require('inquirer');
const { result } = require('lodash');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'rootpass',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database....`)
);

menu = [
    {
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: ["Choice1", "Choice2"]
    }
]

function appInit() {
    inquirer.prompt(menu)
    .then((data) => {
        console.log(data.menu)
        db.query('SELECT * FROM employees_db.department', (err, results) => {
            if (err) throw err;
            console.log(results)

        })
    }) 

}

appInit()