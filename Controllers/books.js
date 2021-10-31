const Book_Instance = require("../Services/book_service");

const book_route_Info = (req,res)=>{
    try {
        const Book_Info = Book_Instance.get_book_route_info();
        console.log(Book_Info);
        res.writeHead(200, {"Content-Type": "text/plain"})
        res.end(Book_Info)
    } catch (e) {
        console.log(e);
    }
}

const createBook  = (req,res)=>{
    let body = " ";
    req.on("data", (chunk)=>{
        body+=chunk.toString()
    })
    req.on("end", ()=>{
        const {name, author, price, amount_in_stock} = JSON.parse(body)
        const book = {
            name,
            author,
            price,
            amount_in_stock
        }      
    const book_created = Book_Instance.create_file(book);
    res.writeHead(200, {"Content-Type": "application/json"})
    res.end(book_created)
    })
}

const getAllBooks = (req,res)=>{
   try {
        const books = Book_Instance.get_all_book_details();
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify(books))
   } catch (e) {
       console.log(e);
   }
}

const get_One_Book = (req,res, book_name)=>{
    try {
        const book = Book_Instance.read_file_by_name(book_name);
        if(!book){
            res.writeHead(404, {"Content-Type": "application/json"})
            res.end(JSON.stringify({message: "Book Not Found"}))
        }
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify(book))
    } catch (e) {
        console.log(e);
    }
}

const get_all_borrowed_books = (req,res)=>{
    try {
        const books = Book_Instance.get_all_borrowed_books();
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify(books))
    } catch (e) {
        console.log(e);
    }
}

const update_book = (req,res, id)=>{
  try {
      let body = "";
      req.on("data", (chunk)=>{
          body+=chunk.toString();
      })
      req.on("end", ()=>{
        const {name, author, price, amount_in_stock} = JSON.parse(body)
        const book_to_update = { name, author, price, amount_in_stock } 
        const updated = Book_Instance.update_file_by_name(id, book_to_update);
        res.end(JSON.stringify(updated))
      })
  } catch (e) {
      console.log(e);
  }
}

const delete_book = (req,res,name)=>{
    try {
        const deleted = Book_Instance.delete_file_by_name(name); 
        if(!deleted){
            res.writeHead(404, {"Content-Type": "application/json"})
            res.end(JSON.stringify({message: "Book Not Found"}))
        }
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify(deleted))
        console.log(deleted);
    } catch (e) {
        console.log(e);
    }
}
 
module.exports = {
    book_route_Info,
    getAllBooks,
    get_One_Book,
    get_all_borrowed_books,
    createBook,
    update_book,
    delete_book,
}