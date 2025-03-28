const Employee = require('../models/Employee');

const employeeController = {};

employeeController.list = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('../views/employee/list', { employees: employees });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

employeeController.show = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.render('../views/employee/show', { employee: employee });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

employeeController.create = (req, res) => {
  res.render('../views/employee/create');
};

employeeController.save = async (req, res) => {
  try {
    const employee = new Employee({
      name: req.body.name,
      address: req.body.address,
      position: req.body.position,
      salary: req.body.salary,
      updated_at: Date.now(),
    });
    await employee.save();
    res.redirect("/employees/show/" + employee._id);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(error => error.message);
      return res.status(400).render("../views/employee/create", { errors: validationErrors });
    }
    res.status(500).send("Internal server error");
  }
};

employeeController.edit = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.render('../views/employee/edit', { employee: employee });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

employeeController.update = async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      address: req.body.address,
      position: req.body.position,
      salary: req.body.salary,
      updated_at: Date.now(),
    });
    res.redirect("/employees/show/" + req.params.id);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

employeeController.delete = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect("/employees");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

module.exports = employeeController;