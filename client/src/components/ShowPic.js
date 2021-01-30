import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { getSinglePic } from '../lib/api'
// import { getSinglePic, favorite } from '../lib/api'
import { getUserId } from '../lib/auth'
import CommentForm from './CommentForm'

import FavButton from './FavButton'

import star from '../assets/star.svg'
import comment from '../assets/comment.svg'


function ShowPic(){
  const { id } = useParams()
  const history = useHistory()
  // const { pathname } = useLocation()
  const [pic,setPic] = React.useState(null)
  const [gather,setGather] = React.useState(false)
  const [error,setError] = React.useState(false)
  const [displayComment,setDisplayComment] = React.useState(false)
  const userId = getUserId()


  const vertPos = []
  for (let i = 0; i < (16 * 16); i++) vertPos.push(`${Math.ceil(Math.random() * 110) - 100}vh`)

  const horiPos = []
  for (let i = 0; i < (16 * 16); i++) horiPos.push(`${Math.ceil(Math.random() * 110) - 100}vw`)



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

  // if (formdata) console.log('form',formdata)

  const mapColorPalette = pic =>{
    return JSON.parse(pic.colorPalette).map(hex=>{
      return (
        <div key={hex} style={{ backgroundColor: hex }}>
        </div>  
      )
    })
  }

  const displayCommentForm = () => setDisplayComment(true)
  

  const mapComments = arr =>{
    return arr.map(ele=>{
      return (
        <div 
          className="user_comments"
          key={ele.id}
        > 
          <img src={ele.owner.profileImage} alt={ele.owner.username} />
          {ele.text}
          {ele.rating}
        </div>  
      )
    })
  }


  return (

    <>
      <CommentForm 
        history ={history}
        displayComment={displayComment}
        setDisplayComment={setDisplayComment}
        pic={pic} 
        id={id}
        userId={userId}
      />

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
                <div className="artist_icon" onClick={()=> history.push(`/artistpage/${pic.artist.id}` )}>
                  <img src={pic.artist.profileImage} alt={pic.artist.username} />
                </div>
                <div className="artist_name">
                  <span>by</span>{pic.artist.username}
                </div>
                {
                  !userId ?
                    <div className="menu_button inactive">
                      <img src={comment} alt="speech bubble" />
                    </div> 
                    :
                    <div className="menu_button"
                      onClick = {displayCommentForm}
                    >
                      <img src={comment} alt="speech bubble" />
                    </div> 
                }                
                <div className="stats">
                  {pic.comments.length}
                </div>  

                <FavButton 
                  liked = {
                    pic.favoritedBy.filter(ele=>{
                      return ele.id === userId
                    }).length > 0 ? true : false
                  }
                  userId = {userId}
                  star={star}
                  pic={pic}
                />

              </div>
              
              {mapComments(pic.comments)}

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