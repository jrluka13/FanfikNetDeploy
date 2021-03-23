const {Schema,model, Types} = require('mongoose')

const schema = new Schema({
    superUser:{type:Boolean},
    status:{type:String},
    isLogin:{type:Boolean},
    name:{type:String},
    email:{type: String, required:true, unique:true},
    password:{type:String,required:true},
    books:[{type:Types.ObjectId, ref:'Book'}]
})

module.exports = model('User',schema)