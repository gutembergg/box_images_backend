const mongoose = require('../database')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false
  },
  resetPasswordToken: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

UserSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
