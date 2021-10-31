const { isAuth } = require("../Middle_Ware/isAuth");
const User_Instance = require("../Services/user_service");
const { encrypt } = require("../Util");

const User_Signup = (req,res)=>{
    let body = " ";
    req.on("data", (chunk)=>{
        body += chunk.toString()
    })  
    req.on("end", ()=>{
        const {username, email, password} = JSON.parse(body) 
        const user = {username, email, password}      
        const newUser = User_Instance.siginup(user);
        
        if(newUser && newUser.hasOwnProperty("email")) {
            const token = encrypt(newUser.email)
            console.log(newUser);
            res.writeHead(200, {"Content-Type": "application/json"})
            console.log(token);
            res.end(JSON.stringify({token:token}))
        }
        res.writeHead(404, {"Content-Type": "application/json"})
        res.end(JSON.stringify(newUser))
    })
}

const User_Login = (req,res)=>{
    let body = " ";
    req.on("data", (chunk)=>{
        body += chunk.toString()
    })  
    req.on("end", ()=>{
        const { email, password } = JSON.parse(body) 
        const result = User_Instance.user_login({email, password})
        
        if(result && result.hasOwnProperty("email")) {
            const token = encrypt(result.email)
            res.writeHead(200, {"Content-Type": "application/json"})
            console.log(token);
            res.end(JSON.stringify({token:token}))
        }
        res.writeHead(404, {"Content-Type": "application/json"})
        res.end(JSON.stringify(result))
    })
}

const get_user_profile = (req,res,email)=>{
    try {
        const user_profile = User_Instance.view_user_profile(email);
        res.writeHead(200, {"Content-Type":"application/json"});
        res.end(JSON.stringify(user_profile))
    } catch (e) {
        console.log(e);
    }
}


const borrow_book = (req,res,email)=>{
    try{
        const name = req.url.split("/")[4]
        const borrowed = User_Instance.Borrow_Books(email,name);
        res.writeHead(200, {"Content-Type":"application/json"});
        res.end(JSON.stringify(borrowed))
    } catch (e) {
        console.log(e);
    }
}


const return_book = (req,res,email)=>{
    try {
            const book_to_return = req.url.split("/")[4]
            const returned = User_Instance.Return_Book(email,book_to_return);
            console.log(returned);
            res.writeHead(200, {"Content-Type":"application/json"});
            res.end(JSON.stringify(returned))
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    User_Signup,
    User_Login,
    get_user_profile,
    borrow_book,
    return_book
}