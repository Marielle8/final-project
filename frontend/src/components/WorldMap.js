import React from 'react'
import { WorldMap } from 'react-svg-worldmap'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'


// const [data,setData] = useState([])
// setData(sata)


const Worldmap = (props) => { 

  const [data,setData] = useState([])
  
  const newItem = "" 

  // VisitedList got all countries we checked as visited, the map is loaded at the begining so it wont rerender from that list. 
  // Guess we need a usestate and useeffect to rerender the map, but dont know how...
  const addItem = () => {
    props.visitedList.forEach(item => {
      newItem = {country: item.country.alphaCode , value: 1}
      setData([...data,newItem])    
    })
  }

  useEffect(() => { 
    addItem()
  },[data])

  console.log(props.visitedList)  
  console.log(data)
// this is how the objects in data needs to look. 
  // { country: "cn", value: 1 },  // china
  
 
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