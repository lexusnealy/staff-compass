-- Insert departments
INSERT INTO department (name)
VALUES ('Design'),
       ('IT'),
       ('Engineering'),
       ('Consulting'),
       ('Management');

-- Insert roles
INSERT INTO role (title, salary, department_id)
VALUES ('Interior Designer', 80000, 1),
       ('IT Specialist', 80000, 2),
       ('Full stack Dev', 110000, 3),
       ('Design Consultant', 70000, 4),
       ('Project Manager', 100000, 5);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Destiny', 'Ray', 1, null),
       ('Hollie', 'Sails', 2, 1),
       ('Jacob', 'Bolawitz', 3, 1),
       ('Larry', 'Dirt', 4, 1),
       ('Amanda', 'Pultz', 5, null);