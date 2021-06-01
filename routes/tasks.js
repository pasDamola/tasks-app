const express = require('express')
const router = express.Router()
const Task = require('../models/task')

// Getting all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Getting one task
router.get('/:id', getTasks, (req, res) => {
    res.send(res.task)
})


// Creating one task
router.post('/', async  (req, res) => {
    const task = new Task({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })

    try {
        const newTask = await Task.save()
        res.status(201).json({ message: 'New task added', data: newTask})
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})



// Updating one task
   // The reason we use patch and not put is because patch only updates the information of only one record while put does so for all the records
router.patch('/:id', getTasks, async (req, res) => {
    if(req.body.description !== null) {
        res.task.description = req.body.description
    } 
    if(req.body.completed !== null){
        res.task.completed = req.body.completed
    }

    try {
        const updatedtask = await res.task.save()
        res.json(updatedtask)
    } catch (error) {
        res.status(400).json({ message: error.message})   
    }
   
})



// Deleting one task
router.delete('/:id', getTasks, async (req, res) => {
    try {
      await  res.task.remove()
      res.json({ message: 'Deleted task'})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

async function getTasks(req, res, next) {
    let task
    try {
        task = await Task.findById(req.params.id)
        if(task == null){
           return res.status(404).json({ message: 'Cannot find user'})
        }
    } catch(error) {
       return res.status(500).json({ message: error.message})
    }
    
    res.task = task
    next()
}


module.exports = router
