import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import user from '../reducers/user'

import { API_URL } from '../reusable/urls'
import assets from '../assets/traveljournal2-icon.png'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState(null)

  const accessToken = useSelector(store => store.user.accessToken)
  const errorMsg = useSelector(store => store.user.errors)

  const dispatch = useDispatch()
  const history = useHistory()  

  useEffect(() => {
    if (accessToken) {
      history.push('/')
    }    
  }, [accessToken, history])

  const onFormSubmit = (event) => {
    event.preventDefault()

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    }
    fetch(API_URL(mode), options)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUsername(data.username))
            dispatch(user.actions.setAccessToken(data.accessToken))
            dispatch(user.actions.setErrors(null))

            localStorage.setItem('user', JSON.stringify({
              username: data.username,
              accessToken: data.accessToken
            }))
          })
        } else {
          dispatch(user.actions.setErrors(data))
        }
      })
      .catch()
  }

  return (
    <form
      className="login-form"
      onSubmit={onFormSubmit} >
      <div className="login-input-container">
        <img src={assets} alt="Traveljournal-icon" />
        <h3 className="site-description">Keep track of your visited countries</h3>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />
      </div>
      {errorMsg ? <p>{errorMsg.message}</p> : null}
      <button
        type="submit"
        onClick={() => setMode('signin')}
      >
        Sign in
      </button>
      <button

        type="submit"
        onClick={() => setMode('signup')}
      >
        Sign up
      </button>
    </form>
  )
}

export default Login