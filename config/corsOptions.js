const alloewdOrigins = require('./allowedOrigins')

const corsOptions = {
  origin:(origin , callback)=>{
      if(alloewdOrigins.indexOf(origin) !== -1 || !origin){
        callback(null , true)
      }else{
        callback(new Error('not alowed by CORS'))
      }
  },

  credentials: true,
  optionsSuccessStatus: 200
}

module.exports = corsOptions