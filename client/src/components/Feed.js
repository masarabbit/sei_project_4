import React from 'react'
// import { Link } from 'react-router-dom'

import { getAllPics } from '../lib/api'
// import { getUserId } from '../lib/auth'

function Feed({ username, userId, mapPics }){
  const [error, setError] = React.useState(false)
  // const [picCounter, setPicCounter] = React.useState(0)
  // const [pics, setPics] = React.useState(null)
  const [filteredPicsFollowed, setFilteredPicsFollowed] = React.useState([])
  const [filteredPicsFavorited, setFilteredPicsFavorited] = React.useState([])
  const user = userId
  // let idN = 0

  const filterPicsFollowed = pics => {
    const artistCheck = pics.map(pic=>{
      return pic.artist.followedBy.filter(follower=>{
        return follower === user
      })
    })
    const result = pics.filter((_pic,i) =>{
      return artistCheck[i].length !== 0
    }) 
    return result
  }

  const filterPicsFavorited = pics => {
    const artistCheck = pics.map(pic=>{
      return pic.favoritedBy.filter(follower=>{
        return follower.id === user
      })
    })
    const result = pics.filter((_pic,i) =>{
      return artistCheck[i].length !== 0
    }) 
    return result
  }


  React.useEffect(() => {
    if (!user) return
    const getData = async () => {
      try {
        const { data } = await getAllPics()
        setFilteredPicsFollowed(filterPicsFollowed(data))
        setFilteredPicsFavorited(filterPicsFavorited(data))
        // if (filterPics(data).length === 0) setPics(data.slice(0,12))
      } catch (err) {
        console.log('error')
        setError(true)
      }
    }
    getData()
  },[user])



  return (

    <>
      {
        !user ?
          <div className="wrapper">
            <p className="blue">please login</p>
          </div>
          :
          null
      }

      {
        filteredPicsFavorited && filteredPicsFavorited.length !== 0 ?
          <>
            <div className="feed_title fade_in">
              art favorited by {username}:
            </div>
            <main className="feed_wrapper">
              {mapPics(filteredPicsFavorited,'small')}
            </main>
          </>    
          :
          error ?
            <p>hmm... error...</p>
            :
            null
      
      }
      {
        filteredPicsFollowed && filteredPicsFollowed.length !== 0 ?
          <>
            <div className="feed_title fade_in">
              art by artists followed by {username}:
            </div>
            <main className="feed_wrapper">
              {mapPics(filteredPicsFollowed,'small')}
            </main>
          </>    
          :
          error ?
            <p>hmm... error...</p>
            :
            null
      
      }
     
    
    </>  
  )
}

export default Feed