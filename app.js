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


//Function that initializes the application
function appInit() {
    let deptNames = [];
    db.query('SELECT department FROM employees_db.department;', (err, results) => {
        if (err) console.log(err);
        for (const department of results) {
            deptNames.push(department.department)
            }
    });

    let rolesArray = [];
    db.query('SELECT title FROM employees_db.roles;', (err, results) => {
        if (err) console.log(err);
        for (const role of results) {
            rolesArray.push(role.title)
        }
    })

    let managerArray = [];
    db.query('SELECT CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee_info LEFT JOIN employee_info manager ON employee_info.manager_id = manager.id', (err, results) => {
        if (err) console.log(err);
        // console.log(results);
        for (const manager of results) {
            if (!managerArray.includes(manager.manager) && manager.manager !== null)
            managerArray.push(manager.manager)
        }
        console.log(managerArray)
    })
    
//Question Arrays for Inquirer

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
            choices:  deptNames
    
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
            choices: rolesArray
            // ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Lead Counsel", "Associate Counsel"]
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: managerArray
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
            choices: rolesArray
        }
    ]
    


    

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
            db.query("SELECT roles.id, roles.title, department.department, roles.salary FROM roles JOIN department ON roles.department_id=department.id ORDER BY id;", (err, results) => {
                if (err) console.log(err);
                console.table(results);
                appInit()
            }) 
        } else if (data.menu === "View all Employees") {
            db.query('SELECT employee_info.id, employee_info.first_name, employee_info.last_name, roles.title,department.department, roles.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee_info LEFT JOIN roles ON employee_info.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee_info manager ON employee_info.manager_id = manager.id', (err, results) => {
                if (err) console.log(err);
                console.table(results);
                appInit()
            }) 
        } else if (data.menu === "Add a department") {
            inquirer.prompt(department)
            .then((data) => {
                db.query(`INSERT INTO department (department) VALUE ('${data.department}')`, (err, results) => {
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
                db.query(`INSERT INTO roles (title, salary) VALUE ('${data.title}', '${data.salary}')`, (err, results) => {
                    if (err) console.log(err);
                    console.log(results);
                    console.log(`${data.title} successfully added to roles...`)
                    appInit();
                })
            })
        } else if (data.menu === "Add an employee"){
            inquirer.prompt(employee)
            .then((data) => {
                let managerID = 1
                db.query(`SELECT id FROM employee_info WHERE CONCAT(first_name, " ", last_name)="${data.manager}"`, (err, results) => {
                    if (err) console.log(err);
                    managerID = results[0].id
                })
                console.log(managerID)
                db.query(`INSERT INTO employee_info (first_name, last_name, role_id, manager_id) VALUE ('${data.firstName}', '${data.lastName}', 1, ${managerID})`, (err, results) => {
                    if (err) console.log(err);
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
