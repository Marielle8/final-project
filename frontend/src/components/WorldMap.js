import React, { useState, useEffect } from 'react'
import { WorldMap } from 'react-svg-worldmap'

const Worldmap = (props) => {
  const [data, setData] = useState([])

  const addItem = () => {
    const visitedCountreisList = props.visitedList.map(item => {
      return { country: item.country.alphaCode, value: "Visited" }
    })
    setData(visitedCountreisList)
  }
  useEffect(() => {
    addItem()
  }, [props.visitedList])

  return (

    <div className="worldmap-container">
      {data.length && <WorldMap
        color="#44656E"
        backgroundColor="transparent"
        tooltipBgColor="#000"
        title="Visited Countries"
        value-prefix="visited"
        size="responsive"
        data={data} />}
    </div>
  )
}

export default Worldmap