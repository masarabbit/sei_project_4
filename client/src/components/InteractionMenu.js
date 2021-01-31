import React from 'react'

import FavButton from './FavButton'

import star from '../assets/star.svg'
import comment from '../assets/comment.svg'
import { useHistory } from 'react-router-dom'


function InteractionMenu({ pic, userId, displayCommentForm, setLikedNow }){
  const history = useHistory()
  
  const commentedByUser = arr => {
    return arr.comments.filter(comment=>{
      return comment.owner.id === userId
    }).length > 0
  }


  return (
    <div className="interaction_menu">
      <div className="artist_icon" onClick={()=> history.push(`/artistpage/${pic.artist.id}` )}>
        <img src={pic.artist.profileImage} alt={pic.artist.username} />
      </div>
      <div className="artist_name">
        <span>by</span>{pic.artist.username}
      </div>
      {!userId || commentedByUser(pic) ?
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
        setLikedNow={setLikedNow}
      />
    </div>
  )
}

export default InteractionMenu