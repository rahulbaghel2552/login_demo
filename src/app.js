const express = require("express");
const path = require("path");
require("dotenv").config();
const hbs = require("hbs");
const db = require("../db/conn");
const Register = require("../models/register");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});


// create a new user to the database
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpass = req.body.cpass;

    if (password === cpass) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phoneno,
        age: req.body.age,
        password: req.body.password,
        confirmPassword: req.body.cpass,
      });

      console.log(registerEmployee);

      const token_val = await registerEmployee.generateAuthToken();
      console.log(`token_result token is ${token_val}`);

      res.cookie("jwt", token_val, { expires: new Date(Date.now() + 3000), httpOnly : true});
      

      const register_result = await registerEmployee.save();
      console.log(`register_result token is ${register_result}`); 

      res.status(201).render("dashboard");
    } else {
      res.send("password not match");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// createv login
app.post("/login", async (req, res) => {
  try {
    const email = req.body.username;
    const password = req.body.password;
    const user_email = await Register.findOne({ email: email });

    const token = await user_email.generateAuthToken();
    const password_compare = await bcrypt.compare(
      password,
      user_email.password
    );
    console.log(password_compare);

    res.cookie("jwt", token, { expires: new Date(Date.now() + 3000), httpOnly : true});

   

    if (password_compare) {
      res.status(201).render("dashboard");
      console.log("login sucessfully");
    } else {
      res.send("invalid email");
    }
  } catch (err) {
    res.send("invalid email addres");
  }
});

app.listen(port, () => {
  console.log(`listen to port no ${port}`);
});
