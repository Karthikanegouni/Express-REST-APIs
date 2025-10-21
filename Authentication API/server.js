const express = require('express');
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

let db = null;
const initializeDbAndServer = async ()=>{
    try{
        const dbPath = path.join(__dirname,'user.db');
        db = await open({
            filename:dbPath,
            driver: sqlite3.Database
        });
        app.listen(3000,()=>console.log("Server is running on http://localhost:3000/"));
    }
    catch(e){
        console.log(e.message);
    }
}
initializeDbAndServer();

app.post("/user/",async(request,response)=>{
    try{
        const {username,name,password,email} = request.body;
        const getUserQuery = `SELECT * FROM user WHERE username='${username}';`;
        const isexistingUser = await db.get(getUserQuery);
        if(isexistingUser===undefined){
        const hashedpassword = await bcrypt.hash(password,10);
            const insertUserQuery = `INSERT INTO user VALUES(
                '${username}',
                '${name}',
                '${hashedpassword}',
                '${email}');`;
            await db.run(insertUserQuery);
            response.status(200).send("User registration Successful");
        }else{
            response.status(400).send("User Already Exists");
        }
    }
    catch(e){
        console.log(e);
        response.send(e.message);
    }
});

app.post('/login/',async(request,response)=>{
    try{
    const {username,password} = request.body;
     const getUserQuery = `SELECT * FROM user WHERE username='${username}';`;
        const validUser = await db.get(getUserQuery);
        if(validUser===undefined){
            response.status(401).send("Invalid Username");
        }else{
            const isPasswordMatched = await bcrypt.compare(password,validUser.password);
            if(isPasswordMatched){
                response.status(200).send("Login Successfull");
            }
            else{
                response.status(401).send("invalid Password");
            }
        }

    }
    catch(e){
        response.status(500).send(e.message);
    }
});



