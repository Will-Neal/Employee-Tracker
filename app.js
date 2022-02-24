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

    //Dynamically generates department names for inquirer
    let deptNames = [];
    db.query('SELECT department FROM employees_db.department;', (err, results) => {
        if (err) console.log(err);
        for (const department of results) {
            deptNames.push(department.department)
            }
    });

    //Dynamically generates roles for inquirer
    let rolesArray = [];
    db.query('SELECT title FROM employees_db.roles;', (err, results) => {
        if (err) console.log(err);
        for (const role of results) {
            rolesArray.push(role.title)
        }
    })

    //Generates the mangers for use in inquirer
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

    //Dynamically generates employees for use in inquirer
    let employeeArray = []
    db.query('SELECT CONCAT (first_name, " ", last_name) AS employee FROM employee_info', (err, results) => {
        if (err) console.log(err);
        for (const employee of results) {
            employeeArray.push(employee.employee)
        }
    })

//Question Arrays for Inquirer, some questions reference arrays above

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
            choices: employeeArray
        },
        {
            name: "roleUpdate",
            type: "list",
            message: "What is the employee's new role?",
            choices: rolesArray
        }
    ]
    


    
    //Beginning of application - prompts with menu
    inquirer.prompt(mainMenu)
    .then((data) => {
        console.log(data.menu)
        

        //VIEW ALL DEPARTMENTS returns all departments including created departments
        if (data.menu === "View all Departments") {
            db.query("SELECT * FROM employees_db.department;", (err, results) => {
                if (err) console.log(err);
                console.table(results);
                appInit()
            })

        //VIEW ALL ROLES CODE returns all roles included created roles    
        } else if (data.menu === "View all Roles") {
            db.query("SELECT roles.id, roles.title, department.department, roles.salary FROM roles LEFT JOIN department ON roles.department_id=department.id ORDER BY id;", (err, results) => {
                if (err) console.log(err);
                console.table(results);
                appInit()
            }) 

        //VIEW ALL EMPLOYEES returns all employees including created employees    
        } else if (data.menu === "View all Employees") {
            db.query('SELECT employee_info.id, employee_info.first_name, employee_info.last_name, roles.title,department.department, roles.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee_info LEFT JOIN roles ON employee_info.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee_info manager ON employee_info.manager_id = manager.id', (err, results) => {
                if (err) console.log(err);
                console.table(results);
                appInit()
            }) 

        //ADD A DEPARTMENT inserts new department into db    
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

        //ADD A ROLE inserts a new role into db by using the department to get an id and then inserting that to table    
        } else if (data.menu === "Add a role") {
            inquirer.prompt(role)
            .then((data) => {
                const title = data.title;
                const salary = data.salary;
                db.query(`SELECT id FROM department WHERE department="${data.department}"`, (err, results) => {
                    if (err) console.log(err);
                    const departmentID = results[0].id
                    db.query(`INSERT INTO roles (title, salary, department_id) VALUE ('${title}', '${salary}', ${departmentID})`, (err, results) => {
                        if (err) console.log(err);
                        console.log(`${title} successfully added to roles...`)
                        appInit();
                    })
                })
                
            })

        //ADD AN EMPLOYEE inserts a new employee by first getting an id from same table using the managers name    
        } else if (data.menu === "Add an employee"){
            inquirer.prompt(employee)
            .then((data) => {
                const firstName = data.firstName;
                const lastName = data.lastName;
                db.query(`SELECT id FROM employee_info WHERE CONCAT(first_name, " ", last_name)="${data.manager}"`, (err, results) => {
                    if (err) console.log(err);
                    const managerID = results[0].id
                    db.query(`INSERT INTO employee_info (first_name, last_name, role_id, manager_id) VALUE ('${firstName}', '${lastName}', 1, ${managerID})`, (err, results) => {
                        if (err) console.log(err);
                        console.log(`${data.firstName} ${data.lastName} successfully added to employees`)
                        appInit();
                    })
                })

                
            })

        //UPDATE AN EMPLOYEE inserts new employee role by getting role id from roles table and then updating info in employee_info table    
        } else if (data.menu === "Update an employee role") {
            console.log("You have selected update an employee role")
            inquirer.prompt(updateRole)
            .then((data) => {
                const fullName = data.employee;
                db.query(`SELECT id FROM roles WHERE title="${data.roleUpdate}"`, (err, results) => {
                    if (err) console.log(err);
                    console.log(results[0].id);
                    idNum = results[0].id;
                    db.query(`UPDATE employee_info SET role_id = ${idNum} WHERE CONCAT (first_name, " ", last_name)="${fullName}"`)
                    console.log(`Employee ${fullName} updated successfully...`)
                    appInit()
                })
            })

        //EXIST closes app if user chooses exit    
        } else {
            process.exit()
        }
    }) 

}



//Call function to initialize app
appInit()
