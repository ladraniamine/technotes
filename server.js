require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/ErrorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const {logEvent} = require('./middleware/logger')
const PORT = process.env.PORT || 5000

connectDB()

app.use(logger)

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname , '/public')))
app.use('/' , require('./routes/root'))

app.all('*' , (req,res)=>{
  if(req.accepts('html')){
    res.status(404)
    .sendFile(path.join(__dirname  , 'views' , '404.html'))
  }else if(req.accepts('json')){
    res.json({message: '404 not found'})
  }else{
    res.type('txt').send("404 not found")
  }
})

app.use(errorHandler)

mongoose.connection.once('open' , ()=>{
  console.log('mongodb connected')
  app.listen(PORT , ()=> console.log(`app running on port ${PORT}`))
})

mongoose.connection.on('error' ,err =>{
  console.log(err)
  logEvent(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
