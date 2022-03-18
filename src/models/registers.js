const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchmema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // unique: true,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    // unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//generating token..............................................//
employeeSchmema.methods.generateAuthToken = async function () {
  try {
    // console.log(this.id);
    const token = jwt.sign({ _id: this._id.toString() },process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    // console.log(token);
    return token;
  } catch (error) {
    res.send("the error part" + error);
    console.log("the error part" + error);
  }
};


//convert password to heshpassword........................................//
employeeSchmema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Register = new mongoose.model("Register", employeeSchmema);

module.exports = Register;
