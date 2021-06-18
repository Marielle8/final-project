import React from 'react'
import { WorldMap } from 'react-svg-worldmap'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'


// const [data,setData] = useState([])
// setData(sata)


const Worldmap = (props) => { 
  const [data,setData] = useState([])

  useEffect(() => { 
    addItem()
  },[data])
  addItem()
  let newItem

  const addItem = () => {
  props.visitedList.forEach(item => {
    newItem = {country: item.country.alphaCode , value: 1}
    setData([...data,newItem])    
  })
}
  // { country: "cn", value: 1 },  // china
  // { country: "in", value: 1 },  // india
  console.log(data)
 
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