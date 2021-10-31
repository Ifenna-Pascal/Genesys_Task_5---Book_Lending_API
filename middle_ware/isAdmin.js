const User_Instance = require("../Services/user_service");
const { isAuth } = require("./isAuth");
const isAdmin = (req,res)=>{
    let email  = isAuth(req,res);
    let user = User_Instance.view_user_profile(email);
    if((user !== null && user.admin === true)){
        return true
    }
       return  res.writeHead(403, {"Content-Type": "application/json"}),
               res.end(JSON.stringify({msg:"You Are Unauthorized to this route, Only meant for admins"}))
}

module.exports = {isAdmin}