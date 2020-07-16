const router = require("express").Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { loginValidation, registerValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("hello Authentication ");
});

router.post("/signup", (req, res) => {
  // Joi Validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(422).json({ error: error.details[0].message });

  const { name, email, password } = req.body;

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User Email already exists" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "User registered successfully!" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/protected", (req, res) => {
  res.send("hello User");
});

router.post("/login", (req, res) => {
  // Joi Validation
  const { error } = loginValidation(req.body);
  if (error) res.status(422).send(error.details[0].message);

  const { email, password } = req.body;
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((matched) => {
        if (matched) {
          //   res.json({ message: "Succefully signedin" });
          const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET || "mysecret"
          );
          res.json({ token });
        } else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
