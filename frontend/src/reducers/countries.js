import { createSlice } from '@reduxjs/toolkit'

const countries = createSlice({
  name: 'countries',
  initialState: {
    items: [],
    visitedCountry: [],
    errors: null
  },
  reducers: {
    setCountries: (store, action) => {
      store.items = action.payload
      console.log(action)
    },
    setVisitedCountry: (store, action) => {
      const existingCountry = store.visitedCountry.find((item) => item.id === action.payload.id)

      if(!existingCountry){
        store.visitedCountry = [...store.visitedCountry, action.payload]         
      } else {
        console.log('Finns redan')
        console.log(existingCountry)

      }
  },
    setErrors: (store, action) => {
      store.errors = action.payload
    }
  }
});

export default countries;