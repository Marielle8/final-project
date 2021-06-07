import React from 'react'
import { WorldMap } from 'react-svg-worldmap'
import { useSelector, useDispatch } from 'react-redux'

import { countries } from '../reducers/countries'

const Worldmap = () => {
  
  const selectedCountry = useSelector(store => store.countries.visitedCountry)    
    
    const data = [
      
      { country: "se", value: 1 }
    ]
    {console.log({selectedCountry})}
    

  return (
    <div>      
      <WorldMap 
        color="blue"
        backgroundColor="transparent"
        tooltipBgColor= "#000"
        title="Visited Countries"
        value-prefix="visited"
        size="lg"        
        data={data}/>
    </div>
  )

}

export default Worldmap