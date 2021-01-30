import React from 'react'
import { favorite, unFavorite } from '../lib/api'



function FavButton ({ pic, liked, star, userId }){
  const [like, setLike] = React.useState(liked)
  const [likedNow, setLikedNow]  = React.useState(0)
  

  const handleFavorite = async () => {
    try {
      await favorite(pic.id)
      setLike(!like)
      setLikedNow(likedNow + 1)
      
    } catch (err) {
      console.log('fav error', err.response)
    }
  }

  const handleUnFavorite = async ()=>{
    try {
      await unFavorite(pic.id)
      setLike(!like)  
      setLikedNow(likedNow - 1)
    } catch (err) {
      console.log('fav error', err.response)
    }
  }
  

  
  return (
    <>
      {
        !userId ?
          <div 
            className="menu_button inactive"
          >
            <img src={star} alt="star" />
          </div>  
          : 
          !like ?
            <div 
              className="menu_button"
              onClick={handleFavorite}
            >
              <img src={star} alt="star" />
            </div>  
            :
            <div 
              className="menu_button clicked"
              onClick={handleUnFavorite}
            >
              <img src={star} alt="star" />
            </div>  
      }

      <div className="stats">  
        {pic.favoritedBy.length + likedNow}
        {/* {favoritedBy.length} */}
      </div>  
    </>  
  )
}

export default FavButton



