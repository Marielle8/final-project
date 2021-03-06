import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcrypt-nodejs'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

dotenv.config()

import countryDB from './data/countryDB.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/travelGuide"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
mongoose.Promise = Promise

const Country = mongoose.model('Country', {
  country: String,  
  alphaCode: String,
})

const User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
    unique: true,
    
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  },
  visitedCountries:[ {
    country: { 
      type: Object,
      ref: "Country", 
    }, 
      comments: Array      
  }]
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Country.deleteMany();

    await countryDB.forEach((item) => {
      const newCountry = new Country(item);
      newCountry.save();
    });
  }
  seedDatabase();
}

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization')
  try {
    const user = await User.findOne({ accessToken })
    if (user) { 
      req.user = user   
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

app.get('/users', authenticateUser)
app.get('/users', async (req, res) => { 
  const {id} = req.user 
  const users = await User.findById(id) 
  res.json({ success: true, users })
})

app.patch('/countries', authenticateUser)
app.patch('/countries', async (req, res) => {
  const { username, visitedCountry  } = req.body
  try {        
    const countryByAlphaCode = await Country.findOne({ alphaCode: visitedCountry }).lean()  
        const updatedUser = await User.findOneAndUpdate({ username: username, },{  
          $push: {        
            visitedCountries: {country: countryByAlphaCode}
            },      
        }, { new: true })
    res.json({ success: true, updatedUser })
      
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid request", error })
  }  
})

app.patch('/countries/:countryid', authenticateUser)
app.patch('/countries/:countryid', async (req, res) => {
  const { countryid } = req.params
  const { comments, } = req.body
  const {id} = req.user   
  try { 
    const updatedTravelTips = await User.findOneAndUpdate( {_id: id, "visitedCountries._id": countryid }, {      
      $push: {  
        "visitedCountries.$.comments": comments
      },      
    }, { new: true })
    res.json({ success: true, updatedTravelTips })    
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