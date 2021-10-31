const crypto = require("crypto");

const encrypt = (email)=>{
    var mykey = crypto.Cipher('aes-128-cbc', 'ife_money');
    var encrypted = mykey.update(email, 'utf8', 'hex')
    encrypted += mykey.final('hex');
    return encrypted;
}

const decrypt = (token)=>{
    var mykey = crypto.Decipher('aes-128-cbc', 'ife_money');
    var decrypt = mykey.update(token, 'hex', 'utf8')
    decrypt += mykey.final('utf8');
    return decrypt
}

module.exports = {encrypt, decrypt}