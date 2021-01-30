import React from 'react'

import { followArtist, unfollowArtist } from '../lib/api'
import { getUserId } from '../lib/auth'

function FollowButton ({ followed, artistData }){
  const [follow, setFollow] = React.useState(followed)
  const [followedNow, setFollowedNow]  = React.useState(0)
  
  const userId = getUserId()

  const handleFollow = async () => {
    try {
      await followArtist(artistData.id)
      setFollow(!follow)
      setFollowedNow(followedNow + 1)
    } catch (err) {
      console.log('fav error', err.response)
    }
  }

  const handleUnfollow = async () => {
    try {
      await unfollowArtist(artistData.id)
      setFollow(!follow)
      setFollowedNow(followedNow - 1)
    } catch (err) {
      console.log('fav error', err.response)
    }
  }


  return (
    <div className="followers_following">
      {artistData.following.length} <span>following</span> 
      {artistData.followedBy.length + followedNow} <span>followers</span>

      {
        !userId ?
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