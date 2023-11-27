const userSchema = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = userSchema.findById(data._id);
      if (user)
        return res.json({
          status: true,
          user: data,
          message: "fuck of",
        });
      else return res.json({ status: false });
    }
  });
};
