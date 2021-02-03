import React from 'react'
import { useHistory } from 'react-router-dom'

import { followArtist, unfollowArtist } from '../lib/api'
import { getUserId } from '../lib/auth'

function FollowButton ({ followed, artistData, setFollowedNow, artistId }){
  const [follow, setFollow] = React.useState(followed)
  const userId = getUserId()
  const history = useHistory()

  const handleFollow = async () => {
    try {
      await followArtist(artistData.id)
      setFollow(!follow)
      setFollowedNow(true)
    } catch (err) {
      console.log('fav error', err.response)
    }
  }

  const handleUnfollow = async () => {
    try {
      await unfollowArtist(artistData.id)
      setFollow(!follow)
      setFollowedNow(false)
    } catch (err) {
      console.log('fav error', err.response)
    }
  }


  return (
    <div className="followers_following">
      {artistData.following.length} 
      <span
        onClick={()=> history.push(`/following/${artistId}`)}
      >following</span> 
      {artistData.followedBy.length} 
      <span
        onClick={()=> history.push(`/followers/${artistId}`)}
      >followers</span>

      {
        !userId || userId === artistData.id ?
          null
          :
          !follow ?
            <button 
              onClick ={handleFollow}
              className="follow">
            follow
            </button>
            :
            <button 
              onClick ={handleUnfollow}
              className="unfollow">
            unfollow
            </button>
      }

  
    </div>
  )
}

export default FollowButton