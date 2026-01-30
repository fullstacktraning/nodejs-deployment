const Laptop = require("../models/Laptop");

exports.getAllLaptops = async (req,res)=>{
    try{
        const laptops = await Laptop.find();
        return res.status(200).json({
            message : "Laptops fectched successfully",
            total : laptops.length,
            data : laptops
        })
    }catch(err){
        res.status(500).json({error:err.message});
    }
}