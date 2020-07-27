const express = require('express')
require('dotenv').config()

const app = express()
const PORT = 5555
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const consign = require('consign')

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

consign().include('src/controllers').into(app)

app.listen(PORT, () => {
  console.log(`Server listen in PORT ${PORT}`)
})
