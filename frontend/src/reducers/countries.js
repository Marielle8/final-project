// import { createSlice } from '@reduxjs/toolkit'

// const countries = createSlice({
//   name: 'countries',
//   initialState: {
//     items: [],
//     visitedCountry: [],
//     errors: null
//   },
//   reducers: {
//     setCountries: (store, action) => {
//       store.items = action.payload
//     },
//     setVisitedCountry: (store, action) => {
//       const existingCountry = store.visitedCountry.find((item) => item === action.payload)

//       if (!existingCountry) {
//         store.visitedCountry = [...store.visitedCountry, action.payload]
//       }
//     },
//     setErrors: (store, action) => {
//       store.errors = action.payload
//     }
//   }
// });

// export default countries;