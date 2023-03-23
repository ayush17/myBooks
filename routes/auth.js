const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../model/customer");
const { registerValidation, loginValidation } = require("../validate");

router.post("/register", async (req, res) => {
  //validation will happen here
  // and if there is error then it throws an error
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await Customer.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already Exist");

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const customer = new Customer({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedCustomer = await customer.save();
    res.send({ customer: customer._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  //validation will happen here
  // and if there is error then it throws an error
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findOne({ email: req.body.email });
  if (!customer) return res.status(400).send("Email is not found");

  // password is correct
  const validPassword = await bcrypt.compare(
    req.body.password,
    customer.password
  );
  if (!validPassword) return res.status(400).send("Invalid Password ");

  // Create and assign a token
  const token = jwt.sign({ _id: customer._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});
module.exports = router;
