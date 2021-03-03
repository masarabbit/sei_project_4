import React from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

import { getArtistPics, getAllPics } from '../lib/api'

function Following(){
  const history = useHistory()
  const { id } = useParams()
  const [artistData,setArtistData] = React.useState(null)
  const [pics, setPics] = React.useState(null)
  const [error, setError] = React.useState(false)


  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getArtistPics(id)
        setArtistData(data)
      } catch (err) {
        console.log('error')
        setError(true)
      }
    }
    getData()
  },[id])

  React.useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await getAllPics()
        setPics(data.sort((a, b) => b.id - a.id))
      } catch (err) {
        console.log('error')
        // setError(true)
      }
    }
    getData()
  },[artistData])

  const mapPics = userId => {
    return (
      pics.filter(pic=>{
        return pic.artist.id === userId
      }).slice(0,4).map(pic=>{
        return (
          <div 
            key={pic.id}
            className="index"
          >  
            <Link to={`/pics/${pic.id}/`}>
              <img 
                src={pic.image} 
                alt={pic.title} 
              />
            </Link>
          </div>  
        )
      })
    )
  }

  const mapUserData = () =>{
    return artistData.following.map(artist=>{
      return (
        <div 
          className="user_list"
          key={artist.id}
        >
          <div 
            className="user_index"
          > 
            <img src={artist.profileImage} alt={artist.username}
              onClick={()=> history.push(`/artistpage/${artist.id}` )}
            />
            <div
              onClick={()=> history.push(`/artistpage/${artist.id}` )}
            >
              {artist.username}
            </div>  
          </div>  
          <div className="user_index_container">
            {
              pics && 
                mapPics(artist.id)
            }
          </div>
        </div>  
      )
    })
  }


  return (
    <>
      { 
        error ?
          <div className="wrapper">
            <p>oops... something went wrong...</p>
          </div>  
          :  
          artistData ?
            artistData.following.length !== 0 ?
              
              <div className="wrapper artist_profile slide_in">
                <div className="feed_title follow_feed">
                  {`artists followed by ${artistData.username}:`}
                </div>
                {mapUserData()}
              </div>  
              :
              <div className="wrapper">
                <p>{artistData.username} isn&apos;t following anyone &#40;yet&#41;</p>  
              </div>  
            :
            <div className="loading_wrapper">
              <div className="blue_box"></div>
              <div className="gray_box"></div>
            </div>  
      }
    </>
  )
}

export default Following