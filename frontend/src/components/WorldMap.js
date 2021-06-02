import React from 'react'
import { WorldMap } from 'react-svg-worldmap'

const Worldmap = () => {
  
  const data =
    [ 
      { country: "se", value: "visited"}, 
      { country: "cn", value: 1 },  // china
      { country: "in", value: 1 },  // india
      { country: "us", value: 1 },  // united states
      { country: "id", value: 1 },  // indonesia
      { country: "pk", value: 1 },  // pakistan
      { country: "br", value: 1 },  // brazil
      { country: "ng", value: 1 },  // nigeria
      { country: "bd", value: 1 },  // bangladesh
      { country: "ru", value: 1 },  // russia
      { country: "mx", value: 1 }   // mexico
    ]

  return (
    <div>
      <WorldMap color="blue" backgroundColor="transparent" title="test" value-prefix="visited" size="lg"  data={data}/>
    </div>
  )

}

export default Worldmap