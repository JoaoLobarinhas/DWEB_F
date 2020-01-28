var Publications = require('../models/publications')

module.exports.getPublicationOfUser = sn =>{
    return Publications.find({owner:sn}).sort({'date': -1}).exec();
}


module.exports.insert = data =>{
    var novo = new Publications(data)
    return novo.save()
}
