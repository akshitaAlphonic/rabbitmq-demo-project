const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

router.use(require("./user/user-signup"));

router.use((req, res, next) => {
  let token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.USER_KEY, (err, decoded) => {
      if (err) {
        res.status(400).json({ message: "Fail to authenticate token" });
      } else {
        decoded = jwt.decode(token, {
          complete: true,
        });
        req.doc = decoded.payload;
        next();
      }
    });
  } else {
    res.status(400).json({ message: "No token provided" });
  }
});

module.exports = router;
