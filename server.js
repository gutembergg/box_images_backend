const express = require('express')
const app = express()
const PORT = 5555

app.listen(PORT, () => {
  console.log(`Server listen in PORT ${PORT}`)
})
