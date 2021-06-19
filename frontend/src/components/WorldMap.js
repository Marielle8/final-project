import React, { useState, useEffect } from 'react'
import { WorldMap } from 'react-svg-worldmap'

import { useSelector } from 'react-redux'

import assets from '../assets/visited-countries.png'

const Worldmap = (props) => {
  // const [data, setData] = useState([])
  // const addItem = () => {
  //   const visitedCountriesList = props.visitedList.map(item => {
  //     return { country: item.country.alphaCode, value: 1 }
  //   })
  //   setData(visitedCountriesList)
  // }

  // useEffect(() => {
  //   addItem(data)
  // }, [props.visitedList])

  // { country: 'se', value: "visited" },
  // { country: "cn", value: 1 },  // china
  // { country: "in", value: 1 },  // india
  const data = []
  return (
    <div className="worldmap-container">
      {/* <img src={assets} alt="" /> */}
      <h2>Your visited contries:</h2>
      <WorldMap
        color="#44656E"
        backgroundColor="transparent"
        tooltipBgColor="#000"
        // title="Visited Countries"
        value-prefix="visited"
        size="responsive"
        data={data} />
    </div>
  )
}

export default Worldmap