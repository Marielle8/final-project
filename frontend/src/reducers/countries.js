import { createSlice } from '@reduxjs/toolkit'

// const initialState = localStorage.getItem('countries')
//   ? {
//     items: JSON.parse(localStorage.getItem('countries')).items,
//     visitedCountry: JSON.parse(localStorage.getItem('countries')).visitedCountry,
//     errors: null
//   }
//   : {
//     items: [],
//     visitedCountry: [],
//     errors: null
//   }

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
    },
    setVisitedCountry: (store, action) => {
      const existingCountry = store.visitedCountry.find((item) => item === action.payload)

      if (!existingCountry) {
        store.visitedCountry = [...store.visitedCountry, action.payload]
      }
    },
    setErrors: (store, action) => {
      store.errors = action.payload
    }
  }
});

export default countries;