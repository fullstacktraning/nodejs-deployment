const mongoose = require("mongoose");

const laptopSchema = new mongoose.Schema({
    id :{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
    qty:{
        type: Number,
        required: true
    },
    pic:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Laptop",laptopSchema);