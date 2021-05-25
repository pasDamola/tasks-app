const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid email format')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value){
           if(value.toLowerCase().includes('password')){
               throw new Error('Value should not contain the word "password"')
           }
        }
    },

    age: {
        type: Number,
        default: 0,
    }
})


module.exports = mongoose.model('User', userSchema)

