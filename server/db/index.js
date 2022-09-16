const mongoose = require('mongoose')

mongoose
  .connect('mongodb://127.0.0.1:27017/cinema', { useNewUrlParser: true})
  .catch(e => {
    consoole.error('Connection error', e.message)
  })
  
const db = mongoose.connection

module.exports = db