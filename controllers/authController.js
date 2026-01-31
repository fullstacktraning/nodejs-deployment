const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { error } = require("console");

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check user exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user)
            return res.status(400).json({message:"Invalid Credentials"});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.status(400).json({message:"Invalid Credentials"});

        const token = jwt.sign({userId : user._id},process.env.JWT_SECRETE,{expiresIn:'1d'});
        res.json({
            message : "Login Successful",
            token
        })

    }catch(err){
        res.status(500).json({error:err.message});
    }
}

exports.forgotPassword = async (req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user)
            return res.status(400).json({message:"User not found"});

        //generate token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 10*60*1000; //10min
        await user.save();

        //Email config
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        });

        const resetLink = `http://18.212.78.53:8000/api/auth/reset-password/${token}`;
        await transporter.sendMail({
            to:user.email,
            subject: "Password Reset",
            html : `<p>Click to reset password :</p>
                    <a href="${resetLink}">${resetLink}</a>`
        })
        res.json({message:"Reset email sent to email"});



    }catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.resetPassword = async (req,res)=>{
    const {password} = req.body;
    const {token} = req.params;
    console.log(token);
    try{
        const user = await User.findOne({
            resetToken : token,
            resetTokenExpiry : { $gt:Date.now()}
        });
        if(!user)
            return res.status(400).json({message:"Invalid or expired token"});

        user.password = await bcrypt.hash(password,10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        res.status(200).json({message:"Password reset successful"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
}


