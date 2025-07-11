const express = require('express')
const app = express()
const port = 3000

const customerRouter = require('./routes/customer-routers')

const iteamRouter = require('./routes/iteams-routers')

const userRouter = require('./routes/user-routers')

// parse application/x-www-form-urlencoded
app.use(express.urlencoded())

// parse application/json
app.use(express.json())



app.use('/api/v1/customers', customerRouter)
app.use('/api/v1/iteams', iteamRouter)
app.use('/api/v1/users',userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
