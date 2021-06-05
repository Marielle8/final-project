import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import WorldMap from './WorldMap'

import { API_URL } from '../reusable/urls'

import countries from '../reducers/countries'
import user from '../reducers/user'

const Main = () => {  
  const [newCountry, setNewCountry] = useState("")

  const accessToken = useSelector(store => store.user.accessToken)
  const countriesItems = useSelector(store => store.countries.items)
  const storedCountries = useSelector(store => store.countries.visitedCountry) 
  const errorMsgMain = useSelector(store => store.countries.errors)

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

      localStorage.removeItem('user')
    })
  }

  const onCountry = (event) => {
    console.log({newCountry})   
    event.preventDefault()
    const existingCountry = storedCountries.find((item) => item === newCountry)
    if(!existingCountry){
      dispatch(countries.actions.setVisitedCountry(newCountry)) 
      dispatch(countries.actions.setErrors(null))   
  } else {    
    dispatch(countries.actions.setErrors({message:'Country already exist'}))
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
                {countriesItems.map(country => (
                  <option                   
                  key={country.Country}
                  value={country.AlphaCode}                                  
                  >{country.Country}</option>                
                  ))}
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