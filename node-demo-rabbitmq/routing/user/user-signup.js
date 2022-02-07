const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
let producer = require('../../common-modules/rabbitmq/producer')
// let consumer = require('../../common-modules/rabbitmq/consumer')

router.post("/signup", async (req, res) => {
  try {
    let userBody = req.body;
    let array1 = ["name", "email", "phone", "password"];
    for (let i = 0; i < array1.length; i++) {
      let element = array1[i];
      if (!userBody[element]) {
        res.status(400).json({ message: "Field is missing" });
      }
    }

    // let user = await User.findOne({$or : [{email : userBody.email} , {phone : userBody.phone}]})
    // if(user){
    //     res.status(400).json({message : "User already exists"})
    // }

    let newUser = new User();
    newUser.name = userBody.name;
    newUser.email = userBody.email;
    newUser.phone = userBody.phone;
    newUser.password = await bcrypt.hashSync(userBody.password, 10);
    let doc = await newUser.save();
    console.log(doc)
    if (doc) {
      let payload = {
        id: doc._id,
      };
      let token = await jwt.sign(payload, process.env.USER_KEY, {
        expiresIn: "24h",
      });
      await producer.sendMessageMatchResult(doc)

      res.status(200).json({
        message: {
          data: doc,
          token: token,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    let userBody = req.body;
    let array1 = [ "email", "password"];
    for (let i = 0; i < array1.length; i++) {
      let element = array1[i];
      if (!userBody[element]) {
        res.status(400).json({ message: "Field is missing" });
      }
    }
      let doc = await User.findOne({email : userBody.email}).select('+password')
if(doc)
{

      if(bcrypt.compareSync(userBody.password , doc.password) ){
          let payload = {
              id : doc._id
          }

          let token = jwt.sign(payload , process.env.USER_KEY , {
              expiresIn : '24h'
          })

          res.status(200).json({message : 'success' , data : doc, token : token})
      }
      else{
          res.status(400).json({message : "Password is wrong"})
      }
}
else{
    res.status(400).json({message : "User not found"})
}
 
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
