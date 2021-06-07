const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

// Getting all users
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Getting one user
router.get('/:id', [auth, getUser], (req, res) => {
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
        const token = await user.generateAuthToken()
        const newUser = await user.save()
        res.status(201).json({ message: 'New user added', newUser, token })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


//login route
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })   
    } catch (error) {
        console.log(error)
        res.status(400).send({message: error.message})
    }
})


//logout route
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send({ message: 'Logged out successfully'})
    } catch (error) {
        res.status(500).send()
    }
})

//logout of all sessions
router.post('/logoutAll', auth, async (req, res) => {
    try {
        
        req.user.tokens = []
        res.send({ message: 'Logged out of all sessions successfully'})
        await req.user.save()
    } catch (error) {
        res.status(500).send()
    }
})



// Updating one user
   // The reason we use patch and not put is because patch only updates the information of only one record while put does so for all the records
router.patch('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
