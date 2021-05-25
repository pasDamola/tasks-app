require('dotenv').config()
const mongoose = require('mongoose')
const validator = require('validator')



mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection

const User = mongoose.model('User', {
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

const me = new User({
    name: 'Oyindamola',
    age: 24,
    password: 'phpandjs1!',
    email: 'oyinDAdavid18@df.com'
})

// me.save().then(() => {
//     console.log(me)
// }).catch(err => console.error(err))

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },

    completed: {
        type: Boolean,
        default: false
    }
})

const firstTask = new Task({
    description: 'Become so good they cannot ignore you',
})

firstTask.save().then(() => {
    console.log(firstTask)
}).catch(err => console.error(err))