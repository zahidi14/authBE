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
      try {
        const user = await userSchema.findById(data.id); // Fix: use 'user' instead of 'usern'
        if (user)
          return res.json({
            status: true,
            user: "fuc",
            message: "fuck off", // Fix: Corrected the message
          });
        else return res.json({ status: false });
      } catch (error) {
        console.error("Error fetching user:", error);
        return res.json({ status: false });
      }
    }
  });
};
