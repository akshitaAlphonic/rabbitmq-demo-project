const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    phone : {
        type : Number
    },
    password : {
        type : String , select : false
    }
},
{
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
    }
})

const model = mongoose.model('user' , userSchema)

module.exports = model