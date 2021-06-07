import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcrypt-nodejs'
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/travelGuide"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const Countries = mongoose.model('Countries', {
  touristSights: {
    type: String
  },
  placesToStay: {
    type: String
  },
  food: {
    type: String
  }
})

const User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  }
})

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization')

  try {
    const user = await User.findOne({ accessToken })
    if (user) {
      next()
    } else {
      res.status(401).json({ message: 'Not authenticated' })
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error })
  }
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/countries', authenticateUser)
app.get('/countries', async (req, res) => {
  const countries = await Countries.find()
  res.json({ success: true, countries })
})

app.post('/countries', authenticateUser)
app.patch('/countries', async (req, res) => {
  const { id, touristSights, placesToStay, food } = req.body
  try {
    const newTips = await Countries.findByIdAndUpdate(id, {
      $set: {
        touristSights: touristSights, 
        placesToStay : placesToStay,
        food: food
      }
    }, {new: true})
    res.json({ success: true, newTips })
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid request", error })
  }
})


// app.post('/countries', authenticateUser)
// app.post('/countries', async (req, res) => {
//   const { touristSights, placesToStay, food } = req.body
//   try {
//     const newTips = await new Countries({ touristSights: req.body.touristSights, placesToStay: req.body.placesToStay, food: req.body.food }).save()
//     res.json({ success: true, newTips })
//   } catch (error) {
//     res.status(400).json({ success: false, message: "Invalid request", error })
//   }
// })

app.post('/signup', async (req, res) => {
  const { username, password } = req.body

  try {
    const salt = bcrypt.genSaltSync()

    const newUser = await new User({
      username,
      password: bcrypt.hashSync(password, salt)
    }).save()

    res.json({
      success: true,
      userID: newUser._id,
      username: newUser.username,
      accessToken: newUser.accessToken
    })
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid request', error })
  }
})

app.post('/signin', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        success: true,
        userID: user._id,
        username: user.username,
        accessToken: user.accessToken
      })
    } else {
      res.status(404).json({ success: false, message: 'User not found' })
    }
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid request', error })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
