var Users = require('../models/users')

module.exports.listar = () => {
    return Users
        .find()
        .exec()
}

module.exports.loginUser = (email) =>{
    return Users.findOne({email:email},{_id:0,email:1,password:1}).exec()
}

module.exports.checkUser = (email) =>{
    return Users.findOne({email:email},{_id:0,password:0}).exec()
}

module.exports.getUser = (studentNumber) =>{
    return Users.findOne({studentNumber:studentNumber},{_id:0,password:0}).exec()
}

module.exports.checkSN = studentNumber => {
    return Users.exists({studentNumber:studentNumber})  
}

module.exports.loginGoogle = (email) =>{
    return Users.findOne({email:email},{_id:0,email:1,googleId:1}).exec()
} 

module.exports.checkEmail = email => {
    return Users.exists({email:email})
}

module.exports.insert = u => {
    var novo = new Users(u)
    return novo.save()
}