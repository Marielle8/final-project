import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import WorldMap from './WorldMap'

import { API_URL } from '../reusable/urls'

import user from '../reducers/user'

const Main = () => {
  const [newCountry, setNewCountry] = useState("")
  const [visitedList, setVisitedList] = useState([])
  const [newCountryTips, setNewCountryTips] = useState("")
  const [newComment, setNewComment] =useState("")

  const accessToken = useSelector(store => store.user.accessToken)
  const countriesItems = useSelector(store => store.user.items)
  const storedCountries = useSelector(store => store.user.visitedCountry)
  const errorMsgMain = useSelector(store => store.user.errors)
  const username = useSelector(store => store.user.username)   

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    if (!accessToken) {
      history.push('/login')
    }
  }, [accessToken, history])
  
  useEffect(() => {
    fetchCountries()
    // eslint-disable-next-line 
  }, [accessToken])
  
    
    const fetchCountries = () => {
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
            console.log("a",data.countries)           
          })
        } else {
          dispatch(user.actions.setErrors('data'))
        }    
})}

// hämta lista av besökta länder
const fetchVisitedList = () => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: accessToken
    }
  }
  fetch(API_URL('users'), options)
    .then(res => res.json())
    .then(data => {
      if (data.success) {                    
        batch(() => {
          console.log(data.users.visitedCountries)           
        })
      } else {
        dispatch(user.actions.setErrors('data'))
      }    
    })}   
    
  const onButtonClick = () => {
    batch(() => {
      dispatch(user.actions.setUsername(null))
      dispatch(user.actions.setAccessToken(null))

      localStorage.removeItem('user')
    })
  }

  const onCountry = (event) => {
    event.preventDefault()
    const options = {
      method: 'PATCH',
      headers: {
        'Authorization': accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ visitedCountry: newCountry, username})      
    }
    fetch(API_URL('countries'), options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchVisitedList()            
          console.log({storedCountries})
          const existingCountry = storedCountries.find((item) => item === newCountry)
          if (!existingCountry) {            
            dispatch(user.actions.setVisitedCountry(newCountry))
            dispatch(user.actions.setErrors(null))            
          } else {
            dispatch(user.actions.setErrors({ message: 'Country already exist' }))      
          }
          
        } else { console.error(data) }
      })
  } 

  const onTravelTips = (event) => {    
    event.preventDefault()

    const options = {
      method: 'PATCH',
      headers: {        
        Authorization: accessToken
      },
      body: JSON.stringify({ comments: newComment})
    }
    fetch(API_URL('countries'), options)
      .then(res=> res.json())
      .then(data => {        
        if (data.success) {     
            dispatch(user.actions.setTravelTips(newComment))
            dispatch(user.actions.setErrors(null))
          } else {
            dispatch(user.actions.setErrors({ message: 'Failed to add travel tips' }))      
          }
        })
      }
      
  return (
    <div className="main-container">      
      <form >
        <p>Collections of countries from api:</p>
        <div>
          <select value={newCountry} onChange={(event) => setNewCountry(event.target.value)}>
            <optgroup label='Countries'>
              {countriesItems && countriesItems.map(country => (
                <option
                  key={country.country}
                  value={country.alphaCode}
                  >{country.country}</option>
                  ))}              
            </optgroup>
          </select>          
        </div>
        {errorMsgMain ? <p>{errorMsgMain.message}</p> : null}
        <button onClick={onCountry}>submit</button>
      </form>      
      <form >
      <select value={newCountryTips} onChange={(event) => setNewCountryTips(event.target.value)}>
            <optgroup label='Countries'>
              {storedCountries && storedCountries.map(country => (
                <option
                  key={country.country}
                  value={country.alphaCode}
                  >{country.country}</option>
                  ))}
            </optgroup>
          </select>
            <input
              type="text"
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              className= "username-input"
              placeholder="food"
            />  
        <button onClick={onTravelTips}>Add tips</button>
        </form>
      <WorldMap />
      <div>     
      {visitedList && visitedList.map(visitedCountry => (
        <p key={visitedCountry.country._id}>{visitedCountry.comments}</p>        
        ))}                  
      </div>
      <button onClick={onButtonClick}>Logout</button>
    </div >
  )
}

export default Main