const express = require('express')
const User=require('../models/User')
const { body, validationResult } = require('express-validator');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const JWT_Secret="satyamisa@godd@boy@loafer"
const router=express.Router();
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','password must be 8 character long').isLength({min:8}),
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    let user=await User.findOne({email:req.body.email})
    console.log(user);
    if(user){
        return res.status(400).json({error:"SOrry the person with this email already exists."});
    }
    const secpass=await argon2.hash(req.body.password);
    user=await User.create({
        name: req.body.name,
        password: secpass,
        email: req.body.email
      })
      const data={
        user:{
          id:user.id
        }
      }
      // .then(user => res.json(user));
      const authtoken=jwt.sign(data,JWT_Secret)
      res.json({authtoken})
    }catch(error){
      console.log(error.message)
      res.status(500).json({error:"Some error ocuuerd"})
    }
})
module.exports=router;