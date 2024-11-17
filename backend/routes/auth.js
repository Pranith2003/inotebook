const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/AuthToken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
require("dotenv").config();

//Route 1:
router.post(
  "/signup",
  [
    body("name", "Enter name min 3 letters").isLength({ min: 5 }),
    body("email", "give string is not in email format").isEmail(),
    body("password", "shoud contain > 8 letters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const isUser = await User.findOne({ email: req.body.email });
        if (isUser) {
          return res
            .status(400)
            .json({ message: "User Already Exists try Signin" });
        }
        const salt = await bcrypt.genSalt(10);
        // console.log("Salt", salt)
        const secPass = await bcrypt.hash(req.body.password, salt);
        // console.log("secPass", secPass)

        const user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass,
        });

        const data = {
          user: {
            id: user.id,
          },
        };

        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        const token = await new Token({
          token: authToken,
          userid: user.id,
          action: "Sign Up",
        });
        const savedToken = await token.save();
        // console.log("Saved Token", savedtoken);
        return res
          .status(201)
          .json({
            Message: "SignUp Successfully",
            user: user,
            authToken,
            savedToken,
          });
      } catch (error) {
        return res
          .status(500)
          .json({ error_code: error.code, message: error.message });
      }
    }
  }
);

// Route 2:

router.post(
  "/signin",
  [
    body("email", "give string is not in email format").isEmail(),
    body("password", "shoud contain > 8 letters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const { email, password } = req.body;
        const isUser = await User.findOne({ email });
        if (isUser) {
          const comparePassword = await bcrypt.compare(
            password,
            isUser.password
          );
          // console.log(comparePassword)
          if (comparePassword) {
            const data = {
              user: {
                id: isUser.id,
              },
            };
            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            const token = await new Token({
              token: authToken,
              userid: isUser.id,
              action: "Sign In",
            });
            const savedToken = await token.save();
            // console.log("Saved Token", savedtoken);
            return res.status(200).json({
              message: `Welcome ${isUser.name}!!... Login Successful`,
              isUser,
              authToken,
              savedToken,
            });
          } else {
            return res.status(400).json({ message: "Incorrect Credentails" });
          }
        } else {
          return res
            .status(400)
            .json({ message: "Please enter correct credentials" });
        }
      } catch (error) {
        console.log(error)
        return res
          .status(500)
          .json({ error_code: error.code, message: error.message });
      }
    }
  }
);

router.post("/getuser", fetchuser, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isUser = await User.findById(userId).select("-password");
    return res.send({ isUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
