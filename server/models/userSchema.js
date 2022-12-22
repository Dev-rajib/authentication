const mongoose = require('mongoose');
//mongoose.set('strictQuery', true);
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keysecret ='rajibsahajatindasnagarbelgharia';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not valid email")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    confirm_password:{
        type:String,
        required:true,
        minlength:6,
    },
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]
});


// hash password

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
        this.confirm_password = await bcrypt.hash(this.confirm_password,12);
    }
    
    next()
});

// token generate 
userSchema.methods.generateAuthtoken = async function(){
    try {
        let tokenGen = jwt.sign({_id:this._id},keysecret,{
            expiresIn:"1d"
        })

        this.tokens = this.tokens.concat({token:tokenGen});
        await this.save();
        return tokenGen;

    } catch (error) {
        res.status(422).json(error);
    }
}






// creating model
const userdb = new mongoose.model("users",userSchema);

module.exports = userdb;