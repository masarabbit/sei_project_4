import React from 'react'
import { useParams } from 'react-router-dom'

import { getSinglePic } from '../lib/api'

function ShowPic(){
  const { id } = useParams()
  const [pic,setPic] = React.useState(null)
  const [gather,setGather] = React.useState(false)
  const [error,setError] = React.useState(false)

  const vertPos = []
  for (let i = 0; i < (16 * 16); i++){
    vertPos.push(`${Math.ceil(Math.random() * 110) - 100}vh`)
  }

  const horiPos = []
  for (let i = 0; i < (16 * 16); i++){
    horiPos.push(`${Math.ceil(Math.random() * 110) - 100}vw`)
  }

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getSinglePic(id)
        setPic(data)
      } catch (err) {
        console.log('error')
        setError(true)
      }
    }
    getData()
  },[id])

  const mapDots = (data)=>{
    const grids = []
    for (let i = 0; i < (16 * 16); i++){
      grids.push(i)
    }
    
    setTimeout(()=>{
      setGather(true)
    },10)
    
    return grids.map(grid=>{
      return (
        <div className="dot" 
          key={grid} 
          id={grid} 
          style={{ 
            top: vertPos[grid], 
            left: horiPos[grid], 
            backgroundColor: JSON.parse(data.dots)[grid] 
          }}>
        </div>
      )
    })
  }

  // if (pic) console.log(pic.dots)

  const mapColorPalette = () =>{
    return JSON.parse(pic.color_palette).map(hex=>{
      return (
        <div 
          key={hex}
          style={{ backgroundColor: hex }}
        >
        </div>  
      )
    })
  }
  
  return (
    <div className="wrapper">
      {
        pic ? 
          <>
            <div className={ `dot_wrapper ${gather && 'assemble'}`}>
              {mapDots(pic)}
            </div>
            <div className="used_colors">
              {mapColorPalette()}
            </div> 
            {/* <div>
              {pic.dots}
            </div>   */}
          </> 
          :
          error ?
            <p> can&#39;t find it ...</p>
            :
            <p> loading </p>
      }

    </div>

  )
}

export default ShowPic