const fs = require("fs"); // loaded the file module
const path = require("path"); // loaded the path module
const Base_dir = path.join(__dirname, "/../data/");
 

// class that contains the book services and methods
class Book_Service {
    constructor(Base_dir){
        this.Base_dir = Base_dir;
    }

    get_book_route_info(){
        const filePath =  path.join(__dirname,"/../Info/")  + "book_routing_info";
        const Book_Info = fs.readFileSync(filePath, "utf-8");
        return Book_Info
    }

    create_file(data){
        if(!(data.amount_in_stock && data.name)) return "Name and number of available book are required"
        data.rented = false;
        data.rentedBy = []
        const filePath = this.Base_dir + "Books" + "\\" + data.name.toLowerCase() + '.json';
        fs.open(filePath, "wx", (err, fd)=>{
            if(!err && fd){
                const stringData = JSON.stringify(data);
                fs.writeFile(fd,stringData, (err)=>{
                    if(err) return "Could not create file"
                    else
                    {
                        fs.close(fd,(err)=>{        
                            if(err) return "can't close file"
                        })
                    }
                })
            }
            else{
                return "cant create a file"
            }
        })
        return `BOOK CREATED SUCCESSFULLYBOOK DETAILS: ${JSON.stringify(data)}`
    }
    read_all_books(){
        const dirName = this.Base_dir + "Books" 
        const bookArray =  fs.readdirSync(dirName);
        return bookArray
    }
    get_all_book_details(){
        const books = this.read_all_books();
        const book_details = [];
        books.forEach(book=>{
            const filePath = this.Base_dir + "Books" + "\\"  + book;
            const Book = fs.readFileSync(filePath, "utf-8");
            book_details.push(JSON.parse(Book));
        })
        return book_details
    }

    get_all_borrowed_books(){
        const books = this.get_all_book_details();
        const borrowed_books = books.filter(x=> x.rented === true);
        return borrowed_books;
    }
    read_file_by_name(name){
        if(!name && typeof(name) !== "string") return "Name of Book is required"
        const books = this.read_all_books();
        const foundBook = books.find(x=> x === name + ".json");
        if(foundBook){
            const filePath = this.Base_dir + "Books" + "\\" + foundBook;
            const Book = fs.readFileSync(filePath, "utf-8");
            return JSON.parse(Book)
        }
        else{
            return "Book Does Not Exist In Library";
        }
      
    }

    delete_file_by_name(name){
        if(!name && typeof(name) !== "string") return "Name of Book is required"
        const books = this.read_all_books();
        const foundBook = books.find(x=> x === name + ".json");
        if(!foundBook) return "Book Does Not Exist In Library";
        const filePath = this.Base_dir + "Books" + "\\" + foundBook;
        fs.unlinkSync(filePath);
        return "Book Deleted Successfully"
    }

    update_file_by_name(name, data){
        if(!name && typeof(name) !== "string") return "Name of Book is required"
        const books = this.read_all_books();
        const foundBook = books.find(x=> x === name + ".json");
        if(!foundBook) return "Book Does Not Exist In Library";
        const filePath = this.Base_dir + "Books" + "\\" + foundBook;
        const book_to_updated = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        let newFilePath = ""
        if(data && data.price){
            book_to_updated.price = data.price
        }
        if(data && data.author){
            book_to_updated.author = data.author
        }
        if(data && data.name){
            book_to_updated.name = data.name;
            newFilePath = this.Base_dir + "Books" + "\\" + data.name.toLowerCase() + ".json";
            fs.renameSync(filePath, newFilePath)
            const updated = fs.writeFileSync(newFilePath, JSON.stringify(book_to_updated))
            return "BOOK UPDATED SuccessfullY" 
        }
        const updated_book = fs.writeFileSync(filePath, JSON.stringify(book_to_updated));
        return "BOOK UPDATED"

    }
}
    


// create an instance of the Book_Service Class
const book_service_instance = new Book_Service(Base_dir);
module.exports = book_service_instance;
 
 