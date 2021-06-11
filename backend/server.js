import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcrypt-nodejs'
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/travelGuide"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
mongoose.Promise = Promise

const Country = mongoose.model('Country', {
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
  },
  visitedCountries: [{
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country"
    },
    comments: String
  }]
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
  const countries = await Country.find()
  res.json({ success: true, countries })
})

//add visit country to visitedCountry

app.patch('/countries/visitedcountry/:countryid', authenticateUser)
app.patch('/countries/visitedcountry/:countryid', async (req, res) => {
  const { visitedCountries } = req.body 
  const { countryid } = req.params  
  try {
  const user = await User.findById(_id)
  const isVisited = await User.findByIdAndUpdate(countryid, {
    $set: {
      visitedCountries: visitedCountries
    }
  }, { new: true })
    res.json({ success: true, isVisited })
} catch (error) {
  res.status(400).json({ success: false, message: "Invalid request", error })
}
})


app.patch('/countries/:countryid', authenticateUser)
app.patch('/countries/:countryid', async (req, res) => {
  const { touristSights,placesToStay, food } = req.body  
  const { countryid } = req.params
  try {
    const user = await User.findById(_id)
    const countryIsVisited = user.visitedCountries.some((country) => {
      return country.equals(countryid)
  })
  if (countryIsVisited) {
    const newTips = await Country.findByIdAndUpdate(countryid, {
      $set: {
        touristSights: touristSights,
        placesToStay: placesToStay,
        food: food
      }
    }, { new: true })
    res.json({ success: true, newTips })
  } else {
    res.status(403).json({ success: false, message: "Country is not visited" })
  }
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid request", error })
  }
})


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
