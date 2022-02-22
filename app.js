//Require 
const mysql = require('mysql2')
const inquirer = require('inquirer');
const { result } = require('lodash');
const { exit } = require('process');

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

mainMenu = [
    {
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View all Departments", "View all Roles", "View all Employees", "Add a department", "Add a role", "Add an employee", "Update an employee Role", "Exit"]
    }
]

function appInit() {
    inquirer.prompt(mainMenu)
    .then((data) => {
        console.log(data.menu)
        if (data.menu === "View all Departments") {
            db.query("SELECT * FROM employees_db.department;", (err, results) => {
                if (err) console.log(err);
                console.table(results);
                appInit()
            })
        } else if (data.menu === "View all Roles") {
            db.query("SELECT * FROM employees_db.roles;", (err, results) => {
                if (err) console.log(err);
                console.table(results);
                appInit()
            }) 
        } else if (data.menu === "View all Employees") {
            db.query("SELECT * FROM employees_db.employee_info;", (err, results) => {
                if (err) console.log(err);
                console.table(results);
                appInit()
            }) 
        } else {
            process.exit()
        }
    }) 

}

appInit()
