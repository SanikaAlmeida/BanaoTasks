const User = require('../model/user')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto = require('crypto');

const register = async (req,res)=>{
    try{
        const user=new User({
            username:req.body.username,
            password:req.body.password,
            email:req.body.email,
        })
        user.password=await bcrypt.hash(user.password, 10)
        const user1=await user.save()
        const token=jwt.sign({_id:user._id},process.env.TOKEN_KEY,{expiresIn: "24h"})
        res.json({message: "Signup successful",token,user});
    }
    catch(error){
        res.status(500).send(error)
    }
}

const log= async(req,res)=>{
    try{
        const username=req.body.username
        const password=req.body.password

        const user=await User.findOne({username:username})
        if(user){
            const validpassword= await bcrypt.compare(password, user.password)
            if(validpassword){
                const token=jwt.sign({_id:user._id},process.env.TOKEN_KEY,{expiresIn: "24h"})
                res.json({message: "Login successful",token,user});
                
            }else{
                return res.send("Incorrect username or password")
            }
        }
        else{
            return res.status(201).send("User not found")
        }

    }
    catch(error){
        res.status(500).send(error)
    }
}

const reqResetPassword = async (req, res) => {
    try {
        const {username} = req.body;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).send('User not found');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; 

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        res.json({ message: 'Password reset request token generated', resetToken });
    } catch (error) {
        console.error('Error generating reset token:', error);
        res.status(500).send('Internal Server Error');
    }
};

const resetPassword = async (req, res) => {
    try {
        const { resetToken, password } = req.body;

        const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).send('Invalid or expired reset token');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.send('Password reset successfully');
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports ={
    register,
    log,reqResetPassword,resetPassword
}