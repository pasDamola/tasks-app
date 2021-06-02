const express = require('express')
const router = express.Router()
const User = require('../models/user')

// Getting all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Getting one user
router.get('/:id', getUser, (req, res) => {
    res.send(res.user)
})


// Creating one user
router.post('/', async  (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        password: req.body.password
    })
    try {
        await User.init();
        const newUser = await user.save()
        res.status(201).json({ message: 'New user added', data: newUser})
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


//login route
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)   
    } catch (error) {
        console.log(error)
        res.status(400).send({message: error.message})
    }
})


// Updating one user
   // The reason we use patch and not put is because patch only updates the information of only one record while put does so for all the records
router.patch('/:id', getUser, async (req, res) => {
    if(req.body.name !== null) {
        res.user.name = req.body.name
    } 
    if(req.body.email !== null){
        res.user.email = req.body.email
    }

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json({ message: error.message})   
    }
   
})



// Deleting one user
router.delete('/:id', getUser, async (req, res) => {
    try {
      await  res.user.remove()
      res.json({ message: 'Deleted user'})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if(user == null){
           return res.status(404).json({ message: 'Cannot find user'})
        }
    } catch(error) {
       return res.status(500).json({ message: error.message})
    }
    
    res.user = user
    next()
}



module.exports = router
