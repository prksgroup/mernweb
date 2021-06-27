const express=require('express')
const router=express.Router();
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('../db/conn');
const User=require('../model/userSchema');

router.get('/',(req,res)=>{
   res.send("Hi from Router Server!!");
});


//User Registeration 
router.post('/register',async (req,res)=>{

    
    const { fname,email,password,cpassword,phone }=req.body;

    console.log("Data recieved ",fname,email,password,cpassword,phone)
    if(!fname || !email || !phone || !password || !cpassword){
        res.status(422).json({message:`Some required fields are missing `});
    }

    try{


        const userExist= await User.findOne({email:email,phone:phone});
        
        if(userExist){
            res.status(409).json({message:`${email} User already exist`})
        }else if(password!=cpassword){
            res.status(409).json({error:`Password and Confirm password should match`});
        }else{
            const newUser=new User({fname:fname,email:email,password:password,cpassword:password,phone:phone});

            const userDataSaving= await newUser.save();
            if(userDataSaving){
                res.status(201).json({message:`${email} user registered successfully`});
            }else{
                res.status(500).json({message:`error occurred while saving data into database ${err}`})
            }
        }

        

    }catch(err){
        console.log("Error---",err);
    }
    
    // console.log(req.body);
    // res.json({message:req.body})
    // res.send("Data posted successfully");
    
});



//User Login
router.post('/signin',async (req,res)=>{
    const {email,password}=req.body;
    console.log(email,"  ",password)
    if(!email || !password){
        res.status(400).json({error:`Invalid Details`});
    }
    try{

        const userExist=await User.findOne({email:email});
        const ismatch=await bcrypt.compare(password,userExist.password)

        if(userExist){
            if(ismatch){

                const token=await userExist.generateAuthToken();
                console.log("JWTTOKEN-",token)
                
                res.cookie('jwtToken',token,{
                    expires:new Date(Date.now()+23452000),
                    httpOnly:true
                })
                res.status(200).json({message:"User Login successfully"});

            }else{
                res.status(400).json({error:`Invalid credentials`});
            }
            
        }else{
            res.status(400).json({error:"Sign Up first user does not exist"})
        }

        

    }catch(err){
        console.log("Error while signing ",err);
    }
    
})
module.exports = router;