const express = require('express')
const routes = express.Router()
const path = require('path')
routes.get('^/$|/index(.html)?' ,  (req , res)=>{
  res.sendFile(path.join(__dirname , '..' , 'views' , 'index.html'))
})

module.exports = routes