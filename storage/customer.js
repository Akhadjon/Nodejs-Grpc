const mongoose = require('mongoose');
const Customer = require('../models/customer')


let CustomerStorage = {
   insert:(customer)=>{
       return new Promise((resolve, reject)=>{
           if(!customer) return reject(new Error("Customer fields required"));
           let savedCustomer = new Customer(customer);
           savedCustomer.save((error, result)=>{
               if (error) return reject(error);
               return resolve(result)
           })
       })
   },


   update:(customer) => {
     return new Promise((resolve, reject)=>{
         if(!customer) return reject(new Error("Customer fields required"));

         Customer.findOne({_id: customer.id }, (error, cs)=>{
             if(error) return reject(error);
             if(!customer) return reject("Customer not found");
    
             cs.name = customer.name;
             cs.age = customer.age;
             cs.address = customer.address;

             cs.save((error, result)=>{
                 if(error) return reject(error);
                 resolve(result);
             });
         });
     });
   },

   remove:(customerRequestId)=>{
      return new Promise((resolve, reject)=>{
        if(!customerRequestId) return reject("customerRequestId is required");
        Customer.findOneAndDelete({_id:customerRequestId}, (error, result)=>{
           if(error) return reject(error);
           resolve(result);
        });
      })
   },

   get:(customerRequestId)=>{
    return new Promise((resolve, reject)=>{
       if(!customerRequestId) return reject("customerRequestId is required");
       Customer.findOne({_id: customerRequestId}, (error, result)=>{
          if(error) return reject(error);
          if(!customer) return reject("Customer not found");
          return resolve(result);
       });
    })
   },

   find:() => {
    return new Promise((resolve, reject) => {
        Customer.find({}, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
},
}

module.exports = CustomerStorage;
