import React, { useEffect } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { API_URL } from '../reusable/urls'

import countries from '../reducers/countries'
import user from '../reducers/user'

const Main = () => {
  const accessToken = useSelector(store => store.user.accessToken)
  const countriesItems = useSelector(store => store.countries.items)
  console.log(countriesItems)

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    if (!accessToken) {
      history.push('/login')
    }
  }, [accessToken, history])

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: accessToken
      }
    }

    fetch(API_URL('countries'), options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          batch(() => {
            dispatch(countries.actions.setCountries(data.countries))
            dispatch(countries.actions.setErrors(null))
          })
        } else {
          dispatch(countries.actions.setErrors('data'))
        }
      })
    // eslint-disable-next-line
  }, [accessToken])

  const onButtonClick = () => {
    batch(() => {
      dispatch(user.actions.setUsername(null))
      dispatch(user.actions.setAccessToken(null))
      dispatch(countries.actions.setCountries([]))

      localStorage.removeItem('user')
    })
  }

  return (
    <div className="main-container">
      <p>Collections of countries from api:</p>
      {countriesItems.map(country => (
        <div key={country._id}>
          <p>{country.touristSights}</p>
          <p>{country.placesToStay}</p>
          <p>{country.food}</p>
        </div>
      ))
      }
      <button onClick={onButtonClick}>Logout</button>
    </div >
  )
}

export default Main