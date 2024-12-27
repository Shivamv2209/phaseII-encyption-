import express from "express";
import cookieParser from "cookie-parser";
import user_model from "./models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtsecret = process.env.JWT_SECRET

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static("public"));

const port =3000;

app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.post("/create",  (req,res)=>{
    let {username,email,password,age} = req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async (err,hash)=>{
            let createduser  = await user_model.create({
                username,
                email,
                password:hash,
                age,
               })

            let token = jwt.sign({email},jwtsecret);
            res.cookie("token",token)

               res.send(createduser);
        })
    })
  
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
})

app.post("/login", async (req,res)=>{
  let user = await user_model.findOne({email:req.body.email});
 if(!user){
    res.send("Something went wrong");
 }

 bcrypt.compare(req.body.password, user.password ,(err,result)=>{
    if(result){
        let token = jwt.sign({email:user.email},jwtsecret);
        res.cookie("token",token)
        res.send("Loign successfull")
    }else{
        res.send("something is wrong")
    }
   
 })
})


app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/");
})


app.listen(port,()=>{
    console.log(`Server is running on the port ${port}`);
})