import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import WorldMap from './WorldMap'

import { API_URL } from '../reusable/urls'

import user from '../reducers/user'

const Main = () => {
  const [newCountry, setNewCountry] = useState("")

  const accessToken = useSelector(store => store.user.accessToken)
  const countriesItems = useSelector(store => store.user.items)
  const storedCountries = useSelector(store => store.user.visitedCountry)
  const errorMsgMain = useSelector(store => store.user.errors)

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
            dispatch(user.actions.setCountries(data.countries))
            dispatch(user.actions.setErrors(null))
            console.log(data)
          })
        } else {
          dispatch(user.actions.setErrors('data'))
        }
      })
    // eslint-disable-next-line 
  }, [accessToken])

  const onButtonClick = () => {
    batch(() => {
      dispatch(user.actions.setUsername(null))
      dispatch(user.actions.setAccessToken(null))

      localStorage.removeItem('user')
    })
  }

  const onCountry = (event) => {
    console.log({ newCountry })
    event.preventDefault()
    const existingCountry = storedCountries.find((item) => item === newCountry)
    if (!existingCountry) {
      dispatch(user.actions.setVisitedCountry(newCountry))
      dispatch(user.actions.setErrors(null))
    } else {
      dispatch(user.actions.setErrors({ message: 'Country already exist' }))
      console.log(errorMsgMain)
    }
  }


  return (
    <div className="main-container">
      <form onSubmit={onCountry}>
        <p>Collections of countries from api:</p>
        <div>
          <select value={newCountry} onChange={(event) => setNewCountry(event.target.value)}>
            <optgroup label='Countries'>
              {countriesItems && countriesItems.map(country => (
                <option
                  key={country.Country}
                  value={country.AlphaCode}
                >{country.Country}</option>
              ))}
              {console.log(countriesItems)}
            </optgroup>
          </select>
        </div>
        {errorMsgMain ? <p>{errorMsgMain.message}</p> : null}
        <button onClick={onCountry}>submit</button>
      </form>
      <WorldMap />
      <button onClick={onButtonClick}>Logout</button>
    </div >
  )
}

export default Main