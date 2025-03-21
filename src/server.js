"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const dotenv_1 = __importDefault(require("dotenv"));
const colors_1 = __importDefault(require("colors"));
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
dotenv_1.default.config();
console.log(colors_1.default.red("WELCOME TO EMPLOYEE TRACKER!"));
console.log(colors_1.default.red("LETS GET STARTED!"));
console.log(colors_1.default.red("PLEASE SELECT AN OPTION FROM THE MENU BELOW."));
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: "localhost",
    database: process.env.DB_NAME,
    port: 5432,
});
const connectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.connect();
        console.log("Connected to the database.");
    }
    catch (err) {
        console.error("Error connecting to database:", err);
        process.exit(1);
    }
});
const mainMenu = () => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield inquirer_1.default.prompt([
        {
            type: "list",
            name: "mainMenu",
            message: colors_1.default.blue("WHAT WOULD YOU LIKE TO DO?"),
            choices: [
                "VIEW ALL DEPARTMENTS",
                "VIEW ALL ROLES",
                "VIEW ALL EMPLOYEES",
                "ADD A DEPARTMENT",
                "ADD A ROLE",
                "ADD AN EMPLOYEE",
                "UPDATE AN EMPLOYEE ROLE",
                "EXIT",
            ],
        },
    ]);
    switch (answers.mainMenu) {
        case "VIEW ALL DEPARTMENTS":
            yield viewDepartments();
            break;
        case "VIEW ALL ROLES":
            yield viewRoles();
            break;
        case "VIEW ALL EMPLOYEES":
            yield viewEmployees();
            break;
        case "ADD A DEPARTMENT":
            yield addDepartment();
            break;
        case "ADD A ROLE":
            yield addRole();
            break;
        case "ADD AN EMPLOYEE":
            yield addEmployee();
            break;
        case "UPDATE AN EMPLOYEE ROLE":
            yield updateEmployee();
            break;
        case "EXIT":
            process.exit(0);
    }
    // Show the menu again after completing the action
    yield mainMenu();
});
const viewDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM department");
    console.table(result.rows);
});
const viewRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM role");
    console.table(result.rows);
});
const viewEmployees = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM employee");
    console.table(result.rows);
});
const addDepartment = () => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield inquirer_1.default.prompt([
        {
            type: "input",
            name: "departmentName",
            message: colors_1.default.cyan("WHAT IS THE NAME OF THE DEPARTMENT?"),
        },
    ]);
    const { departmentName } = answers;
    yield pool.query(`INSERT INTO department (name) VALUES ($1);`, [
        departmentName,
    ]);
    console.log(colors_1.default.green("Department inserted successfully!"));
});
const addRole = () => __awaiter(void 0, void 0, void 0, function* () {
    const departments = yield pool.query("SELECT id, name FROM department");
    const departmentChoices = departments.rows.map((department) => ({
        name: department.name,
        value: department.id,
    }));
    const answers = yield inquirer_1.default.prompt([
        {
            type: "input",
            name: "roleTitle",
            message: colors_1.default.yellow("WHAT IS THE ROLE TITLE?"),
        },
        {
            type: "input",
            name: "roleSalary",
            message: colors_1.default.yellow("WHAT IS THE ROLE SALARY?"),
        },
        {
            type: "list",
            name: "roleDepartment",
            message: colors_1.default.yellow("WHAT DEPARTMENT IS THE ROLE IN?"),
            choices: departmentChoices,
        },
    ]);
    const { roleTitle, roleSalary, roleDepartment } = answers;
    yield pool.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`, [roleTitle, roleSalary, roleDepartment]);
    console.log("Role inserted successfully!");
});
const addEmployee = () => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield pool.query("SELECT id, title FROM role");
    const roleChoices = roles.rows.map((role) => ({
        name: role.title,
        value: role.id,
    }));
    const employees = yield pool.query("SELECT id, first_name, last_name FROM employee");
    const managerChoices = employees.rows.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));
    managerChoices.push({ name: "None", value: null });
    const answers = yield inquirer_1.default.prompt([
        {
            type: "input",
            name: "EmployeeFirstName",
            message: colors_1.default.red("WHAT IS THE EMPLOYEE FIRST NAME?"),
        },
        {
            type: "input",
            name: "EmployeeLastName",
            message: colors_1.default.red("WHAT IS THE EMPLOYEE LAST NAME?"),
        },
        {
            type: "list",
            name: "EmployeeRole",
            message: colors_1.default.red("WHAT IS THE EMPLOYEE ROLE?"),
            choices: roleChoices,
        },
        {
            type: "list",
            name: "EmployeeManager",
            message: colors_1.default.red("WHO IS THE EMPLOYEE MANAGER?"),
            choices: managerChoices,
        },
    ]);
    const { EmployeeFirstName, EmployeeLastName, EmployeeRole, EmployeeManager } = answers;
    yield pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [EmployeeFirstName, EmployeeLastName, EmployeeRole, EmployeeManager]);
    console.log("Employee inserted successfully!");
});
const updateEmployee = () => __awaiter(void 0, void 0, void 0, function* () {
    const employees = yield pool.query("SELECT first_name, last_name, role_id, manager_id FROM employee");
    const employeeChoices = employees.rows.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));
    const departments = yield pool.query("SELECT id, name FROM department");
    const departmentChoices = departments.rows.map((department) => ({
        name: department.name,
        value: department.id,
    }));
    const managerChoices = employees.rows.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));
    const roles = yield pool.query("SELECT id, title FROM role");
    const roleChoices = roles.rows.map((role) => ({
        name: role.title,
        value: role.id,
    }));
    const answers = yield inquirer_1.default.prompt([
        {
            type: "list",
            name: "updateEmployee",
            message: colors_1.default.magenta("WHICH EMPLOYEE WOULD YOU LIKE TO UPDATE?"),
            choices: employeeChoices,
        },
        {
            type: "list",
            name: "updateRole",
            message: colors_1.default.magenta("WHAT IS THEIR NEW ROLE?"),
            choices: roleChoices,
        },
        {
            type: "list",
            name: "updateManager",
            message: colors_1.default.magenta("WHO IS THEIR NEW MANAGER?"),
            choices: managerChoices,
        },
        {
            type: "list",
            name: "updateDepartment",
            message: colors_1.default.magenta("WHAT IS THEIR NEW DEPARTMENT?"),
            choices: departmentChoices,
        },
        {
            type: "input",
            name: "updateSalary",
            message: colors_1.default.magenta("WHAT IS THE EMPLOYEE NEW SALARY?"),
        },
    ]);
    const { updateEmployee, updateRole, updateManager, updateDepartment, updateSalary, } = answers;
    yield pool.query(`UPDATE employee SET role_id = $1, manager_id = $2 WHERE id = $3`, [updateRole, updateManager, updateEmployee]);
    yield pool.query(`UPDATE role set department_id = $1, salary = $2 WHERE id = $3`, [updateDepartment, updateSalary, updateRole]);
    console.log("Employee updated successfully!");
});
connectToDb().then(() => {
    mainMenu();
});
