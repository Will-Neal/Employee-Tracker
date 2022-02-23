//Require 
const mysql = require('mysql2')
const inquirer = require('inquirer');
const { result } = require('lodash');
const { exit } = require('process');

//establish connection with mysql
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

//Obtain info from databases to use in question arrays


// function getDepartments() {
//     db.query('SELECT name FROM employees_db.department;', (err, results) => {
//         if (err) console.log(err);
//         for (const department of results) {
//             console.log(department.name)
//         }
//     })
   
// }

// getDepartments()

//Question Arrays
const mainMenu = [
    {
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View all Departments", "View all Roles", "View all Employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"]
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

const employee = [
    {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
    },
    {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
    },
    {
        name: "role",
        type: "list",
        message: "What is the employees role?",
        choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Lead Counsel", "Associate Counsel"]
    },
    {
        name: "manager",
        type: "list",
        message: "Who is the employee's manager?",
        choices: [1, 4, 8, 10]
    }
]

const updateRole = [
    {
        name: "employee",
        type: "list",
        message: "Which employee would you like to update the role for?",
        choices: [1, 2, 3, 4, 5, 6, 7, 8 , 9, 10 , 11, 12]
    },
    {
        name: "roleUpdate",
        type: "list",
        message: "What is the employee's new role?",
        choices: [1, 2, 3, 4, 5, 6, 7, 8]
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
            db.query("SELECT roles.id, roles.title, department.department, roles.salary FROM roles JOIN department ON roles.department_id=department.id;", (err, results) => {
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
                    appInit();
                })
                
            })
        } else if (data.menu === "Add a role") {
            inquirer.prompt(role)
            .then((data) => {
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
                stringDecimal = num.toFixed(2);
                salary = Number(stringDecimal)
                db.query(`INSERT INTO roles (title, salary, department_id) VALUE ('${data.title}', '${data.salary}', ${departmentNum})`, (err, results) => {
                    if (err) console.log(err);
                    console.log(results);
                    console.log(`${data.title} successfully added to roles...`)
                    appInit();
                })
            })
        } else if (data.menu === "Add an employee"){
            inquirer.prompt(employee)
            .then((data) => {
                console.log(data)
                db.query(`INSERT INTO employee_info (first_name, last_name, role_id, manager_id) VALUE ('${data.firstName}', '${data.lastName}', 1, ${data.manager})`, (err, results) => {
                    if (err) console.log(err);
                    console.log(results);
                    console.log(`${data.firstName} ${data.lastName} successfully added to employees`)
                    appInit();
                })
            })
        } else if (data.menu === "Update an employee role") {
            console.log("You have selected update an employee role")
            inquirer.prompt(updateRole)
            .then((data) => {
                console.log(data)
                db.query(`UPDATE `) 
            })
        } else {
            process.exit()
        }
    }) 

}

appInit()
