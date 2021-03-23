const { Router } = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.post(
  "/register",
  [
    check("email", "Ivalid email").isEmail(),
    check("password", "Min length of password 6 symbols").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data",
        });
      }
      const { email, password } = req.body;
      const name = "";
      const isLogin = false;
      const status = "unblock";
      const candidate = await User.findOne({ email });
      const superUser = false;
      if (candidate) {
        return res.status(400).json({ message: "Such user already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword, name, isLogin,status,superUser });

      await user.save();

      res.status(201).json({ message: "User created" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong, try again" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Enter corect email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User is not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password, try again" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "8h",
      });

      res.json({ token, userId: user.id,status:user.status });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong, try again" });
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const data = await User.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    User.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
      User.findOne({ _id: req.params.id }).then(function (users) {
        res.json(users);
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {

    User.findByIdAndRemove({ _id: req.params.id }).then(function (users) {
      res.json(users);
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

module.exports = router;
