import { createSlice } from '@reduxjs/toolkit'

const initialState = localStorage.getItem('user')
  ? {
    username: JSON.parse(localStorage.getItem('user')).username,
    accessToken: JSON.parse(localStorage.getItem('user')).accessToken,
    errors: null,
    visitedCountry: [],
    visitedCountryId: null,
    items: []    
  }
  : {
    username: null,
    accessToken: null,
    errors: null,
    visitedCountry: [],
    visitedCountryId: null,
    items: []    
  }

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (store, action) => {
      store.username = action.payload
    },
    setAccessToken: (store, action) => {
      store.accessToken = action.payload
    },
    setErrors: (store, action) => {
      store.errors = action.payload
    },
    setCountries: (store, action) => {
      store.items = action.payload
    },
    setVisitedCountry: (store, action) => {
      const existingCountry = store.visitedCountry.find((item) => item === action.payload)
      if (!existingCountry) {
        store.visitedCountry = [...store.visitedCountry, action.payload]        
      }     
    }, 
    setCountryId: (store, action) => {
      store.visitedCountryId = action.payload      
    },  
  }
})

export default user