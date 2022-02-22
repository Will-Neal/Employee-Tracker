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

mainMenu = [
    {
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View all Departments", "View all Roles", "View all Employees", "Add a department", "Add a role", "Add an employee", "Update an employee Role"]
    }
]

function appInit() {
    inquirer.prompt(mainMenu)
    .then((data) => {
        if (data.menu === "View all Departments") {
            console.log("view all deparments selected")
        }
    }) 

}

appInit()

// function appInit() {
//     inquirer.prompt(mainMenu)
//     .then((data) => {
//         console.log(data.menu)
//         db.query('SELECT * FROM employees_db.department', (err, results) => {
//             if (err) throw err;
//             console.log(results)

//         })
//     }) 

// }