const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async (req, res, next) => { //doubt.........clear javascript excute line by line when he got error he break
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(verifyUser);

    const user = await Register.findOne({ _id: verifyUser._id });
    // console.log(user.firstname);

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res.status(401).send(error);
  }
};

module.exports = auth;
