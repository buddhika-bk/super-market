const express = require('express')
const app = express()
const port = 3000

const customerRouter = require('./routes/customer-routers')

const iteamRouter = require('./routes/iteams-routers')

const userRouter = require('./routes/user-routers')

const uploadRouter = require('./routes/uploads-routes');


const path = require('path');

// parse application/x-www-form-urlencoded
app.use(express.urlencoded())

// parse application/json
app.use(express.json())



app.use('/api/v1/customers',customerRouter)
app.use('/api/v1/iteams', iteamRouter)
app.use('/api/v1/users',userRouter)
app.use('/uploads', uploadRouter);
app.use('/upload', express.static(path.join(__dirname, '/uploads')));
app.use('/uploads-customers', express.static(path.join(__dirname, 'uploads-customers')));
app.use('/upload-iteams', express.static(path.join(__dirname, 'upload-iteams')));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
