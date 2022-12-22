const jwt = require("jsonwebtoken");
const userdb = require('../models/userSchema');
const keysecret ='rajibsahajatindasnagarbelgharia';


const authenticate = async(req,res,next)=>{
    try {
        const token = req.headers.authorization;
        const varifytoken = jwt.verify(token,keysecret);
        //console.log(varifytoken);
        const rootUser = await userdb.findOne({_id:varifytoken._id});
        if(!rootUser){throw new Error("user not found")};

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;
        next();

    } catch (error) {
        
    }
}

module.exports = authenticate;