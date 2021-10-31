const fs = require("fs")
const path = require("path");
const { encrypt } = require("../Util");
const Base_dir = path.join(__dirname, "/../data/");
const Book_Service = require("./book_service");

// class that contains user services and methods
class User_Service {
    constructor(Base_dir){
        this.Base_dir = Base_dir;
        this.validateEmail = (elementValue) => {      
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return emailPattern.test(elementValue); 
        }
    }

    get_all_users(){
        try {
            const dirName = this.Base_dir + "Users" 
            const usersArray = fs.readdirSync(dirName);
            if(!usersArray) {
                fs.mkdirSync(dirName) 
                return "No Users Found"
            }
            return usersArray
        } catch (e) {
            return e
        }      
    }

    find_if_user_exists(email){
        try {
            const users = this.get_all_users();
            let foundUser = users.find(x=> x === email + ".json") 
            foundUser && (foundUser =  foundUser.toString().replace(".json", ""));
            return foundUser;
        } catch (e) {
            return e
        }
    }

    siginup(data){
        try {
            const {username, email, password, admin} = data;
            if(!(username && email && password)) return "Username and email and password are required"
            if(!this.validateEmail(data.email)) return "Invalid Email Pattern";
            const userExists = this.find_if_user_exists(email);
            if(userExists) return "Can't Sigin User with this email already exists";
            !admin ?  data.admin = false : data.admin = admin;
            data.borrowedBooks = [];
            const filePath = this.Base_dir + "Users" + "\\" + email + '.json';
            let stringData
            fs.open(filePath, "wx", (err, fd)=>{
                if(!err && fd){
                    stringData = JSON.stringify(data);
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
            
            return data
        } catch (e) {
            return e   
        }
    }

    user_login({password, email}){
        if(!(email && password)) return "email and password are required";
        const user = this.view_user_profile(email);
        if(user.hasOwnProperty("email")){
            if(user.password == password){
               return  user
            }
            else return "Passowrd does not match"
        }else{
            return "user does not exist kindly signup"
        }
    }

    view_all_books_available(){
        const allBooks = Book_Service.read_all_books();
        return allBooks
    }

    view_user_profile(email){
        const user = this.find_if_user_exists(email);
        const filePath = this.Base_dir + "Users" + "\\" + user + '.json'
        return user ? JSON.parse(fs.readFileSync(filePath, "utf-8")) : null
    }

    update_user_details_with_borrowed_book(email, borrowed_book){
        const user = this.find_if_user_exists(email);
        const filePath = this.Base_dir + "Users" + "\\" + user + '.json'
        const user_details = JSON.parse(fs.readFileSync(filePath, "utf-8"))
        user_details && user_details.borrowedBooks.push(borrowed_book);
        const user_updated_details = fs.writeFileSync(filePath,JSON.stringify(user_details));
        return user_updated_details
    }
    
    Borrow_Books(email, book_name){
        const userExists = this.find_if_user_exists(email);
        if(!userExists) return "Kindly Signup To Borrow Books";
        const book_details = Book_Service.read_file_by_name(book_name)
        const filePath = this.Base_dir + "Books" + "\\" + book_details.name + ".json";
        if(book_details.hasOwnProperty("name") && book_details.numberInStock <= 0) return `Insufficient Books - Number of book available is ${book_details.numberInStock}`
        if(book_details.hasOwnProperty("name") && book_details.rentedBy.findIndex(x=> x === email) > -1) return `Sorry ${email} you have borrowed this book before, you can't borrow a book twice pls`;
        if(book_details.hasOwnProperty("name")){
            book_details.amount_in_stock -= 1;
            book_details.rented = true;
            book_details.rentedBy.push(email);
            const updated_book = fs.writeFileSync(filePath, JSON.stringify(book_details));
        }
        delete book_details.amount_in_stock;
        delete book_details.rented;
        delete book_details.rentedBy;
        if(book_details.hasOwnProperty("name")){
            this.update_user_details_with_borrowed_book(email,book_details)
            return {Message:"Book Borrowed Successfully", book_details}
        }
        return book_details
    }

    Return_Book(email,book_name){
        const user = this.find_if_user_exists(email);
        if(!user) return "User does not exist, kindly sign in ";
        // update the amount in stock of book in book store
        const user_filePath = this.Base_dir + "Users" + "\\" + user + '.json'
        const user_details = JSON.parse(fs.readFileSync(user_filePath, "utf-8"));
        console.log(user_details.borrowedBooks.length > 0);
        // console.log(book_);
        const book_details = Book_Service.read_file_by_name(book_name);
        console.log(book_details);
        if(book_details.hasOwnProperty("name") && user_details.borrowedBooks.length > 0){
            console.log(user_details);
            if(user_details.borrowedBooks.indexOf(book_name) !== -1) return "Book Has Not Been Borrowed Already By You"
            // update book details
            const book_filePath = this.Base_dir + "Books" + "\\" + book_name + '.json'
            book_details.amount_in_stock += 1;
            book_details.rentedBy.splice(book_details.rentedBy.indexOf(email),1)
            book_details.rentedBy.length <= 0 && (book_details.rented = false);
            fs.writeFileSync(book_filePath, JSON.stringify(book_details));
            // update user details
            const returned_book = user_details.borrowedBooks.find(x => x.name.toString().toLowerCase() === book_name);
            if(!returned_book) return "Book Not Found"
            user_details.borrowedBooks.splice(user_details.borrowedBooks.indexOf(returned_book), 1)
            const user_updated_details = fs.writeFileSync(user_filePath,JSON.stringify(user_details));  
            return "Book Returned Successfully"
        } else {
             return "NO BORROWED BOOK FOUND"
        }
    } 
}


// create User_service instance
const User_Instance = new User_Service(Base_dir);
module.exports = User_Instance;