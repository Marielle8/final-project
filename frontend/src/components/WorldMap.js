import React, { useState, useEffect } from 'react'
import { WorldMap } from 'react-svg-worldmap'
import passport from '../assets/passport.png'

const Worldmap = (props) => {
  const [data, setData] = useState([])

  const percentageOfWorld = () => {
    let numberOfCountriesVisited = props.visitedList.length  
    const x = 0.4
    let sum = x*numberOfCountriesVisited
    return(sum)
  }

  useEffect(() => {
  const addItem = () => {
    const visitedCountreisList = props.visitedList.map(item => {
      return { country: item.country.alphaCode, value: "Visited" }
    })
    setData(visitedCountreisList)
  }
    addItem()
  }, [props.visitedList])


  return (

    <div className="worldmap-container">
      <p className="card-header">Your visited countries:</p>
      {data.length ? <p className="presentation-text">You have visited {Math.ceil(percentageOfWorld())}% of the world.</p> :null}
      {data.length ? <WorldMap
        color="#44656E"
        backgroundColor="transparent"
        tooltipBgColor="#000"
        value-prefix="visited"
        size="lg"
        data={data} />
        : <img src={passport} alt="passport showing while visited list is empty"/>
      }
    </div>
  )
}

export default Worldmap