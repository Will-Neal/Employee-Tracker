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

const mainMenu = [
    {
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View all Departments", "View all Roles", "View all Employees", "Add a department", "Add a role", "Add an employee", "Update an employee Role", "Exit"]
    }
]

const department = [
    {
        name: "department",
        type: "input",
        message: "What is the name of the department?"
    }
]

const role = [
    {
        name: "title",
        type: "input",
        message: "What is the name of the role?"
    },
    {
        name: "Salary",
        type: "number",
        message: "What is the salary of the role?"
    },
    {
        name: "deparment",
        type: "list",
        message: "Which Department does the role belong to?",
        choices: ["Sales", "Engineering", "Finance", "Legal"]
    },
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
        } else if (data.menu === "Add a department") {
            inquirer.prompt(department)
            .then((data) => {
                console.log(data.department)
                db.query(`INSERT INTO department (name) VALUE ('${data.department}')`, (err, results) => {
                    if (err) console.log(err);
                    console.log("Query complete...");
                    console.log(results);
                })
                
            })
        } else if (data.menu === "Add a role") {
            inquirer.prompt(role)
            .then((data) => {
                console.log(data)
            })
        } else {
            process.exit()
        }
    }) 

}

appInit()
