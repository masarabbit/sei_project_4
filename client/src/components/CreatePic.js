import React from 'react'
import { useRef } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useHistory } from 'react-router-dom'

import { getUserId } from '../lib/auth'
import { createPic, getUserInfo } from '../lib/api'
import { sortedByFrequencyDuplicatesAndBlankRemoved, rgbToHex } from '../lib/utils'
import ArtSubmitForm from './ArtSubmitForm'
import cross from '../assets/cross.svg'


const uploadUrl = process.env.REACT_APP_CLOUDINARY_URL
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET


function CreatePic(){
  const history = useHistory()
  const [user, setUser] = React.useState(null)
  const [displayPalette, setDisplayPalette] = React.useState(false)
  const [palette, setPalette] = React.useState(null)
  const [uploadedImageBlobUrl, setUploadedImageBlobUrl] = React.useState(null)

  const [drawingUrl, setDrawingUrl] = React.useState(null)
  const [drawSetting, setDrawSetting] = React.useState({
    color: '#c5884d'
  }) 
  const [picInfo, setPicInfo] = React.useState({
    title: '',
    categories: [],
    description: ''
  }) 
  const [dots, setDots] = React.useState(Array(256).fill(''))
  const [draw, setDraw] = React.useState(false)
  const drawOn = ()=> setDraw(true) 
  const drawOff = ()=> setDraw(false) 

  const canvas = useRef()
  let ctx = null
  const drawingGrid = useRef()

  const mapFromImage = e => {
    if (!e.target.files[0]) return
    const uploadedImage = e.target.files[0]
    const blobUrl = window.URL.createObjectURL(uploadedImage)
    setUploadedImageBlobUrl(blobUrl)
  }

  React.useEffect(() => {
    if (!uploadedImageBlobUrl) return

    setUpCanvas()
    if (uploadedImageBlobUrl) {
      const image = new Image()
      image.onload = function() {    
        ctx.drawImage(image, 0, 0)
        const arr = []
        const dotsFromImage = []
        for (let i = 0; i < 256; i++) arr.push(i)

        arr.forEach(ele=>{
          const y = Math.floor(ele / 16) * 20
          const x = ele % 16 * 20
          ctx.drawImage(image, x, y, 20, 20, x, y, 20, 20)
          const c = ctx.getImageData(x + 5, y + 5, 1, 1).data
          const hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
          dotsFromImage.push(hex)
        })

        // console.log(dotsFromImage)
        setDots(dotsFromImage)
        // mapFromDots(dotsFromImage)


        drawIntoGrid(dotsFromImage)
      }
      image.src = uploadedImageBlobUrl
    }

  }, [uploadedImageBlobUrl])
  



  const drawIntoGrid = arr =>{
    arr.forEach((dot, i)=>{
      drawingGrid.current.children[i].style.backgroundColor = dot
    })
  }


  const setUpCanvas = () =>{
    const canvasEle = canvas.current
    canvasEle.width = canvasEle.clientWidth
    canvasEle.height = canvasEle.clientHeight    
    ctx = canvasEle.getContext('2d')
  }
  
  const handleChange = e => {
    setDrawSetting({ ...drawSetting, [e.target.name]: e.target.value })
  }

  const handleUpload = async e => { 
    e.preventDefault()

    setUpCanvas() //these ensure that canvas is rendered before upload
    mapFromDots(dots)
    let can = canvas.current.toDataURL('image/png')
    can = can.replace('image/png', 'image/octet-stream')
    const data = new FormData() 
    data.append('file', can)
    data.append('upload_preset', uploadPreset)
    const res = await axios.post(uploadUrl, data)
    setDrawingUrl(res.data.url)
  }
  
  const handleSubmit = async () => {  
    const palette = filterPalette(dots)
    try {
      await createPic({ 
        title: picInfo.title, 
        image: drawingUrl, 
        dots: JSON.stringify(dots), 
        colorPalette: JSON.stringify(palette),
        categories: picInfo.categories,
        artist: getUserId(),
        description: picInfo.description 
      })
      history.push('/')
    } catch (err){
      console.log(err)
    }
  }

  React.useEffect(() => {
    if (!drawingUrl) return
    handleSubmit()
  }, [drawingUrl])
  



  const mapFromDots = dots => {
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
  
  // console.log('dots', dots)

  const drawDotClick = e =>{
    const color = e.target.style.backgroundColor === '' ? drawSetting.color : ''
    e.target.style.backgroundColor = color
    dots[e.target.id] = color
    setDots(dots)
    clickAnimation(e)
  }
  
  const filterPalette = arr =>{
    const palette = Array(8).fill('')
    for (let i = 0; i < 8; i++){
      palette[i] = sortedByFrequencyDuplicatesAndBlankRemoved(arr)[i]
    }
    return palette
  }

  //! don't need uuid? to be considered
  const mapPalette = arr =>{   
    const palette = filterPalette(arr)
    return palette.map(hex=>{
      const idN = uuidv4()
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
    for (let i = 0; i < (16 * 16); i++) grids.push(i)
   
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
  

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getUserInfo()
        setUser(data)
      } catch (err) {
        console.log('error')
        // setError(true)
      }
    }
    getData()
  },[])
  

  
  let idN = 0
  const mapColorPalette = pic =>{
    return JSON.parse(pic.colorPalette).map(hex=>{
      idN++
      return (
        <div 
          key={idN}
          id = {idN}
          style={{ backgroundColor: hex }}
        >
        </div>  
      )
    })
  }
  
  const fork = forkedDots =>{
    drawIntoGrid(JSON.parse(forkedDots))
    setDots(JSON.parse(forkedDots))
  }

  const mapOptions = arr =>{
    return arr.favoritedPic.map(pic=>{
      // console.log(ele.colorPalette)
      return (
      
        <div 
          key={`p${pic.id}`}
          className="palette_wrapper"
        >
          <img 
            onClick ={()=>fork(pic.dots)}
            src={pic.image} alt={pic.title}
          />  
          <div 
            onClick={()=>{
              setDisplayPalette(false)
              setPalette(JSON.parse(pic.colorPalette))
            }}
            className="palette_option"
          >
            {mapColorPalette(pic)}
          </div>  
        </div>
      )
    }
    )
  }


  //* palette and grid to be loaded separately

  return (
    <div className="wrapper no_height slide_in">
      <div className="inner_wrapper">
        <div className="grid_wrapper"
          onMouseDown={drawOn}
          onMouseUp={drawOff}
          ref={drawingGrid}
        > 
          {mapGrid()}
          <canvas 
            ref={canvas}
            className="dots" 
          />
          <div className="color_background">
          </div>
        </div>  
    
        <div className="color_palette">
          {mapPalette(dots)}
        </div>  
      </div>
      
      <div className="tool_box">
        <input type="color" 
          className="color pinkfocus"
          name="color"
          onChange={handleChange}
          value={drawSetting.color}
        />

        <button onClick={()=>{ 
          setDisplayPalette(!displayPalette) 
        }}>
          +
        </button>  
      </div>
    
      <div 
        onMouseLeave={()=>setDisplayPalette(false)}
        className={`palette_choice_menu ${displayPalette && 'open'}`}
      >
        <div className="cross">
          <img src={cross} alt="cross" 
            onClick={()=>setDisplayPalette(false)}
          />
        </div>
        {
          user &&
            <>
              <div>
                {mapOptions(user)}  
              </div>  
              <div className="upload_test">
                <div className="upload_button_wrapper">
                  <div className="input_wrapper">
                    <label className="upload_button" htmlFor="upload" > 
                      upload
                    </label>
                    <input
                      id="upload"
                      type="file"
                      onChange={mapFromImage}
                      // name="{name}"
                    />
                  </div>  
                </div>
              </div>
            </>   
        }
      </div>  
      {
        palette ?
          <div className="palette_option">
            {mapPalette(palette)}
          </div>
          :
          null
      }
  
      <ArtSubmitForm 
        handleUpload={handleUpload}
        picInfo={picInfo}
        setPicInfo={setPicInfo}
      />

    </div>
  )
}

export default CreatePic



