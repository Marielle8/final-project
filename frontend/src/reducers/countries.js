import { createSlice } from '@reduxjs/toolkit';

const countries = createSlice({
  name: 'countries',
  initialState: {
    items: [],
    errors: null
  },
  reducers: {
    setCountries: (store, action) => {
      store.items = action.payload;
    },
    setErrors: (store, action) => {
      store.errors = action.payload;
    }
  }
});

export default countries;