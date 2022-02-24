--Join for show all roles
SELECT roles.id, roles.title, department.department, roles.salary
FROM roles
JOIN department
ON roles.department_id=department.id

--Join got show all Employees
SELECT employee_info.id, employee_info.first_name, employee_info.last_name,roles.title,department.department, roles.salary,
CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employee_info
LEFT JOIN roles ON employee_info.role_id = roles.id
LEFT JOIN department ON roles.department_id = department.id
LEFT JOIN employee_info manager ON employee_info.manager_id = manager.id