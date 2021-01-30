import React from 'react'
import axios from 'axios'
import { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { getUserId } from '../lib/auth'
import { createPic } from '../lib/api'
import { sortedByFrequencyDuplicatesAndBlankRemoved } from '../lib/utils'


const uploadUrl = process.env.REACT_APP_CLOUDINARY_URL
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

function DotsExp(){
  const history = useHistory()
  const [drawingUrl, setDrawingUrl] = React.useState(null)
  const [drawSetting, setDrawSetting] = React.useState({
    color: '#c5884d'
  }) 
  const [picInfo, setPicInfo] = React.useState({
    title: '',
    categories: [1, 2]
  }) 
  const [dots, setDots] = React.useState(Array(256).fill(''))
  const [draw, setDraw] = React.useState(false)
  const drawOn = ()=> setDraw(true) 
  const drawOff = ()=> setDraw(false) 

  // const [ gridCounter, setGridCounter ] = React.useState(0)

  const canvas = useRef()
  let ctx = null

  const setUpCanvas = () =>{
    const canvasEle = canvas.current
    canvasEle.width = canvasEle.clientWidth
    canvasEle.height = canvasEle.clientHeight    
    ctx = canvasEle.getContext('2d')
  }
  
  //* upload related
  const handleFormChange = e => {
    setPicInfo({ ...picInfo, [e.target.name]: e.target.value })
  }

  const handleChange = e => {
    setDrawSetting({ ...drawSetting, [e.target.name]: e.target.value })
  }
  
  const handleUpload = async () => { 
    setUpCanvas() //these ensure that canvas is rendered before upload
    mapFromDots()
    let can = canvas.current.toDataURL('image/png')
    can = can.replace('image/png', 'image/octet-stream')
    const data = new FormData() 
    data.append('file', can)
    data.append('upload_preset', uploadPreset)
    const res = await axios.post(uploadUrl, data)
    setDrawingUrl(res.data.url)
  }
  
  const handleSubmit = async () => {  
    try {
      await createPic({ 
        title: picInfo.title, 
        image: drawingUrl, 
        dots: JSON.stringify(dots), 
        colorPalette: JSON.stringify(sortedByFrequencyDuplicatesAndBlankRemoved(dots)),
        categories: picInfo.categories,
        artist: getUserId()
      })
      history.push('/')
    } catch (err){
      console.log(err)
    }
    
  }

  useEffect(() => {
    if (!drawingUrl) return
    handleSubmit()
  }, [drawingUrl])

  const mapFromDots = () => {
    for (let i = 0; i < (16 * 16); i++){
      const x = i % 16 * 20
      const y = Math.floor(i / 16) * 20
      ctx.fillStyle = dots[i] ? dots[i] : 'transparent'
      ctx.fillRect(x, y, 20, 20)
    }
  }

  const drawDot = e =>{
    if (!draw) return

    e.target.style.backgroundColor = drawSetting.color
    dots[e.target.id] = drawSetting.color  // record
    setDots(dots)

    clickAnimation(e)
  }

  const clickAnimation = e => {
    let clear = null  
    clearInterval(clear)
    e.target.classList.add('clicked') 
    clear = setTimeout(()=>{
      e.target.classList.remove('clicked')
    },500)
  }
  
  console.log('dots', dots)

  const drawDotClick = e =>{

    const color = e.target.style.backgroundColor === '' ? drawSetting.color : ''
    e.target.style.backgroundColor = color

    dots[e.target.id] = color
    setDots(dots)

    clickAnimation(e)
  }
  
  const mapPalette = () =>{   
    const palette = Array(8).fill('')

    for (let i = 0; i < 8; i++){
      palette[i] = sortedByFrequencyDuplicatesAndBlankRemoved(dots)[i]
    }

    let idN = 0
    return palette.map(hex=>{
      idN++
      return (
        <div key={idN} 
          onClick={handlePalettePick}
          id={`p${idN}_${hex}`}
          className="palette_block"
          style={{ backgroundColor: hex }}  
        >  
        </div>
      )
    })
  }

  const handlePalettePick = e =>{
    if (e.target.id.split('_')[1] === 'undefined') return
    console.log(e.target.style.backgroundColor)
    setDrawSetting({ ...drawSetting, color: e.target.id.split('_')[1] })
  }



  const mapGrid = () =>{    
    const grids = []
    for (let i = 0; i < (16 * 16); i++){
      grids.push(i)
    }

    return grids.map(grid=>{
      return (
        <div key={grid} 
          onClick={drawDotClick}
          onMouseMove={drawDot}
          id={grid}
          className="grid">
        </div>
      )
    })
  }

  //* palette and grid to be loaded separately

  return (
    <div className="wrapper">
      <div className="inner_wrapper">

        <div className="grid_wrapper grid_load"
          onMouseDown={drawOn}
          onMouseUp={drawOff}
        > 
          {mapGrid()}
          <canvas 
            ref={canvas}
            className="dots" 
          />
        </div>  
    
        <div className="color_palette grid_load">
          {mapPalette()}
        </div>  

      </div>
      <input type="color" 
        className="color"
        name="color"
        onChange={handleChange}
        value={drawSetting.color}
      />
      <input type="title" 
        name="title"
        onChange={handleFormChange}
        value={picInfo.title}
        placeholder="title"
      />
      <button onClick={handleUpload}>
        submit
      </button>  
    </div>
  )
}

export default DotsExp





// const mapGrid = () =>{    
//   const grids = []
//   for (let i = 0; i < (16 * 16); i++){
//     grids.push(i)
//   }

//   if (gridCounter <= grids.length){
//     setTimeout(()=>{
//       setGridCounter(gridCounter + 1)
//     },20)
//   }
//   return grids.filter(grid=>{
//     if (grids.indexOf(grid) <= gridCounter) return grid
//   }).map(grid=>{
//     return (
//       <div key={grid} 
//         onClick={drawDotClick}
//         onMouseMove={drawDot}
//         id={grid}
//         className="grid grid_float_up">
//       </div>
//     )
//   })
// }