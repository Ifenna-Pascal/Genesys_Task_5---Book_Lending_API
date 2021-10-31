const { User_Signup, get_user_profile, borrow_book, return_book, User_Login } = require("../Controllers/User");
const { isAdmin } = require("../Middle_Ware/isAdmin");
const { isAuth } = require("../Middle_Ware/isAuth");

const user_route_handler = {};
user_route_handler.Users = (req, res)=>{
    const acceptableHeaders = ["POST", "GET", "PUT", "DELETE"];
    if (acceptableHeaders.indexOf(req.method) > -1) {
        user_route_handler._users[req.method](req,res)
    }
    else{
        res.writeHead(404, {"Content-Type": "application/json"})
        res.end(JSON.stringify({message:"Route Not Found"}))
    }
}

// main user route 
user_route_handler._users = {}

// user route handling
user_route_handler._users.GET = (req,res)=>{
    if(req.url === "/api/user/myprofile/"){
        const email =   isAuth(req,res);
        email && get_user_profile(req,res, email)
    }
    else
        res.writeHead(404, {"Content-Type": "application/json"}),
        res.end(JSON.stringify({message:"Route Not Found"}))
}

user_route_handler._users.POST = (req,res)=>{
    if(req.url === "/api/user/signup/"){
        console.log("ewdd");
         User_Signup(req,res)
    } else if(req.url === "/api/user/login/"){
        User_Login(req,res)
    }
    else if (req.url.match(/\/api\/user\/borrow\/.+\/$/)){
        const email =   isAuth(req,res) 
        email && borrow_book(req,res, email)
    } else if (req.url.match(/\/api\/user\/return\/.+\/$/)){
        const email =   isAuth(req,res);
        email && return_book(req,res,email)
    }
    else{
        res.writeHead(404, {"Content-Type": "application/json"}),
        res.end(JSON.stringify({message:"Route Not Found"}))
    }
}


module.exports = user_route_handler