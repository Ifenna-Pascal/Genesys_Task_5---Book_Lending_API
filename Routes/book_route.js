const 
    { 
        getAllBooks, createBook, get_One_Book, 
        delete_book, update_book, book_route_Info 
    }
= require("../Controllers/books");

const { isAdmin } = require("../Middle_Ware/isAdmin");

const book_route_handler = {};
book_route_handler.Books = (req, res)=>{
    const acceptableHeaders = ["POST", "GET", "PUT", "DELETE"];
    if (acceptableHeaders.indexOf(req.method) > -1)
    {
        book_route_handler._books[req.method](req,res)
    }
    else{
        res.writeHead(404, {"Content-Type": "application/json"})
        res.end(JSON.stringify({message:"Route Not Found"}))
    }
}

// main book route 
book_route_handler._books = {}

// book route handlers
book_route_handler._books.GET = (req,res)=>{
    if(req.url.match(/\/api\/books\/$/))
    {
         book_route_Info(req,res)
    }
    if(req.url.match(/\/api\/books\/getbooks\/$/))
    {
        getAllBooks(req,res)
    }

    else if (req.url.match(/\/api\/books\/getbooks\/.+\/$/))
    {
        get_One_Book(req,res, id = req.url.split("/")[4])
    }
    else  
            res.writeHead(404, {"Content-Type": "application/json"}),
            res.end(JSON.stringify({message:"Route Not Found"}))
}

book_route_handler._books.POST = (req,res)=>{
    if(req.url.match(/\/api\/books\/createbook\/$/)) 
    {
        (isAdmin(req,res) === true ) 
        && createBook(req,res);
    }
    else          
        res.writeHead(404, {"Content-Type": "application/json"}),
        res.end(JSON.stringify({message:"Route Not Found"}))
}


book_route_handler._books.DELETE = (req,res)=>{
    if(req.url.match(/\/api\/books\/deletebook\/.+\/$/)) 
    {
        (isAdmin(req,res) === true ) 
        && delete_book(req,res,id = req.url.split("/")[4]);
    }
    else 
        res.writeHead(404, {"Content-Type": "application/json"}),
        res.end(JSON.stringify({message:"Route Not Found"}))
}


book_route_handler._books.UPDATE = (req,res)=>{
    if(req.url.match(/\/api\/books\/updatebook\/.+\/$/)) 
    {
        (isAdmin(req,res) === true ) 
        && update_book(req,res,id = req.url.split("/")[4]);
    }
    else 
        res.writeHead(404, {"Content-Type": "application/json"}),
        res.end(JSON.stringify({message:"Route Not Found"}))
}

module.exports = book_route_handler