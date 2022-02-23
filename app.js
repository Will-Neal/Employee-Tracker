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
        name: "salary",
        type: "number",
        message: "What is the salary of the role?"
    },
    {
        name: "department",
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
                db.query(`INSERT INTO department (name) VALUE ('${data.department}')`, (err, results) => {
                    if (err) console.log(err);
                    console.log("Query complete...");
                    console.log(`${data.department} successfully added to departments...`);
                })
                
            })
        } else if (data.menu === "Add a role") {
            inquirer.prompt(role)
            .then((data) => {
                // console.log(data)
                // console.log(data.title)
                // console.log(data.salary)
                // console.log(data.department)
                departmentNum = 0
                if (data.department === "Engineering") {
                    departmentNum = 1;
                } else if (data.department === "Finance"){
                    departmentNum = 2;
                } else if (data.department === "Legal") {
                    departmentNum = 3;
                } else if (data.department === "Sales") {
                    departmentNum = 4;
                } else {
                    departmentNum = 5;
                }
                num = data.salary;
                console.log(num)
                stringDecimal = num.toFixed(2);
                salary = Number(stringDecimal)
                console.log(departmentNum)
                
                
                db.query(`INSERT INTO roles (title, salary, department_id) VALUE ('${data.title}', '${data.salary}', ${departmentNum})`, (err, results) => {
                    if (err) console.log(err);
                    console.log(results);
                    console.log(`${data.title} successfully added to roles...`)
                })
            })
        } else {
            process.exit()
        }
    }) 

}

appInit()
