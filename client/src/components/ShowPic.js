import React from 'react'
import { useParams } from 'react-router-dom'

import { getSinglePic } from '../lib/api'
// import { getSinglePic, createComment } from '../lib/api'

import star from '../assets/star.svg'
import comment from '../assets/comment.svg'
import profileIcon from '../assets/profile_icon.svg'
import cross from '../assets/cross.svg'

function ShowPic(){
  const { id } = useParams()
  const [pic,setPic] = React.useState(null)
  const [gather,setGather] = React.useState(false)
  const [error,setError] = React.useState(false)
  const [displayComment,setDisplayComment] = React.useState(false)
  const [hover, setHover] = React.useState(null)
  const [formdata, setFormdata] = React.useState({
    text: '',
    rating: ''
  })

  const handleChange = e => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value })
  }


  // const handleSubmit = async e => {
  //   e.preventDefault()
  //   try {
  //     await createComment(formdata)
  //     history.push(`/pics/${id}/`)
  //   } catch (err) {
  //     console.log('error', err.response)
      
  //     //! hide comment button if already commented.
  //     // if (err.response.data.message === 'You have already commented') {
  //     //   setAlreadyCommented(true)
  //     // }

  //     // if (err.response.data.errors) {
  //     //   console.log('Rating way too high')
  //     //   setRatingTooHigh(true)
  //     // }
  //   }
  // }

  const vertPos = []
  for (let i = 0; i < (16 * 16); i++){
    vertPos.push(`${Math.ceil(Math.random() * 110) - 100}vh`)
  }

  const horiPos = []
  for (let i = 0; i < (16 * 16); i++){
    horiPos.push(`${Math.ceil(Math.random() * 110) - 100}vw`)
  }

  const handleHover = e => setHover(e.target.name)
  const removeHover = () => setHover(null)

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

  // if (pic) console.log(pic)

  const mapColorPalette = pic =>{
    return JSON.parse(pic.colorPalette).map(hex=>{
      return (
        <div 
          key={hex}
          style={{ backgroundColor: hex }}
        >
        </div>  
      )
    })
  }

  const displayCommentForm = () =>{
    setDisplayComment(true)
  }

  const closeCommentForm = e =>{
    // console.log(e.target.parentNode.parentNode)
    // e.target.parentNode.parentNode.classList.remove('comment')
    e.target.parentNode.parentNode.classList.add('accepted')
    setTimeout(()=>{
      setDisplayComment(false)
      e.target.parentNode.parentNode.classList.remove('accepted')
    },1000)

  }
  
  return (

    <>
      <div 
        className={`comment_menu_wrapper ${displayComment ? 'display' : ''}`}
      >
        <form className="comment">
          <div className="cross">
            <img src={cross} alt="cross" 
              onClick={closeCommentForm}
            />
          </div>  
          <div className="input_box"
            onMouseEnter={handleHover} 
            onMouseLeave={removeHover}
          >
            <img src={profileIcon} 
              className={`${hover === 'text' ? 'hover' : ''}`}
              alt="smiley face" />
            <textarea 
              name="text"
              onChange={handleChange}
              value={formdata.text}
            />
          </div>  

          <div className="input_box"
            onMouseEnter={handleHover} 
            onMouseLeave={removeHover}
          >
            <img src={profileIcon} 
              className={`range ${hover === 'rating' ? 'hover' : ''}`}
              alt="smiley face" />
            <input
              type="range"
              name="rating"
              onChange={handleChange}
              value={formdata.rating}
            />
            <div className="range_display">
              {formdata.rating}
            </div>  
          </div>  

          <button className="submit">
            submit
          </button>  
        </form>  
      </div>
      <div className="wrapper non_center">
        {
          pic ? 
            <>
              <div className={ `dot_wrapper ${gather && 'assemble'}`}>
                {mapDots(pic)}
              </div>
              <div className="pic_info">
                <div className="title">
                  {pic.title}
                </div>
                <div className="description">
                test test test test test test test
                  {pic.descpription}
                </div>
                <div className="categories">
                  {
                    pic.categories.map(category=>{
                      return (
                        <span key={category.name}>
                          {`${category.name}${pic.categories[pic.categories.length - 1].name !== category.name ? ', ' : ''}`}
                        </span>  
                      )
                  
                    })
                  }
                </div>  
              </div>  
              <div className="interaction_menu">
                <div className="artist_icon">
                  <img src={pic.artist.profileImage} alt={pic.artist.username} />
                </div>
                <div className="menu_button"
                  onClick = {displayCommentForm}
                >
                  <img src={comment} alt="speech bubble" />
                </div> 
                <div className="stats">
                  {pic.comments.length}
                </div>  

                <div className="menu_button">
                  <img src={star} alt="star" />
                </div>  
                <div className="stats">
                  {pic.favoritedBy.length}
                </div>  
              </div>
              <div className="used_colors">
                {mapColorPalette(pic)}
              </div> 
            </> 
            :
            error ?
              <p> can&#39;t find it ...</p>
              :
              <p> loading </p>
        }

      </div>
    </>
  )
}

export default ShowPic