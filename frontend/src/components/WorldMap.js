import React from 'react'
import { WorldMap } from 'react-svg-worldmap'
import { useSelector } from 'react-redux'



const Worldmap = (props) => {
  console.log(props.visitedList)
  const data = [

  ]

  // { country: 'se', value: "visited" },
  // { country: "cn", value: 1 },  // china
  // { country: "in", value: 1 },  // india

  return (
    <div className="worldmap-container">
      <WorldMap
        color="#44656E"
        backgroundColor="transparent"
        tooltipBgColor="#000"
        title="Visited Countries"
        value-prefix="visited"
        size="responsive"
        data={data} />
    </div>
  )
}

export default Worldmap