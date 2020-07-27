const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')

const User = require('../models/User')
const authConfig = require('../config/authConfig.json')

const router = express.Router()

function generateToken (params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

router.post('/register', async (req, res) => {
  const { email } = req.body
  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'User already exists' })
    }
    const user = await User.create(req.body)

    user.password = undefined

    return res.send({
      user,
      token: generateToken({ id: user.id })
    })
  } catch (err) {
    return res.status(400).send({ Error: 'Error register faild' })
  }
})

router.post('/authenticate', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(400).send({ Error: 'User not found' })
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ Error: 'Invalid password' })
    }

    user.password = undefined

    return res.send({
      user,
      token: generateToken({ id: user.id })
    })
  } catch (err) {
    return res.status(400).send({ Error: 'Error in authenticate' })
  }
})

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).send({ Error: 'User not found' })
    }

    const token = crypto.randomBytes(20).toString('hex')

    console.log(token)

    await User.findByIdAndUpdate(user._id, {
      $set: { resetPasswordToken: token }
    })

    const pathname = req.header('origin')

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: `${email}`,
      from: 'gmascarenhas3001@gmail.com',
      subject: `Reset Password ${user.name} `,
      html: `
          <p>Bonjour,</p>
          <p>Vous pouvez changer le password clickez sur le lien en dessus.</p>
          <p>"<strong>${user.name}</strong>"</p>
          <p>Pour changer votre mot de passe : "${pathname}/resetpassword/${token}"</p>
        `
    }

    ;(async () => {
      try {
        await sgMail.send(msg)
      } catch (error) {
        console.error(error)

        if (error.response) {
          console.error(error.response.body)
        }
      }
    })()

    res.send('ok')
  } catch (error) {
    return res.status(400).send({ Error: 'Error inforgot password' })
  }
})

router.post('/reset_password/:id', async (req, res) => {
  const { email, password } = req.body
  const { id } = req.params

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).send({ Error: 'User not found' })
    }
    if (user.resetPasswordToken !== id) {
      return res.status(401).send({ Error: 'Error not authorizate' })
    }

    user.password = password

    await user.save()
    return res.send({ user })
  } catch (error) {
    return res.status(400).send({ Error: 'Error reset password' })
  }
})

module.exports = app => app.use('/auth', router)
