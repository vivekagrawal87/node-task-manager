const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const auth = require('./middleware/auth')

const app = express()

//parse request and response to json
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app
