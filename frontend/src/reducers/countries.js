import { createSlice } from '@reduxjs/toolkit'

const countries = createSlice({
  name: 'countries',
  initialState: {
    items: [],
    visitCountry: null,
    errors: null
  },
  reducers: {
    setCountries: (store, action) => {
      store.items = action.payload
      console.log(action)
    },
    setVisitCountry: (store, action) => {
      store.visitCountry = action.payload      
    },
    setErrors: (store, action) => {
      store.errors = action.payload
    }
  }
});

export default countries;