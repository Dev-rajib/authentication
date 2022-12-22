const express = require('express');
const router = new express.Router(); 
const userdb = require("../models/userSchema");
const bcrypt = require('bcrypt');
const authenticate = require("../middleware/authenticate");

router.post("/register",async(req,res)=>{
    const {name,email,password,confirm_password} = req.body;

    if(!name || !email || !password || !confirm_password){
        res.status(422).json({error:"Fill all details"});
    }

    try {
        const preuser = await userdb.findOne({email:email});
        if(preuser){
            res.status(422).json({error:"this email already exist"});  
    const {name,email,password,confirm_password} = req.body;
        }else if(password !== confirm_password){
            res.status(422).json({error:"password and confirm password not match"});
        }else{
            const finalUser = new userdb({
                name,email,password,confirm_password
            });

            // here password hasing 
            const storeData = await finalUser.save();
            console.log(storeData);
            res.status(201).json({status:201,storeData});
            
        }
    } catch (error) {
        res.status(422).json(error);  
        console.log("catch block error");
    }

});

// user login
router.post("/login",async(req,res)=>{
    //console.log(req.body);

    const {email,password} = req.body;

    if(!email || !password ){
        res.status(422).json({error:"Fill all details"});
    }

    try {
        const userValid = await userdb.findOne({email:email});
        
        if(userValid){
            const isMatch = await bcrypt.compare(password,userValid.password);
            //console.log(isMatch);
            if(!isMatch){
                res.status(422).json({error:"invalied details"})
            }else{
                // token generate
                const token = await userValid.generateAuthtoken();
                console.log(token);

                // cookie generate
                res.cookie("usercookie",token,{
                    expires:new Date(Date.now()+9000000),
                    httpOnly:true,
                });
                const result = {
                    userValid,
                    token
                }
                res.status(201).json({status:201,result})

            }
        }
    } catch (error) {
        res.status(401).json({status:401,message:"Unauthoriezed no token provide"});
    }

});

router.get("/validuser",authenticate,async(req,res)=>{
    try {
        const ValidUserOne = await userdb.findOne({_id:req.userId});
        res.status(201).json({status:201,ValidUserOne});
    } catch (error) {
        res.status(401).json({status:401,error});
    }
});

module.exports = router;