const jwt = require('jsonwebtoken')
const authConfig = require('../config/authConfig.json')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).send({ Error: 'Token not provoied' })
  }

  const parts = authHeader.split(' ')

  if (!(parts.length === 2)) {
    return res.status(401).send({ Error: 'Token bad format' })
  }

  const [sheme, token] = parts

  if (!/^Bearer$/i.test(sheme)) {
    return res.status(401).send({ Error: 'Token malformatted' })
  }
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ Error: 'Token invalid' })

    req.userId = decoded.id

    return next()
  })
}
