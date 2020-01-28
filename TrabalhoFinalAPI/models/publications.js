const mongoose = require('mongoose')

  var FileSchema = new mongoose.Schema({
    filetype:{type: String, required: true},
    filename: String,
    file:{type: Buffer, required: true}
  },{ _id : false })
  
  var publicSchema = new mongoose.Schema({
      owner: { type: String, required : true},
      text:String,
      file:[FileSchema],
      react: Array,
      comments:Array,
      responseTo:String,
      group:String,
      date: String
    });


module.exports = mongoose.model('publications', publicSchema)