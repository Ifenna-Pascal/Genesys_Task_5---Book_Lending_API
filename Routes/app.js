const http = require("http");
const book_route_handler = require("./book_route");
const user_route_handler = require("./user_route");

const Server = http.createServer((req,res)=>{
    if (req.url.match(/\/api\/books\// || /\/api\/books\/.+/)){
        book_route_handler.Books(req,res)
    } else if (req.url.match(/\/api\/user\// || /\/api\/books\/.+/)){
        console.log(req.method);
        user_route_handler.Users(req,res)
    }else{
        res.writeHead(404, {"Content-Type": "application/json"})
        res.end(JSON.stringify({message:"Route Not Found"}))
    }
});

module.exports = Server
