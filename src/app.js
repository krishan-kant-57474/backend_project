require("dotenv").config();
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
require("./db/conn");
const Register = require("./models/registers");
const auth = require("./middleware/auth");


const app = express();
const hbs = require("hbs");
const port = process.env.PORT || 3000;


const static_path = path.join(__dirname, "../public"); //in this line i am doing silly misktake... i am not using "/" before public
const tamplate_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); //doute => use in place app.use(express.json()) for get in form anything //
app.use(express.static(static_path));


app.set("view engine", "hbs");
app.set("views", tamplate_path);
hbs.registerPartials(partials_path);

// console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/secret", auth, (req, res) => {
  // console.log(`this is a cookies = ${req.cookies.jwt}`);
  res.render("secret");
});

app.get("/logout", auth, async (req, res) => {//doute clear => get want res.send()//
  try {
    // console.log(req.user);

    //for single logout,.........................................................//
    // req.user.tokens = req.user.tokens.filter((currElement) => {
    //   return currElement.token != req.token;
    // });

    // logout from all devices...................................................//
    req.user.tokens = [];
    res.clearCookie("jwt");
    // console.log("logout");
    await req.user.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: password,
        confirmpassword: cpassword,
      });
      // console.log(registerEmployee);

      //middleware..................before save we convert password and also generate token.............................//
      const token = await registerEmployee.generateAuthToken();
      // console.log("the token part_1 " + token);
      
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true,
      });
      console.log(cookie);     //doubte

      const register = await registerEmployee.save();
      res.status(201).render("index");
    } else {
      res.send("password are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// login check.....................................//
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, useremail.password);

    const token = await useremail.generateAuthToken();
    // console.log("the token part_2 " + token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
    });

    // console.log(isMatch);
    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("invalid password details");
    }
  } catch (error) {
    res.status(400).send("invalid login details");
  }
});

app.listen(port, () => {
  console.log(`surver is running at port no. ${port}`);
});
