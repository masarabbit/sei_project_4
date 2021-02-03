import React from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

import { getArtistPics, getAllPics } from '../lib/api'

function Followers(){
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
        setPics(data)
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
    return artistData.followedBy.map(follower=>{
      return (
        <div 
          className="user_list"
          key={follower.id}
        >
          <div 
            className="user_index"
          > 
            <img src={follower.profileImage} alt={follower.username}
              onClick={()=> history.push(`/artistpage/${follower.id}` )}
            />
            <div
              onClick={()=> history.push(`/artistpage/${follower.id}` )}
            >
              {follower.username}
            </div>  
          </div>  
          {
            pics &&
              mapPics(follower.id)
          }
        </div>  
      )
    })
  }


  return (
    <>
      { 
        error ?
          <div className="wrapper">
            <p>oops... something gone wrong...</p>
          </div>  
          :  
          artistData ?
            artistData.followedBy.length !== 0 ?
              
              <div className="wrapper artist_profile slide in">
                <div className="feed_title">
                  {`${artistData.username}'s followers:`}
                </div>
                {mapUserData()}
              </div>  
              :
              <div className="wrapper">
                <p>{artistData.username} has no followers &#40;yet&#41;</p>  
              </div>  
            :
            <div className="wrapper">
              <p>loading...</p>  
            </div>    
      }
    </>
  )
}

export default Followers