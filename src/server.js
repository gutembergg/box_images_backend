const express = require('express')
const app = express()
const PORT = 5555
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

require('./controllers/authController')(app)

app.listen(PORT, () => {
  console.log(`Server listen in PORT ${PORT}`)
})
