//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY)

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

main().catch(err => console.log(err));
mongoose.set('strictQuery',true);


async function main() {
  await mongoose.connect("mongodb://localhost:27017/userDB");
  }

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ['password']})

const User =new mongoose.model("User",userSchema)

app.get("/",function(req,res){
    res.render("home")
});

app.get("/login",function(req,res){
    res.render("login")
});

app.get("/register",function(req,res){
    res.render("register")
});

app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }
        else{
            console.log(err);
        }
    });
})

app.post("/login",function(req,res){
    const email = req.body.username
    const password = req.body.password
    User.findOne({email:email},function(err,foundemail){
        if(!err){
            if(foundemail){
                if(foundemail.password===password){
                    res.render("secrets")
                }
                else{
                    console.log("Wrong Password")
                }
            }
            else{
                console.log("Can not find a match email!")
            }
        }
        else{
            console.log(err)
        }
        
    })
})



app.listen(3000,function(){
    console.log("Server started on port 3000")
})
