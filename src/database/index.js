const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/boximages', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
mongoose.set('useFindAndModify', false)

mongoose.Promise = global.Promise

mongoose.connection.on('connected', err => {
  if (err) throw err

  console.log('Connected database')
})

module.exports = mongoose
