const express = require('express')
const app = express()
const path = require('path')
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/ErrorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')

const PORT = process.env.PORT || 5000

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
app.listen(PORT , ()=> console.log(`app running on port ${PORT}`))
