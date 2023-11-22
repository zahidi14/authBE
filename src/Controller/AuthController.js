const userSchema = require("../Models/UserModel");
const { createSecretToken } = require("../Util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existUser = await userSchema.findOne({ email });
    if (existUser) {
      return res.json({
        message: "User Allready Exist",
      });
    }
    const user = await userSchema.create({
      email,
      password,
      username,
      createdAt,
    });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      message: "user signed successfully",
      success: true,
      user,
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "all field are required" });
    }
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.json({
        message: "Incorrect Password or Email ",
      });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({
        message: "Incorrect Password or Ewmail",
      });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      message: "user Login Successfully",
      success: true,
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports.test = (req, res, next) => {
  res.status(200).json({
    message: "tset",
  });
};
