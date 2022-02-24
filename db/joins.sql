--Join for show all roles
SELECT roles.id, roles.title, department.department, roles.salary
FROM roles
JOIN department
ON roles.department_id=department.id