const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})


userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })

    await user.save()

    return token
}


// findByCredentials
userSchema.statics.findByCredentials = async function(email, password) {
    const user = await this.findOne({ email: email })
    if(!user) {
        throw new Error('Unable to Login')
    }

    const isMatch = bcrypt.compare(user.password, password)

    if(!isMatch) {
        throw new Error('Unable to Login')
    }

    return user
}


// hash a plain text password
userSchema.pre('save',async  function(next) {
    const user = this

    user.password = await bcrypt.hash(user.password, 8)
  

    next()
})



module.exports = mongoose.model('User', userSchema)
