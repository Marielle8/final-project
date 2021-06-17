import React from 'react'
import { WorldMap } from 'react-svg-worldmap'
import { useSelector } from 'react-redux'
import { useState } from 'react'


const [data,setData] = useState([])
// this.setState({ data: [...this.state.data,{country: item.country.alphaCode , value: 1}] }) 
setData(newData)


const Worldmap = (props) => { 

  const data = []
  props.visitedList.forEach(item => {
    data.push({country: item.country.alphaCode , value: 1})    
  })
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