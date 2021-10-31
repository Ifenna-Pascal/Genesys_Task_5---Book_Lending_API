const Server = require("./Routes/app");

const PORT = process.env.PORT || 5000;

Server.listen(PORT, ()=>{
    console.log("SERVER IS LISTENIBG");
})
