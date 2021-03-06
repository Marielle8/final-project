import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Worldmap from './WorldMap'
import Header from './Header'
import Footer from './Footer'

import { API_URL } from '../reusable/urls'

import user from '../reducers/user'

const Main = () => {  
  const [newCountry, setNewCountry] = useState("")
  const [visitedList, setVisitedList] = useState([])
  const [newCountryId, setNewCountryId] = useState("")
  const [newComment, setNewComment] = useState("")

  const accessToken = useSelector(store => store.user.accessToken)
  const countriesItems = useSelector(store => store.user.items)
  const errorMsgCountry = useSelector(store => store.user.errorsCountry)
  const errorMsgTips = useSelector(store => store.user.errorsTips)
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
            dispatch(user.actions.setErrorsCountry(null))
            fetchVisitedList()
          })
        } else {
          dispatch(user.actions.setErrorsCountry('data'))
        }
      })
  }
  

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
          setVisitedList(data.users.visitedCountries)
        } else {
          dispatch(user.actions.setErrorsCountry('data'))
        }
      })
  }

  const onCountry = (event) => {
    const existingCountry = visitedList.some((item) => item.country.alphaCode === newCountry)
    if (!existingCountry) {
      const options = {
        method: 'PATCH',
        headers: {
          'Authorization': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ visitedCountry: newCountry, username })
      }
      fetch(API_URL('countries'), options)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            batch(() => {
              dispatch(user.actions.setVisitedCountry(newCountry))
              dispatch(user.actions.setErrorsCountry(null))
              fetchVisitedList()
            })
          } else {
            dispatch(user.actions.setErrorsCountry("Country already exist"))
          }
        })
    } else {
      dispatch(user.actions.setErrorsCountry("Country already exist"))
      event.preventDefault()
    }
  }

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
          dispatch(user.actions.setErrorsTips(null))
          fetchVisitedList()
          setNewComment("")         
        } else {
          dispatch(user.actions.setErrorsTips('Failed to add travel tips'))
        }
      })
  }

  const onButtonClick = () => {
    batch(() => {
      dispatch(user.actions.setUsername(null))
      dispatch(user.actions.setAccessToken(null))
      localStorage.removeItem('user')
    })
  }

  const onSelectedCountryTips = (event) => {   
    dispatch(user.actions.setCountryId(event.target.value))
    setNewCountryId(event.target.value)  
  }

  return (
    <>
      <Header />
      <div className="main-container">
        <form className="add-countries-form" onSubmit={onCountry}>
          <div className="logout-and-presentation-container">
            <h3 className="card-header">Hi {username}!</h3>
            <button className="logout-button" onClick={onButtonClick}>Log out</button>
          </div>
          <div className="presentation-text-container">
            <p className="presentation-text">Welcome to your travel journal. Here you can easily get an overview of all the countries you have visited by adding them to an interactive worldmap.</p>
            <p className="presentation-text">To remember all the wonderful places you have seen during your travels you can add notes to a specifik country and have them displayed further down on this page.</p>
          </div>
          <h3 className="card-header">Add a new country you have visited:</h3>
          <div>
            <select value={newCountry} onChange={(event) => setNewCountry(event.target.value)}>
              <optgroup label='Countries'>
                <option value="" disabled defaultValue>Select country</option>
                {countriesItems && countriesItems.map(country => (
                  <option
                    key={country.country}
                    value={country.alphaCode}
                  >
                    {country.country}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          {errorMsgCountry ? <p>{errorMsgCountry}</p> : null}
          <button className="add-countries-button" type="submit" disabled={!newCountry}>Add country</button>
        </form>
        <Worldmap visitedList={visitedList} />
        <form className="add-tips-form" onSubmit={onTravelTips}>
          <h3 className="card-header">Choose one of your visited countries and add some notes:</h3>
          <select value={newCountryId} onChange={onSelectedCountryTips}>
            <optgroup label='Countries'>
              <option value="" defaultValue>Select country</option>
              {visitedList && visitedList.map(country => (
                <option
                  key={country.country._id}
                  value={country._id}
                >{country.country.country}</option>
              ))}
            </optgroup>
          </select>
          <input
            type="text"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}            
            placeholder="Write a note"
          />
          <button type="submit" className="add-tips-button" disabled={!newComment}>Add notes</button>
          {errorMsgTips ? <p>{errorMsgTips}</p> : null}
        </form>
        <div className="travel-tips-container">
          <h3 className="card-header">Your travel notes:</h3>
          <div className="notes-container">
            {visitedList && visitedList.map(item => (
              <div key={item.country._id}>
                <p  className="presentation-text"><span className="country-text">Country:</span> {item.country.country}</p>
                {item.comments.map(comment => (
                  <div key={item.index}>
                    <p className="presentation-text"><span className="notes-text">Notes:</span> {comment}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div >
    </>
  )
}

export default Main