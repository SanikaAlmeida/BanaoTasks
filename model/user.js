const mongoose= require('mongoose')
const Schema=mongoose.Schema

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    resetToken:{ 
        type: String 
    },
    resetTokenExpiry:{
         type: Date 
    },
})

module.exports=mongoose.model('User',userSchema)