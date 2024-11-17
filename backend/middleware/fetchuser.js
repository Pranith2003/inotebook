const jwt = require("jsonwebtoken");
require("dotenv").config();

const fetchuser = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      return res
        .status(401)
        .json({ error: "Please authenticate using valid token" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
    // console.log("From Fetch User: ", data)
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

module.exports = fetchuser;
