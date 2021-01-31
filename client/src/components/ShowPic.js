import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { getSinglePic, deletePic } from '../lib/api'

import { getUserId } from '../lib/auth'
import { deleteComment } from '../lib/api'
import CommentForm from './CommentForm'

import InteractionMenu from './InteractionMenu'


function ShowPic(){
  const history = useHistory()
  const { id } = useParams()
  // const history = useHistory()
  // const { pathname } = useLocation()
  const [pic,setPic] = React.useState(null)
  const [gather,setGather] = React.useState(false)
  const [error,setError] = React.useState(false)
  const [displayComment,setDisplayComment] = React.useState(false)
  const userId = getUserId()

  const [displayDelete, setDisplayDelete] = React.useState(false)
  const [commentDeleted, setCommentDeleted] = React.useState(false)
  const [likedNow, setLikedNow]  = React.useState(false)


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
  },[id, displayComment, commentDeleted, likedNow])


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

  
  const handleDeleteComment = async (id, e) =>{
    try {
      await deleteComment(id)
      e.target.parentNode.parentNode.classList.add('slide_out')
      setTimeout(()=>{
        setCommentDeleted(id)
      },500)
    } catch (err) {
      console.log(err.response)
    }

  }

  const mapComments = arr =>{
    return arr.map((comment, i)=>{
      return (
        <div 
          className={`user_comments ${i === 0 ? 'first' : ''}`}
          key={comment.id}
        > 
          <div>
            <img 
              className="small_artist_icon"
              src={comment.owner.profileImage} alt={comment.owner.username} 
              onClick={()=>history.push(`/artistpage/${comment.owner.id}`)}
            />
            {comment.owner.username}
            {comment.id}
            <span>
              {comment.rating}pts
            </span>
          </div>       
          <div>
            {comment.text}
          </div>
          { userId === comment.owner.id &&
            <div>         
              <button onClick={(e)=>handleDeleteComment(comment.id, e)} className="delete">
                delete
              </button>
            </div>
          }
        </div>  
      )
    })
  }



  const deleteArt = async e =>{
    if (userId) return
    try {
      await deletePic(pic.id)
      e.target.parentNode.parentNode.parentNode.classList.add('delete')
      setTimeout(()=>{
        history.push('/')
      },1000) 
    } catch (err) {
      console.log('fav error', err.response)
    }
  }
  

  const averagePoint = arr => {
    let points = 0
    arr.comments.forEach(comments=>{
      points += comments.rating
    })
    if (!points) return 0
    points /= arr.comments.length
    return points.toFixed(1)
  }
    

  return (

    <>
      <CommentForm 
        // history ={history}
        displayComment={displayComment}
        setDisplayComment={setDisplayComment}
        pic={pic} 
        // id={id}
        userId={userId}
      />

      <div className="wrapper non_center">
        {pic ? 
          <>
            <div className={ `dot_wrapper ${gather && 'assemble'}`}>
              {mapDots(pic)}
            </div>
            <div className="pic_info">
              <div className="title">
                {pic.title}
                <span>
                  {averagePoint(pic)}pts
                </span>
              </div>
              <div className="description">
                {pic.description}
              </div>
              <div className="categories">
                {pic.categories.map(category=>{
                  return (
                    <span key={category.name}>
                      {`${category.name}${pic.categories[pic.categories.length - 1].name !== category.name ? ', ' : ''}`}
                    </span>  
                  )
                })}
              </div>  
              {pic.artist.id === userId &&

                <div className="delete_button">
                  <button 
                    className="delete"
                    onClick={()=>setDisplayDelete(true)}>
                        delete
                  </button>  
                </div>  
              }
              { 
                !displayDelete ?
                  null
                  :
                  <div className="delete_menu">
                      are you sure you want to delete?
                    <button 
                      className="yes"
                      onClick={deleteArt}>
                      yes
                    </button>
                    <button 
                      className="no"
                      onClick={()=>setDisplayDelete(false)}>
                      no
                    </button>
                  </div>
              }
            </div>  

            <InteractionMenu 
              pic = {pic} 
              userId = {userId} 
              displayCommentForm = {displayCommentForm}
              setLikedNow={setLikedNow}
            />
            
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