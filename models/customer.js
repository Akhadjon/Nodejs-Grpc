const mongoose = require('mongoose');

var CustomerSchema = new mongoose.Schema({
     name:{
         type:String,
         required:true
     }, 
     address:{
         type:String,
         required:true
     },
     age:{
         type:Number,
         required:true
     }
})


module.exports = mongoose.model('Customer', CustomerSchema);