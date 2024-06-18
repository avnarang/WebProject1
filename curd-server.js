const express = require('express');
const app = express();
const mysql2 = require("mysql2");
const fileuploader=require("express-fileupload");

app.listen(3003,function(){
    console.log("Server started at port 3003");
})
app.use(express.static("public"));
const congObj={
    host:"127.0.0.1",
    user:"root",
    password :"Parnika@12#",
    database:"project",
    dateStrings:true
}
app.use(fileuploader());
const object = mysql2.createConnection(congObj);

object.connect(function(err){
    if(err==null){
        console.log("Connected Successfully");
    }
    else{
        console.log(err.message);
    }

})
app.get("/",function(req,resp){
   
    let filePath=process.cwd()+"/public/index.html";
    resp.sendFile(filePath);
    
})


       
app.use(express.urlencoded({extended:true}));
app.get("/profile-save",function(req,resp)
{
    //create table users3(emailId varchar(30) primary key, password varchar(30),utype varchar(30),status int,dos date);
    
       
       object.query("insert into users3 values(?,?,?,1,current_date())",[req.query.email,req.query.password,req.query.utype],function(err)
       {
            if(err==null)
                resp.send("Signedup successfully!");
            else
                resp.send(err.message);
            
       })

       
       
})


app.get("/check-email",function(req,resp){
    object.query("select * from users3 where emailId=?",[req.query.txtEmail],function(err,resultJsonAry){
        if(resultJsonAry.length==1)
            resp.send("This account already exists");
        else
            resp.send(" ");
    })
    
})
app.get("/login-info",function(req,resp){
    object.query("select * from users3 where emailId = ? and password = ?",[req.query.email,req.query.password],function(err,resultJsonAry){
        if(err != null){    
            resp.send(err.message);
        }
        if(resultJsonAry.length==1){
            if(resultJsonAry[0].status == 1){
                resp.send(resultJsonAry[0].utype);
            }
            else{
                resp.send("Your account has been blocked!");
            }
        }
        else{
            resp.send("Invalid login credentials");
        }
    })
    
})
app.get("/change-password",function(req,resp){
    object.query("update users3 set password=? where emailId = ? and password = ?",[req.query.newPwd,req.query.email,req.query.oldPwd],function(err,resultJsonAry){
        if (err == null) {
            if (resultJsonAry.affectedRows == 1) {
                resp.send("Password Changed Successfully!!");
            }

            else {
                resp.send("Invalid Credentials");
            }
        }

        else {
            resp.send(err.message);
        }
        
    })
})

app.get("/customer-profile",function(req,resp){
    let filePath=process.cwd()+"/public/customer-profile.html";
    
        resp.sendFile(filePath);
    
   
})


app.post("/custProfile-save",function(req,resp){
    //create table customers(emailid varchar(30) primary key,name varchar(30),contact varchar(12),address varchar(50),city varchar(20),state varchar(20),picname varchar(100))
    const email=req.body.custEmail;
    const name=req.body.custName;
    const contact=req.body.contact;
    const address=req.body.address;
    const city=req.body.city;
    const state=req.body.state;

    let filename;
    if(req.files==null)
        filename="nopic.jpg";
    else{
        filename=req.files.ppic.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.ppic.mv(path);
    }
    req.body.ppic=filename;
    object.query("insert into customers values(?,?,?,?,?,?,?)",[email,name,contact,address,city,state,filename],function(err){
        if(err==null)
            resp.send("Customer details saved successfuly!");
        else
            resp.send(err.message);
    })
})
app.get("/fetch-details",function(req,resp)
{
    object.query("select * from customers where emailid=?",[req.query.email],function(err,resultJsonAry){
            resp.send(resultJsonAry);
    })
})
app.post("/modify-details",function(req,resp){
    const email=req.body.custEmail;
    const name=req.body.custName;
    const contact=req.body.contact;
    const address=req.body.address;
    const city=req.body.city;
    const state=req.body.state;

    let filename;
    if(req.files==null)
        filename=req.body.hdn;
    else{
        filename=req.files.ppic.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.ppic.mv(path);
    }
    req.body.ppic=filename;
    object.query("update customers set name=? , contact=? , address=? , city=? , state=? , picname=? where emailid=?",[name,contact,address,city,state,filename,email],function(err){
        if(err==null)
            resp.send("Profile Updated!");
        else
            resp.send(err.message);
    })
})



app.get("/custDashboard",function(req,resp){
    let filePath=process.cwd()+"/public/custDashboard.html";
    resp.sendFile(filePath);
})
app.get("/provDashboard",function(req,resp){
    let filePath=process.cwd()+"/public/provDashboard.html";
    resp.sendFile(filePath);
})
app.get("/adminDashboard",function(req,resp){
    let filePath=process.cwd()+"/public/adminDashboard.html";
    resp.sendFile(filePath);
})

//create table tasks(rid int primary key auto_increment,emailid varchar(30),category varchar(30),address varchar(50),city varchar(20),upto date,task varchar(200));

app.get("/task-details",function(req,resp){
    object.query("insert into tasks values(0,?,?,?,?,?,?)",[req.query.email,req.query.taskCategory,req.query.address,req.query.city,req.query.duration,req.query.workDetails],function(err){
        if (err == null) {
            resp.send("Task Posted Successfully");
            }
            
            else {
            resp.send(err.message);
            }
    })
})
app.get("/auto-fill",function(req,resp){
    object.query("select * from customers where emailid=?",[req.query.email],function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})


app.get("/provider-profile",function(req,resp){
    let filePath=process.cwd()+"/public/provider-profile.html";
    resp.sendFile(filePath);
})
app.get("/provider-finder",function(req,resp){
    let filePath=process.cwd()+"/public/servProvider-finder.html";

        resp.sendFile(filePath);
    
    
})
app.get("/findJob",function(req,resp){
    let filePath=process.cwd()+"/public/findJob.html";

        resp.sendFile(filePath);
    
    
})
app.get("/req-manager",function(req,resp){
    let filePath=process.cwd()+"/public/requireManager.html";
    resp.sendFile(filePath);
})
app.post("/servProfile-save",function(req,resp){
    const email=req.body.servEmail;
    const name=req.body.servName;
    const contact=req.body.contact;
    const gender=req.body.gender;
    const category=req.body.taskCategory;
    const firm=req.body.firm;
    const firmWebsite=req.body.website;
    const location=req.body.location;
    const duration=req.body.since;
    const otherInfo=req.body.workExp;


    let filename;
    if(req.files==null)
        filename="nopic.jpg";
    else{
        filename=req.files.ppic.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.ppic.mv(path);
    }
    req.body.ppic=filename;

    object.query("insert into providers values(?,?,?,?,?,?,?,?,?,?,?)",[email,name,contact,gender,category,firm,firmWebsite,location,duration,otherInfo,filename],function(err){
        if(err==null)
            resp.send("Service Provider details saved successfuly!");
        else
            resp.send(err.message);
    })
})
app.get("/search-profile",function(req,resp){
    object.query("select * from providers where emailid=?",[req.query.email],function(err,resultJsonAry){
        if(err==null)
        resp.send(resultJsonAry);
        else
        resp.send(err.message);
    })
})
//create table providers(emailid varchar(30) primary key,name varchar(30), contact varchar(12),gender varchar(30),category varchar(30),firm varchar(30),website varchar(30),location varchar(50),since int,otherInfo varchar(200),picname varchar(100));
app.post("/edit-profile",function(req,resp){
    const email=req.body.servEmail;
    const name=req.body.servName;
    const contact=req.body.contact;
    const gender=req.body.gender;
    const category=req.body.taskCategory;
    const firm=req.body.firm;
    const firmWebsite=req.body.website;
    const location=req.body.location;
    const duration=req.body.since;
    const otherInfo=req.body.workExp;

    let filename;
    if(req.files==null)
        filename="nopic.jpg";
    else{
        filename=req.files.ppic.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.ppic.mv(path);
    }
    req.body.ppic=filename;

    object.query("update providers set name=? , contact=?, gender=?, category=? , firm=? , website=?,location=?,since=?,otherInfo=?,picname=? where emailid=?",[name,contact,gender,category,firm,firmWebsite,location,duration,otherInfo,filename,email],function(err){
        if(err==null)
            resp.send("Profile Updated!");
        else
            resp.send(err.message);
    })
})


app.get("/angular-fetch-distinct-location",function(req,resp){
    object.query("select distinct location from providers",function(err,resultJsonAry){
            resp.send(resultJsonAry);
    })
})
app.get("/angular-fetch-distinct-category",function(req,resp){
    object.query("select distinct category from providers",function(err,resultJsonAry){
            resp.send(resultJsonAry);
    })
})
app.get("/fetch-one-record",function(req,resp){
    object.query("select * from providers where location=? and category=?",[req.query.location,req.query.category],function(err,resultJsonAry){
            resp.send(resultJsonAry);
    })
})
app.get("/angular-fetch-distinct-cityC",function(req,resp){
    object.query("select distinct city from tasks",function(err,resultJsonAry){
            resp.send(resultJsonAry);
    })
})
app.get("/angular-fetch-distinct-categoryC",function(req,resp){
    object.query("select distinct category from tasks",function(err,resultJsonAry){
            resp.send(resultJsonAry);
    })
})
app.get("/fetch-one-recordC",function(req,resp){
    object.query("select * from customers where city=? and category=?",[req.query.city,req.query.category],function(err,resultJsonAry){
            resp.send(resultJsonAry);
    })
})
app.get("/manager",function(req,resp){
    let filePath=process.cwd()+"/public/usersManager.html";
    resp.sendFile(filePath);
})
app.get("/angular-fetch-all",function(req,resp){
    object.query("select * from users3",function(err,resultJsonAry){
        resp.send(resultJsonAry);
        
    })
})
// app.get("/fetch-one-record",function(req,resp){
//     object.query("select * from users3 where password=? ",[req.query.password],function(err,resultJsonAry){
//             resp.send(resultJsonAry);
//     })
// })


app.get("/angular-delete",function(req,resp){
    const email=req.query.emailId;
    object.query("delete from users3 where emailId=?",[email],function(err,result){
        if(err==null)
        {
            if(result.affectedRows==1)
                resp.send("Profile Deleted!");
            else
                resp.send("Profile does not exist!");
        }
        else
            resp.send(err.message);
    })
})
app.get("/angular-block",function(req,resp){
    const email = req.query.emailId;
    object.query("update users3 set status=0 where emailId=?",[email],function(err,resultJsonAry){
        if(err==null)
        {
            if(resultJsonAry.affectedRows==0)
                resp.send("User already blocked!");
            else
                resp.send("User blocked");
        }
        else
            resp.send(err.message);
        
    })
})
app.get("/angular-unblock",function(req,resp){
    const email = req.query.emailId;
    object.query("update users3 set status=1 where emailId=?",[email],function(err,resultJsonAry){
        if(err==null)
        {
            if(resultJsonAry.affectedRows==0)
                resp.send("User already unblocked!");
            else
                resp.send("User unblocked");
        }
        else
            resp.send(err.message);
        
    })
})
app.get("/angular-fetch-distinct-pwds",function(req,resp){
    object.query("select * from users3",function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})
app.get("/providerList",function(req,resp){
    let filePath=process.cwd()+"/public/all-providers.html";
    resp.sendFile(filePath);
})
app.get("/angular-fetch-providers",function(req,resp){
    object.query("select * from providers",function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})
app.get("/customerList",function(req,resp){
    let filePath=process.cwd()+"/public/all-customers.html";
    resp.sendFile(filePath);
})
app.get("/angular-fetch-customers",function(req,resp){
    object.query("select * from customers",function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})
app.get("/findJob",function(req,resp){
    let filePath=process.cwd()+"/public/findJob.html";
    resp.sendFile(filePath);
})
app.get("/angular-fetch-jobs",function(req,resp){
    object.query("select * from tasks",function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})
app.get("/show-all-req", function(req,resp) {
    // console.log("done");
    const email = req.query.emailid;
    
    object.query("select * from tasks where emailid=?",[email], function(err,respJsonArry) {
        // console.log("done");
        if (err == null){
            resp.send(respJsonArry);
        }

        else {
            resp.send(err.message);
        }
    })
})

app.get("/delete-task", function(req,resp) {
    const delrid=req.query.reqrid;
    object.query("delete from tasks where rid=?",[delrid],function(err,result)
    {
        if(err==null)
        {
           if(result.affectedRows==1)
               resp.send("Task Deleted Successfully");
           else
                resp.send("Inavlid ID");
        }
        else
           resp.send(err.message);
    })
})

