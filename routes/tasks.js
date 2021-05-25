const express = require('express')
const router = express.Router()
const Task = require('../models/task')

// Getting all subscribers
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
