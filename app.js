const express = require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app=express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb+srv://admin-anushree:anushree@cluster0.5c6hr.mongodb.net/customerlist?retryWrites=true&w=majority';

// Database Name
const dbName = 'customerlist';

// Create a new MongoClient
const client = new MongoClient(url);




      
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render("index");
});

app.get("/viewcustomers",function(req,res){
    const db = client.db(dbName);
     const collection = db.collection('customers');
    const email=["Shruti@Sinha.com",
       "Aryan@Singh.com",
       "James@Brown.com",
      " Nupur@Sen.com",
       " Oishiki@Ganguly.com",
     " Aditi@Patel.com",
        "Rohan@Bharadwaj.com",
       " Samarth@Shah.com",
       " Ananya@Maheshwari.com",
" Ayush@Kalra.com"]
  // Find some documents
  collection.find({}).toArray(function(err, customer_list) {
    assert.equal(err, null);
      console.log("found the following records");
    res.render("customers",{'customers':customer_list,'emails':email});
  });

});


app.get("/transaction/:customerName",function(req,res){
  const db = client.db(dbName);
     const collection = db.collection('customers');
    
  // Find some documents
  collection.find({}).toArray(function(err, customer_list) {
      assert.equal(err, null);
     const requestedCustomer = req.params.customerName;      collection.findOne({name:requestedCustomer},function(err,customer_list){
        if(!err){
            
      res.render("transaction",{'customerName':requestedCustomer});
    }else{console.log(err);}
  });

});
  });



app.post('/transaction/:customerName', function(req, res) {

     const db = client.db(dbName);
     const collection = db.collection('customers');
    const sender =req.body.senderList; 
          var transferAmount=req.body.amount;
 const requestedCustomer = req.params.customerName;
    console.log(requestedCustomer);
  // Find some documents
  collection.find({}).toArray(function(err, customer_list) {
        assert.equal(err, null);
   
    collection.findOne({name:sender},function(err,customer_list){
           
        if(!err){
            const senderCurrentbalance=customer_list.currentbalance; 
              var sendernewBalance=parseInt(senderCurrentbalance)-parseInt(transferAmount);
            console.log(customer_list.name);
             console.log(sendernewBalance);
 
                 collection.updateOne({name:sender}, {
          $set:{currentbalance:sendernewBalance}
      } );
        }
       else{console.log(err);} });
      collection.findOne({name:requestedCustomer},function(err,customer_list){
           
        if(!err){
const currentbalance=customer_list.currentbalance;   
            var newBalance=parseInt(currentbalance)+parseInt(transferAmount);
            res.render("thankyou",{'customerName':requestedCustomer,'transferAmount':transferAmount,'currentbalance':newBalance});
            console.log(newBalance);
            
              collection.updateOne({name:requestedCustomer}, {
          $set:{currentbalance:newBalance}
      } );
       }
    else{console.log(err);}
      });
        
  });
});


app.listen(port);

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to database");
    
    let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
    
 app.listen(port,function(){
     console.log("server started on port 3000");
 });

});


            
            // ;
//([{ "name" : "Shruti Sinha", "currentbalance" : 1000 },
//{  "name" : "Aryan Singh", "currentbalance" : 6000 },
//{ "name" : "James Brown", "currentbalance" : 9000 },
//{ "name" : "Nupur Sen", "currentbalance" : 12000 },
//{  "name" : "Oishiki Ganguly", "currentbalance" : 15000 },
//{  "name" : "Aditi Patel", "currentbalance" : 11000 },
//{  "name" : "Rohan Bharadwaj", "currentbalance" : 10000 },
//{  "name" : "Samarth Shah", "currentbalance" : 1000 },
//{  "name" : "Ananya Maheshwari", "currentbalance" : 8000 },
//{"name" : "Ayush Kalra", "currentbalance" : 20000 }])
