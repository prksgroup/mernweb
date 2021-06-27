const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const userschema=new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})



userschema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12)
        this.cpassword=await bcrypt.hash(this.cpassword,12)
    }
    next();
})

userschema.methods.generateAuthToken=async function(){
    let tokengenerate=jwt.sign({_id:this._id},process.env.SECRET_KEY)
    this.tokens=this.tokens.concat({token:tokengenerate});
    await this.save()
    return tokengenerate;
}

const User=mongoose.model('Registeration',userschema)
module.exports=User;