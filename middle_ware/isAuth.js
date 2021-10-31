const User_Instance = require("../Services/user_service");
const { decrypt } = require("../Util");
const isAuth = (req,res)=>{
   const token = req.headers["x-auth"] && req.headers["x-auth"].split(" ")[1];
   if(token) {
      const email = decrypt(token)
      console.log(email);
      const user = User_Instance.find_if_user_exists(email);
      if(user){
         return user
      }else{
         return res.writeHead(403, {"Content-Type":"application/json"}),
         res.end(JSON.stringify("You are not allowed to access this route, Kindly Sign in "))
      }
   }else{
      return res.writeHead(403, {"Content-Type":"application/json"}),
      res.end(JSON.stringify("You are not allowed to access this route, Kindly Sign in "))
   } 
}

module.exports = {isAuth}