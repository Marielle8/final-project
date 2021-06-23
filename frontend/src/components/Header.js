import React, { useEffect, useRef } from 'react'
import {  useSelector } from 'react-redux'
import lottie from 'lottie-web'

import desktopicon from '../assets/header-desktop.png'
import icon from '../assets/traveljournal2-icon.png'

const Header = () => {   

  const username = useSelector(store => store.user.username) 
  const lottieContainer = useRef(null)

  useEffect(() => {    
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../animation/airplane.json')
    })
  }, [])

  return (
    <section className="header">
      <img className="header-icon-desktop" src={desktopicon} alt="Traveljournal-icon" />
      <img className="header-icon" src={icon} alt="Traveljournal-icon" />
      <div className="lottie-container" ref={lottieContainer} />
      <div className="header-text">
        <h1 className="header-h1">Welcome</h1>
        <h2 className="header-h2">{username}</h2>       
      </div>
    </section>
  )
}

export default Header