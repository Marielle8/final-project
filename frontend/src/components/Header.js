import React from 'react'
import { useDispatch, batch } from 'react-redux'

import user from '../reducers/user'

import assets from '../assets/traveljournal2-icon.png'

const Header = () => {
  const dispatch = useDispatch()

  const onButtonClick = () => {
    batch(() => {
      dispatch(user.actions.setUsername(null))
      dispatch(user.actions.setAccessToken(null))

      localStorage.removeItem('user')
    })
  }
  return (
    <section className="header">
      <div className="header-container">
        <img className="header-icon" src={assets} alt="Traveljournal-icon" />

      </div>
      <div className="header-text">

        <span ><h1>Welcome</h1></span>
        <span><h1>Marielle!</h1></span>
        <button className="logout-button" onClick={onButtonClick}>Log out</button>
      </div>
    </section>
  )
}

export default Header