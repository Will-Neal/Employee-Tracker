INSERT INTO department (name)
VALUE ("Engineering"),("Finance"),("Legal"),("Sales");

INSERT INTO roles (id, title, salary, department_id)
VALUE (1, "Sales Lead", 100000.00, 4),(2, "Salesperson", 80000.00, 4),(3, "Lead Engineer", 150000.00, 1),(4, "Software Engineer", 120000.00, 1),(5, "Account Manager", 160000.00, 2),(6, "Accountant", 125000.00, 2),(7, "Lead Counsel", 250000.00, 3),(8, "Associate Counsel", 190000.00, 3);


INSERT INTO employee_info (first_name, last_name, role_id, manager_id)
VALUE("Woody", "Vicente", 5, NULL),("Dixon", "Menendez", 6, 1),("Natalia", "Aleksandrov", 6, 1),("Elizabeth", "Robertson", 7, NULL),("Yafa", "MacDougall", 8, 4),("Tyler", "Durden", 8, 4),("Min", "Alesi", 1, NULL),("Clark", "Slater", 2, 8),("Jana", "Scott", 2, 8),("Gabe", "Byer", 3, NULL), ("Harry", "Bowron", 4, 10),("Gregor","Winkle", 4, 10);