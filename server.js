require('dotenv').config()


const express = require('express')
const app = express()
const mongoose = require('mongoose')
const usersRouter = require('./routes/users')
const tasksRouter = require('./routes/tasks')
const port = process.env.PORT || 3000


mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Database Connected') )

app.use(express.json())


app.use('/users', usersRouter)
app.use('/tasks', tasksRouter)


app.listen(port, () => console.log('Server Started!'))