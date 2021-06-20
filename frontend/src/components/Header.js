import React, { useEffect, useRef } from 'react'
import { useDispatch, batch, useSelector } from 'react-redux'
import lottie from 'lottie-web'
import { useHistory } from 'react-router-dom'

import user from '../reducers/user'

import assets from '../assets/header-desktop.png'

const Header = () => {  

  const dispatch = useDispatch()
  const history = useHistory()

  const username = useSelector(store => store.user.username)
  const accessToken = useSelector(store => store.user.accessToken)

  const onButtonClick = () => {
    batch(() => {
      dispatch(user.actions.setUsername(null))
      dispatch(user.actions.setAccessToken(null))

      localStorage.removeItem('user')
    })
  }
  const lottieContainer = useRef(null)

  useEffect(() => {
    if (accessToken) {
      history.push('/')
    }
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../animation/airplane.json')
    })
  }, [accessToken, history])

  return (
    <section className="header">
      <img className="header-icon" src={assets} alt="Traveljournal-icon" />
      <div className="lottie-container" ref={lottieContainer} />
      <div className="header-text">
        <h1 className="header-h1">Welcome</h1>
        <h2 className="header-h2">{username}</h2>
        <button className="logout-button" onClick={onButtonClick}>Log out</button>
      </div>
    </section>
  )
}

export default Header