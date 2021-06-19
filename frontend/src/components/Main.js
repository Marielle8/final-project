import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Worldmap from './WorldMap'
import Header from './Header'

import { API_URL } from '../reusable/urls'

import user from '../reducers/user'

const Main = () => {
  const [newCountry, setNewCountry] = useState("")
  const [visitedList, setVisitedList] = useState([])
  const [newCountryTips, setNewCountryTips] = useState("")
  const [newComment, setNewComment] = useState("")

  const accessToken = useSelector(store => store.user.accessToken)
  const countriesItems = useSelector(store => store.user.items)
  const storedCountries = useSelector(store => store.user.visitedCountry)
  const errorMsgMain = useSelector(store => store.user.errors)
  const username = useSelector(store => store.user.username)
  const countryId = useSelector(store => store.user.visitedCountryId)  
  
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
            fetchVisitedList()
          })
        } else {
          dispatch(user.actions.setErrors('data'))
        }
      })
  }

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
            setVisitedList(data.users.visitedCountries)
          })
        } else {
          dispatch(user.actions.setErrors('data'))
        }
      })
  }
  // const onButtonClick = () => {
  //   batch(() => {
  //     dispatch(user.actions.setUsername(null))
  //     dispatch(user.actions.setAccessToken(null))

  //     localStorage.removeItem('user')
  //   })
  // }

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
          batch(() =>{
          fetchVisitedList()
          dispatch(user.actions.setVisitedCountry(newCountry))
          dispatch(user.actions.setErrors(null))
          })
        } else { console.error(data) }
      })
  }

// 

  const onTravelTips = (event) => {
    event.preventDefault()

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comments: newComment })
    }
    fetch(API_URL(`countries/${countryId}`), options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log(data)
          // sätter id till stat
          dispatch(user.actions.setTravelTips(newCountryTips))
          // ska ta det som skrivs i input
          dispatch(user.actions.setNewComment(newComment))
          // dispatch(user.actions.setErrors(null))
        } else {
          dispatch(user.actions.setErrors({ message: 'Failed to add travel tips' }))
        }
      })
  }

  return (

    <div className="main-container">
      <Header />
      <Worldmap visitedList={visitedList} />
      <form className="countries-form">
        <p>Add a new country you have visited</p>
        <div>
          <select value={newCountry} onChange={(event) => setNewCountry(event.target.value)}>
            <optgroup label='Countries'>
            <option value="" disabled selected>Select country</option>
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
        <button onClick={onCountry}>Add country</button>
      </form>
      <form className="add-tips-form">
        <p>Choose one of your visited countries and add some tips:</p>
        <select value={newCountryTips} onChange={(event) => setNewCountryTips(event.target.value)}>
          <optgroup label='Countries'> 
            {visitedList && visitedList.map(country => (
              <option
                key={country.country._id}
                value={country.country._id}
              >{country.country.country}</option>
              ))}
          </optgroup>
        </select>

        <input
          type="text"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          className="username-input"
          placeholder="food"
        />

        <button className="add-button" onClick={onTravelTips}>Add travel tips</button>
      </form>      
      {/* <div>
        {visitedList && visitedList.map(visitedCountry => (
          <div>
            {visitedCountry.country.map(item => (
              <div key={item._id}>
                <p>{item.country}</p>
                <p>{item.alphaCode}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      {console.log(visitedList)} */}
      {/* <button onClick={onButtonClick}>Logout</button> */}
      <div className="travel-tips-container">
        <p>Your travel tips:</p>
      </div>
    </div >


  )
}

export default Main