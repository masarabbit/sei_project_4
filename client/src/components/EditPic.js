import React from 'react'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

import { getSinglePic, getUserInfo, editPic } from '../lib/api'
import { getUserId } from '../lib/auth'
import { sortedByFrequencyDuplicatesAndBlankRemoved, rgbToHex } from '../lib/utils'


import { clickAnimation, drawIntoGrid, mapFromDots, explode } from '../lib/draw'
import cross from '../assets/cross.svg'
import useForm from '../hooks/useForm' 
import ArtSubmitForm from './ArtSubmitForm'

import uploadIcon from '../assets/upload.svg'
import paletteIcon from '../assets/palette.svg'
import undoIcon from '../assets/undo.svg'

const uploadUrl = process.env.REACT_APP_CLOUDINARY_URL
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET


function EditPic(){
  const { id } = useParams()
  const history = useHistory()
  const { formdata, setFormdata, setErrors, errors, handleChange } = useForm({
    title: '', 
    image: '', 
    dots: '', 
    colorPalette: '',
    categories: [],
    artist: '',
    description: ''
  })
  const [drawSetting, setDrawSetting] = React.useState({
    color: '#32d0fc'
  }) 
  
  const [user, setUser] = React.useState(null)
  const [palette, setPalette] = React.useState(null)
  const [displayPalette, setDisplayPalette] = React.useState(false)
  const [uploadedImageBlobUrl, setUploadedImageBlobUrl] = React.useState(null)
  const [dots, setDots] = React.useState(Array(256).fill(''))
  const [draw, setDraw] = React.useState(false)
  const drawOn = ()=> setDraw(true) 
  const drawOff = ()=> setDraw(false) 
  const submissionForm = useRef(null)
  const submissionButton = useRef(null)
  let ctx = null
  const [drawingUrl, setDrawingUrl] = React.useState(null)

  const canvas = useRef()
  const drawingGrid = useRef()
  const userId = getUserId()
  const handleSettingChange = e => {
    setDrawSetting({ ...drawSetting, [e.target.name]: e.target.value })
  }

  const historyLimit = 50
  const [drawingHistory, setDrawingHistory] = React.useState(Array(historyLimit - 1).fill(Array(256).fill('')))
  const [historyStep, setHistoryStep] = React.useState(historyLimit)


  const recordHistory = arr =>{
    let records = [...drawingHistory]
    records.push([...arr])
    if (records.length > historyLimit + 1) {
      records = records.filter((record,i)=>{
        if (i !== 0) return record
      })
    }
    setDrawingHistory(records)
  }

  const setUpCanvas = () =>{
    const canvasEle = canvas.current
    canvasEle.width = canvasEle.clientWidth
    canvasEle.height = canvasEle.clientHeight    
    ctx = canvasEle.getContext('2d')
  }

  const mapFromImage = e => {
    if (!e.target.files[0]) return
    const uploadedImage = e.target.files[0]
    const blobUrl = window.URL.createObjectURL(uploadedImage)
    setUploadedImageBlobUrl(blobUrl)
  }


  const handleUpload = async e => { 
    e.preventDefault()
    if ( e.target.classList.contains('deactivate')) return
    e.target.classList.add('deactivate')
    
    const drawnDots = dots.filter(dot=> dot)
    const dotsError = drawnDots.length === 0 ? 'your canvas is blank!' : ''
    const titleError = formdata.title === '' ? 'please enter title' : ''
    const selectError = formdata.categories.length === 0 ? 'please select atleast one' : ''
    // const descriptionError = formdata.description === '' ? 'please enter description' : ''
    setErrors({ 
      title: titleError, 
      categories: selectError, 
      // description: descriptionError,
      dots: dotsError 
    })
    if (dotsError || titleError || selectError) {     
      submissionForm.current = e.target.parentNode.parentNode
      submissionForm.current.classList.add('shake')
      setTimeout(()=>{
        submissionForm.current.classList.add('static')
        submissionForm.current.classList.remove('shake') 
      },500)
      e.target.classList.remove('deactivate')
      return
    }
    setUpCanvas() //these ensure that canvas is rendered before upload
    mapFromDots(dots,ctx)
    let can = canvas.current.toDataURL('image/png')
    can = can.replace('image/png', 'image/octet-stream')
    const data = new FormData() 
    data.append('file', can)
    data.append('upload_preset', uploadPreset)
    const res = await axios.post(uploadUrl, data)
    setDrawingUrl(res.data.url)
    submissionButton.current = e.target
  }


  const handleSubmit = async () => {  
    const palette = filterPalette(dots)
    try {
      await editPic(id,{ 
        title: formdata.title, 
        image: drawingUrl, 
        dots: JSON.stringify(dots), 
        colorPalette: JSON.stringify(palette),
        categories: formdata.categories,
        artist: userId,
        description: formdata.description 
      })
  
      explode(drawingGrid)
      setTimeout(()=>{
        history.push(`/artistpage/${userId}`)
      },1000)
    } catch (err){
      console.log(err)
      submissionButton.current.classList.remove('deactivate')
    }
  }

  React.useEffect(() => {
    if (!drawingUrl) return
    handleSubmit()
  }, [drawingUrl])
  


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
        setDots(dotsFromImage)
        drawIntoGrid(dotsFromImage,drawingGrid)
      }
      image.src = uploadedImageBlobUrl
    }
  }, [uploadedImageBlobUrl])
  

  

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getSinglePic(id)
        setFormdata(data)
        setDots(JSON.parse(data.dots))
        drawIntoGrid(JSON.parse(data.dots),drawingGrid)

        // const record = [...drawingHistory]
        // record[0] = data.dots
        // setDrawingHistory(record)
      } catch (err) {
        console.log('error')
      }
    }
    getData()
  },[id])

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getUserInfo()
        setUser(data)
      } catch (err) {
        console.log('error')
      }
    }
    getData()
  },[])
  

  const drawDot = e =>{
    if (!draw) return
    e.target.style.backgroundColor = drawSetting.color
    dots[e.target.id] = drawSetting.color  // record
    setDots(dots)
    clickAnimation(e)
    setErrors({ ...errors, dots: '' })
    recordHistory(dots)
    setHistoryStep(historyLimit)
  }

  const drawDotClick = e =>{
    const color = e.target.style.backgroundColor === '' ? drawSetting.color : ''
    e.target.style.backgroundColor = color
    dots[e.target.id] = color
    setDots(dots)
    clickAnimation(e)
    setErrors({ ...errors, dots: '' })
    recordHistory(dots)
    setHistoryStep(historyLimit)
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

  const filterPalette = arr =>{
    const palette = Array(8).fill('')
    for (let i = 0; i < 8; i++){
      palette[i] = sortedByFrequencyDuplicatesAndBlankRemoved(arr)[i]
    }
    return palette
  }

  
  let idN = 0
  const mapPalette = arr =>{   
    const palette = filterPalette(arr)
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


  const mapFavoritedPalette = pic =>{
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

  const handlePalettePick = e =>{
    if (e.target.id.split('_')[1] === 'undefined') return
    setDrawSetting({ ...drawSetting, color: e.target.id.split('_')[1] })
  }

  const fork = forkedDots =>{
    drawIntoGrid(JSON.parse(forkedDots),drawingGrid)
    setDots(JSON.parse(forkedDots))
  }

  const mapOptions = arr =>{
    return arr.favoritedPic.map(pic=>{
      return (
        <div key={`p${pic.id}`}
          className="palette_wrapper"
        >
          <img onClick ={()=>fork(pic.dots)}
            src={pic.image} alt={pic.title}
          />  
          <div onClick={()=>{
            setDisplayPalette(false)
            setPalette(JSON.parse(pic.colorPalette))
          }}
          className="palette_option"
          >
            {mapFavoritedPalette(pic)}
          </div>  
        </div>
      )
    }
    )
  }
  
  //! still a little buggy
  const handleBack = () =>{
    console.log('trig')
    if (historyStep === 0 || !drawingHistory[historyStep]) return
    drawIntoGrid(drawingHistory[historyStep],drawingGrid)
    setDots(drawingHistory[historyStep - 1])
    setHistoryStep(historyStep - 1)
  }


  return (
    <>
      {
        !userId || userId !== formdata.artist.id ?
          <div className="wrapper">
            <p>you are not authorised</p>
          </div>
          :
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
              <div 
                onClick={handleBack}
                className="back">
                <img src={undoIcon} alt="undo" />
              </div>  
        
              <input type="color" 
                className="color pinkfocus"
                name="color"
                onChange={handleSettingChange}
                value={drawSetting.color}
              />

              <img src={paletteIcon}
                className="palette_icon"
                onClick={()=>{ 
                  setDisplayPalette(!displayPalette) 
                }}
              />  
              <div className="image_upload_wrapper">
                <label htmlFor="upload" > 
                  <img src={uploadIcon} alt="upload button" />
                </label>
                <input
                  id="upload"
                  type="file"
                  onChange={mapFromImage}
                />
              </div>  
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
              formdata={formdata}
              handleChange={handleChange}
              errors={errors}
            />
          </div>
      }
    </>
  )
}

export default EditPic