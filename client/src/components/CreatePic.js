import React from 'react'
import { useRef } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useHistory } from 'react-router-dom'

import { getUserId } from '../lib/auth'
import { createPic, getUserInfo } from '../lib/api'
import { sortedByFrequencyDuplicatesAndBlankRemoved, rgbToHex } from '../lib/utils'
import { clickAnimation, drawIntoGrid, explode, mapFromDots } from '../lib/draw'
import ArtSubmitForm from './ArtSubmitForm'
import cross from '../assets/cross.svg'
import useForm from '../hooks/useForm' 

import uploadIcon from '../assets/upload.svg'
import paletteIcon from '../assets/palette.svg'
import undoIcon from '../assets/undo.svg'


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
    color: '#32d0fc'
  }) 
  const { formdata,  handleChange, setErrors, errors } = useForm({
    title: '', 
    image: '', 
    dots: '', 
    colorPalette: '',
    categories: [],
    artist: '',
    description: ''
  })

  const [dots, setDots] = React.useState(Array(256).fill(''))
  const [draw, setDraw] = React.useState(false)
  const drawOn = ()=> setDraw(true) 
  const drawOff = ()=> setDraw(false) 
  const canvas = useRef()
  const drawingGrid = useRef()
  const submissionForm = useRef(null)
  const submissionButton = useRef(null)
  let ctx = null
  
  const userId = getUserId()

  const mapFromImage = e => {
    if (!e.target.files[0]) return
    const uploadedImage = e.target.files[0]
    const blobUrl = window.URL.createObjectURL(uploadedImage)
    setUploadedImageBlobUrl(blobUrl)
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

  React.useEffect(() => {
    if (!uploadedImageBlobUrl) return

    setUpCanvas()
    if (uploadedImageBlobUrl) {
      const image = new Image()
      image.onload = function() {    
        const width = image.naturalWidth 
        const height = image.naturalHeight 
        if (width < height){
          canvas.current.setAttribute('width', 320)
          canvas.current.setAttribute('height', 320 * (height / width)) 
          ctx.drawImage(image, 0, 0, 320, 320 * (height / width))
        } else {
          canvas.current.setAttribute('width', 320 * (width / height))
          canvas.current.setAttribute('height', 320) 
          ctx.drawImage(image, 0, 0, 320 * (width / height), 320)
        }
      
        // ctx.drawImage(image, 0, 0)
        // ctx.drawImage(image, 0, 0, 320, 320)
        const dotsFromImage = []

        for (let i = 0; i < 256; i++) {
          const y = Math.floor(i / 16) * 20
          const x = i % 16 * 20
          const c = ctx.getImageData(x + 5, y + 5, 1, 1).data
          const hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
          dotsFromImage.push(hex)
        }
        setDots(dotsFromImage)
        drawIntoGrid(dotsFromImage,drawingGrid)
      }
      image.src = uploadedImageBlobUrl
    }
  }, [uploadedImageBlobUrl])
  

  const setUpCanvas = () =>{
    const canvasEle = canvas.current
    canvasEle.width = canvasEle.clientWidth
    canvasEle.height = canvasEle.clientHeight    
    ctx = canvasEle.getContext('2d')
  }
  
  const handleSettingChange = e => {
    setDrawSetting({ ...drawSetting, [e.target.name]: e.target.value })
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
    const can = canvas.current.toDataURL('image/png')
    // can = can.replace('image/png', 'image/octet-stream')
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
      await createPic({ 
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
  
  const filterPalette = arr =>{
    const palette = Array(8).fill('')
    for (let i = 0; i < 8; i++){
      palette[i] = sortedByFrequencyDuplicatesAndBlankRemoved(arr)[i]
    }
    return palette
  }

  // const filterPalette = arr =>{
  //   return sortedByFrequencyDuplicatesAndBlankRemoved(arr).slice(0,8)
  // } //* this would give me blank array to begin, so I will use filterPalette above.

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
      }
    }
    getData()
  },[])
  

  
  let idN = 0
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
  
  const fork = forkedDots =>{
    drawIntoGrid(JSON.parse(forkedDots),drawingGrid)
    setDots(JSON.parse(forkedDots))
  }

  const mapOptions = arr =>{
    return arr.map(pic=>{
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
    if (historyStep === 0 || !drawingHistory[historyStep]) return
    drawIntoGrid(drawingHistory[historyStep],drawingGrid)
    setDots(drawingHistory[historyStep - 1])
    setHistoryStep(historyStep - 1)
  }

  return (
    <>
      {
        !userId ?
          <div className="wrapper">
            <p>please log in</p>
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
              <div className="favorited_palettes">
                {mapOptions(user.favoritedPic)}  
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

export default CreatePic


// React.useEffect(() => {
//   if (!uploadedImageBlobUrl) return

//   setUpCanvas()
//   if (uploadedImageBlobUrl) {
//     const image = new Image()
//     image.onload = function() {    
//       ctx.drawImage(image, 0, 0)
//       const arr = []
//       const dotsFromImage = []
//       for (let i = 0; i < 256; i++) arr.push(i)

//       arr.forEach(ele=>{
//         const y = Math.floor(ele / 16) * 20
//         const x = ele % 16 * 20
//         ctx.drawImage(image, x, y, 20, 20, x, y, 20, 20)
//         const c = ctx.getImageData(x + 5, y + 5, 1, 1).data
//         const hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
//         dotsFromImage.push(hex)
//       })
//       setDots(dotsFromImage)
//       drawIntoGrid(dotsFromImage,drawingGrid)
//     }
//     image.src = uploadedImageBlobUrl
//   }
// }, [uploadedImageBlobUrl])


//?
// React.useEffect(() => {
//   if (!uploadedImageBlobUrl) return

//   setUpCanvas()
//   if (uploadedImageBlobUrl) {
//     const image = new Image()
//     image.onload = function() {    
//       ctx.drawImage(image, 0, 0)
//       const arr = []
//       for (let i = 0; i < 256; i++) arr.push(i)
//       const dotsFromImage = []

//       arr.forEach(ele=>{
//         const y = Math.floor(ele / 16) * 20
//         const x = ele % 16 * 20
//         // ctx.drawImage(image, x, y, 20, 20, x, y, 20, 20)
//         const c = ctx.getImageData(x + 5, y + 5, 1, 1).data
//         const hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
//         dotsFromImage.push(hex)
//       })
//       setDots(dotsFromImage)
//       drawIntoGrid(dotsFromImage,drawingGrid)
//     }
//     image.src = uploadedImageBlobUrl
//   }
// }, [uploadedImageBlobUrl])

