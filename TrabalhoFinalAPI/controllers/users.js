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

module.exports.updateGoogleAccount = (email,body) =>{
    return Users.findOneAndUpdate({email:email},body).exec()
}

module.exports.checkEmail = email => {
    return Users.exists({email:email})
}

module.exports.getUserProfile = sn =>{
    return Users.aggregate([
        {
          '$match': {
            'studentNumber': sn
          }
        }, {
          '$project': {
            'firstName': 1, 
            'lastName': 1, 
            'email': 1, 
            'curso': 1, 
            'lastAcess': 1, 
            'studentNumber': 1,
            'profilePhoto':1,
            'bannerPhoto':1,
            'followers': {
              '$cond': {
                'if': {
                  '$isArray': '$followers'
                }, 
                'then': {
                  '$size': '$followers'
                }, 
                'else': 'NA'
              }
            }, 
            'following': {
              '$cond': {
                'if': {
                  '$isArray': '$following'
                }, 
                'then': {
                  '$size': '$following'
                }, 
                'else': 'NA'
              }
            }
          }
        }
      ])
}

module.exports.getUserProfilePics = sn =>{
  return Users.findOne({studentNumber:sn},{_id:0,bannerPhoto:1,profilePhoto:1}).exec()
}

module.exports.insert = u => {
    var novo = new Users(u)
    return novo.save()
}